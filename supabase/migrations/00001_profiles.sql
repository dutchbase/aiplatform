-- Migration: 00001_profiles
-- Phase 4: Database & Auth
-- Description: Creates profiles table linked to auth.users, with triggers
--              for auto-creation on signup and auto-update of updated_at,
--              plus RLS policies for authenticated read and self-update.
--
-- Run this SQL in the Supabase Dashboard SQL Editor.

-- ============================================================================
-- Section 1: Profiles table
-- ============================================================================

create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

-- ============================================================================
-- Section 2: Enable Row Level Security
-- ============================================================================

alter table public.profiles enable row level security;

-- ============================================================================
-- Section 3: Auto-create profile on signup trigger
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- Section 4: Auto-update updated_at trigger
-- ============================================================================

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

-- ============================================================================
-- Section 5: RLS Policies
-- ============================================================================

-- Policy 1: Authenticated users can read all profiles
create policy "Profiles are viewable by authenticated users"
  on public.profiles
  for select
  to authenticated
  using ( true );

-- Policy 2: Users can update their own profile
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- Policy 3: Admins can update any profile
create policy "Admins can update any profile"
  on public.profiles
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid())
      and role = 'admin'
    )
  );
