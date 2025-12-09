# Arena Fox Login UI

Modern, interactive login experience for the Arena Fox dashboard (Kingshot event management). Built with Next.js (App Router), TypeScript, Tailwind CSS, Mantine components, Headless UI switches, and motion-enhanced iconography.

## Scripts
- `npm install` — install dependencies
- `npm run dev` — start the Next.js dev server
- `npm run build` — type-check and build for production
- `npm start` — serve the production build
- `npm run lint` — run ESLint with Next.js core web vitals rules

## Notes
- Design includes placeholders for vector illustrations; see `IMAGE_ASSETS.md` for guidance and suggested subjects.
- Layout combines Mantine cards/inputs with Tailwind glassmorphism and Headless UI toggles to satisfy modern component expectations.
- Supports responsive breakpoints, neon gradients, and dark-default theming for the Arena Fox aesthetic.

## Supabase security setup
Use Supabase for authentication and role-gated dashboard controls. Keep your keys in a private `.env` file (never commit them). The app expects (use `NEXT_PUBLIC_*` keys, with `VITE_*` still supported for local fallback):

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-public-anon-key>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<optional-publishable-key>
VITE_SUPER_ADMIN_EMAIL=<email-that-should-be-treated-as-super-admin>
```

### Minimal schema
Run these statements in the Supabase SQL editor (or psql) to add secure tables that pair with Supabase Auth. Enable Row Level Security (RLS) on both tables and create policies that allow:
- Authenticated users to select/update only their own rows.
- Super admins (first email you register or any row with `role = 'super_admin'`) to read/write everything.

```sql
create type public.user_role as enum ('member', 'admin', 'super_admin');

create table public.user_accounts (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text,
  avatar_url text,
  bio text,
  role public.user_role not null default 'member',
  is_enabled boolean not null default true,
  is_verified boolean not null default false,
  verified_at timestamptz,
  status_label text check (status_label in ('cool', 'hot', 'vip', 'staff')),
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

alter table public.user_accounts enable row level security;
alter table public.user_profiles enable row level security;
```

Suggested policies (adjust to your needs):

- **Members**: `using (auth.uid() = id)` for select/update on both tables.
- **Super admins**: `using (exists (select 1 from user_accounts ua where ua.id = auth.uid() and ua.role = 'super_admin'))` with `with check (true)` so they can manage verification ticks, labels, and account enablement.
- **Verified tick**: only set `is_verified = true` or `verified_at` when the acting user is super admin or admin.

### Admin behaviors
- The first email you register becomes the super admin. Store it in `VITE_SUPER_ADMIN_EMAIL` so the UI shows elevated controls.
- Super admins can enable/disable accounts, set status labels such as `cool` or `hot`, and toggle verification ticks. Unverified users never see a tick in the UI.
- Keep the service-role key on the server only (never expose it to the browser); use it in edge functions or API routes for admin mutations.
