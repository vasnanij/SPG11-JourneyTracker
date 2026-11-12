import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Calendar,
  X,
  CheckSquare,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { Milestone } from '../types';
import { formatDate } from '../utils/validation';

export const MilestonesPage: React.FC = () => {
  const {
    journeys,
    milestones,
    addMilestone,
    editMilestone,
    toggleMilestone,
    removeMilestone,
  } = useAppData();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  useDocumentMeta({
    title: 'Milestone Tracker',
    isPrivate: true,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [journeyFilter, setJourneyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMs, setEditingMs] = useState<Milestone | null>(null);
  const [selectedJourneyId, setSelectedJourneyId] = useState('');
  const [title, setTitle] = useState('');
  const [milestoneDate, setMilestoneDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [description, setDescription] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Milestone | null>(null);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openCreateModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openCreateModal = () => {
    setEditingMs(null);
    setSelectedJourneyId(journeys[0]?.id || '');
    setTitle('');
    setMilestoneDate(new Date().toISOString().slice(0, 10));
    setDescription('');
    setPersonalNotes('');
    setIsCompleted(false);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (ms: Milestone) => {
    setEditingMs(ms);
    setSelectedJourneyId(ms.journey_id);
    setTitle(ms.title);
    setMilestoneDate(ms.milestone_date);
    setDescription(ms.description);
    setPersonalNotes(ms.personal_notes || '');
    setIsCompleted(ms.is_completed);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedJourneyId) {
      setFormError('Please select a journey for this milestone.');
      return;
    }
    if (!title.trim()) {
      setFormError('Milestone title is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingMs) {
        await editMilestone(editingMs.id, {
          journey_id: selectedJourneyId,
          title,
          milestone_date: milestoneDate,
          description,
          personal_notes: personalNotes,
          is_completed: isCompleted,
        });
        showToast('Milestone Updated', `"${title}" saved.`);
      } else {
        await addMilestone({
          journey_id: selectedJourneyId,
          title,
          milestone_date: milestoneDate,
          description,
          personal_notes: personalNotes,
          is_completed: isCompleted,
        });
        showToast('Milestone Created', `"${title}" added and progress updated.`);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save milestone.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (ms: Milestone) => {
    try {
      await toggleMilestone(ms.id, !ms.is_completed);
      showToast(
        !ms.is_completed ? 'Milestone Completed!' : 'Marked as Pending',
        `"${ms.title}" updated.`
      );
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Unable to update milestone.',
        'error'
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeMilestone(deleteTarget.id);
      showToast('Milestone Deleted', `"${deleteTarget.title}" removed.`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Unable to delete milestone.',
        'error'
      );
    }
  };

  const filteredMilestones = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return milestones.filter((m) => {
      if (journeyFilter !== 'ALL' && m.journey_id !== journeyFilter) return false;
      if (statusFilter === 'COMPLETED' && !m.is_completed) return false;
      if (statusFilter === 'PENDING' && m.is_completed) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.personal_notes || '').toLowerCase().includes(q)
      );
    });
  }, [milestones, searchQuery, journeyFilter, statusFilter]);

  const chartData = useMemo(() => {
    return journeys.slice(0, 6).map((j) => {
      const list = milestones.filter((m) => m.journey_id === j.id);
      return {
        name: j.title.length > 14 ? `${j.title.slice(0, 14)}…` : j.title,
        completed: list.filter((m) => m.is_completed).length,
        pending: list.filter((m) => !m.is_completed).length,
      };
    });
  }, [journeys, milestones]);

  const totalCount = milestones.length;
  const completedCount = milestones.filter((m) => m.is_completed).length;
  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Milestone Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Track milestones across all your journeys and monitor automated completion progress.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          disabled={journeys.length === 0}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Progress Bar & Chart Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Overall Milestone Progress
            </span>
            <p className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white">
              {overallPct}%
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {completedCount} completed • {totalCount - completedCount} pending
            </p>
            <div className="mt-4 w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-300"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {journeys.slice(0, 3).map((j) => (
              <div key={j.id} className="text-xs">
                <div className="flex justify-between font-medium mb-1">
                  <span className="truncate max-w-[180px] text-slate-700 dark:text-slate-300">
                    {j.title}
                  </span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold">
                    {j.progress_percentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full"
                    style={{ width: `${j.progress_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Milestones by Journey
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Completed vs. pending milestones per journey
          </p>
          {chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-slate-500">
              Create a journey and add milestones to view chart analytics.
            </div>
          ) : (
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                    fontSize={12}
                  />
                  <YAxis
                    stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                      borderColor: theme === 'dark' ? '#334155' : '#cbd5e1',
                      color: theme === 'dark' ? '#f8fafc' : '#0f172a',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="completed" name="Completed" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milestones..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
          />
        </div>

        <select
          value={journeyFilter}
          onChange={(e) => setJourneyFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
        >
          <option value="ALL">All Journeys</option>
          {journeys.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as 'ALL' | 'PENDING' | 'COMPLETED')
          }
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
        >
          <option value="ALL">All Milestones</option>
          <option value="PENDING">Pending Only</option>
          <option value="COMPLETED">Completed Only</option>
        </select>
      </div>

      {/* Milestones List */}
      {journeys.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <CheckSquare className="w-10 h-10 text-teal-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Create a Journey First
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Milestones belong to a journey. Create your first journey to start tracking milestones.
          </p>
          <Link
            to="/journeys?action=new"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Create Journey
          </Link>
        </div>
      ) : filteredMilestones.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No milestones match your current filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMilestones.map((ms) => {
            const parentJourney = journeys.find((j) => j.id === ms.journey_id);
            return (
              <div
                key={ms.id}
                className={`p-5 rounded-2xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  ms.is_completed
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/50'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggle(ms)}
                    aria-label={
                      ms.is_completed
                        ? `Mark ${ms.title} as pending`
                        : `Mark ${ms.title} as completed`
                    }
                    className="mt-0.5 text-teal-600 dark:text-teal-400 hover:scale-110 transition-transform"
                  >
                    {ms.is_completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-400 hover:text-teal-600" />
                    )}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-base font-bold text-slate-900 dark:text-white ${
                          ms.is_completed ? 'line-through opacity-80' : ''
                        }`}
                      >
                        {ms.title}
                      </h3>
                      {parentJourney && (
                        <Link
                          to={`/journeys/${parentJourney.id}`}
                          className="px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:underline"
                        >
                          {parentJourney.title}
                        </Link>
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Target: {formatDate(ms.milestone_date)}</span>
                      {ms.is_completed && ms.completed_at && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          • Completed {formatDate(ms.completed_at)}
                        </span>
                      )}
                    </div>

                    {ms.description && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        {ms.description}
                      </p>
                    )}

                    {ms.personal_notes && (
                      <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300 italic">
                        Personal Note: {ms.personal_notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggle(ms)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      ms.is_completed
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {ms.is_completed ? 'Reopen' : 'Mark Complete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(ms)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Edit milestone"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(ms)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    aria-label="Delete milestone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Milestone Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {editingMs ? 'Edit Milestone' : 'Add Milestone'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-xs text-red-700 dark:text-red-300">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Associated Journey *
                </label>
                <select
                  value={selectedJourneyId}
                  onChange={(e) => setSelectedJourneyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  {journeys.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Complete 2-week hydrotherapy cycle"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Milestone Date *
                </label>
                <input
                  type="date"
                  required
                  value={milestoneDate}
                  onChange={(e) => setMilestoneDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this milestone..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Personal Notes
                </label>
                <textarea
                  rows={2}
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="Private notes or observations..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mark as completed
                </span>
              </label>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                >
                  {saving ? 'Saving...' : 'Save Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Milestone"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
