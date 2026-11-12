export type ThemeMode = 'light' | 'dark';

export type JourneyStatus = 'Not Started' | 'In Progress' | 'Completed';

export type JourneyCategory =
  | 'Mobility & Physical Therapy'
  | 'Medical & Neurology'
  | 'Daily Living & Adaptive Tech'
  | 'Speech & Communication'
  | 'Wellness & Mental Health'
  | 'Community & Family'
  | 'Research & Clinical Trials'
  | 'Personal Goal';

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  avatar_url: string | null;
  theme_preference: ThemeMode;
  notify_upcoming_milestones: boolean;
  notify_new_journeys: boolean;
  notify_completed_milestones: boolean;
  created_at: string;
  updated_at: string;
}

export interface Journey {
  id: string;
  user_id: string;
  title: string;
  description: string;
  personal_notes: string;
  category: string;
  tags: string[];
  start_date: string;
  end_date: string | null;
  status: JourneyStatus;
  progress_percentage: number;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface JourneyFormInput {
  title: string;
  description: string;
  personal_notes: string;
  category: string;
  tags: string[];
  start_date: string;
  end_date: string | null;
  status: JourneyStatus;
  progress_percentage?: number;
  cover_image?: string | null;
}

export interface Milestone {
  id: string;
  journey_id: string;
  user_id: string;
  title: string;
  description: string;
  personal_notes: string;
  milestone_date: string;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface MilestoneFormInput {
  journey_id: string;
  title: string;
  description: string;
  personal_notes: string;
  milestone_date: string;
  is_completed?: boolean;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  journey_id: string | null;
  title: string;
  content: string;
  entry_date: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntryFormInput {
  journey_id: string | null;
  title: string;
  content: string;
  entry_date: string;
  photo_url?: string | null;
}

export interface JourneyPhoto {
  id: string;
  user_id: string;
  journey_id: string | null;
  image_url: string;
  caption: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  type: 'upcoming_milestone' | 'new_journey' | 'completed_milestone';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
}

export interface TimelineItem {
  id: string;
  date: string;
  type: 'journey_start' | 'milestone_completed' | 'milestone_upcoming' | 'journal_entry' | 'personal_event';
  title: string;
  description: string;
  journey_id?: string | null;
  journey_title?: string;
  category?: string;
}

export interface DashboardStats {
  totalJourneys: number;
  activeJourneys: number;
  completedJourneys: number;
  completedMilestones: number;
  upcomingMilestones: number;
  totalMilestones: number;
  totalJournalEntries: number;
  totalPhotos: number;
}
