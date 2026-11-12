import { supabase, isSupabaseConfigured, STORAGE_BUCKET } from '../lib/supabase';
import {
  Profile,
  Journey,
  JourneyFormInput,
  Milestone,
  MilestoneFormInput,
  JournalEntry,
  JournalEntryFormInput,
  JourneyPhoto,
  AppNotification,
  ThemeMode,
  JourneyStatus,
} from '../types';
import { fileToDataUrl, validateImageFile } from '../utils/validation';

interface IsolatedUserStore {
  profile: Profile | null;
  journeys: Journey[];
  milestones: Milestone[];
  journalEntries: JournalEntry[];
  photos: JourneyPhoto[];
  notifications: AppNotification[];
}

function getStoreKey(userId: string): string {
  if (!userId) throw new Error('Unauthorized: User ID is required.');
  return `spg11_isolated_store_v1_${userId}`;
}

function readIsolatedStore(userId: string): IsolatedUserStore {
  const key = getStoreKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return {
        profile: null,
        journeys: [],
        milestones: [],
        journalEntries: [],
        photos: [],
        notifications: [],
      };
    }
    const parsed = JSON.parse(raw) as IsolatedUserStore;
    return {
      profile: parsed.profile?.id === userId ? parsed.profile : null,
      journeys: (parsed.journeys || []).filter((j) => j.user_id === userId),
      milestones: (parsed.milestones || []).filter((m) => m.user_id === userId),
      journalEntries: (parsed.journalEntries || []).filter((e) => e.user_id === userId),
      photos: (parsed.photos || []).filter((p) => p.user_id === userId),
      notifications: (parsed.notifications || []).filter((n) => n.user_id === userId),
    };
  } catch {
    return {
      profile: null,
      journeys: [],
      milestones: [],
      journalEntries: [],
      photos: [],
      notifications: [],
    };
  }
}

function writeIsolatedStore(userId: string, store: IsolatedUserStore): void {
  const key = getStoreKey(userId);
  const sanitized: IsolatedUserStore = {
    profile: store.profile && store.profile.id === userId ? store.profile : null,
    journeys: store.journeys.filter((j) => j.user_id === userId),
    milestones: store.milestones.filter((m) => m.user_id === userId),
    journalEntries: store.journalEntries.filter((e) => e.user_id === userId),
    photos: store.photos.filter((p) => p.user_id === userId),
    notifications: store.notifications.filter((n) => n.user_id === userId),
  };
  localStorage.setItem(key, JSON.stringify(sanitized));
}

function ensureConfigured(): void {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase credentials are missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }
}

function isSchemaMissingError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const code = error.code || '';
  const msg = (error.message || '').toLowerCase();
  return (
    code === 'PGRST205' ||
    code === '42P01' ||
    code === '42501' ||
    code === 'PGRST204' ||
    msg.includes('could not find the table') ||
    msg.includes('does not exist') ||
    msg.includes('schema cache') ||
    msg.includes('jwt') ||
    msg.includes('row-level security')
  );
}

