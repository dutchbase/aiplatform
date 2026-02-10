-- Migration: 00002_qa_schema
-- Phase 13: Q&A Datamodel
-- Description: Creates questions, answers, and answer_replies tables with RLS,
--              updated_at triggers, and performance indexes for the Q&A platform.
--
-- Run this SQL in the Supabase Dashboard SQL Editor.

-- ============================================================================
-- Section 1: Tabellen aanmaken
-- ============================================================================

-- questions table
create table public.questions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

-- answers table
create table public.answers (
  id uuid not null default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

-- answer_replies table
create table public.answer_replies (
  id uuid not null default gen_random_uuid(),
  answer_id uuid not null references public.answers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (id)
);

-- ============================================================================
-- Section 2: Enable Row Level Security
-- ============================================================================

alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.answer_replies enable row level security;

-- ============================================================================
-- Section 3: Updated_at triggers
-- ============================================================================

-- Re-declare function idempotently (already created in 00001_profiles.sql)
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_questions_updated_at
  before update on public.questions
  for each row execute procedure public.update_updated_at_column();

create trigger update_answers_updated_at
  before update on public.answers
  for each row execute procedure public.update_updated_at_column();

create trigger update_answer_replies_updated_at
  before update on public.answer_replies
  for each row execute procedure public.update_updated_at_column();

-- ============================================================================
-- Section 4: RLS Policies
-- ============================================================================

-- Note: (select auth.uid()) is used instead of auth.uid() in all policies.
-- The SELECT wrapper caches the result per-statement (not per-row), which
-- gives ~20x performance improvement on large tables (decision 04-01-D2).

-- questions policies
create policy "Questions are publicly readable"
  on public.questions
  for select
  using ( true );

create policy "Authenticated users can insert questions"
  on public.questions
  for insert
  to authenticated
  with check ( user_id = (select auth.uid()) );

create policy "Users can update their own questions"
  on public.questions
  for update
  to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

create policy "Users can delete their own questions"
  on public.questions
  for delete
  to authenticated
  using ( user_id = (select auth.uid()) );

-- answers policies
create policy "Answers are publicly readable"
  on public.answers
  for select
  using ( true );

create policy "Authenticated users can insert answers"
  on public.answers
  for insert
  to authenticated
  with check ( user_id = (select auth.uid()) );

create policy "Users can update their own answers"
  on public.answers
  for update
  to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

create policy "Users can delete their own answers"
  on public.answers
  for delete
  to authenticated
  using ( user_id = (select auth.uid()) );

-- answer_replies policies
create policy "Answer replies are publicly readable"
  on public.answer_replies
  for select
  using ( true );

create policy "Authenticated users can insert answer replies"
  on public.answer_replies
  for insert
  to authenticated
  with check ( user_id = (select auth.uid()) );

create policy "Users can update their own answer replies"
  on public.answer_replies
  for update
  to authenticated
  using ( user_id = (select auth.uid()) )
  with check ( user_id = (select auth.uid()) );

create policy "Users can delete their own answer replies"
  on public.answer_replies
  for delete
  to authenticated
  using ( user_id = (select auth.uid()) );

-- ============================================================================
-- Section 5: Indexes
-- ============================================================================

-- questions: user_id voor "vragen van gebruiker", created_at voor sortering
create index idx_questions_user_id on public.questions(user_id);
create index idx_questions_created_at on public.questions(created_at desc);

-- answers: question_id voor "antwoorden bij vraag", user_id, created_at
create index idx_answers_question_id on public.answers(question_id);
create index idx_answers_user_id on public.answers(user_id);
create index idx_answers_created_at on public.answers(created_at desc);

-- answer_replies: answer_id voor "reacties bij antwoord", user_id, created_at
create index idx_answer_replies_answer_id on public.answer_replies(answer_id);
create index idx_answer_replies_user_id on public.answer_replies(user_id);
create index idx_answer_replies_created_at on public.answer_replies(created_at desc);
