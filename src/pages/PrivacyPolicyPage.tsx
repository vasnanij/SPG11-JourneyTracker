import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Cookie, Eye, FileText, Mail } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const PrivacyPolicyPage: React.FC = () => {
  useDocumentMeta({
    title: 'Privacy Policy & Google AdSense Cookie Disclosure',
    description:
      'Read the complete Privacy Policy for SPG11 Journey Tracker, including how we protect personal data, our Google AdSense and DoubleClick cookie disclosures, and your GDPR/CCPA privacy rights.',
    isPrivate: false,
  });

  return (
    <PublicLayout>
      <section className="py-14 sm:py-20 bg-gradient-to-b from-teal-50/50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal & Data Protection Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Last Updated: November 13, 2026 • Effective Date: November 1, 2026
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* 1. Introduction */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>1. Introduction and Scope</span>
            </h2>
            <p>
              Welcome to <strong>SPG11 Journey Tracker</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We respect your privacy and are committed to protecting the personal information you share when visiting our public website, reading our educational resource guides, or using our authenticated milestone tracking and journaling application.
            </p>
            <p>
              This Privacy Policy explains what information we collect, how we use and safeguard it, how third-party advertising partners (including Google AdSense) use cookies on public pages, and how you can exercise your data privacy rights at any time.
            </p>
          </div>

          {/* 2. Information We Collect */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>2. Information We Collect</span>
            </h2>
            <p>We collect information in the following ways depending on how you interact with SPG11 Journey Tracker:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account & Profile Information:</strong> When you register for an account, we collect your name, email address, encrypted authentication credentials (managed via Supabase Auth), optional profile avatar, and theme/notification preferences.
              </li>
              <li>
                <strong>User-Created Workspace Records:</strong> When logged in, you may voluntarily create journeys, milestones, private journal entries, and photo gallery uploads. These records are strictly isolated to your authenticated user ID (`auth.uid()`) via PostgreSQL Row-Level Security (RLS) policies and private storage buckets.
              </li>
              <li>
                <strong>Contact Inquiries:</strong> When you submit a message through our <Link to="/contact" className="text-teal-600 dark:text-teal-400 underline">Contact Us</Link> page, we collect your name, email address, topic, and message content solely to respond to your inquiry.
              </li>
              <li>
                <strong>Technical & Log Data:</strong> Like most web applications, standard non-identifying browser metadata (such as browser type, operating system, referring URL, date/time stamp, and anonymized IP address) is processed for security, performance monitoring, and fraud prevention.
              </li>
            </ul>
          </div>

          {/* 3. Mandatory Google AdSense & Advertising Cookies Clause */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cookie className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>3. Google AdSense & Advertising Cookies Disclosure</span>
            </h2>
            <p>
              To support the operation and free availability of our public educational guides and platform infrastructure, we may display advertisements served by <strong>Google AdSense</strong> and third-party advertising partners on public-facing pages.
            </p>
            <ul className="list-disc pl-6 space-y-2.5">
              <li>
                <strong>Third-Party Vendors and Cookies:</strong> Third-party vendors, including Google, use cookies (such as the Google advertising cookie and DoubleClick DART cookie) to serve ads based on a user&apos;s prior visits to this website or other websites on the internet.
              </li>
              <li>
                <strong>Personalized Advertising:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve advertisements to our visitors based on their visit to SPG11 Journey Tracker and/or other sites on the internet.
              </li>
              <li>
                <strong>How to Opt Out of Personalized Advertising:</strong> Users may opt out of personalized advertising at any time by visiting{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 dark:text-teal-400 font-semibold underline"
                >
                  Google Ads Settings (adssettings.google.com)
                </a>
                . Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 dark:text-teal-400 font-semibold underline"
                >
                  www.aboutads.info/choices
                </a>{' '}
                or{' '}
                <a
                  href="https://www.youronlinechoices.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 dark:text-teal-400 font-semibold underline"
                >
                  www.youronlinechoices.eu
                </a>
                .
              </li>
              <li>
                <strong>Strict Separation from Private Workspace Data:</strong> Private records created inside your authenticated dashboard (journeys, milestones, private journal entries, and uploaded photographs) are <strong>never</strong> shared with advertising networks, indexed by search engines, or used for ad targeting under any circumstances.
              </li>
            </ul>
          </div>

          {/* 4. Essential First-Party Cookies & Local Storage */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              4. First-Party Cookies and Local Storage
            </h2>
            <p>
              In addition to third-party cookies on public pages, SPG11 Journey Tracker uses essential first-party browser storage (`localStorage` and session tokens) to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Maintain your authenticated login session (`spg11_supabase_auth_token`).</li>
              <li>Remember your visual accessibility preference between White Mode and Dark Mode (`spg11_theme_preference`).</li>
              <li>Cache static application shell files via our Progressive Web App (PWA) Service Worker for faster page loads.</li>
            </ul>
          </div>

          {/* 5. Database Security & Row-Level Isolation */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>5. Data Security & Row-Level Isolation</span>
            </h2>
            <p>
              All database tables (`profiles`, `journeys`, `milestones`, `journal_entries`, and `journey_photos`) and private storage objects (`spg11-media`) enforce PostgreSQL Row-Level Security (RLS). Every query is cryptographically verified against the authenticated user&apos;s session JWT (`auth.uid()`), ensuring that no user can view, modify, or delete another user&apos;s private records. All data in transit is encrypted via HTTPS/TLS.
            </p>
          </div>

          {/* 6. Your Privacy Rights (GDPR, CCPA & Global Standards) */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              6. Your Data Rights (Export, Correction, and Deletion)
            </h2>
            <p>
              Regardless of your location (including under the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA)), we provide built-in self-service tools to exercise your rights:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                <strong>Right of Access & Data Portability:</strong> You can export all of your journeys, milestones, and journal entries in standard <strong>CSV</strong> or <strong>JSON</strong> format directly from your Profile & Settings page.
              </li>
              <li>
                <strong>Right to Rectification:</strong> You can edit or update your name, email address, journeys, milestones, and journal entries at any time.
              </li>
              <li>
                <strong>Right to Erasure (&ldquo;Right to Be Forgotten&rdquo;):</strong> You can permanently delete individual records or delete your entire account and all associated data from the Danger Zone section of your Profile & Settings page.
              </li>
            </ul>
          </div>

          {/* 7. Children's Privacy & Non-Medical Nature */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              7. Children&apos;s Privacy & Non-Medical Disclaimer
            </h2>
            <p>
              SPG11 Journey Tracker is intended for use by adults (18 years or older) or by parents and legal guardians documenting family journeys. We do not knowingly collect personal information directly from children under 13 without parental consent. Furthermore, SPG11 Journey Tracker is a personal organization and documentation tool and does not provide medical advice, clinical diagnosis, or treatment recommendations.
            </p>
          </div>

          {/* 8. Contact Us */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>8. Contact Information for Privacy Inquiries</span>
            </h2>
            <p className="text-sm">
              If you have any questions about this Privacy Policy, our cookie practices, or your personal data rights, please contact our Privacy & Support team via our{' '}
              <Link to="/contact" className="text-teal-600 dark:text-teal-400 font-semibold underline">
                Contact Us page
              </Link>{' '}
              or email us at <strong>privacy@spg11journeytracker.org</strong>.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
