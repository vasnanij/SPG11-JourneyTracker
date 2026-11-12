import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawPublishableKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

// Clean markdown links if someone pasted [https://...](https://...) into .env
function sanitizeUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  const markdownMatch = trimmed.match(/\((https?:\/\/[^)]+)\)/);
  if (markdownMatch) return markdownMatch[1];
  return trimmed.replace(/^\[|\]$/g, '');
}

export const SUPABASE_URL = sanitizeUrl(rawUrl);
export const SUPABASE_ANON_KEY = (rawPublishableKey || '').trim();

export const isSupabaseConfigured: boolean = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_ANON_KEY.length > 15
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'spg11_supabase_auth_token',
      },
    })
  : null;

export const STORAGE_BUCKET = 'spg11-media';

export async function checkDatabaseSchemaStatus(): Promise<{
  configured: boolean;
  tablesReady: boolean;
  errorCode?: string;
  errorMessage?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      configured: false,
      tablesReady: false,
      errorMessage:
        'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY environment variables.',
    };
  }

  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error) {
      if (
        error.code === 'PGRST205' ||
        error.code === '42P01' ||
        error.message?.includes('Could not find the table') ||
        error.message?.includes('does not exist')
      ) {
        return {
          configured: true,
          tablesReady: false,
          errorCode: error.code || 'PGRST205',
          errorMessage:
            'Supabase project connected, but database tables have not been created yet. Run the SQL migration in your Supabase SQL Editor.',
        };
      }
    }
    return {
      configured: true,
      tablesReady: true,
    };
  } catch (err) {
    return {
      configured: true,
      tablesReady: false,
      errorMessage: err instanceof Error ? err.message : 'Unable to reach Supabase instance.',
    };
  }
}
