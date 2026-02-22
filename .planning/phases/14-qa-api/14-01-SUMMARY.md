---
phase: 14-qa-api
plan: 01
subsystem: api
tags: [supabase, typescript, server-actions, nextjs, rls, postgresql]

# Dependency graph
requires:
  - phase: 13-qa-datamodel
    provides: questions, answers, answer_replies tables with RLS policies and indexes
  - phase: 03-supabase
    provides: createClient() from lib/supabase/server for server-side DB access
  - phase: 04-auth
    provides: Supabase Auth integration (auth.getUser()) used in all mutation guards

provides:
  - Typed Q&A domain layer: lib/qa/types.ts with Question, Answer, AnswerReply, input types
  - Four Server Component read functions: getQuestions, getQuestionById, getAnswersByQuestionId, getRepliesByAnswerId
  - Three authenticated Server Actions: createQuestion, createAnswer, createReply
  - API contract documentation in docs/qa.md

affects: [15-qa-frontend, 16-qa-forms, qa-moderation, qa-search]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Manual validation with Dutch error messages (zod not installed; explicit length/UUID checks)
    - Auth-first guard pattern in Server Actions (getUser() before any DB write)
    - Generic DB error surface (raw errors swallowed, Dutch fallback returned)
    - Typed query functions throwing on error (callers handle at Server Component boundary)
    - revalidatePath for targeted cache invalidation after mutations

key-files:
  created:
    - lib/qa/types.ts
    - lib/qa/queries.ts
    - app/qa/actions.ts
    - docs/qa.md
  modified:
    - docs/CHANGELOG.md

key-decisions:
  - "Manual validation instead of Zod (zod not in package.json; avoided adding new dep)"
  - "Queries throw on DB error rather than returning null (callers use try/catch or error boundary)"
  - "Generic 'Er is iets misgegaan' for DB errors in actions (no internal details to callers)"
  - "UUID regex validation for foreign key inputs (question_id, answer_id)"

patterns-established:
  - "Server Actions return { id } | { error } discriminated union - callers check error field"
  - "All mutations guard with auth.getUser() before any data access"
  - "Read functions in lib/qa/queries.ts; mutations in app/qa/actions.ts"

# Metrics
duration: 3min
completed: 2026-02-10
---

# Phase 14 Plan 01: Q&A API Summary

**Typed Q&A API layer with authenticated Server Actions (createQuestion/Answer/Reply) and four Server Component read functions backed by the Phase 13 Supabase schema**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-02-10T17:11:15Z
- **Completed:** 2026-02-10T17:13:43Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- TypeScript domain types for all Q&A entities and input shapes with zero `any`
- Four read functions in `lib/qa/queries.ts` callable from Server Components with proper null handling
- Three Server Actions in `app/qa/actions.ts` with auth guard, input validation, and safe error returns
- API contract documentation in `docs/qa.md` covering all functions, validation rules, and error handling

## Task Commits

Each task was committed atomically:

1. **Task 1: TypeScript types and read functions** - `d544292` (feat)
2. **Task 2: Server Actions for Q&A mutations** - `32794a2` (feat)
3. **Task 3: Documentation and changelog** - `0be1b70` (docs)

**Plan metadata:** `3b45da9` (docs: complete qa-api plan)

## Files Created/Modified
- `lib/qa/types.ts` - Question, Answer, AnswerReply, CreateQuestionInput, CreateAnswerInput, CreateReplyInput types
- `lib/qa/queries.ts` - getQuestions, getQuestionById, getAnswersByQuestionId, getRepliesByAnswerId
- `app/qa/actions.ts` - createQuestion, createAnswer, createReply Server Actions with auth + validation
- `docs/qa.md` - API contract documentation for all actions and read functions
- `docs/CHANGELOG.md` - Phase 14 entry prepended

## Decisions Made

**14-01-D1: Manual validation instead of Zod**
Zod was not present in package.json. Rather than adding a new dependency mid-phase, manual validation with explicit string length checks and UUID regex was implemented. Behavior is identical to Zod schemas specified in the plan.

**14-01-D2: Read functions throw on DB error**
Query functions in `lib/qa/queries.ts` throw `new Error(error.message)` on unexpected DB errors rather than returning null or a discriminated union. This lets Server Components handle errors at their boundary (via error.tsx or try/catch), which is the idiomatic Next.js App Router pattern.

**14-01-D3: UUID regex for foreign key validation**
Since the plan specified UUID validation for `question_id` and `answer_id` inputs and Zod was unavailable, a standard UUID v4 regex is used to validate these fields before hitting the database.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Manual validation instead of Zod schemas**
- **Found during:** Task 2 (Server Actions)
- **Issue:** Plan specified Zod schemas but zod package is not installed
- **Fix:** Implemented manual validation with identical constraints (min lengths, UUID regex) and same Dutch error messages
- **Files modified:** app/qa/actions.ts
- **Verification:** TypeScript compiles cleanly; validation logic covers all specified constraints
- **Committed in:** 32794a2 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking - missing dependency handled by manual implementation)
**Impact on plan:** Identical validation behavior achieved without new dependencies. No scope creep.

## Issues Encountered
None - all tasks completed as planned, with the single deviation handled inline.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 15 (Q&A frontend) can immediately import from `lib/qa/queries.ts` and `app/qa/actions.ts`
- All types exported from `lib/qa/types.ts` for use in components
- `createQuestion` returns `{ id }` enabling redirect to new question page after creation
- No blockers or concerns

---
*Phase: 14-qa-api*
*Completed: 2026-02-10*
