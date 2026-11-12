import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  Compass,
  BookOpen,
  Users,
  Sparkles,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const AboutPage: React.FC = () => {
  useDocumentMeta({
    title: 'About Us — Our Mission & Values',
    description:
      'Learn about SPG11 Journey Tracker, our mission to empower individuals and families living with Hereditary Spastic Paraplegia Type 11 through private milestone tracking and practical resource guides.',
    isPrivate: false,
  });

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-teal-50/60 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-5">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>About SPG11 Journey Tracker</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Built for Clarity, Dignity, and Meaningful Progress
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            SPG11 Journey Tracker was created to give individuals and families navigating Hereditary Spastic Paraplegia Type 11 a calm, structured, and completely private platform to organize daily milestones, preserve memories, and access practical educational guides.
          </p>
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                Why We Built This Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Turning Scattered Notes into a Cohesive Personal Timeline
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Families and individuals living with rare neurological conditions like SPG11 often juggle physical therapy schedules, hydrotherapy routines, assistive equipment fittings, and specialist check-ins across dozens of notebooks and apps.
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                We designed SPG11 Journey Tracker to bring everything into one calm, accessible workspace—combining quantitative milestone tracking with private chronological journaling and a curated public library of practical guides.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Compass className="w-6 h-6 text-teal-600 dark:text-teal-400 mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Structured Journeys
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Organize therapy, adaptive tech, and personal goals with automated progress calculations.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Privacy First
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Protected by Supabase Row-Level Security (RLS) so your private records belong strictly to you.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Open Resource Library
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Free, publicly accessible guides covering mobility, adaptive living, and caregiver wellness.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Accessible by Design
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Full White Mode and Dark Mode support, clear typography, and mobile-ready PWA installation.
                </p>
              </div>
            </div>
          </div>

          {/* Core Commitments */}
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Our Editorial & Platform Principles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  1. Respect for Personal Data Ownership
                </h3>
                <p className="leading-relaxed">
                  You own your stories, milestones, and photographs. We provide one-click CSV and JSON data exports and transparent account deletion tools with zero lock-in.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  2. Practical, Empowering Guides
                </h3>
                <p className="leading-relaxed">
                  Our public resource articles focus on actionable organization, daily comfort, ergonomic adaptations, and family sustainability—written in clear, compassionate language.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">
                  3. Clear Non-Medical Boundaries
                </h3>
                <p className="leading-relaxed">
                  We never replace your relationship with qualified neurologists or physical therapists. Instead, we help you organize your personal observations so every clinical visit is more productive.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <Sparkles className="w-4 h-4" />
              <span>Explore Our Public Library or Start Your Workspace</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Ready to Explore SPG11 Journey Tracker?
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                <span>Browse Resource Guides</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-colors"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
