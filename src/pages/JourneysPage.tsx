import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Tag,
  Edit3,
  Trash2,
  Eye,
  Upload,
  X,
  Map,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { Journey, JourneyFormInput, JourneyStatus } from '../types';
import { JOURNEY_CATEGORIES, JOURNEY_STATUSES } from '../utils/constants';
import { formatDate } from '../utils/validation';

export const JourneysPage: React.FC = () => {
  const {
    journeys,
    milestones,
    addJourney,
    editJourney,
    removeJourney,
    uploadFile,
  } = useAppData();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  useDocumentMeta({
    title: 'My Journeys',
    isPrivate: true,
  });

  // Search, Filter, and Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('created_desc');

  // Create/Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<Journey | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [category, setCategory] = useState<string>(JOURNEY_CATEGORIES[0]);
  const [status, setStatus] = useState<JourneyStatus>('In Progress');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<Journey | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openCreateModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openCreateModal = () => {
    setEditingJourney(null);
    setTitle('');
    setDescription('');
    setPersonalNotes('');
    setCategory(JOURNEY_CATEGORIES[0]);
    setStatus('In Progress');
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate('');
    setTagsInput('');
    setCoverImage(null);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (journey: Journey) => {
    setEditingJourney(journey);
    setTitle(journey.title);
    setDescription(journey.description);
    setPersonalNotes(journey.personal_notes || '');
    setCategory(journey.category);
    setStatus(journey.status);
    setStartDate(journey.start_date);
    setEndDate(journey.end_date || '');
    setTagsInput((journey.tags || []).join(', '));
    setCoverImage(journey.cover_image);
    setFormError(null);
    setModalOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormError(null);
    setUploadingCover(true);
    try {
      const url = await uploadFile(file, 'covers');
      setCoverImage(url);
      showToast('Cover Photo Ready', 'Photograph attached to journey.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSaveJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Journey title is required.');
      return;
    }
    if (!startDate) {
      setFormError('Start date is required.');
      return;
    }
    if (endDate && new Date(endDate) < new Date(startDate)) {
      setFormError('End date cannot be earlier than the start date.');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: JourneyFormInput = {
      title,
      description,
      personal_notes: personalNotes,
      category,
      tags: parsedTags,
      start_date: startDate,
      end_date: endDate || null,
      status,
      cover_image: coverImage,
    };

    setSaving(true);
    try {
      if (editingJourney) {
        await editJourney(editingJourney.id, payload);
        showToast('Journey Updated', `"${title}" has been saved.`);
      } else {
        await addJourney(payload);
        showToast('Journey Created', `"${title}" has been added to your journeys.`);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save journey.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await removeJourney(deleteTarget.id);
      showToast('Journey Deleted', `"${deleteTarget.title}" was removed.`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(
        'Delete Failed',
        err instanceof Error ? err.message : 'Unable to delete journey.',
        'error'
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredJourneys = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return journeys
      .filter((j) => {
        if (statusFilter !== 'ALL' && j.status !== statusFilter) return false;
        if (categoryFilter !== 'ALL' && j.category !== categoryFilter) return false;
        if (!q) return true;
        const inTitle = j.title.toLowerCase().includes(q);
        const inDesc = j.description.toLowerCase().includes(q);
        const inNotes = (j.personal_notes || '').toLowerCase().includes(q);
        const inCat = j.category.toLowerCase().includes(q);
        const inTags = (j.tags || []).some((t) => t.toLowerCase().includes(q));
        return inTitle || inDesc || inNotes || inCat || inTags;
      })
      .sort((a, b) => {
        if (sortBy === 'start_desc') {
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        }
        if (sortBy === 'start_asc') {
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        }
        if (sortBy === 'progress_desc') {
          return b.progress_percentage - a.progress_percentage;
        }
        if (sortBy === 'created_asc') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [journeys, searchQuery, statusFilter, categoryFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            My Journeys
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Organize, document, and monitor every chapter of your SPG11 journey.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Journey</span>
        </button>
      </div>

      {/* Search, Filter & Sort Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search journeys, notes, tags..."
            aria-label="Search journeys"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Statuses</option>
            {JOURNEY_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Categories</option>
            {JOURNEY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort journeys"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="created_desc">Newest Created</option>
            <option value="created_asc">Oldest Created</option>
            <option value="start_desc">Start Date (Newest)</option>
            <option value="start_asc">Start Date (Oldest)</option>
            <option value="progress_desc">Highest Progress %</option>
          </select>
        </div>
      </div>

      {/* Journey Cards Grid */}
      {filteredJourneys.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-3">
            <Map className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {journeys.length === 0 ? 'Start Your First Journey' : 'No Matching Journeys'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {journeys.length === 0
              ? 'Create a journey to organize milestones, upload cover photographs, and track your progress.'
              : 'Try adjusting your search keywords or status filter.'}
          </p>
          {journeys.length === 0 && (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Journey</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJourneys.map((journey) => {
            const jMilestones = milestones.filter((m) => m.journey_id === journey.id);
            const completedCount = jMilestones.filter((m) => m.is_completed).length;

            return (
              <div
                key={journey.id}
                className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Cover Photo or Gradient Header */}
                <div className="relative h-40 bg-gradient-to-br from-teal-600/90 to-blue-700/90 overflow-hidden">
                  {journey.cover_image && (
                    <img
                      src={journey.cover_image}
                      alt={journey.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/75 backdrop-blur-sm text-white text-[11px] font-semibold truncate">
                      {journey.category}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${
                        journey.status === 'Completed'
                          ? 'bg-emerald-500 text-white'
                          : journey.status === 'In Progress'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-100'
                      }`}
                    >
                      {journey.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Link
                      to={`/journeys/${journey.id}`}
                      className="text-lg font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-1"
                    >
                      {journey.title}
                    </Link>

                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {formatDate(journey.start_date)}
                        {journey.end_date ? ` → ${formatDate(journey.end_date)}` : ' → Ongoing'}
                      </span>
                    </div>

                    {journey.description && (
                      <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {journey.description}
                      </p>
                    )}

                    {journey.tags && journey.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {journey.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Progress Indicator & Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600 dark:text-slate-400">
                          Progress ({completedCount}/{jMilestones.length} milestones)
                        </span>
                        <span className="text-teal-600 dark:text-teal-400">
                          {journey.progress_percentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded-full transition-all duration-300"
                          style={{ width: `${journey.progress_percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <Link
                        to={`/journeys/${journey.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </Link>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(journey)}
                          aria-label={`Edit ${journey.title}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(journey)}
                          aria-label={`Delete ${journey.title}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Journey Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="journey-modal-title"
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <h2
                id="journey-modal-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                {editingJourney ? 'Edit Journey' : 'Create New Journey'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJourney} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-medium text-red-700 dark:text-red-300">
                  {formError}
                </div>
              )}

              <div>
                <label
                  htmlFor="journey-title"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Journey Title *
                </label>
                <input
                  id="journey-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Daily Physical Therapy & Gait Strengthening"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="journey-category"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Journey Category
                  </label>
                  <select
                    id="journey-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {JOURNEY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="journey-status"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Status
                  </label>
                  <select
                    id="journey-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as JourneyStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {JOURNEY_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="journey-start-date"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Start Date *
                  </label>
                  <input
                    id="journey-start-date"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="journey-end-date"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Optional End Date
                  </label>
                  <input
                    id="journey-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="journey-desc"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="journey-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the goals and focus of this journey..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="journey-notes"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Personal Notes
                </label>
                <textarea
                  id="journey-notes"
                  rows={2}
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="Add private reminders, specialist notes, or observations..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="journey-tags"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Tags (comma-separated)
                </label>
                <input
                  id="journey-tags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g., mobility, stretching, hydrotherapy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Cover Photograph Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cover Photograph (JPEG, PNG, WebP, GIF — max 5 MB)
                </label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>{uploadingCover ? 'Uploading...' : 'Upload Cover Photo'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                  {coverImage && (
                    <div className="flex items-center gap-2">
                      <img
                        src={coverImage}
                        alt="Cover preview"
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => setCoverImage(null)}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingCover}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white text-sm font-semibold shadow-sm"
                >
                  {saving
                    ? 'Saving...'
                    : editingJourney
                    ? 'Save Changes'
                    : 'Create Journey'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Journey"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All milestones associated with this journey will also be permanently deleted.`}
        confirmLabel="Delete Journey"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
