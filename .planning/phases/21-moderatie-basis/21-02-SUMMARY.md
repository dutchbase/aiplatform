---
phase: 21-moderatie-basis
plan: 02
status: complete
completed: 2026-02-11
---

# Plan 21-02 Summary — Moderation UI & Queue

## What was built

**components/qa/report-form.tsx** (new Client Component)
- Uses `useFormState` from `react-dom` + same `ActionFn` cast pattern as `answer-form.tsx`
- Collapsed by default (shows "Rapporteer" text link)
- Expands on click to show inline form with select dropdown (spam, ongewenste inhoud, onjuiste informatie, anders)
- Shows Dutch error from Server Action on failure
- On success (state !== null && !state.error): replaces form with "Rapport verzonden. Bedankt voor je melding."
- Uses `Button size="sm"` (Button component confirmed to support size variants)

**app/qa/vraag/[id]/page.tsx** (updated)
- Added `import { ReportForm }` alongside existing imports
- Added `{user && <ReportForm questionId={question.id} />}` after question author/date line
- Added `{user && <ReportForm answerId={answer.id} />}` inside each answer card, after author/date line
- No changes to reply forms or existing layout

**app/moderatie/page.tsx** (new Server Component)
- Auth check: `supabase.auth.getUser()` → redirect('/login') if no user
- Role check: profiles SELECT → redirect('/') if role not moderator/admin
- Fetches all reports ordered by created_at DESC with PostgREST join on questions and answers
- Renders list: type badge, content preview (question title or first 80 chars of answer body), reason, date, link to post
- Shows empty state message when no reports

**docs/moderatie.md** (new)
- Complete documentation: feature overview, user flow (report button steps), moderator queue description, role assignment SQL, database summary, RLS summary

**docs/CHANGELOG.md** (updated)
- Phase 21 entry prepended above Phase 20 entry

## TypeScript

`npx tsc --noEmit` — no errors after all changes
