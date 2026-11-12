import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Map,
  CheckCircle2,
  Clock,
  BookOpen,
  Image as ImageIcon,
  Calendar,
  Filter,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { TimelineItem } from '../types';
import { formatDate } from '../utils/validation';

export const TimelinePage: React.FC = () => {
  const { journeys, milestones, journalEntries, photos } = useAppData();

  useDocumentMeta({
    title: 'Interactive Timeline',
    isPrivate: true,
  });

  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [journeyFilter, setJourneyFilter] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');

  const allTimelineItems: TimelineItem[] = useMemo(() => {
    const items: TimelineItem[] = [];

    for (const j of journeys) {
      items.push({
        id: `journey-${j.id}`,
        date: j.start_date,
        type: 'journey_start',
        title: `Started Journey: ${j.title}`,
        description: j.description || `${j.category} (${j.status})`,
        journey_id: j.id,
        journey_title: j.title,
        category: j.category,
      });
    }

    for (const m of milestones) {
      const parent = journeys.find((j) => j.id === m.journey_id);
      items.push({
        id: `milestone-${m.id}`,
        date: m.milestone_date,
        type: m.is_completed ? 'milestone_completed' : 'milestone_upcoming',
        title: `${m.is_completed ? 'Completed Milestone' : 'Upcoming Milestone'}: ${
          m.title
        }`,
        description: m.description || m.personal_notes || 'Milestone checkpoint',
        journey_id: m.journey_id,
        journey_title: parent?.title,
      });
    }

    for (const e of journalEntries) {
      const parent = journeys.find((j) => j.id === e.journey_id);
      items.push({
        id: `journal-${e.id}`,
        date: e.entry_date,
        type: 'journal_entry',
        title: `Journal Reflection: ${e.title}`,
        description: e.content,
        journey_id: e.journey_id,
        journey_title: parent?.title,
      });
    }

    for (const p of photos) {
      const parent = journeys.find((j) => j.id === p.journey_id);
      items.push({
        id: `photo-${p.id}`,
        date: p.created_at.slice(0, 10),
        type: 'personal_event',
        title: `Memory Captured: ${p.caption || 'Journey Photograph'}`,
        description: 'Uploaded to private photo gallery',
        journey_id: p.journey_id,
        journey_title: parent?.title,
      });
    }

    return items;
  }, [journeys, milestones, journalEntries, photos]);

  const filteredTimeline = useMemo(() => {
    return allTimelineItems
      .filter((item) => {
        if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
        if (journeyFilter !== 'ALL' && item.journey_id !== journeyFilter) return false;
        if (dateFrom && new Date(item.date) < new Date(dateFrom)) return false;
        if (dateTo && new Date(item.date) > new Date(dateTo)) return false;
        return true;
      })
      .sort((a, b) => {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sortDirection === 'desc' ? diff : -diff;
      });
  }, [allTimelineItems, typeFilter, journeyFilter, dateFrom, dateTo, sortDirection]);

  const getBadgeConfig = (type: TimelineItem['type']) => {
    switch (type) {
      case 'journey_start':
        return {
          icon: Map,
          label: 'Journey Start',
          bg: 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300',
          dot: 'bg-teal-600',
        };
      case 'milestone_completed':
        return {
          icon: CheckCircle2,
          label: 'Completed Milestone',
          bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300',
          dot: 'bg-emerald-600',
        };
      case 'milestone_upcoming':
        return {
          icon: Clock,
          label: 'Upcoming Milestone',
          bg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300',
          dot: 'bg-blue-600',
        };
      case 'journal_entry':
        return {
          icon: BookOpen,
          label: 'Journal Entry',
          bg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300',
          dot: 'bg-purple-600',
        };
      default:
        return {
          icon: ImageIcon,
          label: 'Personal Event / Photo',
          bg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300',
          dot: 'bg-amber-600',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Interactive Chronological Timeline
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Explore journey start dates, completed milestones, upcoming targets, journal reflections, and personal events in chronological order.
        </p>
      </div>

      {/* Date & Type Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Event Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          >
            <option value="ALL">All Events</option>
            <option value="journey_start">Journey Start Dates</option>
            <option value="milestone_completed">Completed Milestones</option>
            <option value="milestone_upcoming">Upcoming Milestones</option>
            <option value="journal_entry">Journal Entries</option>
            <option value="personal_event">Personal Memories & Photos</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Journey Filter
          </label>
          <select
            value={journeyFilter}
            onChange={(e) => setJourneyFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          >
            <option value="ALL">All Journeys</option>
            {journeys.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Chronological Order
          </label>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as 'desc' | 'asc')}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredTimeline.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <Filter className="w-9 h-9 text-teal-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No Timeline Events Found
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create journeys, milestones, or journal entries, or clear your date filters to see timeline activity.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 before:absolute before:top-3 before:bottom-3 before:left-2.5 sm:before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 space-y-6">
          {filteredTimeline.map((item) => {
            const cfg = getBadgeConfig(item.type);
            const Icon = cfg.icon;
            return (
              <div key={item.id} className="relative">
                <span
                  className={`absolute -left-6 sm:-left-7 top-4 w-5 h-5 rounded-full ${cfg.dot} ring-4 ring-slate-50 dark:ring-slate-950 flex items-center justify-center text-white`}
                >
                  <Icon className="w-3 h-3" />
                </span>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg.bg}`}
                      >
                        {cfg.label}
                      </span>
                      {item.journey_title && item.journey_id && (
                        <Link
                          to={`/journeys/${item.journey_id}`}
                          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          {item.journey_title}
                        </Link>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.date)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
