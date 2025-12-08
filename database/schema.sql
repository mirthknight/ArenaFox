create extension if not exists "uuid-ossp";

-- Define user roles
do $$ begin
    create type public.user_role as enum ('member', 'admin', 'super_admin');
exception
    when duplicate_object then null;
end $$;

-- Define invite status
do $$ begin
    create type public.invite_status as enum ('pending', 'sent', 'accepted', 'expired', 'revoked');
exception
    when duplicate_object then null;
end $$;

-- DATA TABLE: user_accounts
create table if not exists public.user_accounts (
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

-- DATA TABLE: user_profiles
create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- DATA TABLE: badges (assignable by admin/super admin)
create table if not exists public.badges (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  color text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz default timezone('utc', now())
);

-- DATA TABLE: profile_badges (bridge between users and badges)
create table if not exists public.profile_badges (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references auth.users (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  assigned_by uuid references auth.users (id) on delete set null,
  assigned_at timestamptz default timezone('utc', now()),
  unique (profile_id, badge_id)
);

-- DATA TABLE: profile_likes
create table if not exists public.profile_likes (
  profile_id uuid not null references auth.users (id) on delete cascade,
  liked_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz default timezone('utc', now()),
  primary key (profile_id, liked_by)
);

-- DATA TABLE: user_invites (email-only onboarding)
create table if not exists public.user_invites (
  id uuid primary key default uuid_generate_v4(),
  invitee_email text not null,
  role public.user_role not null default 'member',
  invited_by uuid references auth.users (id) on delete set null,
  invite_code text not null,
  status public.invite_status not null default 'pending',
  expires_at timestamptz,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create unique index if not exists user_invites_unique_pending on public.user_invites (invitee_email, status)
  where status in ('pending', 'sent');

create unique index if not exists user_invites_code_unique on public.user_invites (invite_code);

-- RLS: Enable Row Level Security
alter table public.user_accounts enable row level security;
alter table public.user_profiles enable row level security;
alter table public.badges enable row level security;
alter table public.profile_badges enable row level security;
alter table public.profile_likes enable row level security;
alter table public.user_invites enable row level security;

-- CLEANUP: Drop existing policies to avoid conflicts or infinite recursions
drop policy if exists "Users can view own account" on public.user_accounts;
drop policy if exists "Users can update own account" on public.user_accounts;
drop policy if exists "Admins can manage all accounts" on public.user_accounts;
drop policy if exists "Authenticated users can view enabled accounts" on public.user_accounts;
drop policy if exists "Users can view own profile" on public.user_profiles;
drop policy if exists "Users can update own profile" on public.user_profiles;
drop policy if exists "Admins can manage all profiles" on public.user_profiles;
drop policy if exists "Authenticated users can view profiles" on public.user_profiles;
drop policy if exists "Admins can manage badges" on public.badges;
drop policy if exists "Authenticated users can view badges" on public.badges;
drop policy if exists "Admins can manage profile badges" on public.profile_badges;
drop policy if exists "Authenticated users can view profile badges" on public.profile_badges;
drop policy if exists "Users can like profiles" on public.profile_likes;
drop policy if exists "Users can view likes" on public.profile_likes;
drop policy if exists "Users can unlike profiles" on public.profile_likes;
drop policy if exists "Admins can manage invites" on public.user_invites;

-- HELPER: Check super admin status without recursion
-- We use SECURITY DEFINER so this runs with admin privileges, bypassing RLS
create or replace function public.is_super_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_accounts
    where id = auth.uid() and role = 'super_admin'
  );
end;
$$ language plpgsql security definer;

-- HELPER: Check admin or super admin
create or replace function public.is_admin_or_super()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_accounts
    where id = auth.uid() and role in ('admin', 'super_admin')
  );
end;
$$ language plpgsql security definer;

-- POLICIES: user_accounts
-- 1. Users can read/update their own data
create policy "Users can view own account" on public.user_accounts
  for select using (auth.uid() = id);

create policy "Users can update own account" on public.user_accounts
  for update using (auth.uid() = id);

-- 2. Admins and super admins can manage everything
create policy "Admins can manage all accounts" on public.user_accounts
  for all using (public.is_admin_or_super());

-- 3. Authenticated users can view enabled accounts (for profile directory)
create policy "Authenticated users can view enabled accounts" on public.user_accounts
  for select using (auth.uid() is not null and is_enabled = true);

-- POLICIES: user_profiles
create policy "Users can view own profile" on public.user_profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.user_profiles
  for update using (auth.uid() = id);

-- Admins and super admins can manage profiles
create policy "Admins can manage all profiles" on public.user_profiles
  for all using (public.is_admin_or_super());

-- Allow authenticated users to view profiles for the directory
create policy "Authenticated users can view profiles" on public.user_profiles
  for select using (auth.uid() is not null);

-- POLICIES: badges
create policy "Authenticated users can view badges" on public.badges
  for select using (auth.uid() is not null);

create policy "Admins can manage badges" on public.badges
  for all using (public.is_admin_or_super());

-- POLICIES: profile_badges
create policy "Authenticated users can view profile badges" on public.profile_badges
  for select using (auth.uid() is not null);

create policy "Admins can manage profile badges" on public.profile_badges
  for all using (public.is_admin_or_super());

-- POLICIES: profile_likes
create policy "Users can view likes" on public.profile_likes
  for select using (auth.uid() is not null);

create policy "Users can like profiles" on public.profile_likes
  for insert with check (auth.uid() = liked_by);

create policy "Users can unlike profiles" on public.profile_likes
  for delete using (auth.uid() = liked_by);

-- POLICIES: user_invites
create policy "Admins can manage invites" on public.user_invites
  for all using (public.is_admin_or_super());
