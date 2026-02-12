-- Migration: 00004_reports_resolution
-- Phase 27: Moderatie Acties
-- Description: Adds resolution fields to the reports table to support the
--              moderation workflow (resolve or dismiss reports, delete content).
--
-- Run this SQL in the Supabase Dashboard SQL Editor.

-- ============================================================================
-- Section 1: Kolommen toevoegen
-- ============================================================================

ALTER TABLE public.reports
  ADD COLUMN status text NOT NULL DEFAULT 'open'
    CONSTRAINT reports_status_check CHECK (status IN ('open', 'resolved', 'dismissed')),
  ADD COLUMN resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN resolved_at timestamptz;

-- ============================================================================
-- Section 2: Index voor statusfiltering
-- ============================================================================

-- Index for filtering by status (moderators always filter open reports)
CREATE INDEX idx_reports_status ON public.reports(status);

-- ============================================================================
-- Section 3: UPDATE RLS Policy voor moderators en admins
-- ============================================================================

-- Note: (select auth.uid()) caches result per-statement (decision 04-01-D2)
CREATE POLICY "Moderators and admins can update report status"
  ON public.reports FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('moderator', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (SELECT auth.uid())
        AND role IN ('moderator', 'admin')
    )
  );
