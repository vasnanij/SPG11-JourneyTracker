# SPG11 Journey Tracker

**Track Every Step of Your SPG11 Journey.**

A complete, responsive, production-ready SaaS web application built with **React, TypeScript, Tailwind CSS, Lucide React, Recharts, React Router, and Supabase** (Auth, PostgreSQL Database with Row-Level Security, and Private Storage).

> **Important Notice:** SPG11 Journey Tracker is a personal tracking, journaling, and milestone documentation tool—not a medical diagnosis or treatment recommendation service.

---

## Features

- **Public Landing Page**: Hero showcase, Features, How It Works, Benefits, Interactive FAQ, and Contact Form with full SEO & Open Graph tags.
- **White Mode & Dark Mode**: Instant theme switching with Sun/Moon toggle in the navigation bar, persisted in `localStorage` (`spg11_theme_preference`) and user profile preferences. Defaults to White Mode (`light`) for new users.
- **Supabase Authentication**: Registration, Email/Password Login, Forgot Password, Password Reset, Session Persistence, Protected Routes, and Account Deletion.
- **Main Dashboard**: Real-time statistics (`Total Journeys`, `Active Journeys`, `Completed Milestones`, `Upcoming Milestones`), Recharts visualizations, Quick Action buttons, Recent Activity stream, Upcoming Milestones list, and Recently Uploaded Photos.
- **My Journeys (Full CRUD)**: Create, view, edit, delete, search, filter by status/category, sort by date/progress, upload cover photographs, and add tags & personal notes.
- **Milestone Tracker**: Create, edit, delete, and mark milestones completed. Automatically recalculates parent journey progress percentage and status.
- **Private Personal Journal**: Write, edit, delete, search, attach photos, and organize private chronological reflections by journey.
- **Photo Gallery**: Upload validated images (`JPEG`, `PNG`, `WebP`, `GIF` up to 5 MB) to private Supabase Storage (`spg11-media`), add captions, filter by journey, and preview in a full-screen lightbox modal.
- **Interactive Timeline**: Chronological stream of journey start dates, completed milestones, upcoming milestones, journal entries, and uploaded photos with date-range and event-type filtering.
- **Data Export**: One-click CSV and JSON exports isolated strictly to the logged-in user.
- **Progressive Web App (PWA)**: Includes `manifest.json`, Service Worker (`sw.js`) caching static shell assets while never caching private user records, install prompt, and offline status banner.

---

## Complete 8-Step Supabase Setup & Deployment Instructions

### 1. How to Create a Supabase Project
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. Click **New Project**, select your organization, enter **SPG11 Journey Tracker** as the project name, set a strong database password, choose a region close to your users, and click **Create new project**.

### 2. Where to Find the Project URL
1. Once your project finishes provisioning, go to **Project Settings** (gear icon in the left sidebar) → **API**.
2. Under **Project URL**, copy the URL (e.g. `https://rcnvypwiuoyshljsvgri.supabase.co`).

### 3. Where to Find the Publishable / Anon Key
1. On the same **Project Settings → API** page, locate the **Project API keys** section.
2. Copy the `anon` `public` key.
3. Never expose the `service_role` secret key in frontend code.
4. Copy `.env.example` to `.env` in the project root and set:
   ```env
   VITE_SUPABASE_URL=https://rcnvypwiuoyshljsvgri.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbnZ5cHdpdW95c2hsanN2Z3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyMjUwMjksImV4cCI6MjEwOTgwMTAyOX0.vOqZIh8UvkpNRaicAg2EPOB0Rx4JtmNibrOcPXB-y3A
   ```

### 4. How to Execute the Generated SQL Migrations
1. In your Supabase Dashboard, open **SQL Editor** from the left sidebar and click **New query**.
2. Open the file [`supabase/migrations/20261109000000_spg11_schema.sql`](./supabase/migrations/20261109000000_spg11_schema.sql) (or click the **Database Setup** button in the app's top navigation bar and click **Copy SQL Migration**).
3. Paste the entire SQL script into the Supabase SQL Editor and click **Run**.
4. This creates `profiles`, `journeys`, `milestones`, `journal_entries`, `journey_photos`, performance indexes, `updated_at` triggers, new-user profile triggers, and Row-Level Security (RLS) policies.

### 5. How to Configure Supabase Authentication
1. In the Supabase Dashboard, navigate to **Authentication → Providers → Email**.
2. Ensure **Enable Email provider** is turned ON.
3. For immediate sign-in during local development without waiting for confirmation emails, toggle **Confirm email** OFF (optional; in production, configure a custom SMTP server under **Project Settings → Auth**).
4. Under **Authentication → URL Configuration**, set **Site URL** to `http://localhost:5173` (or your production domain) and add `http://localhost:5173/**` under **Redirect URLs**.

### 6. How to Create the Private Storage Bucket
1. Running `supabase/migrations/20261109000000_spg11_schema.sql` automatically creates the private bucket `spg11-media` with a 5 MB file size limit and allowed MIME types (`image/jpeg`, `image/png`, `image/webp`, `image/gif`).
2. Alternatively, go to **Storage → New bucket**, name it `spg11-media`, keep **Public bucket** OFF (private), and save.

### 7. How to Configure Storage Security Policies
1. The SQL migration automatically creates four RLS policies on `storage.objects` for `select`, `insert`, `update`, and `delete` restricted to `bucket_id = 'spg11-media' AND (storage.foldername(name))[1] = auth.uid()::text`.
2. This guarantees every user can only upload, view, and delete files inside their own `/<user_id>/` folder.

### 8. How to Run and Test the Application
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Type-check and build for production
npm run build
```
