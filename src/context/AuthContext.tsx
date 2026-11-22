import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, checkDatabaseSchemaStatus } from '../lib/supabase';
import { Profile } from '../types';
import {
  getOrCreateProfile,
  updateProfile as updateProfileService,
  purgeAllUserData,
} from '../services/dataService';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

interface StoredAccountRecord {
  id: string;
  email: string;
  full_name: string;
  passwordHash: string;
  created_at: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  tablesReady: boolean;
  schemaMessage?: string;
  recheckSchema: () => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
  updateUserProfile: (updates: Partial<Profile>) => Promise<Profile>;
  deleteUserAccount: () => Promise<void>;
}

const ACCOUNTS_REGISTRY_KEY = 'spg11_auth_accounts_registry_fjsoleiemcdlhlfiufvc';
const ACTIVE_SESSION_KEY = 'spg11_active_auth_session_fjsoleiemcdlhlfiufvc';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function hashPassword(email: string, password: string): Promise<string> {
  const normalized = `${email.trim().toLowerCase()}::${password}::spg11_salt_v1`;
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getAccountsRegistry(): Record<string, StoredAccountRecord> {
  try {
    const raw = localStorage.getItem(ACCOUNTS_REGISTRY_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, StoredAccountRecord>;
  } catch {
    return {};
  }
}

function saveAccountsRegistry(registry: Record<string, StoredAccountRecord>): void {
  localStorage.setItem(ACCOUNTS_REGISTRY_KEY, JSON.stringify(registry));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tablesReady, setTablesReady] = useState<boolean>(true);
  const [schemaMessage, setSchemaMessage] = useState<string | undefined>(undefined);

  const recheckSchema = async () => {
    const status = await checkDatabaseSchemaStatus();
    setTablesReady(status.tablesReady);
    setSchemaMessage(status.errorMessage);
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (!isSupabaseConfigured || !supabase) {
        if (mounted) {
          setLoading(false);
          setTablesReady(false);
        }
        return;
      }

      await recheckSchema();

      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const sbUser = data.session.user;
          const authUser: AuthUser = {
            id: sbUser.id,
            email: sbUser.email || '',
            full_name:
              (sbUser.user_metadata?.full_name as string) ||
              (sbUser.email ? sbUser.email.split('@')[0] : 'User'),
            created_at: sbUser.created_at,
          };
          const userProfile = await getOrCreateProfile(
            authUser.id,
            authUser.full_name,
            authUser.email
          );
          if (mounted) {
            setUser(authUser);
            setProfile(userProfile);
            localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authUser));
            setLoading(false);
          }
          return;
        }
      } catch {
        // Check persisted session next
      }

      // Restore persisted session if active
      try {
        const savedSession = localStorage.getItem(ACTIVE_SESSION_KEY);
        if (savedSession) {
          const parsed = JSON.parse(savedSession) as AuthUser;
          if (parsed?.id && parsed?.email) {
            const userProfile = await getOrCreateProfile(
              parsed.id,
              parsed.full_name,
              parsed.email
            );
            if (mounted) {
              setUser(parsed);
              setProfile(userProfile);
            }
          }
        }
      } catch {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
      }

      if (mounted) {
        setLoading(false);
      }
    }

    initAuth();

    const { data: sub } = supabase
      ? supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const sbUser = session.user;
            const authUser: AuthUser = {
              id: sbUser.id,
              email: sbUser.email || '',
              full_name:
                (sbUser.user_metadata?.full_name as string) ||
                (sbUser.email ? sbUser.email.split('@')[0] : 'User'),
              created_at: sbUser.created_at,
            };
            const userProfile = await getOrCreateProfile(
              authUser.id,
              authUser.full_name,
              authUser.email
            );
            if (mounted) {
              setUser(authUser);
              setProfile(userProfile);
              localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authUser));
            }
          } else if (event === 'SIGNED_OUT') {
            // Handled in signOut
          }
        })
      : { data: { subscription: null } };

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (fullName: string, email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Check your .env credentials.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const registry = getAccountsRegistry();

    if (registry[cleanEmail]) {
      throw new Error('An account with this email address is already registered. Please sign in.');
    }

    let userId: string = crypto.randomUUID();
    let createdAt = new Date().toISOString();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
        },
      },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('already registered') || msg.includes('already exists')) {
        throw new Error('An account with this email address is already registered. Please sign in.');
      }
      // If Supabase free tier SMTP rate limit (2 emails/hr) is hit, still register the user with their isolated UUID
      if (!msg.includes('rate limit') && !msg.includes('email') && !msg.includes('confirmation')) {
        throw new Error(error.message);
      }
    }

    if (data?.user?.identities && data.user.identities.length === 0) {
      throw new Error('An account with this email address is already registered. Please sign in.');
    }

    if (data?.user?.id) {
      userId = data.user.id;
      createdAt = data.user.created_at || createdAt;
    }

    const passwordHash = await hashPassword(cleanEmail, password);
    registry[cleanEmail] = {
      id: userId,
      email: cleanEmail,
      full_name: cleanName,
      passwordHash,
      created_at: createdAt,
    };
    saveAccountsRegistry(registry);

    const authUser: AuthUser = {
      id: userId,
      email: cleanEmail,
      full_name: cleanName,
      created_at: createdAt,
    };

    const userProfile = await getOrCreateProfile(userId, cleanName, cleanEmail);
    setUser(authUser);
    setProfile(userProfile);
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authUser));
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Check your .env credentials.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (!error && data?.user) {
      const sbUser = data.user;
      const authUser: AuthUser = {
        id: sbUser.id,
        email: sbUser.email || cleanEmail,
        full_name:
          (sbUser.user_metadata?.full_name as string) ||
          cleanEmail.split('@')[0],
        created_at: sbUser.created_at,
      };
      const userProfile = await getOrCreateProfile(
        authUser.id,
        authUser.full_name,
        authUser.email
      );
      setUser(authUser);
      setProfile(userProfile);
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authUser));
      return;
    }

    // Verify against registered accounts if Supabase email confirmation is pending
    const registry = getAccountsRegistry();
    const record = registry[cleanEmail];
    if (record) {
      const candidateHash = await hashPassword(cleanEmail, password);
      if (candidateHash === record.passwordHash) {
        const userProfile = await getOrCreateProfile(
          record.id,
          record.full_name,
          record.email
        );
        const authUser: AuthUser = {
          id: record.id,
          email: record.email,
          full_name: userProfile.full_name || record.full_name,
          created_at: record.created_at,
        };
        setUser(authUser);
        setProfile(userProfile);
        localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(authUser));
        return;
      }
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    throw new Error(error?.message || 'Invalid login credentials.');
  };

  const signOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore network errors during signout
      }
    }
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    setUser(null);
    setProfile(null);
  };

  const requestPasswordReset = async (email: string) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured.');
    }
    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error && !error.message.toLowerCase().includes('rate limit')) {
      throw new Error(error.message);
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    if (!user) throw new Error('You must be logged in to change your password.');
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw new Error(error.message);
      }
    }
    const registry = getAccountsRegistry();
    const record = registry[user.email.toLowerCase()];
    if (record) {
      record.passwordHash = await hashPassword(user.email.toLowerCase(), newPassword);
      saveAccountsRegistry(registry);
    }
  };

  const updateUserEmail = async (newEmail: string) => {
    if (!user) throw new Error('You must be logged in to change your email.');
    const cleanNewEmail = newEmail.trim().toLowerCase();
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        const { error } = await supabase.auth.updateUser({ email: cleanNewEmail });
        if (error && !error.message.toLowerCase().includes('rate limit')) {
          throw new Error(error.message);
        }
      }
    }

    const registry = getAccountsRegistry();
    const oldEmail = user.email.toLowerCase();
    if (registry[cleanNewEmail] && cleanNewEmail !== oldEmail) {
      throw new Error('That email address is already in use by another account.');
    }
    if (registry[oldEmail]) {
      const record = registry[oldEmail];
      delete registry[oldEmail];
      registry[cleanNewEmail] = {
        ...record,
        email: cleanNewEmail,
      };
      saveAccountsRegistry(registry);
    }

    const updatedUser: AuthUser = { ...user, email: cleanNewEmail };
    setUser(updatedUser);
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(updatedUser));
    if (profile) {
      setProfile({ ...profile, email: cleanNewEmail });
    }
  };

  const updateUserProfile = async (updates: Partial<Profile>): Promise<Profile> => {
    if (!user) throw new Error('Not authenticated.');
    const updated = await updateProfileService(user.id, updates);
    setProfile(updated);
    if (updates.full_name) {
      const nextUser: AuthUser = { ...user, full_name: updates.full_name };
      setUser(nextUser);
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(nextUser));

      const registry = getAccountsRegistry();
      const emailKey = user.email.toLowerCase();
      if (registry[emailKey]) {
        registry[emailKey].full_name = updates.full_name;
        saveAccountsRegistry(registry);
      }
    }
    return updated;
  };

  const deleteUserAccount = async () => {
    if (!user) throw new Error('Not authenticated.');
    const userId = user.id;
    const emailKey = user.email.toLowerCase();

    await purgeAllUserData(userId);

    const registry = getAccountsRegistry();
    if (registry[emailKey]) {
      delete registry[emailKey];
      saveAccountsRegistry(registry);
    }

    await signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured: isSupabaseConfigured,
        tablesReady,
        schemaMessage,
        recheckSchema,
        signUp,
        signIn,
        signOut,
        requestPasswordReset,
        updateUserPassword,
        updateUserEmail,
        updateUserProfile,
        deleteUserAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
