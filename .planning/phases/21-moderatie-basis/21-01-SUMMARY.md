---
phase: 21-moderatie-basis
plan: 01
status: complete
completed: 2026-02-11
---

# Plan 21-01 Summary — Reports Foundation

## What was built

**supabase/migrations/00003_reports.sql**
- `reports` table with `id`, `question_id` (nullable FK → questions), `answer_id` (nullable FK → answers), `user_id` (FK → auth.users), `reason`, `created_at`
- `reports_target_check` CHECK constraint enforcing exactly one of question_id/answer_id is filled
- RLS enabled with two policies: INSERT for authenticated users, SELECT for moderator/admin only (via profiles role subquery)
- Four partial/standard indexes: question_id (WHERE NOT NULL), answer_id (WHERE NOT NULL), user_id, created_at DESC

**lib/qa/types.ts**
- Added `Report` type (id, question_id, answer_id, user_id, reason, created_at)
- Added `CreateReportInput` type (question_id?, answer_id?, reason)
- No existing types modified

**app/qa/actions.ts**
- Added `CreateReportInput` to import line
- Added `createReport` Server Action: auth check, UUID regex validation for question_id/answer_id, empty reason check, reason allowlist validation (spam/ongewenste inhoud/onjuiste informatie/anders), Supabase insert into `reports`
- Returns `{ error?: string }` — empty `{}` signals success

**docs/database-schema.md**
- New "Moderatie Tabellen" section with reports table definition, constraints, RLS policies table, and indexes table
- "Toekomstige uitbreidingen" updated to show reports as implemented
- Migratie versie updated to 00003, Laatst bijgewerkt to 2026-02-11

## Decisions made

- No `updated_at` on reports (append-only)
- Both question_id and answer_id nullable but CHECK enforces exactly one
- Reason validated against allowlist in Server Action (not just in DB) for clear Dutch error messages

## TypeScript

`npx tsc --noEmit` — no errors
