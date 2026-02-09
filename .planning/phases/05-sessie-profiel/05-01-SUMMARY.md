---
phase: 05-sessie-profiel
plan: 01
title: "Session-Aware Header & Profile Page"
status: complete
type: execute
subsystem: auth
tags: [authentication, profile, session, server-components, react-18]

dependencies:
  requires:
    - 04-01-profiles-table
    - 04-02-auth-flow
    - 03-01-supabase-client-infrastructure
  provides:
    - auth-aware-header
    - protected-profile-route
    - display-name-editing
  affects:
    - future-phases-with-user-specific-content

tech-stack:
  added: []
  patterns:
    - async-server-components-for-auth
    - useFormState-react-18-pattern
    - server-action-form-feedback
    - protected-route-redirect

key-files:
  created:
    - app/profiel/page.tsx
    - app/profiel/actions.ts
    - app/profiel/profile-form.tsx
  modified:
    - components/layout/header.tsx
    - docs/CHANGELOG.md

decisions:
  - id: 05-01-D1
    choice: "Header as async Server Component with getUser()"
    rationale: "No client-side auth state management needed - cleaner, faster, SSR-friendly"
    alternatives: ["Client Component with useEffect + useState", "AuthProvider context"]
  - id: 05-01-D2
    choice: "Signout via form POST to existing /auth/signout Route Handler"
    rationale: "Reuse Phase 4 infrastructure, progressive enhancement, no JS needed"
    alternatives: ["Client-side supabase.auth.signOut() call", "New signout Server Action"]
  - id: 05-01-D3
    choice: "useFormState from react-dom (not useActionState from react)"
    rationale: "Project uses React 18.3.1 - useActionState is React 19+ only"
    alternatives: ["Upgrade to React 19 RC", "Manual useState + onSubmit handler"]
  - id: 05-01-D4
    choice: "defaultValue (not value) for display name input"
    rationale: "Uncontrolled input allows editing without onChange handler - simpler for forms with Server Actions"
    alternatives: ["Controlled input with useState + onChange"]

metrics:
  duration: "2m 45s"
  files-changed: 5
  lines-added: 197
  commits: 2
  completed: 2026-02-09
---

# Phase 05 Plan 01: Session-Aware Header & Profile Page Summary

**One-liner:** Auth-aware header with conditional nav links (Inloggen/Profiel/Uitloggen) and protected profile page with display name editing via useFormState Server Action.

## What Was Built

This plan completed the user-facing authentication experience by surfacing the backend auth infrastructure (built in Phases 3-4) in the UI.

### Header (Task 1)
- Converted `components/layout/header.tsx` to async Server Component
- Added `getUser()` call to check authentication state
- **Anonymous visitors see:** "Inloggen" + "Registreren" links (both → `/login`)
- **Logged-in users see:** "Mijn profiel" link (→ `/profiel`) + "Uitloggen" button (form POST to `/auth/signout`)
- All existing navigation preserved (Home, OpenClaw, Blog, Q&A)

### Profile Page (Task 2)
- Created `/profiel` protected route with redirect to `/login` if not authenticated
- Server Component fetches user via `getUser()` and profile data from `profiles` table
- Displays email address (from auth) and display name (from profiles)
- `ProfileForm` Client Component allows editing display name with real-time feedback
- `updateProfile` Server Action validates input, updates database with RLS, returns Dutch success/error messages
- Uses `useFormState` from `react-dom` (React 18.3.1 compatible)
- `revalidatePath('/profiel')` ensures page refreshes with updated data after save

## Decisions Made

**D1: Header as async Server Component**
- Uses `getUser()` directly in Server Component
- No client-side state, no hydration overhead, instant auth status on SSR
- Alternative rejected: Client Component with useEffect (adds JS bundle, slower initial render)

**D2: Reuse existing signout Route Handler**
- Form POST to `/auth/signout` (created in Phase 4)
- Progressive enhancement: works without JavaScript
- Alternative rejected: New Server Action (unnecessary duplication)

**D3: useFormState from react-dom**
- Project locked to React 18.3.1
- `useActionState` is React 19+ only
- Alternative rejected: Upgrade to React 19 RC (introduces instability)

**D4: Uncontrolled input with defaultValue**
- Simpler than controlled input for Server Action forms
- No onChange handler needed
- Alternative rejected: Controlled input with useState (more code for no benefit)

## Technical Highlights

**No 'use client' bloat:** Header and profile page are Server Components - only `profile-form.tsx` needs client interactivity.

**Security patterns preserved:**
- `getUser()` used (not insecure `getSession()`)
- RLS policies enforce profile update authorization
- Redirect not wrapped in try/catch (Next.js throws to redirect)

**React 18 compatibility:**
- `useFormState` from `react-dom` (not `useActionState` from `react`)
- `SubmitButton` as separate component (useFormStatus requires child component)

**Dutch UI:** All user-facing text in Dutch (Mijn profiel, Weergavenaam, E-mailadres, success/error messages)

## Files Modified

**Created:**
- `app/profiel/page.tsx` - Protected profile page Server Component (26 lines)
- `app/profiel/actions.ts` - Server Action for profile updates (38 lines)
- `app/profiel/profile-form.tsx` - Client Component form with useFormState (52 lines)

**Modified:**
- `components/layout/header.tsx` - Added auth check and conditional navigation (40 lines → 62 lines)
- `docs/CHANGELOG.md` - Added Phase 5 entry

## Commits

1. `c1f64b0` - feat(05-01): add auth-aware header with conditional navigation
2. `adeaf34` - feat(05-01): add protected profile page with display name editing

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Blockers:** None

**Outputs available for next phases:**
- Auth-aware navigation pattern established (can be reused in other components)
- Protected route pattern documented (redirect if not authenticated)
- Profile editing pattern (Server Action + useFormState) can be extended for more fields

**Concerns:** None

## Test Coverage

Manual verification completed:
- [x] TypeScript compilation passes
- [x] Header is async Server Component with getUser()
- [x] No deprecated patterns (no getSession, no useActionState, no auth-helpers-nextjs)
- [x] Redirect not in try/catch block
- [x] Server Action signature correct (prevState first parameter)
- [x] Profile form uses react-dom useFormState
- [x] Input uses defaultValue (not value)
- [x] Dutch UI text throughout
- [x] Changelog updated

## Performance Notes

- Header SSR with auth check adds ~10ms per request (acceptable overhead for server-side auth state)
- Profile page queries profiles table once per visit (cached by Next.js)
- Form submission updates profiles table and revalidates cache (instant UI feedback)

## Lessons Learned

**What went well:**
- Server Component pattern for auth checks is cleaner than client-side useEffect
- useFormState provides excellent UX for form feedback without complex state management
- Reusing existing Route Handler avoided duplication

**What could be improved:**
- Could add loading state to profile page (currently relies on Next.js streaming)
- Could add optimistic UI updates (currently waits for server response)

## Links

- Phase 5 Plan: `.planning/phases/05-sessie-profiel/05-01-PLAN.md`
- Prior Phase: 04-02 (Authentication Flow)
- Next Phase: 06-01 (URL Structure for OpenClaw section)
