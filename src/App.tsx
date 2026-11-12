import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages/AuthPages';
import { Compass } from 'lucide-react';

// Lazy-loaded public trust, legal, and resource pages
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage').then((m) => ({
    default: m.PrivacyPolicyPage,
  }))
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const ResourcesHubPage = lazy(() =>
  import('./pages/ResourcesPage').then((m) => ({ default: m.ResourcesHubPage }))
);
const ResourceArticlePage = lazy(() =>
  import('./pages/ResourcesPage').then((m) => ({
    default: m.ResourceArticlePage,
  }))
);

// Lazy-loaded protected dashboard pages
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const JourneysPage = lazy(() =>
  import('./pages/JourneysPage').then((m) => ({ default: m.JourneysPage }))
);
const JourneyDetailPage = lazy(() =>
  import('./pages/JourneyDetailPage').then((m) => ({
    default: m.JourneyDetailPage,
  }))
);
const MilestonesPage = lazy(() =>
  import('./pages/MilestonesPage').then((m) => ({ default: m.MilestonesPage }))
);
const JournalPage = lazy(() =>
  import('./pages/JournalPage').then((m) => ({ default: m.JournalPage }))
);
const GalleryPage = lazy(() =>
  import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);
const TimelinePage = lazy(() =>
  import('./pages/TimelinePage').then((m) => ({ default: m.TimelinePage }))
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);

const PageLoader: React.FC = () => (
  <div className="py-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
    <div className="w-12 h-12 rounded-2xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
      <Compass className="w-6 h-6 animate-spin" />
    </div>
    <p className="text-xs font-semibold">Loading view...</p>
  </div>
);

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppDataProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes (Accessible without password & indexed by Google) */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/resources" element={<ResourcesHubPage />} />
                  <Route path="/resources/:slug" element={<ResourceArticlePage />} />

                  {/* Authentication Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />

                  {/* Protected Private Workspace Routes (Protected from indexing) */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/journeys" element={<JourneysPage />} />
                    <Route path="/journeys/:id" element={<JourneyDetailPage />} />
                    <Route path="/milestones" element={<MilestonesPage />} />
                    <Route path="/timeline" element={<TimelinePage />} />
                    <Route path="/journal" element={<JournalPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>

                  {/* Catch-all fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AppDataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
