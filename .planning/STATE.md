# Project State

## Current Position

Phase: 4 of 25 (Database & Auth)
Plan: 2 of 2 (in phase)
Status: Phase complete
Last activity: 2026-02-09 - Completed 04-02-PLAN.md

Progress: [====------------------------] 16% (4/25 phases)

## Accumulated Decisions

| ID | Phase | Decision | Impact |
|----|-------|----------|--------|
| 01-01-D1 | 01 | Title template uses "AI Assistenten Hub" suffix | All future child pages inherit this pattern |
| 01-01-D2 | 01 | Dark mode via system preference only | Manual toggle deferred to Phase 5+ |
| 01-01-D3 | 01 | metadataBase uses NEXT_PUBLIC_BASE_URL env var | Production URL needed at deployment |
| 02-01-D1 | 02 | HSL color format for design tokens | Easier color variant creation than RGB |
| 02-01-D2 | 02 | darkMode: 'media' (system preference) | No script/library needed, simpler for MVP |
| 02-01-D3 | 02 | Server Components for Header/Footer | Better performance, no client JS needed |
| 02-01-D4 | 02 | Semantic token classes only | All components use bg-background, text-foreground (never raw colors) |
| 02-02-D1 | 02 | Export Button and buttonVariants | buttonVariants reusable for custom button-styled elements |
| 02-02-D2 | 02 | asChild pattern for Link composition | Avoids nested anchor tags, enables Button as Link wrapper |
| 02-02-D3 | 02 | Server Components with asChild + Link | No 'use client' needed for static navigation buttons |
| 03-01-D1 | 03 | Use @supabase/ssr (not deprecated auth-helpers-nextjs) | Future-proof Supabase integration with Next.js 14+ support |
| 03-01-D2 | 03 | Use getAll/setAll cookie methods (not get/set/remove) | Current pattern, deprecated methods will break in future versions |
| 03-01-D3 | 03 | Call auth.getUser() in middleware (not getSession()) | Validates JWT on server, getSession() is insecure |
| 03-01-D4 | 03 | Non-null assertions on Supabase env vars | Fail-fast behavior prevents silent failures |
| 03-01-D5 | 03 | No auth redirects in middleware yet | Authentication is Phase 4+, middleware only refreshes sessions |
| 03-01-D6 | 03 | Async server client factory | Next.js 14+ cookies() is async |
| 03-01-D7 | 03 | Cookie propagation on both request and response | Ensures Server Components and browser both see updated cookies |
| 04-01-D1 | 04 | CHECK constraint instead of PostgreSQL ENUM for role | Easier to modify roles later without complex migrations |
| 04-01-D2 | 04 | Use (select auth.uid()) in RLS policies | Caches result per-statement (not per-row), 20x performance improvement |
| 04-01-D3 | 04 | security definer set search_path = '' on triggers | Bypasses RLS while preventing search_path injection attacks |
| 04-01-D4 | 04 | No INSERT or DELETE RLS policies on profiles | Only trigger inserts, only cascade deletes - simpler security model |
| 04-02-D1 | 04 | formAction pattern without 'use client' | Progressive enhancement, no client JS needed for basic auth flow |
| 04-02-D2 | 04 | Single page for login and registration | Simpler UX, both actions share form fields |
| 04-02-D3 | 04 | PKCE flow via verifyOtp with token_hash | Modern, secure email confirmation pattern required by Supabase |
| 04-02-D4 | 04 | POST method for signout | Sign out is a state mutation, not a GET-safe operation |

## Blockers / Concerns

None.

## Completed Phases

| Phase | Plan | Summary | Key Output | Verified |
|-------|------|---------|------------|----------|
| 01 | 01-01 | Enhanced metadata and Dutch homepage | app/layout.tsx, app/page.tsx | ✓ 6/6 |
| 02 | 02-01 | HSL design tokens, Inter font, Header/Footer | app/globals.css, tailwind.config.ts, components/layout/ | ✓ 8/8 |
| 02 | 02-02 | Button component with 6 variants, homepage update | components/ui/button.tsx, app/page.tsx | ✓ 6/6 |
| 03 | 03-01 | Supabase client infrastructure with session middleware | lib/supabase/client.ts, lib/supabase/server.ts, middleware.ts | ✓ 10/10 |
| 04 | 04-01 | Profiles table with triggers and RLS policies | supabase/migrations/00001_profiles.sql, docs/database-schema.md | ✓ 6/6 |
| 04 | 04-02 | Authentication flow with login, signup, and email confirmation | app/login/actions.ts, app/login/page.tsx, app/auth/confirm/route.ts, app/auth/signout/route.ts | ✓ 11/11 |

## Session Continuity

Last session: 2026-02-09T18:37:00Z
Stopped at: Completed 04-02-PLAN.md (Phase 4 complete)
Resume file: None