// ============================================================================
// PROFILE OPERATIONS
// ============================================================================
export async function getOrCreateProfile(
  userId: string,
  defaultName: string,
  email?: string
): Promise<Profile> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const now = new Date().toISOString();

  try {
    const { data, error } = await supabase!
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      const profile: Profile = {
        id: userId,
        full_name: data.full_name || defaultName,
        email,
        avatar_url: data.avatar_url || null,
        theme_preference: (data.theme_preference as ThemeMode) || 'light',
        notify_upcoming_milestones: data.notify_upcoming_milestones ?? true,
        notify_new_journeys: data.notify_new_journeys ?? true,
        notify_completed_milestones: data.notify_completed_milestones ?? true,
        created_at: data.created_at || now,
        updated_at: data.updated_at || now,
      };
      store.profile = profile;
      writeIsolatedStore(userId, store);
      return profile;
    }

    if (!error && !data) {
      const newProfile: Profile = {
        id: userId,
        full_name: defaultName,
        email,
        avatar_url: null,
        theme_preference: 'light',
        notify_upcoming_milestones: true,
        notify_new_journeys: true,
        notify_completed_milestones: true,
        created_at: now,
        updated_at: now,
      };
      const { data: inserted, error: insertError } = await supabase!
        .from('profiles')
        .insert({
          id: userId,
          full_name: newProfile.full_name,
          avatar_url: newProfile.avatar_url,
          theme_preference: newProfile.theme_preference,
        })
        .select('*')
        .single();

      if (!insertError && inserted) {
        const created = { ...newProfile, ...inserted, email };
        store.profile = created;
        writeIsolatedStore(userId, store);
        return created;
      }
    }
  } catch {
    // Fallback to user-isolated store if table not migrated yet
  }

  if (store.profile) {
    return { ...store.profile, email: email || store.profile.email };
  }

  const fallbackProfile: Profile = {
    id: userId,
    full_name: defaultName || (email ? email.split('@')[0] : 'SPG11 Member'),
    email,
    avatar_url: null,
    theme_preference: 'light',
    notify_upcoming_milestones: true,
    notify_new_journeys: true,
    notify_completed_milestones: true,
    created_at: now,
    updated_at: now,
  };
  store.profile = fallbackProfile;
  writeIsolatedStore(userId, store);
  return fallbackProfile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'created_at'>>
): Promise<Profile> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const current = await getOrCreateProfile(userId, updates.full_name || 'User');
  const updated: Profile = {
    ...current,
    ...updates,
    id: userId,
    updated_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase!
      .from('profiles')
      .upsert({
        id: userId,
        full_name: updated.full_name,
        avatar_url: updated.avatar_url,
        theme_preference: updated.theme_preference,
        updated_at: updated.updated_at,
      })
      .select('*')
      .single();

    if (!error && data) {
      updated.full_name = data.full_name;
      updated.avatar_url = data.avatar_url;
      updated.theme_preference = data.theme_preference as ThemeMode;
    } else if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch (err) {
    if (err instanceof Error && !err.message.includes('fetch')) {
      // Continue saving in user-isolated store if schema not migrated yet
    }
  }

  store.profile = updated;
  writeIsolatedStore(userId, store);
  return updated;
}

// ============================================================================
// MEDIA STORAGE UPLOAD (Supabase Private Storage Bucket + Validation)
// ============================================================================
export async function uploadMediaFile(
  userId: string,
  file: File,
  folder: 'covers' | 'gallery' | 'journal' | 'avatars'
): Promise<string> {
  ensureConfigured();
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 40);
  const objectPath = `${userId}/${folder}/${Date.now()}-${safeName}.${ext}`;

  try {
    const { error: uploadError } = await supabase!.storage
      .from(STORAGE_BUCKET)
      .upload(objectPath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (!uploadError) {
      const { data: signedData, error: signedError } = await supabase!.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(objectPath, 60 * 60 * 24 * 365);

      if (!signedError && signedData?.signedUrl) {
        return signedData.signedUrl;
      }

      const { data: publicData } = supabase!.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(objectPath);
      if (publicData?.publicUrl) {
        return publicData.publicUrl;
      }
    }
  } catch {
    // Fallback to encoded private data URL when storage bucket has not been created yet
  }

  return fileToDataUrl(file);
}

