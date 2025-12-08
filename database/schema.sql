-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Define user roles
do $$ begin
    create type public.user_role as enum ('member', 'admin', 'super_admin');
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

-- RLS: Enable Row Level Security
alter table public.user_accounts enable row level security;
alter table public.user_profiles enable row level security;

-- CLEANUP: Drop existing policies to avoid conflicts or infinite recursions
drop policy if exists "Users can view own account" on public.user_accounts;
drop policy if exists "Users can update own account" on public.user_accounts;
drop policy if exists "Super admins can manage all accounts" on public.user_accounts;
drop policy if exists "Users can view own profile" on public.user_profiles;
drop policy if exists "Users can update own profile" on public.user_profiles;

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

-- POLICIES: user_accounts
-- 1. Users can read/update their own data
create policy "Users can view own account" on public.user_accounts
  for select using (auth.uid() = id);

create policy "Users can update own account" on public.user_accounts
  for update using (auth.uid() = id);

-- 2. Super admins can do everything
-- Uses the function to avoid querying the table directly in the policy (infinite loop)
create policy "Super admins can manage all accounts" on public.user_accounts
  for all using (public.is_super_admin());

-- POLICIES: user_profiles
create policy "Users can view own profile" on public.user_profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.user_profiles
  for update using (auth.uid() = id);
