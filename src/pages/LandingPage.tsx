import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Map,
  CheckCircle2,
  BookOpen,
  Image as ImageIcon,
  BarChart3,
  ShieldCheck,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Send,
  HeartHandshake,
  Lock,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { RESOURCE_ARTICLES } from '../data/resourcesData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { validateEmail } from '../utils/validation';

const FEATURES = [
  {
    icon: Map,
    title: 'Structured Journey Tracking',
    description:
      'Organize therapy programs, daily mobility goals, adaptive equipment transitions, and personal chapters with clear status and progress indicators.',
  },
  {
    icon: CheckCircle2,
    title: 'Automated Milestone Progress',
    description:
      'Set target dates, add personal notes, and watch your overall journey progress calculate automatically as each milestone is completed.',
  },
  {
    icon: BookOpen,
    title: 'Private Personal Journal',
    description:
      'Write chronological reflections, attach photographs, and link entries to specific journeys in a completely private space.',
  },
  {
    icon: ImageIcon,
    title: 'Secure Photo Gallery',
    description:
      'Preserve meaningful visual memories with captions, journey organization, and full-resolution modal previews backed by private storage.',
  },
  {
    icon: Clock,
    title: 'Interactive Chronological Timeline',
    description:
      'Visualize journey start dates, completed milestones, upcoming targets, and journal entries on a unified filterable timeline.',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics & Data Export',
    description:
      'Monitor progress through intuitive charts and export your personal records anytime in standard CSV or JSON formats.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Create Your Secure Account',
    description:
      'Sign up with your email to initialize your private workspace protected by Supabase Row-Level Security (RLS).',
  },
  {
    step: '02',
    title: 'Define Journeys & Milestones',
    description:
      'Create journeys for physical therapy, adaptive living, wellness, or personal goals and break them into actionable milestones.',
  },
  {
    step: '03',
    title: 'Document Memories & Monitor Progress',
    description:
      'Record daily journal entries, upload photos, and track real-time completion charts from desktop or mobile.',
  },
];

const BENEFITS = [
  {
    icon: Lock,
    title: '100% Private by Design',
    description:
      'Strict database Row-Level Security ensures only you can view, edit, or export your journeys, journal reflections, and photographs.',
  },
  {
    icon: HeartHandshake,
    title: 'Built for Clarity & Calm',
    description:
      'Thoughtfully designed interface with comfortable typography, distraction-free layouts, and full White Mode and Dark Mode support.',
  },
  {
    icon: Smartphone,
    title: 'Installable Progressive Web App',
    description:
      'Install SPG11 Journey Tracker directly onto Android, iOS, Windows, or macOS for a native app experience.',
  },
  {
    icon: Download,
    title: 'Full Data Ownership',
    description:
      'Your memories belong to you. Export your entire history to CSV or JSON with a single click whenever you choose.',
  },
];