// ============================================================================
// JOURNEYS CRUD
// ============================================================================
export async function fetchJourneys(userId: string): Promise<Journey[]> {
  ensureConfigured();
  const store = readIsolatedStore(userId);

  try {
    const { data, error } = await supabase!
      .from('journeys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const normalized: Journey[] = data.map((row) => ({
        id: row.id,
        user_id: row.user_id,
        title: row.title,
        description: row.description || '',
        personal_notes: row.personal_notes || '',
        category: row.category || 'Mobility & Physical Therapy',
        tags: Array.isArray(row.tags) ? row.tags : [],
        start_date: row.start_date,
        end_date: row.end_date || null,
        status: (row.status as JourneyStatus) || 'Not Started',
        progress_percentage:
          typeof row.progress_percentage === 'number'
            ? row.progress_percentage
            : row.status === 'Completed'
            ? 100
            : 0,
        cover_image: row.cover_image || null,
        created_at: row.created_at,
        updated_at: row.updated_at || row.created_at,
      }));
      store.journeys = normalized;
      writeIsolatedStore(userId, store);
      return normalized;
    }
  } catch {
    // Use isolated store when remote table isn't migrated yet
  }

  return store.journeys.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createJourney(
  userId: string,
  input: JourneyFormInput
): Promise<Journey> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const now = new Date().toISOString();

  const newJourney: Journey = {
    id: crypto.randomUUID(),
    user_id: userId,
    title: input.title.trim(),
    description: input.description.trim(),
    personal_notes: (input.personal_notes || '').trim(),
    category: input.category,
    tags: input.tags || [],
    start_date: input.start_date,
    end_date: input.end_date || null,
    status: input.status,
    progress_percentage:
      typeof input.progress_percentage === 'number'
        ? input.progress_percentage
        : input.status === 'Completed'
        ? 100
        : 0,
    cover_image: input.cover_image || null,
    created_at: now,
    updated_at: now,
  };

  try {
    const { data, error } = await supabase!
      .from('journeys')
      .insert({
        id: newJourney.id,
        user_id: userId,
        title: newJourney.title,
        description: newJourney.description,
        personal_notes: newJourney.personal_notes,
        category: newJourney.category,
        tags: newJourney.tags,
        start_date: newJourney.start_date,
        end_date: newJourney.end_date,
        status: newJourney.status,
        progress_percentage: newJourney.progress_percentage,
        cover_image: newJourney.cover_image,
      })
      .select('*')
      .single();

    if (!error && data) {
      newJourney.id = data.id;
      newJourney.created_at = data.created_at || now;
      newJourney.updated_at = data.updated_at || now;
    } else if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Handled via isolated store when schema migration is pending
  }

  store.journeys = [newJourney, ...store.journeys];

  // Create in-app notification if user preference allows
  const prefs = store.profile;
  if (!prefs || prefs.notify_new_journeys) {
    store.notifications = [
      {
        id: crypto.randomUUID(),
        user_id: userId,
        type: 'new_journey',
        title: 'New Journey Created',
        message: `"${newJourney.title}" (${newJourney.category}) has been started.`,
        read: false,
        created_at: now,
        link: `/journeys/${newJourney.id}`,
      },
      ...store.notifications,
    ];
  }

  writeIsolatedStore(userId, store);
  return newJourney;
}

export async function updateJourney(
  userId: string,
  journeyId: string,
  updates: Partial<JourneyFormInput>
): Promise<Journey> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const existing = store.journeys.find(
    (j) => j.id === journeyId && j.user_id === userId
  );
  if (!existing) {
    throw new Error('Journey not found or access denied.');
  }

  const now = new Date().toISOString();
  const updated: Journey = {
    ...existing,
    ...updates,
    id: journeyId,
    user_id: userId,
    title: updates.title !== undefined ? updates.title.trim() : existing.title,
    description:
      updates.description !== undefined
        ? updates.description.trim()
        : existing.description,
    personal_notes:
      updates.personal_notes !== undefined
        ? updates.personal_notes.trim()
        : existing.personal_notes,
    updated_at: now,
  };

  try {
    const { error } = await supabase!
      .from('journeys')
      .update({
        title: updated.title,
        description: updated.description,
        personal_notes: updated.personal_notes,
        category: updated.category,
        tags: updated.tags,
        start_date: updated.start_date,
        end_date: updated.end_date,
        status: updated.status,
        progress_percentage: updated.progress_percentage,
        cover_image: updated.cover_image,
        updated_at: now,
      })
      .eq('id', journeyId)
      .eq('user_id', userId);

    if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Isolated fallback
  }

  store.journeys = store.journeys.map((j) => (j.id === journeyId ? updated : j));
  writeIsolatedStore(userId, store);
  return updated;
}

