import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit3,
  Maximize2,
  X,
  Calendar,
  Lock,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { JourneyPhoto } from '../types';
import { formatDate } from '../utils/validation';

export const GalleryPage: React.FC = () => {
  const {
    journeys,
    photos,
    addPhoto,
    editPhotoCaption,
    removePhoto,
    uploadFile,
  } = useAppData();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  useDocumentMeta({
    title: 'Photo Gallery',
    isPrivate: true,
  });

  const [journeyFilter, setJourneyFilter] = useState('ALL');
  const [searchCaption, setSearchCaption] = useState('');

  // Upload Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState('');
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit Caption Modal
  const [editingPhoto, setEditingPhoto] = useState<JourneyPhoto | null>(null);
  const [editCaptionText, setEditCaptionText] = useState('');
  const [editJourneyId, setEditJourneyId] = useState('');

  // Fullscreen Lightbox Preview Modal
  const [lightboxPhoto, setLightboxPhoto] = useState<JourneyPhoto | null>(null);

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<JourneyPhoto | null>(null);

  useEffect(() => {
    if (searchParams.get('action') === 'upload') {
      openUploadModal();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const openUploadModal = () => {
    setSelectedJourneyId(journeys[0]?.id || '');
    setCaption('');
    setPreviewUrl(null);
    setFormError(null);
    setUploadModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormError(null);
    setUploading(true);
    try {
      const url = await uploadFile(file, 'gallery');
      setPreviewUrl(url);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!previewUrl) {
      setFormError('Please select a valid photograph to upload.');
      return;
    }

    setSaving(true);
    try {
      await addPhoto({
        journey_id: selectedJourneyId || null,
        image_url: previewUrl,
        caption,
      });
      showToast('Photograph Saved', 'Added to your private photo gallery.');
      setUploadModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save photo.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEditCaption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    try {
      await editPhotoCaption(
        editingPhoto.id,
        editCaptionText,
        editJourneyId || null
      );
      showToast('Photo Updated', 'Caption and journey association updated.');
      setEditingPhoto(null);
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Failed to update caption.',
        'error'
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removePhoto(deleteTarget.id);
      showToast('Photo Deleted', 'Photograph removed from your gallery.');
      if (lightboxPhoto?.id === deleteTarget.id) {
        setLightboxPhoto(null);
      }
      setDeleteTarget(null);
    } catch (err) {
      showToast(
        'Error',
        err instanceof Error ? err.message : 'Unable to delete photo.',
        'error'
      );
    }
  };

  const filteredPhotos = useMemo(() => {
    const q = searchCaption.trim().toLowerCase();
    return photos.filter((p) => {
      if (journeyFilter !== 'ALL' && p.journey_id !== journeyFilter) return false;
      if (!q) return true;
      return (p.caption || '').toLowerCase().includes(q);
    });
  }, [photos, journeyFilter, searchCaption]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Private Storage Gallery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Photo Gallery
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Preserve visual memories, add captions, and organize photographs by journey.
          </p>
        </div>
        <button
          type="button"
          onClick={openUploadModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photograph</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={searchCaption}
          onChange={(e) => setSearchCaption(e.target.value)}
          placeholder="Search photo captions..."
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
        />

        <select
          value={journeyFilter}
          onChange={(e) => setJourneyFilter(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
        >
          <option value="ALL">All Journeys & General Photos</option>
          {journeys.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
      </div>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <ImageIcon className="w-10 h-10 text-teal-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {photos.length === 0 ? 'No Photographs Uploaded Yet' : 'No Matching Photos'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Upload JPEG, PNG, WebP, or GIF photographs (up to 5 MB) to preserve memories from your SPG11 journey.
          </p>
          {photos.length === 0 && (
            <button
              type="button"
              onClick={openUploadModal}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold"
            >
              <Upload className="w-4 h-4" /> Upload First Photograph
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => {
            const linkedJourney = journeys.find((j) => j.id === photo.journey_id);
            return (
              <div
                key={photo.id}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col"
              >
                <div
                  onClick={() => setLightboxPhoto(photo)}
                  className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption || 'Journey photograph'}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-xl bg-slate-900/80 text-white text-xs font-semibold inline-flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" /> Preview
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {photo.caption || 'Untitled memory'}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(photo.created_at)}
                      </span>
                      {linkedJourney && (
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 text-[11px] font-semibold">
                          {linkedJourney.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setLightboxPhoto(photo)}
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      View Full Size
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPhoto(photo);
                          setEditCaptionText(photo.caption);
                          setEditJourneyId(photo.journey_id || '');
                        }}
                        aria-label="Edit photo caption"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(photo)}
                        aria-label="Delete photo"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Photo Modal */}
      {uploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Upload Photograph
              </h2>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-xs text-red-700 dark:text-red-300">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Image File (JPEG, PNG, WebP, GIF — Max 5 MB) *
                </label>
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-teal-500 bg-slate-50/50 dark:bg-slate-800/40 transition-colors">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Selected preview"
                      className="max-h-48 rounded-xl object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="w-7 h-7 text-teal-600 mb-2" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {uploading ? 'Processing image...' : 'Click to select an image file'}
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Caption
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Describe this moment or milestone..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Organize by Journey (Optional)
                </label>
                <select
                  value={selectedJourneyId}
                  onChange={(e) => setSelectedJourneyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value="">General Gallery (Unassigned)</option>
                  {journeys.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold"
                >
                  {saving ? 'Saving...' : 'Save to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Caption Modal */}
      {editingPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Photo Details
              </h2>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="p-1 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditCaption} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Caption
                </label>
                <input
                  type="text"
                  value={editCaptionText}
                  onChange={(e) => setEditCaptionText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Journey
                </label>
                <select
                  value={editJourneyId}
                  onChange={(e) => setEditJourneyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value="">General Gallery</option>
                  {journeys.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Preview Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {lightboxPhoto.caption || 'Journey Photograph'}
                </p>
                <p className="text-xs text-slate-500">
                  Uploaded {formatDate(lightboxPhoto.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={lightboxPhoto.image_url}
                alt={lightboxPhoto.caption || 'Preview'}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Photograph"
        message="Are you sure you want to permanently delete this photograph from your gallery?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
