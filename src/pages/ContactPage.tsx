import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useToast } from '../context/ToastContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { validateEmail } from '../utils/validation';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();

  useDocumentMeta({
    title: 'Contact Us — Support, Accessibility & General Inquiries',
    description:
      'Get in touch with the SPG11 Journey Tracker team for platform support, accessibility feedback, privacy questions, or resource suggestions.',
    isPrivate: false,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Platform Inquiry');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setError('Please enter a message of at least 10 characters.');
      return;
    }

    setSubmitted(true);
    showToast(
      'Inquiry Submitted',
      'Thank you for contacting SPG11 Journey Tracker. We will respond within 1–2 business days.'
    );
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <PublicLayout>
      <section className="py-14 sm:py-20 bg-gradient-to-b from-teal-50/60 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Support & Community Feedback</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Contact Us
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Have a question about using SPG11 Journey Tracker, an accessibility suggestion, or a privacy inquiry? We are here to help.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Sidebar */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Direct Email Channels
              </h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Reach out directly to the appropriate department:
              </p>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    General Support:
                  </span>{' '}
                  <span className="text-teal-600 dark:text-teal-400">
                    support@spg11journeytracker.org
                  </span>
                </li>
                <li>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Privacy & Data Requests:
                  </span>{' '}
                  <span className="text-teal-600 dark:text-teal-400">
                    privacy@spg11journeytracker.org
                  </span>
                </li>
                <li>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Editorial & Guides:
                  </span>{' '}
                  <span className="text-teal-600 dark:text-teal-400">
                    editorial@spg11journeytracker.org
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Response Times
              </h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We review all inquiries Monday through Friday and aim to respond within <strong>24 to 48 hours</strong>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Non-Emergency Notice
              </h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Please note that we are a software and documentation platform and cannot provide medical consultations. For clinical questions, please contact your healthcare provider directly.
              </p>
            </div>
          </div>

          {/* Interactive Contact Form */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Send Us a Message
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Fill out the form below and our team will get back to you promptly.
            </p>

            {submitted ? (
              <div className="mt-8 p-8 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-teal-600 dark:text-teal-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Message Sent Successfully
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out to SPG11 Journey Tracker. We have logged your message and will reply via email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                {error && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-medium text-red-700 dark:text-red-300"
                  >
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-page-name"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-page-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-page-email"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-page-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-page-subject"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Inquiry Category
                  </label>
                  <select
                    id="contact-page-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="General Platform Inquiry">General Platform Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Accessibility Feedback">Accessibility Feedback</option>
                    <option value="Resource Guide Suggestion">Resource Guide Suggestion</option>
                    <option value="Privacy & Data Protection">Privacy & Data Protection</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-page-message"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="contact-page-message"
                    rows={6}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please share details about your question or feedback..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    Your contact details are never sold or shared.
                  </span>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