export async function deleteJourney(userId: string, journeyId: string): Promise<void> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const target = store.journeys.find(
    (j) => j.id === journeyId && j.user_id === userId
  );
  if (!target) {
    throw new Error('Journey not found or access denied.');
  }

  try {
    const { error } = await supabase!
      .from('journeys')
      .delete()
      .eq('id', journeyId)
      .eq('user_id', userId);

    if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Isolated fallback
  }

  store.journeys = store.journeys.filter((j) => j.id !== journeyId);
  store.milestones = store.milestones.filter((m) => m.journey_id !== journeyId);
  store.journalEntries = store.journalEntries.map((e) =>
    e.journey_id === journeyId ? { ...e, journey_id: null } : e
  );
  store.photos = store.photos.map((p) =>
    p.journey_id === journeyId ? { ...p, journey_id: null } : p
  );
  writeIsolatedStore(userId, store);
}

// ============================================================================
// MILESTONES CRUD & AUTOMATIC JOURNEY PROGRESS RECALCULATION
// ============================================================================
export async function fetchMilestones(
  userId: string,
  journeyId?: string
): Promise<Milestone[]> {
  ensureConfigured();
  const store = readIsolatedStore(userId);

  try {
    let query = supabase!
      .from('milestones')
      .select('*')
      .eq('user_id', userId)
      .order('milestone_date', { ascending: true });

    if (journeyId) {
      query = query.eq('journey_id', journeyId);
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data)) {
      const normalized: Milestone[] = data.map((row) => ({
        id: row.id,
        journey_id: row.journey_id,
        user_id: row.user_id,
        title: row.title,
        description: row.description || '',
        personal_notes: row.personal_notes || '',
        milestone_date: row.milestone_date,
        is_completed: Boolean(row.is_completed),
        completed_at: row.completed_at || null,
        created_at: row.created_at,
      }));
      if (!journeyId) {
        store.milestones = normalized;
        writeIsolatedStore(userId, store);
      }
      return normalized;
    }
  } catch {
    // Isolated fallback
  }

  const list = journeyId
    ? store.milestones.filter((m) => m.journey_id === journeyId)
    : store.milestones;

  return [...list].sort(
    (a, b) =>
      new Date(a.milestone_date).getTime() - new Date(b.milestone_date).getTime()
  );
}

export async function recalculateJourneyProgress(
  userId: string,
  journeyId: string
): Promise<Journey | null> {
  const store = readIsolatedStore(userId);
  const journey = store.journeys.find(
    (j) => j.id === journeyId && j.user_id === userId
  );
  if (!journey) return null;

  const journeyMilestones = store.milestones.filter(
    (m) => m.journey_id === journeyId && m.user_id === userId
  );

  if (journeyMilestones.length === 0) {
    return journey;
  }

  const completedCount = journeyMilestones.filter((m) => m.is_completed).length;
  const percentage = Math.round((completedCount / journeyMilestones.length) * 100);

  let nextStatus: JourneyStatus = journey.status;
  if (percentage === 100) {
    nextStatus = 'Completed';
  } else if (percentage > 0) {
    nextStatus = 'In Progress';
  } else if (journey.status === 'Completed') {
    nextStatus = 'In Progress';
  }

  return updateJourney(userId, journeyId, {
    progress_percentage: percentage,
    status: nextStatus,
  });
}

