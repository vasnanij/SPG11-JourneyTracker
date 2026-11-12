import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { OfflineAndInstallBanner } from './OfflineBanner';
import { useAuth } from '../context/AuthContext';

const PUBLIC_NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/resources', label: 'Resources & Guides' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
];

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <OfflineAndInstallBanner />

      {/* Public Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle public navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/" aria-label="SPG11 Journey Tracker Home">
              <Logo size="md" />
            </Link>
          </div>

          <nav
            className="hidden lg:flex items-center gap-6 text-sm font-medium"
            aria-label="Main Public Navigation"
          >
            {PUBLIC_NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive
                      ? 'text-teal-600 dark:text-teal-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm shadow-teal-600/20 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
            {PUBLIC_NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Terms of Service
            </NavLink>
            {!user && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Comprehensive Public Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
            {/* Column 1: Brand */}
            <div className="space-y-3">
              <Logo size="md" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                A dedicated personal documentation, milestone organization, and private journaling platform built for individuals and families navigating the SPG11 journey.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <ShieldCheck className="w-4 h-4" />
                <span>HTTPS & Row-Level Security Protected</span>
              </div>
            </div>

            {/* Column 2: Platform & Guides */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Platform & Resources
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <Link to="/" className="hover:text-teal-600 dark:hover:text-teal-400">
                    Home & Overview
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    SPG11 Resource Library & Guides
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/daily-mobility-physical-therapy-and-hydrotherapy-routines"
                    className="hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    Mobility & Hydrotherapy Guide
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/adaptive-equipment-and-home-accessibility-planning"
                    className="hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    Adaptive Equipment Planning
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/caregiver-and-family-wellness-sustainable-routines"
                    className="hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    Caregiver & Family Wellness
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company & Trust */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                About & Support
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <Link to="/about" className="hover:text-teal-600 dark:hover:text-teal-400">
                    About Us & Our Mission
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-teal-600 dark:hover:text-teal-400">
                    Contact Us & Support
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-teal-600 dark:hover:text-teal-400">
                    Member Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-teal-600 dark:hover:text-teal-400">
                    Create Free Account
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Compliance */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Legal & Compliance
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    Privacy Policy & Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-teal-600 dark:hover:text-teal-400">
                    Terms of Service & Disclaimer
                  </Link>
                </li>
                <li>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-teal-600 dark:hover:text-teal-400"
                  >
                    XML Sitemap
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>
              <strong>Important Non-Medical Disclaimer:</strong> SPG11 Journey Tracker is a personal tracking, journaling, and milestone documentation tool—not a medical diagnosis or treatment recommendation service. Always consult qualified healthcare professionals for medical advice.
            </p>
            <p className="shrink-0">
              © {new Date().getFullYear()} SPG11 Journey Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
