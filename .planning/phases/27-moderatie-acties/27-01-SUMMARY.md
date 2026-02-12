# Summary 27-01 – Admin Dashboard: Moderatie Acties

**Status:** COMPLETE
**Date:** 2026-02-12

## Wat is er gebouwd

- `supabase/migrations/00004_reports_resolution.sql` – migration met status/resolved_by/resolved_at + UPDATE policy + index
- `lib/qa/types.ts` – ReportStatus type, Report interface uitgebreid
- `app/moderatie/actions.ts` – resolveReport en deleteContent Server Actions
- `app/moderatie/page.tsx` – tabs Open/Afgehandeld met actieknoppen
- `app/admin/content/page.tsx` – inhoudbeheer met zoeken, paginering, verwijder
- `app/admin/content/actions.ts` – adminDeleteQuestion en adminDeleteAnswer

## Afwijkingen van plan

- `app/admin/page.tsx` was al bijgewerkt in Phase 26 met alle 4 kaarten (incl. Inhoudsbeheer); geen extra update nodig

## Acceptance criteria

- [x] Migration adds `status`, `resolved_by`, `resolved_at` to `reports` table
- [x] `ReportStatus` type exported from `lib/qa/types.ts`
- [x] `/moderatie` shows "Open" tab (default) and "Afgehandeld" tab with correct counts
- [x] "Sluit rapport" button marks report as `dismissed` with `resolved_by` and `resolved_at`
- [x] "Verwijder content" button deletes the question or answer AND marks report as `resolved`
- [x] Both actions verify moderator/admin role before executing
- [x] Resolved reports no longer appear in "Open" tab
- [x] `/admin/content` lists all questions with delete functionality
- [x] Admin content delete uses service-role client (bypasses RLS)
- [x] TypeScript should compile without errors