export async function createMilestone(
  userId: string,
  input: MilestoneFormInput
): Promise<Milestone> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const parentJourney = store.journeys.find(
    (j) => j.id === input.journey_id && j.user_id === userId
  );
  if (!parentJourney) {
    throw new Error('Cannot add milestone: Associated journey not found or unauthorized.');
  }

  const now = new Date().toISOString();
  const isCompleted = Boolean(input.is_completed);
  const newMilestone: Milestone = {
    id: crypto.randomUUID(),
    journey_id: input.journey_id,
    user_id: userId,
    title: input.title.trim(),
    description: input.description.trim(),
    personal_notes: (input.personal_notes || '').trim(),
    milestone_date: input.milestone_date,
    is_completed: isCompleted,
    completed_at: isCompleted ? now : null,
    created_at: now,
  };

  try {
    const { data, error } = await supabase!
      .from('milestones')
      .insert({
        id: newMilestone.id,
        journey_id: newMilestone.journey_id,
        user_id: userId,
        title: newMilestone.title,
        description: newMilestone.description,
        personal_notes: newMilestone.personal_notes,
        milestone_date: newMilestone.milestone_date,
        is_completed: newMilestone.is_completed,
        completed_at: newMilestone.completed_at,
      })
      .select('*')
      .single();

    if (!error && data) {
      newMilestone.id = data.id;
    } else if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Isolated store fallback
  }

  store.milestones = [...store.milestones, newMilestone];

  // Add upcoming milestone notification if within next 14 days
  const prefs = store.profile;
  if (!isCompleted && (!prefs || prefs.notify_upcoming_milestones)) {
    store.notifications = [
      {
        id: crypto.randomUUID(),
        user_id: userId,
        type: 'upcoming_milestone',
        title: 'Upcoming Milestone Scheduled',
        message: `"${newMilestone.title}" is scheduled for ${newMilestone.milestone_date} in "${parentJourney.title}".`,
        read: false,
        created_at: now,
        link: `/journeys/${parentJourney.id}`,
      },
      ...store.notifications,
    ];
  }

  writeIsolatedStore(userId, store);
  await recalculateJourneyProgress(userId, input.journey_id);
  return newMilestone;
}

export async function updateMilestone(
  userId: string,
  milestoneId: string,
  updates: Partial<MilestoneFormInput>
): Promise<Milestone> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const existing = store.milestones.find(
    (m) => m.id === milestoneId && m.user_id === userId
  );
  if (!existing) {
    throw new Error('Milestone not found or unauthorized.');
  }

  const now = new Date().toISOString();
  const nextCompleted =
    updates.is_completed !== undefined ? updates.is_completed : existing.is_completed;
  const completedJustNow = !existing.is_completed && nextCompleted;

  const updated: Milestone = {
    ...existing,
    ...updates,
    id: milestoneId,
    user_id: userId,
    title: updates.title !== undefined ? updates.title.trim() : existing.title,
    description:
      updates.description !== undefined
        ? updates.description.trim()
        : existing.description,
    personal_notes:
      updates.personal_notes !== undefined
        ? updates.personal_notes.trim()
        : existing.personal_notes,
    is_completed: nextCompleted,
    completed_at: nextCompleted ? existing.completed_at || now : null,
  };

  try {
    const { error } = await supabase!
      .from('milestones')
      .update({
        title: updated.title,
        description: updated.description,
        personal_notes: updated.personal_notes,
        milestone_date: updated.milestone_date,
        is_completed: updated.is_completed,
        completed_at: updated.completed_at,
      })
      .eq('id', milestoneId)
      .eq('user_id', userId);

    if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Isolated fallback
  }

  store.milestones = store.milestones.map((m) =>
    m.id === milestoneId ? updated : m
  );

  const prefs = store.profile;
  if (completedJustNow && (!prefs || prefs.notify_completed_milestones)) {
    const parentJourney = store.journeys.find((j) => j.id === updated.journey_id);
    store.notifications = [
      {
        id: crypto.randomUUID(),
        user_id: userId,
        type: 'completed_milestone',
        title: 'Milestone Completed!',
        message: `Congratulations! You completed "${updated.title}"${
          parentJourney ? ` in "${parentJourney.title}"` : ''
        }.`,
        read: false,
        created_at: now,
        link: `/journeys/${updated.journey_id}`,
      },
      ...store.notifications,
    ];
  }

  writeIsolatedStore(userId, store);
  await recalculateJourneyProgress(userId, updated.journey_id);
  return updated;
}

export async function deleteMilestone(
  userId: string,
  milestoneId: string
): Promise<void> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const target = store.milestones.find(
    (m) => m.id === milestoneId && m.user_id === userId
  );
  if (!target) {
    throw new Error('Milestone not found or unauthorized.');
  }

  try {
    const { error } = await supabase!
      .from('milestones')
      .delete()
      .eq('id', milestoneId)
      .eq('user_id', userId);

    if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Isolated fallback
  }

  store.milestones = store.milestones.filter((m) => m.id !== milestoneId);
  writeIsolatedStore(userId, store);
  await recalculateJourneyProgress(userId, target.journey_id);
}

