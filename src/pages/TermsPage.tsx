import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const TermsPage: React.FC = () => {
  useDocumentMeta({
    title: 'Terms of Service & Medical Disclaimer',
    description:
      'Review the Terms of Service, user responsibilities, data ownership policies, and non-medical disclaimer for SPG11 Journey Tracker.',
    isPrivate: false,
  });

  return (
    <PublicLayout>
      <section className="py-14 sm:py-20 bg-gradient-to-b from-teal-50/50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Terms of Use & Platform Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Terms of Service & Non-Medical Disclaimer
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Last Updated: November 13, 2026
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-9 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Prominent Non-Medical Disclaimer */}
          <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-base">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>1. Important Non-Medical Disclaimer</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              <strong>SPG11 Journey Tracker is a personal tracking, milestone organization, and journaling platform—not a medical device, clinical diagnostic tool, or healthcare provider.</strong> All articles, guides, and templates on this website are provided strictly for informational and personal organization purposes. Nothing on this platform constitutes medical advice, diagnosis, or treatment recommendations. Always seek the advice of your neurologist, physiatrist, physical therapist, or other qualified healthcare provider with any questions you may have regarding a medical condition.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>2. Acceptance of Terms</span>
            </h2>
            <p>
              By accessing or using SPG11 Journey Tracker, browsing our public resource guides, or creating an account, you agree to be bound by these Terms of Service and our{' '}
              <Link to="/privacy-policy" className="text-teal-600 dark:text-teal-400 underline">
                Privacy Policy
              </Link>
              . If you do not agree to these terms, please discontinue use of the platform.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>3. User Accounts & Responsibilities</span>
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
              </li>
              <li>
                You agree not to upload unlawful, harmful, or infringing files, and not to attempt to bypass authentication, Row-Level Security policies, or storage restrictions.
              </li>
              <li>
                Uploaded images must comply with our supported formats (`JPEG`, `PNG`, `WebP`, `GIF`) and the 5 MB per-file size limit.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              4. Ownership of Your Personal Content
            </h2>
            <p>
              You retain full ownership of all personal records, journey descriptions, milestone notes, private journal reflections, and photographs you create or upload to your workspace. We claim no intellectual property ownership over your personal documentation, and you may export (`CSV` / `JSON`) or permanently delete your records at any time.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Platform Availability & Limitation of Liability
            </h2>
            <p>
              We strive to keep SPG11 Journey Tracker available, responsive, and secure 24/7, and we encourage users to regularly export backup copies of their records using our built-in CSV and JSON export tools. The platform is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, either express or implied.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              6. Questions & Contact
            </h2>
            <p>
              If you have any questions regarding these Terms of Service, please reach out through our{' '}
              <Link to="/contact" className="text-teal-600 dark:text-teal-400 font-semibold underline">
                Contact Us
              </Link>{' '}
              page.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
