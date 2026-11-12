import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  X,
  RefreshCw,
  ShieldCheck,
  HardDrive,
  KeyRound,
  Terminal,
} from 'lucide-react';
import { SQL_MIGRATION_SCRIPT } from '../utils/constants';
import { SUPABASE_URL } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose?: () => void;
  forceBlocking?: boolean;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  forceBlocking = false,
}) => {
  const { isConfigured, tablesReady, recheckSchema } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(SQL_MIGRATION_SCRIPT);
      setCopied(true);
      showToast('SQL Migration Copied', 'Paste and run it in your Supabase SQL Editor.');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast('Copy failed', 'Please manually select and copy the SQL code.', 'error');
    }
  };

  const handleRecheck = async () => {
    setChecking(true);
    await recheckSchema();
    setChecking(false);
    showToast('Database Checked', 'Schema status updated.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="supabase-setup-title"
    >
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl my-8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="supabase-setup-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Supabase Backend & Database Setup Guide
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete 8-step guide for connecting and migrating your Supabase project
              </p>
            </div>
          </div>
          {!forceBlocking && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close setup modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 max-h-[78vh] overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              !isConfigured
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                : tablesReady
                ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
            }`}
          >
            <div>
              <p className="font-semibold">
                {!isConfigured
                  ? 'Supabase Credentials Missing (.env)'
                  : tablesReady
                  ? 'Connected: Supabase PostgreSQL Tables Active'
                  : 'Connected to Supabase URL — SQL Migration Ready to Execute'}
              </p>
              <p className="text-xs mt-1 opacity-90">
                {!isConfigured
                  ? 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file and restart the dev server.'
                  : `Endpoint: ${SUPABASE_URL}`}
              </p>
            </div>
            {isConfigured && (
              <button
                type="button"
                onClick={handleRecheck}
                disabled={checking}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
                {checking ? 'Checking...' : 'Re-check Schema'}
              </button>
            )}
          </div>

          {/* 8 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                <KeyRound className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                1–3. Project URL & Anon Key
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                1. Create a project at <strong>supabase.com/dashboard</strong>.<br />
                2. Go to <strong>Project Settings → API</strong> to copy the Project URL.<br />
                3. Copy the <strong>anon / public</strong> key into your <code>.env</code> file as{' '}
                <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                4–5. SQL Migrations & Auth
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                4. Open <strong>SQL Editor → New Query</strong> in Supabase and run the migration script below.<br />
                5. Under <strong>Authentication → Providers → Email</strong>, enable Email provider (and optionally disable Confirm Email for instant testing).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                <HardDrive className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                6–7. Private Storage & Policies
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                6. The SQL migration automatically creates the private bucket{' '}
                <code>spg11-media</code> (5 MB max, JPEG/PNG/WebP/GIF).<br />
                7. Storage RLS restricts access to <code>(storage.foldername(name))[1] = auth.uid()::text</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                <Terminal className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                8. Run & Test the Application
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Run <code>npm install</code> and <code>npm run dev</code>. Register an account, create journeys, track milestones, write journal entries, and upload photos.
              </p>
            </div>
          </div>

          {/* SQL Migration Script */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                supabase/migrations/20261109000000_spg11_schema.sql
              </span>
              <button
                type="button"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied SQL!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy SQL Migration
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-h-56 border border-slate-800">
              {SQL_MIGRATION_SCRIPT}
            </pre>
          </div>
        </div>

        {!forceBlocking && onClose && (
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