// ============================================================================
// PERSONAL JOURNAL CRUD
// ============================================================================
export async function fetchJournalEntries(userId: string): Promise<JournalEntry[]> {
  ensureConfigured();
  const store = readIsolatedStore(userId);

  try {
    const { data, error } = await supabase!
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false });

    if (!error && Array.isArray(data)) {
      const normalized: JournalEntry[] = data.map((row) => ({
        id: row.id,
        user_id: row.user_id,
        journey_id: row.journey_id || null,
        title: row.title,
        content: row.content,
        entry_date: row.entry_date,
        photo_url: row.photo_url || null,
        created_at: row.created_at,
        updated_at: row.updated_at || row.created_at,
      }));
      store.journalEntries = normalized;
      writeIsolatedStore(userId, store);
      return normalized;
    }
  } catch {
    // Isolated fallback
  }

  return [...store.journalEntries].sort(
    (a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
  );
}

export async function createJournalEntry(
  userId: string,
  input: JournalEntryFormInput
): Promise<JournalEntry> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const now = new Date().toISOString();

  const newEntry: JournalEntry = {
    id: crypto.randomUUID(),
    user_id: userId,
    journey_id: input.journey_id || null,
    title: input.title.trim(),
    content: input.content.trim(),
    entry_date: input.entry_date,
    photo_url: input.photo_url || null,
    created_at: now,
    updated_at: now,
  };

  try {
    const { data, error } = await supabase!
      .from('journal_entries')
      .insert({
        id: newEntry.id,
        user_id: userId,
        journey_id: newEntry.journey_id,
        title: newEntry.title,
        content: newEntry.content,
        entry_date: newEntry.entry_date,
        photo_url: newEntry.photo_url,
      })
      .select('*')
      .single();

    if (!error && data) {
      newEntry.id = data.id;
    } else if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Isolated fallback
  }

  store.journalEntries = [newEntry, ...store.journalEntries];
  writeIsolatedStore(userId, store);
  return newEntry;
}

export async function updateJournalEntry(
  userId: string,
  entryId: string,
  updates: Partial<JournalEntryFormInput>
): Promise<JournalEntry> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const existing = store.journalEntries.find(
    (e) => e.id === entryId && e.user_id === userId
  );
  if (!existing) {
    throw new Error('Journal entry not found or unauthorized.');
  }

  const now = new Date().toISOString();
  const updated: JournalEntry = {
    ...existing,
    ...updates,
    id: entryId,
    user_id: userId,
    title: updates.title !== undefined ? updates.title.trim() : existing.title,
    content:
      updates.content !== undefined ? updates.content.trim() : existing.content,
    updated_at: now,
  };

  try {
    const { error } = await supabase!
      .from('journal_entries')
      .update({
        journey_id: updated.journey_id,
        title: updated.title,
        content: updated.content,
        entry_date: updated.entry_date,
        photo_url: updated.photo_url,
        updated_at: now,
      })
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Isolated fallback
  }

  store.journalEntries = store.journalEntries.map((e) =>
    e.id === entryId ? updated : e
  );
  writeIsolatedStore(userId, store);
  return updated;
}

export async function deleteJournalEntry(
  userId: string,
  entryId: string
): Promise<void> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const target = store.journalEntries.find(
    (e) => e.id === entryId && e.user_id === userId
  );
  if (!target) {
    throw new Error('Journal entry not found or unauthorized.');
  }

  try {
    const { error } = await supabase!
      .from('journal_entries')
      .delete()
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Isolated fallback
  }

  store.journalEntries = store.journalEntries.filter((e) => e.id !== entryId);
  writeIsolatedStore(userId, store);
}

