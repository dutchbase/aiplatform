---
phase: 16
plan: "16-01"
status: complete
date: "2026-02-10"
subsystem: qa-forms
tags: [nextjs, react, forms, useFormState, authentication, client-components]
requires: ["15-01"]
provides: ["Q&A write functionality: ask question, post answer, post reply with auth gates"]
affects: ["17-01", "18-01", "20-01"]
tech-stack:
  added: []
  patterns:
    - "useFormState from react-dom (React 18.3.1) for Server Action form state"
    - "Server Component auth gate: createClient().auth.getUser() then conditional render"
    - "as unknown as ActionFn cast for useFormState with single-arg Server Actions"
    - "useEffect on state.id for client-side redirect after successful form submit"
    - "Toggle pattern for inline reply form (open/close state with useState)"
key-files:
  created:
    - app/qa/nieuwe-vraag/page.tsx
    - components/qa/ask-question-form.tsx
    - components/qa/answer-form.tsx
    - components/qa/reply-form.tsx
  modified:
    - app/qa/vraag/[id]/page.tsx
    - app/qa/page.tsx
    - docs/CHANGELOG.md
decisions:
  - id: "16-01-D1"
    decision: "useFormState cast via 'as unknown as ActionFn' instead of wrapping Server Action"
    rationale: "Existing Server Actions take only (formData: FormData) not (state, formData). Cast is safe at runtime since React ignores the state argument when calling the action. Avoids adding wrapper functions in actions.ts."
    impact: "All three form components use this cast pattern consistently"
metrics:
  duration: "10 minutes"
  tasks_completed: 3
  tasks_total: 3
  completed: "2026-02-10"
---

# Phase 16 Plan 01: Q&A Formulieren Summary

Q&A write forms with `useFormState(createQuestion/createAnswer/createReply)`, auth gates via Server Component `getUser()` checks, and `useEffect`-driven redirect after question creation.

## What Was Built

Phase 16 completes the Q&A community cycle by adding the write side to the read side from Phase 15.

**New page:** `/qa/nieuwe-vraag` — Server Component that checks authentication via `createClient().auth.getUser()`. Unauthenticated users see a login CTA. Authenticated users see `AskQuestionForm`.

**New components:**

- `AskQuestionForm` — Client Component with `useFormState(createQuestion, null)`. On error: shows inline error message. On success (state.id present): `useEffect` triggers `router.push(/qa/vraag/${state.id})` for redirect to the new question.
- `AnswerForm` — Client Component with `useFormState(createAnswer, null)`. Shows hidden `question_id` input, inline error on failure, "Antwoord geplaatst!" success message, and `formRef.reset()` to clear the textarea after successful submit.
- `ReplyForm` — Client Component with `useState(false)` toggle. Shows "Reageer" button when closed; on click reveals inline form with `useFormState(createReply, null)`. After successful submit: closes the form and resets it.

**Updated pages:**

- `app/qa/vraag/[id]/page.tsx` — Added auth check. Authenticated users see `AnswerForm` below the answers section and `ReplyForm` per answer. Unauthenticated users see login CTAs instead.
- `app/qa/page.tsx` — Added "Vraag stellen" link to `/qa/nieuwe-vraag` above the questions list.

## Technical Details

### useFormState Signature Compatibility

The existing Server Actions (`createQuestion`, `createAnswer`, `createReply`) have signature `(formData: FormData) => Promise<{...}>`. The `useFormState` hook expects `(state: S, payload: P) => Promise<S>`. These are incompatible types in TypeScript but compatible at runtime (React passes the previous state as first arg, which the actions ignore since they only destructure `formData`).

Resolution: Cast via `createQuestion as unknown as ActionFn` where `ActionFn = (state: FormState, payload: FormData) => Promise<FormState>`. This avoids modifying `actions.ts` and keeps the cast localized to each form component.

### Auth Gate Pattern

Both `/qa/nieuwe-vraag/page.tsx` and `/qa/vraag/[id]/page.tsx` use:
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
```
This follows decision 03-01-D3 (validate JWT on server, not getSession()).

### Revalidation

- `createQuestion` calls `revalidatePath('/qa')` — refreshes Q&A overview
- `createAnswer` calls `revalidatePath('/qa')` and `revalidatePath('/qa/vraag/${question_id}')` — refreshes both pages
- `createReply` calls `revalidatePath('/qa')` — Next.js App Router revalidates all nested routes, so `/qa/vraag/[id]` also refreshes

## Decisions Made

| ID | Decision | Rationale |
|----|----------|-----------|
| 16-01-D1 | `as unknown as ActionFn` cast for useFormState with single-arg Server Actions | Safe runtime behavior; avoids modifying existing actions.ts signatures |

## Deviations from Plan

None - plan executed exactly as written.

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | AskQuestionForm + nieuwe-vraag page | d429ce1 | app/qa/nieuwe-vraag/page.tsx, components/qa/ask-question-form.tsx |
| 2 | AnswerForm + ReplyForm + detail page integration | 9c88aa6 | components/qa/answer-form.tsx, components/qa/reply-form.tsx, app/qa/vraag/[id]/page.tsx, app/qa/page.tsx |
| 3 | CHANGELOG Phase 16 entry | 55026f8 | docs/CHANGELOG.md |

## Next Phase Readiness

Phase 17 (breadcrumbs + 404 pagina) can start immediately. No blockers or concerns from this phase.
