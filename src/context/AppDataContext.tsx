import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  Journey,
  JourneyFormInput,
  Milestone,
  MilestoneFormInput,
  JournalEntry,
  JournalEntryFormInput,
  JourneyPhoto,
  AppNotification,
  DashboardStats,
} from '../types';
import * as dataService from '../services/dataService';

interface AppDataContextValue {
  journeys: Journey[];
  milestones: Milestone[];
  journalEntries: JournalEntry[];
  photos: JourneyPhoto[];
  notifications: AppNotification[];
  stats: DashboardStats;
  loadingData: boolean;
  refreshAll: () => Promise<void>;
  addJourney: (input: JourneyFormInput) => Promise<Journey>;
  editJourney: (id: string, updates: Partial<JourneyFormInput>) => Promise<Journey>;
  removeJourney: (id: string) => Promise<void>;
  addMilestone: (input: MilestoneFormInput) => Promise<Milestone>;
  editMilestone: (id: string, updates: Partial<MilestoneFormInput>) => Promise<Milestone>;
  toggleMilestone: (id: string, isCompleted: boolean) => Promise<Milestone>;
  removeMilestone: (id: string) => Promise<void>;
  addJournalEntry: (input: JournalEntryFormInput) => Promise<JournalEntry>;
  editJournalEntry: (id: string, updates: Partial<JournalEntryFormInput>) => Promise<JournalEntry>;
  removeJournalEntry: (id: string) => Promise<void>;
  addPhoto: (input: { journey_id: string | null; image_url: string; caption: string }) => Promise<JourneyPhoto>;
  editPhotoCaption: (id: string, caption: string, journeyId: string | null) => Promise<JourneyPhoto>;
  removePhoto: (id: string) => Promise<void>;
  uploadFile: (file: File, folder: 'covers' | 'gallery' | 'journal' | 'avatars') => Promise<string>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [photos, setPhotos] = useState<JourneyPhoto[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  const refreshAll = useCallback(async () => {
    if (!user?.id) {
      setJourneys([]);
      setMilestones([]);
      setJournalEntries([]);
      setPhotos([]);
      setNotifications([]);
      return;
    }

    setLoadingData(true);
    try {
      const [jList, mList, eList, pList] = await Promise.all([
        dataService.fetchJourneys(user.id),
        dataService.fetchMilestones(user.id),
        dataService.fetchJournalEntries(user.id),
        dataService.fetchJourneyPhotos(user.id),
      ]);
      const nList = dataService.getNotifications(user.id);
      setJourneys(jList);
      setMilestones(mList);
      setJournalEntries(eList);
      setPhotos(pList);
      setNotifications(nList);
    } finally {
      setLoadingData(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const addJourney = async (input: JourneyFormInput): Promise<Journey> => {
    if (!user) throw new Error('Not authenticated');
    const created = await dataService.createJourney(user.id, input);
    await refreshAll();
    return created;
  };

  const editJourney = async (
    id: string,
    updates: Partial<JourneyFormInput>
  ): Promise<Journey> => {
    if (!user) throw new Error('Not authenticated');
    const updated = await dataService.updateJourney(user.id, id, updates);
    await refreshAll();
    return updated;
  };

  const removeJourney = async (id: string): Promise<void> => {
    if (!user) throw new Error('Not authenticated');
    await dataService.deleteJourney(user.id, id);
    await refreshAll();
  };

  const addMilestone = async (input: MilestoneFormInput): Promise<Milestone> => {
    if (!user) throw new Error('Not authenticated');
    const created = await dataService.createMilestone(user.id, input);
    await refreshAll();
    return created;
  };

  const editMilestone = async (
    id: string,
    updates: Partial<MilestoneFormInput>
  ): Promise<Milestone> => {
    if (!user) throw new Error('Not authenticated');
    const updated = await dataService.updateMilestone(user.id, id, updates);
    await refreshAll();
    return updated;
  };

  const toggleMilestone = async (
    id: string,
    isCompleted: boolean
  ): Promise<Milestone> => {
    if (!user) throw new Error('Not authenticated');
    const updated = await dataService.updateMilestone(user.id, id, {
      is_completed: isCompleted,
    });
    await refreshAll();
    return updated;
  };

  const removeMilestone = async (id: string): Promise<void> => {
    if (!user) throw new Error('Not authenticated');
    await dataService.deleteMilestone(user.id, id);
    await refreshAll();
  };

  const addJournalEntry = async (
    input: JournalEntryFormInput
  ): Promise<JournalEntry> => {
    if (!user) throw new Error('Not authenticated');
    const created = await dataService.createJournalEntry(user.id, input);
    await refreshAll();
    return created;
  };

  const editJournalEntry = async (
    id: string,
    updates: Partial<JournalEntryFormInput>
  ): Promise<JournalEntry> => {
    if (!user) throw new Error('Not authenticated');
    const updated = await dataService.updateJournalEntry(user.id, id, updates);
    await refreshAll();
    return updated;
  };

  const removeJournalEntry = async (id: string): Promise<void> => {
    if (!user) throw new Error('Not authenticated');
    await dataService.deleteJournalEntry(user.id, id);
    await refreshAll();
  };

  const addPhoto = async (input: {
    journey_id: string | null;
    image_url: string;
    caption: string;
  }): Promise<JourneyPhoto> => {
    if (!user) throw new Error('Not authenticated');
    const created = await dataService.createJourneyPhoto(user.id, input);
    await refreshAll();
    return created;
  };

  const editPhotoCaption = async (
    id: string,
    caption: string,
    journeyId: string | null
  ): Promise<JourneyPhoto> => {
    if (!user) throw new Error('Not authenticated');
    const updated = await dataService.updateJourneyPhotoCaption(
      user.id,
      id,
      caption,
      journeyId
    );
    await refreshAll();
    return updated;
  };

  const removePhoto = async (id: string): Promise<void> => {
    if (!user) throw new Error('Not authenticated');
    await dataService.deleteJourneyPhoto(user.id, id);
    await refreshAll();
  };

  const uploadFile = async (
    file: File,
    folder: 'covers' | 'gallery' | 'journal' | 'avatars'
  ): Promise<string> => {
    if (!user) throw new Error('Not authenticated');
    return dataService.uploadMediaFile(user.id, file, folder);
  };

  const markNotificationAsRead = (id: string) => {
    if (!user) return;
    const next = dataService.markNotificationRead(user.id, id);
    setNotifications(next);
  };

  const markAllNotificationsAsRead = () => {
    if (!user) return;
    const next = dataService.markAllNotificationsRead(user.id);
    setNotifications(next);
  };

  const stats: DashboardStats = useMemo(() => {
    const totalJourneys = journeys.length;
    const activeJourneys = journeys.filter((j) => j.status === 'In Progress').length;
    const completedJourneys = journeys.filter((j) => j.status === 'Completed').length;
    const completedMilestones = milestones.filter((m) => m.is_completed).length;
    const upcomingMilestones = milestones.filter((m) => !m.is_completed).length;

    return {
      totalJourneys,
      activeJourneys,
      completedJourneys,
      completedMilestones,
      upcomingMilestones,
      totalMilestones: milestones.length,
      totalJournalEntries: journalEntries.length,
      totalPhotos: photos.length,
    };
  }, [journeys, milestones, journalEntries, photos]);

  return (
    <AppDataContext.Provider
      value={{
        journeys,
        milestones,
        journalEntries,
        photos,
        notifications,
        stats,
        loadingData,
        refreshAll,
        addJourney,
        editJourney,
        removeJourney,
        addMilestone,
        editMilestone,
        toggleMilestone,
        removeMilestone,
        addJournalEntry,
        editJournalEntry,
        removeJournalEntry,
        addPhoto,
        editPhotoCaption,
        removePhoto,
        uploadFile,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return ctx;
}
