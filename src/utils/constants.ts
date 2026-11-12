import { JourneyCategory, JourneyStatus } from '../types';

export const JOURNEY_CATEGORIES: JourneyCategory[] = [
  'Mobility & Physical Therapy',
  'Medical & Neurology',
  'Daily Living & Adaptive Tech',
  'Speech & Communication',
  'Wellness & Mental Health',
  'Community & Family',
  'Research & Clinical Trials',
  'Personal Goal',
];

export const JOURNEY_STATUSES: JourneyStatus[] = [
  'Not Started',
  'In Progress',
  'Completed',
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const SQL_MIGRATION_SCRIPT = `-- SPG11 Journey Tracker - Complete Supabase Schema & RLS Migration
create extension if not exists "pgcrypto";

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

create table if not exists public.journey_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id uuid references public.journeys(id) on delete set null,
  image_url text not null,
  caption text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.journeys enable row level security;
alter table public.milestones enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journey_photos enable row level security;

create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users manage own journeys" on public.journeys for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own milestones" on public.milestones for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own journal_entries" on public.journal_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own journey_photos" on public.journey_photos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('spg11-media', 'spg11-media', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;`;
