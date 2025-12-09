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

-- Workspace-specific enums
do $$ begin
    create type public.workspace_role as enum ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type public.workspace_invite_status as enum ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type public.event_category as enum ('ALLIANCE_EVENT', 'SOLO_EVENT', 'KILL_EVENT', 'SEASONAL_EVENT');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type public.event_status as enum ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type public.change_target_type as enum ('EVENT_SESSION', 'PLAYER');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type public.change_request_status as enum ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type public.activity_target_type as enum ('WORKSPACE', 'PLAYER', 'EVENT_SESSION', 'CHANGE_REQUEST');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type public.activity_action_type as enum (
        'CREATE_WORKSPACE',
        'UPDATE_WORKSPACE',
        'ARCHIVE_WORKSPACE',
        'CREATE_PLAYER',
        'UPDATE_PLAYER',
        'CREATE_EVENT_SESSION',
        'UPDATE_EVENT_SESSION',
        'DELETE_EVENT_SESSION',
        'INVITE_MEMBER',
        'ACCEPT_INVITE',
        'CREATE_CHANGE_REQUEST',
        'REVIEW_CHANGE_REQUEST'
    );
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type public.comment_target_type as enum ('WORKSPACE', 'PLAYER', 'EVENT_SESSION', 'CHANGE_REQUEST');
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

-- DATA TABLE: workspaces
create table if not exists public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  server_id integer not null,
  alliance_name text not null,
  alliance_tag text,
  description text,
  default_timezone text not null default 'UTC',
  is_archived boolean not null default false,
  created_by_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- DATA TABLE: workspace_members
create table if not exists public.workspace_members (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.workspace_role not null,
  joined_at timestamptz default timezone('utc', now()),
  unique (workspace_id, user_id)
);

-- DATA TABLE: workspace_invites
create table if not exists public.workspace_invites (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  invited_email text not null,
  invited_by_user_id uuid references auth.users (id) on delete set null,
  role_offered public.workspace_role not null,
  token text not null unique,
  status public.workspace_invite_status not null default 'PENDING',
  expires_at timestamptz not null,
  created_at timestamptz default timezone('utc', now())
);

-- DATA TABLE: players (alliance members inside workspaces)
create table if not exists public.players (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  in_game_name text not null,
  alliance_role text not null,
  city_level integer,
  power bigint,
  is_active boolean not null default true,
  joined_date date,
  external_player_id text,
  notes text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- DATA TABLE: event_types (global templates and workspace overrides)
create table if not exists public.event_types (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid references public.workspaces (id) on delete cascade,
  code text not null,
  name text not null,
  category public.event_category not null,
  description text,
  is_enabled_by_default boolean not null default true,
  default_fields jsonb not null default '[]'::jsonb
);

create unique index if not exists event_types_code_unique on public.event_types (code) where workspace_id is null;
create unique index if not exists event_types_workspace_code_unique on public.event_types (workspace_id, code);

-- DATA TABLE: event_sessions
create table if not exists public.event_sessions (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  event_type_code text not null,
  name text,
  start_date_time timestamptz not null,
  end_date_time timestamptz,
  status public.event_status not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- DATA TABLE: event_participations
create table if not exists public.event_participations (
  id uuid primary key default uuid_generate_v4(),
  event_session_id uuid not null references public.event_sessions (id) on delete cascade,
  player_id uuid not null references public.players (id) on delete cascade,
  role text not null,
  stats jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

-- DATA TABLE: change_requests
create table if not exists public.change_requests (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  target_type public.change_target_type not null,
  target_id uuid not null,
  requested_by_user_id uuid not null references auth.users (id) on delete cascade,
  status public.change_request_status not null default 'PENDING',
  proposed_changes jsonb not null default '{}'::jsonb,
  reviewer_user_id uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  review_comment text,
  created_at timestamptz default timezone('utc', now())
);

-- DATA TABLE: activity_logs
create table if not exists public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  actor_user_id uuid not null references auth.users (id) on delete set null,
  action_type public.activity_action_type not null,
  target_type public.activity_target_type not null,
  target_id uuid not null,
  diff jsonb,
  created_at timestamptz default timezone('utc', now())
);

-- DATA TABLE: comments
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  target_type public.comment_target_type not null,
  target_id uuid not null,
  author_user_id uuid not null references auth.users (id) on delete set null,
  body text not null,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now()),
  is_edited boolean not null default false
);

-- DATA TABLE: workspace_state_snapshots (server-side cache for client state hydration)
create table if not exists public.workspace_state_snapshots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  workspace_id uuid references public.workspaces (id) on delete cascade,
  state_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz default timezone('utc', now()),
  unique (user_id, workspace_id)
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
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_invites enable row level security;
alter table public.players enable row level security;
alter table public.event_types enable row level security;
alter table public.event_sessions enable row level security;
alter table public.event_participations enable row level security;
alter table public.change_requests enable row level security;
alter table public.activity_logs enable row level security;
alter table public.comments enable row level security;
alter table public.workspace_state_snapshots enable row level security;

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
drop policy if exists "Workspace members can manage workspaces" on public.workspaces;
drop policy if exists "Workspace members can manage members" on public.workspace_members;
drop policy if exists "Workspace members can manage invites" on public.workspace_invites;
drop policy if exists "Workspace members can manage players" on public.players;
drop policy if exists "Workspace members can manage event types" on public.event_types;
drop policy if exists "Workspace members can manage event sessions" on public.event_sessions;
drop policy if exists "Workspace members can manage event participations" on public.event_participations;
drop policy if exists "Workspace members can manage change requests" on public.change_requests;
drop policy if exists "Workspace members can manage activity" on public.activity_logs;
drop policy if exists "Workspace members can manage comments" on public.comments;
drop policy if exists "Users can manage own workspace state snapshots" on public.workspace_state_snapshots;

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

-- HELPER: check workspace membership or ownership
create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.workspaces w
    where w.id = target_workspace_id and w.created_by_user_id = auth.uid()
  ) or exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace_id and wm.user_id = auth.uid()
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

-- POLICIES: workspaces and collaboration
create policy "Workspace members can manage workspaces" on public.workspaces
  for all using (public.is_workspace_member(id));

create policy "Workspace members can manage members" on public.workspace_members
  for all using (public.is_workspace_member(workspace_id));

create policy "Workspace members can manage invites" on public.workspace_invites
  for all using (public.is_workspace_member(workspace_id));

create policy "Workspace members can manage players" on public.players
  for all using (public.is_workspace_member(workspace_id));

create policy "Workspace members can manage event types" on public.event_types
  for all using (workspace_id is null or public.is_workspace_member(workspace_id));

create policy "Workspace members can manage event sessions" on public.event_sessions
  for all using (public.is_workspace_member(workspace_id));

create policy "Workspace members can manage event participations" on public.event_participations
  for all using (exists (
    select 1 from public.event_sessions es
    where es.id = event_session_id and public.is_workspace_member(es.workspace_id)
  ));

create policy "Workspace members can manage change requests" on public.change_requests
  for all using (public.is_workspace_member(workspace_id));

create policy "Workspace members can manage activity" on public.activity_logs
  for all using (public.is_workspace_member(workspace_id));

create policy "Workspace members can manage comments" on public.comments
  for all using (public.is_workspace_member(workspace_id));

-- POLICIES: workspace_state_snapshots
create policy "Users can manage own workspace state snapshots" on public.workspace_state_snapshots
  for all using (auth.uid() = user_id);
