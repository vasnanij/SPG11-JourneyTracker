-- ============================================================================
-- SPG11 Journey Tracker - Complete Supabase Database Schema, Indexes, RLS & Storage
-- ============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  theme_preference text not null default 'light' check (theme_preference in ('light', 'dark')),
  notify_upcoming_milestones boolean not null default true,
  notify_new_journeys boolean not null default true,
  notify_completed_milestones boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 2. JOURNEYS TABLE
-- ============================================================================
create table if not exists public.journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  personal_notes text not null default '',
  category text not null default 'Mobility & Physical Therapy',
  tags text[] not null default '{}',
  start_date date not null,
  end_date date,
  status text not null default 'Not Started' check (status in ('Not Started', 'In Progress', 'Completed')),
  progress_percentage integer not null default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
  cover_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 3. MILESTONES TABLE
-- ============================================================================
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  personal_notes text not null default '',
  milestone_date date not null,
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 4. JOURNAL ENTRIES TABLE
-- ============================================================================
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id uuid references public.journeys(id) on delete set null,
  title text not null,
  content text not null,
  entry_date date not null default current_date,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 5. JOURNEY PHOTOS TABLE
-- ============================================================================
create table if not exists public.journey_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id uuid references public.journeys(id) on delete set null,
  image_url text not null,
  caption text not null default '',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 6. PERFORMANCE INDEXES
-- ============================================================================
create index if not exists idx_journeys_user_id on public.journeys(user_id);
create index if not exists idx_journeys_status on public.journeys(user_id, status);
create index if not exists idx_journeys_start_date on public.journeys(user_id, start_date desc);

create index if not exists idx_milestones_user_id on public.milestones(user_id);
create index if not exists idx_milestones_journey_id on public.milestones(journey_id);
create index if not exists idx_milestones_date on public.milestones(user_id, milestone_date asc);

create index if not exists idx_journal_entries_user_id on public.journal_entries(user_id);
create index if not exists idx_journal_entries_journey_id on public.journal_entries(journey_id);
create index if not exists idx_journal_entries_date on public.journal_entries(user_id, entry_date desc);

create index if not exists idx_journey_photos_user_id on public.journey_photos(user_id);
create index if not exists idx_journey_photos_journey_id on public.journey_photos(journey_id);

-- ============================================================================
-- 7. AUTOMATIC UPDATED_AT & PROFILE CREATION TRIGGERS
-- ============================================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists set_journeys_updated_at on public.journeys;
create trigger set_journeys_updated_at
  before update on public.journeys
  for each row execute function public.handle_updated_at();

drop trigger if exists set_journal_entries_updated_at on public.journal_entries;
create trigger set_journal_entries_updated_at
  before update on public.journal_entries
  for each row execute function public.handle_updated_at();

-- Automatically create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, theme_preference)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'light'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 8. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.journeys enable row level security;
alter table public.milestones enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journey_photos enable row level security;

-- PROFILES POLICIES
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can delete their own profile" on public.profiles;
create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- JOURNEYS POLICIES
drop policy if exists "Users can view their own journeys" on public.journeys;
create policy "Users can view their own journeys"
  on public.journeys for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own journeys" on public.journeys;
create policy "Users can create their own journeys"
  on public.journeys for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own journeys" on public.journeys;
create policy "Users can update their own journeys"
  on public.journeys for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own journeys" on public.journeys;
create policy "Users can delete their own journeys"
  on public.journeys for delete
  using (auth.uid() = user_id);

-- MILESTONES POLICIES (also validates ownership of the parent journey)
drop policy if exists "Users can view their own milestones" on public.milestones;
create policy "Users can view their own milestones"
  on public.milestones for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create milestones for their own journeys" on public.milestones;
create policy "Users can create milestones for their own journeys"
  on public.milestones for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.journeys j
      where j.id = journey_id and j.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update their own milestones" on public.milestones;
create policy "Users can update their own milestones"
  on public.milestones for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.journeys j
      where j.id = journey_id and j.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete their own milestones" on public.milestones;
create policy "Users can delete their own milestones"
  on public.milestones for delete
  using (auth.uid() = user_id);

-- JOURNAL ENTRIES POLICIES (validates optional associated journey ownership)
drop policy if exists "Users can view their own journal entries" on public.journal_entries;
create policy "Users can view their own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own journal entries" on public.journal_entries;
create policy "Users can create their own journal entries"
  on public.journal_entries for insert
  with check (
    auth.uid() = user_id
    and (
      journey_id is null
      or exists (
        select 1 from public.journeys j
        where j.id = journey_id and j.user_id = auth.uid()
      )
    )
  );

drop policy if exists "Users can update their own journal entries" on public.journal_entries;
create policy "Users can update their own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      journey_id is null
      or exists (
        select 1 from public.journeys j
        where j.id = journey_id and j.user_id = auth.uid()
      )
    )
  );

drop policy if exists "Users can delete their own journal entries" on public.journal_entries;
create policy "Users can delete their own journal entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- JOURNEY PHOTOS POLICIES (validates optional associated journey ownership)
drop policy if exists "Users can view their own photos" on public.journey_photos;
create policy "Users can view their own photos"
  on public.journey_photos for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own photos" on public.journey_photos;
create policy "Users can insert their own photos"
  on public.journey_photos for insert
  with check (
    auth.uid() = user_id
    and (
      journey_id is null
      or exists (
        select 1 from public.journeys j
        where j.id = journey_id and j.user_id = auth.uid()
      )
    )
  );

drop policy if exists "Users can update their own photos" on public.journey_photos;
create policy "Users can update their own photos"
  on public.journey_photos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own photos" on public.journey_photos;
create policy "Users can delete their own photos"
  on public.journey_photos for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- 9. SUPABASE STORAGE BUCKET & PRIVATE STORAGE POLICIES
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'spg11-media',
  'spg11-media',
  false,
  5242880, -- 5MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Users can only read/write/delete files inside their own folder: <user_id>/*
drop policy if exists "Users can view their own private media" on storage.objects;
create policy "Users can view their own private media"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'spg11-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can upload their own private media" on storage.objects;
create policy "Users can upload their own private media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'spg11-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own private media" on storage.objects;
create policy "Users can update their own private media"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'spg11-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own private media" on storage.objects;
create policy "Users can delete their own private media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'spg11-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