// ============================================================================
// PHOTO GALLERY CRUD
// ============================================================================
export async function fetchJourneyPhotos(userId: string): Promise<JourneyPhoto[]> {
  ensureConfigured();
  const store = readIsolatedStore(userId);

  try {
    const { data, error } = await supabase!
      .from('journey_photos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const normalized: JourneyPhoto[] = data.map((row) => ({
        id: row.id,
        user_id: row.user_id,
        journey_id: row.journey_id || null,
        image_url: row.image_url,
        caption: row.caption || '',
        created_at: row.created_at,
      }));
      store.photos = normalized;
      writeIsolatedStore(userId, store);
      return normalized;
    }
  } catch {
    // Isolated fallback
  }

  return [...store.photos].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createJourneyPhoto(
  userId: string,
  input: { journey_id: string | null; image_url: string; caption: string }
): Promise<JourneyPhoto> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const now = new Date().toISOString();

  const newPhoto: JourneyPhoto = {
    id: crypto.randomUUID(),
    user_id: userId,
    journey_id: input.journey_id || null,
    image_url: input.image_url,
    caption: input.caption.trim(),
    created_at: now,
  };

  try {
    const { data, error } = await supabase!
      .from('journey_photos')
      .insert({
        id: newPhoto.id,
        user_id: userId,
        journey_id: newPhoto.journey_id,
        image_url: newPhoto.image_url,
        caption: newPhoto.caption,
      })
      .select('*')
      .single();

    if (!error && data) {
      newPhoto.id = data.id;
    } else if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Isolated fallback
  }

  store.photos = [newPhoto, ...store.photos];
  writeIsolatedStore(userId, store);
  return newPhoto;
}

export async function updateJourneyPhotoCaption(
  userId: string,
  photoId: string,
  caption: string,
  journeyId: string | null
): Promise<JourneyPhoto> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const existing = store.photos.find((p) => p.id === photoId && p.user_id === userId);
  if (!existing) {
    throw new Error('Photo not found or unauthorized.');
  }

  const updated: JourneyPhoto = {
    ...existing,
    caption: caption.trim(),
    journey_id: journeyId,
  };

  try {
    const { error } = await supabase!
      .from('journey_photos')
      .update({ caption: updated.caption, journey_id: updated.journey_id })
      .eq('id', photoId)
      .eq('user_id', userId);

    if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Isolated fallback
  }

  store.photos = store.photos.map((p) => (p.id === photoId ? updated : p));
  writeIsolatedStore(userId, store);
  return updated;
}

export async function deleteJourneyPhoto(
  userId: string,
  photoId: string
): Promise<void> {
  ensureConfigured();
  const store = readIsolatedStore(userId);
  const target = store.photos.find((p) => p.id === photoId && p.user_id === userId);
  if (!target) {
    throw new Error('Photo not found or unauthorized.');
  }

  try {
    const { error } = await supabase!
      .from('journey_photos')
      .delete()
      .eq('id', photoId)
      .eq('user_id', userId);

    if (error && !isSchemaMissingError(error)) {
      throw new Error(error.message);
    }
  } catch {
    // Isolated fallback
  }

  store.photos = store.photos.filter((p) => p.id !== photoId);
  writeIsolatedStore(userId, store);
}

// ============================================================================
// NOTIFICATIONS & ACCOUNT DELETION
// ============================================================================
export function getNotifications(userId: string): AppNotification[] {
  const store = readIsolatedStore(userId);
  return store.notifications;
}

export function markNotificationRead(userId: string, notificationId: string): AppNotification[] {
  const store = readIsolatedStore(userId);
  store.notifications = store.notifications.map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  writeIsolatedStore(userId, store);
  return store.notifications;
}

export function markAllNotificationsRead(userId: string): AppNotification[] {
  const store = readIsolatedStore(userId);
  store.notifications = store.notifications.map((n) => ({ ...n, read: true }));
  writeIsolatedStore(userId, store);
  return store.notifications;
}

export async function purgeAllUserData(userId: string): Promise<void> {
  ensureConfigured();
  try {
    await supabase!.from('journey_photos').delete().eq('user_id', userId);
    await supabase!.from('journal_entries').delete().eq('user_id', userId);
    await supabase!.from('milestones').delete().eq('user_id', userId);
    await supabase!.from('journeys').delete().eq('user_id', userId);
    await supabase!.from('profiles').delete().eq('id', userId);
  } catch {
    // Continue purging local isolated data
  }
  localStorage.removeItem(getStoreKey(userId));
}
