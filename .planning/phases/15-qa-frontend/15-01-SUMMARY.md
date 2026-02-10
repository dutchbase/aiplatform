---
phase: 15-qa-frontend
plan: 01
subsystem: ui
tags: [nextjs, server-components, supabase, qa, typescript, dutch]

# Dependency graph
requires:
  - phase: 14-qa-api
    provides: Q&A read functions (getQuestions, getQuestionById, getAnswersByQuestionId, getRepliesByAnswerId), Server Actions, and TypeScript types
  - phase: 13-qa-database
    provides: questions, answers, answer_replies tables with RLS and profiles JOIN capability
provides:
  - Functional Q&A overview page at /qa showing live questions from Supabase
  - Functional Q&A detail page at /qa/vraag/[id] with question, answers, and nested replies
  - profiles JOIN in all Q&A queries returning author display_name
  - notFound() guard for unknown question IDs
  - Dynamic generateMetadata using actual question title on detail pages
affects: [16-qa-forms, 17-content, 18-seo-advanced, 19-moderation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Promise.all for parallel per-answer reply fetching in Server Component"
    - "profiles(display_name) Supabase JOIN pattern for author names"
    - "notFound() guard pattern for dynamic route 404 handling"
    - "generateMetadata with async Supabase fetch for dynamic page titles"

key-files:
  created: []
  modified:
    - app/qa/page.tsx
    - app/qa/vraag/[id]/page.tsx
    - lib/qa/queries.ts
    - lib/qa/types.ts
    - docs/CHANGELOG.md

key-decisions:
  - "Used &middot; HTML entity instead of · character for author/date separator (JSX safe)"
  - "profiles JOIN added to all four query functions (consistent coverage across read functions)"
  - "Promise.all for reply fetching — parallel per-answer calls rather than sequential"

patterns-established:
  - "Q&A page pattern: async Server Component -> getQuestions() -> conditional list or empty state"
  - "Q&A detail pattern: getQuestionById -> notFound() guard -> parallel answer+reply fetch -> render hierarchy"

# Metrics
duration: 2min
completed: 2026-02-10
---

# Phase 15 Plan 01: Q&A Frontend Summary

**Functional Q&A read-only frontend using Supabase data: overview page with question list, detail page with nested answer/reply hierarchy, profiles JOIN for author names, and notFound() for unknown IDs.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-10T18:06:41Z
- **Completed:** 2026-02-10T18:08:58Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Replaced both Q&A placeholder pages with fully working async Server Components fetching live data from Supabase
- Added `profiles(display_name)` JOIN to all four Q&A query functions and updated TypeScript types accordingly
- Detail page renders the full question thread hierarchy: question body -> answers with author/date -> indented replies per answer

## Task Commits

Each task was committed atomically:

1. **Task 1: Q&A overview page with question list and empty state** - `82568ff` (feat)
2. **Task 2: Q&A detail page with answers and nested replies** - `68cd071` (feat)
3. **Task 3: CHANGELOG bijwerken voor Phase 15** - `24fe435` (docs)

**Plan metadata:** (docs commit - see Final Commit step)

## Files Created/Modified
- `app/qa/page.tsx` - Async Server Component: fetches questions via getQuestions(), renders list with clickable titles, author, date; empty state when no questions
- `app/qa/vraag/[id]/page.tsx` - Async Server Component: generateMetadata with real question title, notFound() guard, full thread hierarchy (question -> answers -> replies)
- `lib/qa/queries.ts` - All four read functions updated to use `*.select('*, profiles(display_name)')` for author JOIN
- `lib/qa/types.ts` - Question, Answer, AnswerReply types extended with `profiles: { display_name: string | null } | null` field
- `docs/CHANGELOG.md` - Phase 15 section added at top with Added, Changed, and Technical Details

## Decisions Made

**15-01-D1: profiles JOIN added to all four query functions**
All four read functions (getQuestions, getQuestionById, getAnswersByQuestionId, getRepliesByAnswerId) were updated uniformly to include the profiles JOIN. This ensures consistent author name availability across all Q&A read operations, avoiding partial JOIN coverage that could cause future surprises.

**15-01-D2: Promise.all for per-answer reply fetching**
Rather than fetching replies sequentially, Promise.all maps over answers and fetches each answer's replies in parallel. This reduces total latency from O(n) sequential DB calls to O(1) parallel calls bounded by the slowest reply fetch.

**15-01-D3: &middot; HTML entity for author/date separator**
Used `&middot;` HTML entity in JSX instead of the raw `·` character for the separator between author and date. Consistent with JSX best practices for special characters.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added profiles field to lib/qa/types.ts**
- **Found during:** Task 1 (Q&A overview page implementation)
- **Issue:** The existing Question, Answer, and AnswerReply types in lib/qa/types.ts lacked the `profiles` field entirely. The plan specified adding the JOIN to queries but the types also needed updating for TypeScript to accept the new shape.
- **Fix:** Added `profiles: { display_name: string | null } | null` field to all three types.
- **Files modified:** lib/qa/types.ts
- **Verification:** TypeScript compiles without errors after update.
- **Committed in:** 82568ff (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical - type definition update)
**Impact on plan:** Necessary for TypeScript strict-mode compliance. The plan mentioned updating types implicitly but did not explicitly call it out as a separate step.

## Issues Encountered
None - implementation proceeded without unexpected problems.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Q&A read frontend is complete. /qa shows live questions; /qa/vraag/[id] shows full thread.
- Phase 16 (Q&A forms) can build directly on top: the pages are ready to receive "Stel een vraag", "Geef antwoord", and "Reageer" forms.
- No blockers.

---
*Phase: 15-qa-frontend*
*Completed: 2026-02-10*
