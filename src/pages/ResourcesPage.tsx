import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Calendar,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import {
  RESOURCE_ARTICLES,
  RESOURCE_CATEGORIES,
} from '../data/resourcesData';
import { formatDate } from '../utils/validation';

// ============================================================================
// PUBLIC RESOURCES & GUIDES HUB (/resources)
// ============================================================================
export const ResourcesHubPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useDocumentMeta({
    title: 'SPG11 Resource Library & Practical Guides',
    description:
      'Explore comprehensive, practical guides on SPG11 mobility routines, hydrotherapy tracking, adaptive equipment planning, specialist appointment preparation, and family wellness.',
    isPrivate: false,
  });

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return RESOURCE_ARTICLES.filter((art) => {
      if (selectedCategory !== 'ALL' && art.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        art.title.toLowerCase().includes(q) ||
        art.subtitle.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-teal-50/60 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Public Educational & Organization Library</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            SPG11 Resource Guides & Practical Handbooks
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            In-depth guides for organizing physical therapy milestones, planning home accessibility, preparing for specialist visits, and supporting family well-being.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === 'ALL'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                All Guides ({RESOURCE_ARTICLES.length})
              </button>
              {RESOURCE_CATEGORIES.map((cat) => {
                const count = RESOURCE_ARTICLES.filter(
                  (a) => a.category === cat
                ).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      selectedCategory === cat
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles & topics..."
                aria-label="Search resource guides"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.slug}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-semibold">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/resources/${article.slug}`}
                    className="block text-xl font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors leading-snug"
                  >
                    {article.title}
                  </Link>

                  <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    By {article.author}
                  </span>
                  <Link
                    to={`/resources/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

// ============================================================================
// INDIVIDUAL RESOURCE ARTICLE READER (/resources/:slug)
// ============================================================================
export const ResourceArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article =
    RESOURCE_ARTICLES.find((a) => a.slug === slug) || RESOURCE_ARTICLES[0];

  useDocumentMeta({
    title: article.title,
    description: article.summary,
    isPrivate: false,
  });

  const relatedArticles = RESOURCE_ARTICLES.filter(
    (a) => a.slug !== article.slug
  ).slice(0, 3);

  return (
    <PublicLayout>
      <article className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Resource Guides</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
            <span className="px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 font-semibold">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Published {formatDate(article.publishedAt)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {article.title}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {article.subtitle}
          </p>

          {/* Key Takeaways Box */}
          <div className="mt-8 p-6 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/80">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Key Takeaways</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {article.keyTakeaways.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Body Sections */}
          <div className="mt-10 space-y-8 text-base text-slate-700 dark:text-slate-200 leading-relaxed">
            {article.sections.map((sec) => (
              <section key={sec.heading} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </section>
            ))}
          </div>

          {/* CTA Box inside Article */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Put This Guide into Action in Your Workspace
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Create a free account to track journeys, milestones, and private journal entries.
              </p>
            </div>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold shrink-0"
            >
              Get Started Free
            </Link>
          </div>

          {/* Related Guides */}
          <div className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              More SPG11 Resource Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/resources/${rel.slug}`}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-colors bg-white dark:bg-slate-900"
                >
                  <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                    {rel.category}
                  </span>
                  <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {rel.title}
                  </h3>
                  <span className="mt-2 inline-block text-xs text-slate-500">
                    {rel.readTime} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </PublicLayout>
  );
};
