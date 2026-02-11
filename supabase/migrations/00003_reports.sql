-- Migration: 00003_reports
-- Phase 21: Moderatie Basis
-- Description: Creates the reports table with RLS policies and indexes for the
--              moderation reporting system.
--
-- Run this SQL in the Supabase Dashboard SQL Editor.

-- ============================================================================
-- Section 1: Tabel aanmaken
-- ============================================================================

create table public.reports (
  id uuid not null default gen_random_uuid(),
  question_id uuid null references public.questions(id) on delete cascade,
  answer_id uuid null references public.answers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now(),
  primary key (id)
);

-- Enforce that exactly one of question_id or answer_id is filled (decision 21-01)
alter table public.reports
  add constraint reports_target_check
  check (
    (question_id is not null and answer_id is null) or
    (question_id is null and answer_id is not null)
  );

-- ============================================================================
-- Section 2: Enable Row Level Security
-- ============================================================================

alter table public.reports enable row level security;

-- ============================================================================
-- Section 3: RLS Policies
-- ============================================================================

-- Note: (select auth.uid()) is used instead of auth.uid() in all policies.
-- The SELECT wrapper caches the result per-statement (not per-row), which
-- gives ~20x performance improvement on large tables (decision 04-01-D2).

-- INSERT: authenticated users can report any question or answer
create policy "Authenticated users can insert reports"
  on public.reports
  for insert
  to authenticated
  with check ( user_id = (select auth.uid()) );

-- SELECT: only moderators and admins can view reports
create policy "Moderators and admins can view reports"
  on public.reports
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where id = (select auth.uid())
        and role in ('moderator', 'admin')
    )
  );

-- ============================================================================
-- Section 4: Indexes
-- ============================================================================

create index idx_reports_question_id on public.reports(question_id) where question_id is not null;
create index idx_reports_answer_id on public.reports(answer_id) where answer_id is not null;
create index idx_reports_user_id on public.reports(user_id);
create index idx_reports_created_at on public.reports(created_at desc);
