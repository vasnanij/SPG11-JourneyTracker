import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Sun,
  Moon,
  Bell,
  Download,
  Trash2,
  Upload,
  Check,
  FileJson,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { exportUserDataAsCSV, exportUserDataAsJSON } from '../utils/exportData';
import { validateEmail, validatePassword } from '../utils/validation';

export const ProfilePage: React.FC = () => {
  const {
    user,
    profile,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    deleteUserAccount,
  } = useAuth();
  const { journeys, milestones, journalEntries, photos, uploadFile } = useAppData();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useDocumentMeta({
    title: 'Profile & Settings',
    isPrivate: true,
  });

  const [fullName, setFullName] = useState(profile?.full_name || user?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [savingEmail, setSavingEmail] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [notifyUpcoming, setNotifyUpcoming] = useState(
    profile?.notify_upcoming_milestones ?? true
  );
  const [notifyNewJourneys, setNotifyNewJourneys] = useState(
    profile?.notify_new_journeys ?? true
  );
  const [notifyCompleted, setNotifyCompleted] = useState(
    profile?.notify_completed_milestones ?? true
  );

  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || user?.full_name || '');
      setAvatarUrl(profile.avatar_url);
      setNotifyUpcoming(profile.notify_upcoming_milestones);
      setNotifyNewJourneys(profile.notify_new_journeys);
      setNotifyCompleted(profile.notify_completed_milestones);
    }
  }, [profile, user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const url = await uploadFile(file, 'avatars');
      setAvatarUrl(url);
      await updateUserProfile({ avatar_url: url });
      showToast('Profile Picture Updated', 'Your avatar has been saved.');
    } catch (err) {
      showToast(
        'Upload Failed',
        err instanceof Error ? err.message : 'Could not upload avatar.',
        'error'
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast('Validation Error', 'Full name cannot be empty.', 'error');
      return;
    }
    setSavingProfile(true);
    try {
      await updateUserProfile({
        full_name: fullName.trim(),
        avatar_url: avatarUrl,
      });
      showToast('Profile Saved', 'Your personal details have been updated.');
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Failed to update profile.',
        'error'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(newEmail);
    if (err) {
      showToast('Invalid Email', err, 'error');
      return;
    }
    setSavingEmail(true);
    try {
      await updateUserEmail(newEmail);
      showToast('Email Updated', `Account email updated to ${newEmail}.`);
    } catch (error) {
      showToast(
        'Update Failed',
        error instanceof Error ? error.message : 'Unable to update email.',
        'error'
      );
    } finally {
      setSavingEmail(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePassword(newPassword);
    if (err) {
      showToast('Invalid Password', err, 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mismatch', 'Passwords do not match.', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await updateUserPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password Changed', 'Your password has been updated securely.');
    } catch (error) {
      showToast(
        'Error',
        error instanceof Error ? error.message : 'Failed to change password.',
        'error'
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleThemeSelect = async (mode: 'light' | 'dark') => {
    setTheme(mode);
    try {
      await updateUserProfile({ theme_preference: mode });
      showToast(
        'Theme Updated',
        `Switched to ${mode === 'light' ? 'White Mode' : 'Dark Mode'}.`
      );
    } catch {
      // Theme still saved locally
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await updateUserProfile({
        notify_upcoming_milestones: notifyUpcoming,
        notify_new_journeys: notifyNewJourneys,
        notify_completed_milestones: notifyCompleted,
      });
      showToast('Notification Preferences Saved', 'In-app alert settings updated.');
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Could not save preferences.',
        'error'
      );
    }
  };

  const handleExportJSON = () => {
    if (!user) return;
    exportUserDataAsJSON({
      exportedAt: new Date().toISOString(),
      application: 'SPG11 Journey Tracker',
      userId: user.id,
      profile,
      journeys,
      milestones,
      journalEntries,
      photos,
    });
    showToast('JSON Export Downloaded', 'Your private journey data has been exported.');
  };

  const handleExportCSV = () => {
    if (!user) return;
    exportUserDataAsCSV({
      exportedAt: new Date().toISOString(),
      application: 'SPG11 Journey Tracker',
      userId: user.id,
      profile,
      journeys,
      milestones,
      journalEntries,
      photos,
    });
    showToast('CSV Export Downloaded', 'Your spreadsheet export is ready.');
  };

  const handleConfirmDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await deleteUserAccount();
      showToast('Account Deleted', 'Your account and all private data have been removed.');
      navigate('/');
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Failed to delete account.',
        'error'
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          User Profile & Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Manage your account details, theme preferences, in-app notifications, and personal data exports.
        </p>
      </div>

      {/* 1. Personal Profile & Avatar */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Personal Profile
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-teal-600 text-white text-2xl font-bold flex items-center justify-center">
                {(fullName || 'U').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-semibold cursor-pointer">
                <Upload className="w-4 h-4 text-teal-600" />
                <span>
                  {uploadingAvatar ? 'Uploading...' : 'Upload Profile Picture'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Supports JPEG, PNG, WebP, or GIF up to 5 MB.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold"
          >
            <Check className="w-4 h-4" />
            <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </form>
      </section>

      {/* 2. Theme Preference */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-teal-400" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500" />
          )}
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Appearance & Theme Preference
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Choose between White Mode and Dark Mode. Your selection updates immediately and is saved for future visits.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <button
            type="button"
            onClick={() => handleThemeSelect('light')}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
              theme === 'light'
                ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 ring-2 ring-teal-500/30'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  White Mode
                </p>
                <p className="text-xs text-slate-500">Clean light interface</p>
              </div>
            </div>
            {theme === 'light' && <Check className="w-4 h-4 text-teal-600" />}
          </button>

          <button
            type="button"
            onClick={() => handleThemeSelect('dark')}
            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
              theme === 'dark'
                ? 'border-teal-500 bg-teal-950/40 ring-2 ring-teal-500/30'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-teal-400" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Dark Mode
                </p>
                <p className="text-xs text-slate-500">Deep navy comfort theme</p>
              </div>
            </div>
            {theme === 'dark' && <Check className="w-4 h-4 text-teal-400" />}
          </button>
        </div>
      </section>

      {/* 3. Email & Password Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Change Email Address
            </h2>
          </div>

          <form onSubmit={handleChangeEmail} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={savingEmail}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
            >
              {savingEmail ? 'Updating...' : 'Update Email'}
            </button>
          </form>
        </section>

        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Change Password
            </h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={savingPassword}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
            >
              {savingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </section>
      </div>

      {/* 4. In-App Notification Preferences */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            In-App Notification Preferences
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure which events generate in-app notifications in your dashboard notification center. (Browser push notifications require separate server VAPID push configuration and are not enabled by default.)
        </p>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Upcoming Milestones
              </p>
              <p className="text-xs text-slate-500">
                Notify me in-app when new upcoming milestones are scheduled
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyUpcoming}
              onChange={(e) => setNotifyUpcoming(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Newly Created Journeys
              </p>
              <p className="text-xs text-slate-500">
                Add a notification entry when a new journey is started
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyNewJourneys}
              onChange={(e) => setNotifyNewJourneys(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Completed Milestones
              </p>
              <p className="text-xs text-slate-500">
                Celebrate when a milestone is marked as completed
              </p>
            </div>
            <input
              type="checkbox"
              checked={notifyCompleted}
              onChange={(e) => setNotifyCompleted(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSaveNotifications}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
        >
          Save Notification Settings
        </button>
      </section>

      {/* 5. Data Export (CSV & JSON) */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <Download className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Export Your Personal Journey Data
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Download a complete copy of your journeys ({journeys.length}), milestones ({milestones.length}), and private journal entries ({journalEntries.length}). Only records belonging to your authenticated user ID are included.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export as CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold"
          >
            <FileJson className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Export as JSON</span>
          </button>
        </div>
      </section>

      {/* 6. Danger Zone: Secure Account Deletion */}
      <section className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 space-y-3">
        <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
          <Trash2 className="w-5 h-5" />
          <h2 className="text-lg font-bold">Delete Account Permanently</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Permanently delete your account, profile, journeys, milestones, private journal entries, and uploaded photographs. This action cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setConfirmDeleteAccount(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold"
        >
          Delete My Account
        </button>
      </section>

      <ConfirmDialog
        isOpen={confirmDeleteAccount}
        title="Delete Your Account Permanently?"
        message="This will permanently erase all your journeys, milestones, journal reflections, and photographs. Are you sure you want to proceed?"
        confirmLabel="Yes, Delete My Account"
        loading={deletingAccount}
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => setConfirmDeleteAccount(false)}
      />
    </div>
  );
};
