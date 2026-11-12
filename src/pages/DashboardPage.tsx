import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Map,
  Activity,
  CheckCircle2,
  Clock,
  Plus,
  BookOpen,
  Image as ImageIcon,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { formatDate } from '../utils/validation';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const {
    journeys,
    milestones,
    journalEntries,
    photos,
    stats,
    loadingData,
    toggleMilestone,
  } = useAppData();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useDocumentMeta({
    title: 'Dashboard',
    isPrivate: true,
  });

  const displayName = profile?.full_name || user?.full_name || 'Friend';

  // Prepare Recharts data from real user records
  const journeyProgressData = journeys.slice(0, 6).map((j) => ({
    name: j.title.length > 16 ? `${j.title.slice(0, 16)}…` : j.title,
    fullTitle: j.title,
    progress: j.progress_percentage,
  }));

  const statusBreakdownData = [
    {
      name: 'Completed Milestones',
      value: stats.completedMilestones,
      color: '#0d9488',
    },
    {
      name: 'Upcoming Milestones',
      value: stats.upcomingMilestones,
      color: '#3b82f6',
    },
  ];

  const upcomingMilestonesList = milestones
    .filter((m) => !m.is_completed)
    .slice(0, 5);

  // Recent Activity combining journeys, milestones, and journal entries
  const recentActivity = [
    ...journeys.map((j) => ({
      id: `j-${j.id}`,
      title: `Journey started: ${j.title}`,
      subtitle: `${j.category} • ${j.status}`,
      date: j.created_at,
      link: `/journeys/${j.id}`,
    })),
    ...milestones
      .filter((m) => m.is_completed)
      .map((m) => ({
        id: `m-${m.id}`,
        title: `Milestone completed: ${m.title}`,
        subtitle: `Completed on ${formatDate(m.completed_at || m.milestone_date)}`,
        date: m.completed_at || m.created_at,
        link: `/journeys/${m.journey_id}`,
      })),
    ...journalEntries.map((e) => ({
      id: `e-${e.id}`,
      title: `Journal entry: ${e.title}`,
      subtitle: `Entry date: ${formatDate(e.entry_date)}`,
      date: e.created_at,
      link: '/journal',
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const handleQuickCompleteMilestone = async (id: string, title: string) => {
    try {
      await toggleMilestone(id, true);
      showToast('Milestone Completed!', `"${title}" marked as completed.`);
    } catch (err) {
      showToast(
        'Action Failed',
        err instanceof Error ? err.message : 'Could not update milestone.',
        'error'
      );
    }
  };

  const chartAxisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const chartGridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const tooltipBg = theme === 'dark' ? '#0f172a' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? '#334155' : '#cbd5e1';
  const tooltipText = theme === 'dark' ? '#f8fafc' : '#0f172a';

  if (loadingData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Quick Actions */}
      <section className="rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700 text-white p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-50 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal SPG11 Journey Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {displayName}
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-teal-50/90 max-w-2xl">
              Track your active journeys, celebrate completed milestones, and document daily reflections in your private workspace.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/journeys?action=new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-900 hover:bg-teal-50 text-xs sm:text-sm font-bold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Journey</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/milestones?action=new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800/70 hover:bg-teal-800 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/journal?action=new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800/70 hover:bg-teal-800 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Write Journal</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/gallery?action=upload')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800/70 hover:bg-teal-800 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Core Dashboard Statistics Cards */}
      <section
        aria-label="Dashboard Statistics"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Journeys
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalJourneys}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {stats.completedJourneys} completed
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Map className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Journeys
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.activeJourneys}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Currently in progress
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completed Milestones
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.completedMilestones}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Out of {stats.totalMilestones} total
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Upcoming Milestones
            </p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.upcomingMilestones}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Pending completion
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Progress Visualizations (Recharts) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Progress Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Journey Progress Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time completion percentage across your journeys
              </p>
            </div>
            <Link
              to="/journeys"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {journeyProgressData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Map className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No journeys created yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Create your first journey to visualize progress percentages here.
              </p>
              <Link
                to="/journeys?action=new"
                className="mt-4 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
              >
                Create First Journey
              </Link>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={journeyProgressData}
                  margin={{ top: 10, right: 16, left: -12, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                  <XAxis
                    dataKey="name"
                    stroke={chartAxisColor}
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={chartAxisColor}
                    fontSize={12}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      color: tooltipText,
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Progress']}
                  />
                  <Bar
                    dataKey="progress"
                    fill="#0d9488"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Milestone Completion Pie Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Milestone Completion Ratio
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completed vs. upcoming milestones
            </p>
          </div>

          {stats.totalMilestones === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl my-4">
              <CheckCircle2 className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No milestones yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Add milestones to your journeys to track completion metrics.
              </p>
            </div>
          ) : (
            <div className="h-52 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={76}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusBreakdownData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: tooltipBg,
                      borderColor: tooltipBorder,
                      color: tooltipText,
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-600 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">
                Completed ({stats.completedMilestones})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-400">
                Upcoming ({stats.upcomingMilestones})
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Overview & Upcoming Milestones */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Journey Overview */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Your Active & Recent Journeys
            </h2>
            <Link
              to="/journeys"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Manage Journeys →
            </Link>
          </div>

          {journeys.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                You haven&apos;t added any journeys yet.
              </p>
              <Link
                to="/journeys?action=new"
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Start a Journey
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {journeys.slice(0, 4).map((journey) => (
                <Link
                  key={journey.id}
                  to={`/journeys/${journey.id}`}
                  className="block p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 bg-slate-50/50 dark:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {journey.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {journey.category} • Started {formatDate(journey.start_date)}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
                        journey.status === 'Completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                          : journey.status === 'In Progress'
                          ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {journey.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="text-teal-600 dark:text-teal-400">
                        {journey.progress_percentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-teal-600 rounded-full transition-all duration-300"
                        style={{ width: `${journey.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Milestones */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Upcoming Milestones
            </h2>
            <Link
              to="/milestones"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              All Milestones →
            </Link>
          </div>

          {upcomingMilestonesList.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No pending milestones right now.
              </p>
              <Link
                to="/milestones?action=new"
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Milestone
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMilestonesList.map((ms) => {
                const parentJourney = journeys.find((j) => j.id === ms.journey_id);
                return (
                  <div
                    key={ms.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {ms.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        Target: {formatDate(ms.milestone_date)}
                        {parentJourney ? ` • ${parentJourney.title}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickCompleteMilestone(ms.id, ms.title)}
                      title="Mark milestone as completed"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shrink-0 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Recent Activity & Recently Uploaded Photos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Activity
            </h2>
            <Link
              to="/timeline"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Full Timeline →
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400">
              Your recent journeys, completed milestones, and journal entries will appear here.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentActivity.map((act) => (
                <Link
                  key={act.id}
                  to={act.link}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 hover:opacity-80 transition-opacity"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {act.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {act.subtitle}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                    {formatDate(act.date)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recently Uploaded Photos */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recently Uploaded Photos
            </h2>
            <Link
              to="/gallery"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Open Gallery →
            </Link>
          </div>

          {photos.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <ImageIcon className="w-7 h-7 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No photographs uploaded yet.
              </p>
              <Link
                to="/gallery?action=upload"
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Upload First Photo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.slice(0, 6).map((photo) => (
                <Link
                  key={photo.id}
                  to="/gallery"
                  className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption || 'Journey memory'}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-950/80 to-transparent text-white text-[11px] font-medium truncate">
                      {photo.caption}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
