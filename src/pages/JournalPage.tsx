import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Calendar,
  BookOpen,
  Edit3,
  Trash2,
  Upload,
  Lock,
  X,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { JournalEntry } from '../types';
import { formatDate } from '../utils/validation';

export const JournalPage: React.FC = () => {
  const {
    journeys,
    journalEntries,
    addJournalEntry,
    editJournalEntry,
    removeJournalEntry,
    uploadFile,
  } = useAppData();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  useDocumentMeta({
    title: 'Personal Journal',
    isPrivate: true,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [journeyFilter, setJourneyFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openCreateModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openCreateModal = () => {
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setEntryDate(new Date().toISOString().slice(0, 10));
    setSelectedJourneyId('');
    setPhotoUrl(null);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setEntryDate(entry.entry_date);
    setSelectedJourneyId(entry.journey_id || '');
    setPhotoUrl(entry.photo_url || null);
    setFormError(null);
    setModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormError(null);
    setUploadingPhoto(true);
    try {
      const url = await uploadFile(file, 'journal');
      setPhotoUrl(url);
      showToast('Photo Attached', 'Image attached to your journal entry.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Entry title is required.');
      return;
    }
    if (!content.trim()) {
      setFormError('Journal content is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingEntry) {
        await editJournalEntry(editingEntry.id, {
          title,
          content,
          entry_date: entryDate,
          journey_id: selectedJourneyId || null,
          photo_url: photoUrl,
        });
        showToast('Entry Updated', `"${title}" has been saved.`);
      } else {
        await addJournalEntry({
          title,
          content,
          entry_date: entryDate,
          journey_id: selectedJourneyId || null,
          photo_url: photoUrl,
        });
        showToast('Entry Saved', `"${title}" added to your private journal.`);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeJournalEntry(deleteTarget.id);
      showToast('Entry Deleted', `"${deleteTarget.title}" removed.`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Unable to delete entry.',
        'error'
      );
    }
  };

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return journalEntries
      .filter((entry) => {
        if (journeyFilter !== 'ALL' && entry.journey_id !== journeyFilter) {
          return false;
        }
        if (!q) return true;
        return (
          entry.title.toLowerCase().includes(q) ||
          entry.content.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const diff =
          new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime();
        return sortOrder === 'desc' ? diff : -diff;
      });
  }, [journalEntries, searchQuery, journeyFilter, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Private to Owner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Personal Journal
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Write private reflections, attach photographs, and organize entries chronologically by journey.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Write Journal Entry</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journal entries..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
          />
        </div>

        <select
          value={journeyFilter}
          onChange={(e) => setJourneyFilter(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
        >
          <option value="ALL">All Journeys & General Entries</option>
          {journeys.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
        >
          <option value="desc">Newest First (Chronological)</option>
          <option value="asc">Oldest First (Chronological)</option>
        </select>
      </div>

      {/* Journal Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <BookOpen className="w-10 h-10 text-teal-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {journalEntries.length === 0 ? 'Your Private Journal is Empty' : 'No Matching Entries'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {journalEntries.length === 0
              ? 'Document your daily experiences, thoughts, therapy reflections, and personal moments.'
              : 'Try adjusting your search keywords or journey filter.'}
          </p>
          {journalEntries.length === 0 && (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> Write First Entry
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const linkedJourney = journeys.find((j) => j.id === entry.journey_id);
            return (
              <article
                key={entry.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        {formatDate(entry.entry_date)}
                      </span>
                      {linkedJourney && (
                        <Link
                          to={`/journeys/${linkedJourney.id}`}
                          className="px-2.5 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:underline"
                        >
                          {linkedJourney.title}
                        </Link>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {entry.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(entry)}
                      aria-label={`Edit ${entry.title}`}
                      className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(entry)}
                      aria-label={`Delete ${entry.title}`}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {entry.content}
                </p>

                {entry.photo_url && (
                  <div className="mt-4">
                    <img
                      src={entry.photo_url}
                      alt={entry.title}
                      loading="lazy"
                      className="max-h-72 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Write / Edit Journal Entry Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {editingEntry ? 'Edit Journal Entry' : 'New Private Journal Entry'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-xs text-red-700 dark:text-red-300">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Entry Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Morning balance session and energy reflection"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Entry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Link to Journey (Optional)
                  </label>
                  <select
                    value={selectedJourneyId}
                    onChange={(e) => setSelectedJourneyId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="">General Reflection (No Journey)</option>
                    {journeys.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Journal Reflection *
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts, milestones noticed today, or personal memories..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Attach Photograph (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-xs font-semibold cursor-pointer">
                    <Upload className="w-4 h-4 text-teal-600" />
                    <span>{uploadingPhoto ? 'Uploading...' : 'Choose Image'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {photoUrl && (
                    <div className="flex items-center gap-2">
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoUrl(null)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
                  disabled={saving || uploadingPhoto}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                >
                  {saving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Journal Entry"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