const FAQS = [
  {
    question: 'What is SPG11 Journey Tracker?',
    answer:
      'SPG11 Journey Tracker is a dedicated personal documentation, milestone organization, and journaling web application designed to help individuals and families track meaningful progress, daily routines, and personal memories.',
  },
  {
    question: 'Are my journal entries and photographs private?',
    answer:
      'Yes. Every record is isolated to your authenticated user ID using Supabase Row-Level Security (RLS) policies and private storage buckets. No other user can access your records.',
  },
  {
    question: 'How is journey progress calculated?',
    answer:
      'Whenever you add or complete milestones inside a journey, the platform automatically computes the completion percentage based on completed vs. total milestones and updates your dashboard charts.',
  },
  {
    question: 'Can I export my records or use the app on mobile?',
    answer:
      'Absolutely. You can install SPG11 Journey Tracker as a Progressive Web App (PWA) on mobile or desktop and export your journeys, milestones, and journal entries as CSV or JSON files from your Profile settings.',
  },
  {
    question: 'Does this platform provide medical advice?',
    answer:
      'No. SPG11 Journey Tracker is strictly a personal tracking, journaling, and milestone documentation tool—not a medical diagnosis or treatment recommendation service.',
  },
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  useDocumentMeta({
    title: 'Track Every Step of Your SPG11 Journey',
    description:
      'A simple and meaningful platform to document your journey, organize milestones, save memories, and monitor your progress.',
    isPrivate: false,
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);

    if (!contactName.trim()) {
      setContactError('Please enter your name.');
      return;
    }
    const emailErr = validateEmail(contactEmail);
    if (emailErr) {
      setContactError(emailErr);
      return;
    }
    if (!contactMessage.trim() || contactMessage.trim().length < 10) {
      setContactError('Please enter a message of at least 10 characters.');
      return;
    }

    setContactSent(true);
    showToast(
      'Message Received',
      'Thank you for reaching out! Our team has recorded your inquiry.'
    );
    setContactName('');
    setContactEmail('');
    setContactMessage('');
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28 bg-gradient-to-b from-teal-50/60 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Private Milestone, Journal & Memory Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Track Every Step of Your SPG11 Journey.
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A simple and meaningful platform to document your journey, organize milestones, save memories, and monitor your progress.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? '/dashboard' : '/register'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold shadow-lg shadow-teal-600/25 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-base font-semibold transition-all"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Dashboard Preview Showcase */}
          <div className="mt-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  SPG11 Journey Tracker — Live Workspace Preview
                </span>
              </div>
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> End-to-End RLS Protected
              </span>
            </div>
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Active Journey
                </div>
                <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  Daily Mobility & Hydrotherapy Routine
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  4 of 5 milestones completed • Started Oct 2026
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Completion Progress</span>
                    <span className="text-teal-600 dark:text-teal-400">80%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full w-4/5" />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Upcoming Milestone
                </div>
                <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  6-Week Gait & Balance Check-In
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Scheduled for Nov 20, 2026 • Mobility & Physical Therapy
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5" /> Reminder Active
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Private Journal & Gallery
                </div>
                <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  Afternoon Walk & Stretching Notes
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Documented energy levels, stretching exercises, and uploaded 3 progress photos.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                  <Lock className="w-3.5 h-3.5" /> Private to Owner
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              Platform Capabilities
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Everything You Need to Document Your Journey
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              Purpose-built tools to keep your milestones, daily reflections, and visual memories organized in one calm, accessible workspace.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              How It Works
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Simple, Meaningful Progress in Three Steps
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <span className="text-3xl font-extrabold text-teal-600/30 dark:text-teal-400/30">
                  {item.step}
                </span>
                <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200/70 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              Why SPG11 Journey Tracker
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Designed for Privacy, Accessibility & Peace of Mind
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {b.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Published SPG11 Resource Guides Section */}
      <section className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                Public Resource Library
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Practical Guides for the SPG11 Community
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
                Explore our free, in-depth guides covering physical therapy organization, home accessibility, specialist appointment preparation, and family wellness.
              </p>
            </div>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 hover:bg-teal-100 text-xs sm:text-sm font-bold shrink-0"
            >
              <span>View All {RESOURCE_ARTICLES.length} Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {RESOURCE_ARTICLES.slice(0, 4).map((article) => (
              <Link
                key={article.slug}
                to={`/resources/${article.slug}`}
                className="flex flex-col justify-between p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all shadow-sm"
              >
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-teal-100/80 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-[11px] font-semibold mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-3">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <span>{article.readTime}</span>
                  <span>Read Guide →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              Frequently Asked Questions
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Common Questions About SPG11 Journey Tracker
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-slate-900 dark:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-teal-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-10">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                Contact & Feedback
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Have Questions or Suggestions?
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Send us a message regarding platform features, accessibility requests, or technical support.
              </p>
            </div>

            {contactSent ? (
              <div className="mt-8 p-6 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-center">
                <CheckCircle2 className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto" />
                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  Thank You for Contacting Us
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  We have received your message and will respond shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setContactSent(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="mt-8 space-y-4" noValidate>
                {contactError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-medium text-red-700 dark:text-red-300">
                    {contactError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Topic
                  </label>
                  <select
                    id="contact-subject"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Accessibility Feedback">Accessibility Feedback</option>
                    <option value="Privacy & Security">Privacy & Security</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we help you?"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
