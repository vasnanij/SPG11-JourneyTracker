import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Tag,
  Plus,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  BookOpen,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { Milestone } from '../types';
import { formatDate } from '../utils/validation';

export const JourneyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    journeys,
    milestones,
    journalEntries,
    photos,
    addMilestone,
    editMilestone,
    toggleMilestone,
    removeMilestone,
    removeJourney,
  } = useAppData();
  const { showToast } = useToast();

  const journey = journeys.find((j) => j.id === id);

  useDocumentMeta({
    title: journey ? journey.title : 'Journey Details',
    isPrivate: true,
  });

  const [msModalOpen, setMsModalOpen] = useState(false);
  const [editingMs, setEditingMs] = useState<Milestone | null>(null);
  const [msTitle, setMsTitle] = useState('');
  const [msDate, setMsDate] = useState(new Date().toISOString().slice(0, 10));
  const [msDesc, setMsDesc] = useState('');
  const [msNotes, setMsNotes] = useState('');
  const [msCompleted, setMsCompleted] = useState(false);
  const [savingMs, setSavingMs] = useState(false);

  const [deleteMsTarget, setDeleteMsTarget] = useState<Milestone | null>(null);
  const [confirmDeleteJourney, setConfirmDeleteJourney] = useState(false);

  if (!journey) {
    return (
      <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Journey Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          This journey does not exist or belongs to another account.
        </p>
        <Link
          to="/journeys"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Journeys
        </Link>
      </div>
    );
  }

  const journeyMilestones = milestones.filter((m) => m.journey_id === journey.id);
  const completedMilestones = journeyMilestones.filter((m) => m.is_completed);
  const pendingMilestones = journeyMilestones.filter((m) => !m.is_completed);
  const journeyJournals = journalEntries.filter((e) => e.journey_id === journey.id);
  const journeyPhotos = photos.filter((p) => p.journey_id === journey.id);

  const openNewMilestone = () => {
    setEditingMs(null);
    setMsTitle('');
    setMsDate(new Date().toISOString().slice(0, 10));
    setMsDesc('');
    setMsNotes('');
    setMsCompleted(false);
    setMsModalOpen(true);
  };

  const openEditMilestone = (ms: Milestone) => {
    setEditingMs(ms);
    setMsTitle(ms.title);
    setMsDate(ms.milestone_date);
    setMsDesc(ms.description);
    setMsNotes(ms.personal_notes || '');
    setMsCompleted(ms.is_completed);
    setMsModalOpen(true);
  };

  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTitle.trim()) return;
    setSavingMs(true);
    try {
      if (editingMs) {
        await editMilestone(editingMs.id, {
          title: msTitle,
          milestone_date: msDate,
          description: msDesc,
          personal_notes: msNotes,
          is_completed: msCompleted,
        });
        showToast('Milestone Updated', `"${msTitle}" saved.`);
      } else {
        await addMilestone({
          journey_id: journey.id,
          title: msTitle,
          milestone_date: msDate,
          description: msDesc,
          personal_notes: msNotes,
          is_completed: msCompleted,
        });
        showToast('Milestone Added', `"${msTitle}" added and progress recalculated.`);
      }
      setMsModalOpen(false);
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Failed to save milestone.',
        'error'
      );
    } finally {
      setSavingMs(false);
    }
  };

  const handleToggleMs = async (ms: Milestone) => {
    try {
      await toggleMilestone(ms.id, !ms.is_completed);
      showToast(
        !ms.is_completed ? 'Milestone Completed!' : 'Milestone Reopened',
        `"${ms.title}" updated and journey progress recalculated.`
      );
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Could not update milestone.',
        'error'
      );
    }
  };

  const handleDeleteMilestone = async () => {
    if (!deleteMsTarget) return;
    try {
      await removeMilestone(deleteMsTarget.id);
      showToast('Milestone Deleted', `"${deleteMsTarget.title}" removed.`);
      setDeleteMsTarget(null);
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Failed to delete milestone.',
        'error'
      );
    }
  };

  const handleDeleteJourney = async () => {
    try {
      await removeJourney(journey.id);
      showToast('Journey Deleted', `"${journey.title}" was deleted.`);
      navigate('/journeys');
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Failed to delete journey.',
        'error'
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/journeys"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Journeys</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={openNewMilestone}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
          <button
            type="button"
            onClick={() => setConfirmDeleteJourney(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Journey</span>
          </button>
        </div>
      </div>

      {/* Journey Hero Overview Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {journey.cover_image && (
          <div className="h-56 sm:h-72 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <img
              src={journey.cover_image}
              alt={journey.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 text-xs font-semibold">
                  {journey.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {journey.title}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>
                  Started {formatDate(journey.start_date)}
                  {journey.end_date ? ` • Ended ${formatDate(journey.end_date)}` : ' • Ongoing'}
                </span>
              </div>
            </div>

            <div className="w-full sm:w-64 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-600 dark:text-slate-300">Overall Progress</span>
                <span className="text-teal-600 dark:text-teal-400 text-base">
                  {journey.progress_percentage}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full transition-all duration-300"
                  style={{ width: `${journey.progress_percentage}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                {completedMilestones.length} of {journeyMilestones.length} milestones completed
              </p>
            </div>
          </div>

          {journey.description && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Journey Description
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {journey.description}
              </p>
            </div>
          )}

          {journey.personal_notes && (
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                Personal Notes
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {journey.personal_notes}
              </p>
            </div>
          )}

          {journey.tags && journey.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {journey.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                >
                  <Tag className="w-3 h-3 text-teal-600" />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Milestones Section */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Journey Milestones ({journeyMilestones.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completing milestones automatically recalculates this journey&apos;s progress percentage.
            </p>
          </div>
          <button
            type="button"
            onClick={openNewMilestone}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        </div>

        {journeyMilestones.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No milestones added to this journey yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Milestones */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                Pending Milestones ({pendingMilestones.length})
              </h3>
              <div className="space-y-3">
                {pendingMilestones.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">All milestones completed!</p>
                ) : (
                  pendingMilestones.map((ms) => (
                    <div
                      key={ms.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleMs(ms)}
                          aria-label={`Mark ${ms.title} as completed`}
                          className="mt-0.5 text-slate-400 hover:text-teal-600 transition-colors"
                        >
                          <Circle className="w-5 h-5" />
                        </button>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {ms.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Target Date: {formatDate(ms.milestone_date)}
                          </p>
                          {ms.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5">
                              {ms.description}
                            </p>
                          )}
                          {ms.personal_notes && (
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 italic">
                              Note: {ms.personal_notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditMilestone(ms)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                          aria-label="Edit milestone"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteMsTarget(ms)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"
                          aria-label="Delete milestone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Completed Milestones */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                Completed Milestones ({completedMilestones.length})
              </h3>
              <div className="space-y-3">
                {completedMilestones.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No completed milestones yet.</p>
                ) : (
                  completedMilestones.map((ms) => (
                    <div
                      key={ms.id}
                      className="p-4 rounded-xl border border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleMs(ms)}
                          aria-label={`Mark ${ms.title} as pending`}
                          className="mt-0.5 text-emerald-600 dark:text-emerald-400"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white line-through opacity-80">
                            {ms.title}
                          </p>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                            Completed {formatDate(ms.completed_at || ms.milestone_date)}
                          </p>
                          {ms.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                              {ms.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditMilestone(ms)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                          aria-label="Edit milestone"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteMsTarget(ms)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"
                          aria-label="Delete milestone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Linked Journal Entries & Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Journal Entries ({journeyJournals.length})</span>
            </h3>
            <Link
              to="/journal?action=new"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              + Write Entry
            </Link>
          </div>
          {journeyJournals.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No journal entries linked to this journey yet.
            </p>
          ) : (
            <div className="space-y-3">
              {journeyJournals.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {entry.title}
                    </p>
                    <span className="text-xs text-slate-500">{formatDate(entry.entry_date)}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {entry.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-teal-600" />
              <span>Journey Photos ({journeyPhotos.length})</span>
            </h3>
            <Link
              to="/gallery?action=upload"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              + Upload Photo
            </Link>
          </div>
          {journeyPhotos.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No photographs linked to this journey yet.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {journeyPhotos.map((p) => (
                <Link
                  key={p.id}
                  to="/gallery"
                  className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
                >
                  <img
                    src={p.image_url}
                    alt={p.caption || 'Journey photo'}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Milestone Modal */}
      {msModalOpen && (
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
                onClick={() => setMsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveMilestone} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={msTitle}
                  onChange={(e) => setMsTitle(e.target.value)}
                  placeholder="e.g., Complete 20-minute assisted standing session"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Date *
                </label>
                <input
                  type="date"
                  required
                  value={msDate}
                  onChange={(e) => setMsDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={msDesc}
                  onChange={(e) => setMsDesc(e.target.value)}
                  placeholder="Details about this milestone..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Personal Notes
                </label>
                <textarea
                  rows={2}
                  value={msNotes}
                  onChange={(e) => setMsNotes(e.target.value)}
                  placeholder="Any personal observations..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={msCompleted}
                  onChange={(e) => setMsCompleted(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mark milestone as completed
                </span>
              </label>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMs}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                >
                  {savingMs ? 'Saving...' : 'Save Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteMsTarget)}
        title="Delete Milestone"
        message={`Are you sure you want to delete "${deleteMsTarget?.title}"?`}
        onConfirm={handleDeleteMilestone}
        onCancel={() => setDeleteMsTarget(null)}
      />

      <ConfirmDialog
        isOpen={confirmDeleteJourney}
        title="Delete Journey"
        message={`Are you sure you want to delete "${journey.title}" and all its milestones?`}
        onConfirm={handleDeleteJourney}
        onCancel={() => setConfirmDeleteJourney(false)}
      />
    </div>
  );
};
