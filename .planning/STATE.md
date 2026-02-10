# Project State

## Current Position

Phase: 20 of 25 (Interne Links) - COMPLETE (next: Phase 21)
Plan: 1 of 1 (in phase)
Status: Phase 20 complete; Phase 21 (Moderatie Basis) planned, ready for execution
Last activity: 2026-02-10 - Completed 20-01-PLAN.md (RelatedContent component, related.ts utility, blog/tutorial/qa/installatie cross-links)

Progress: [====================----------] 84% (21/25 phases complete)

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
| 05-01-D1 | 05 | Header as async Server Component with getUser() | No client-side auth state management needed - cleaner, faster, SSR-friendly |
| 05-01-D2 | 05 | Signout via form POST to existing /auth/signout Route Handler | Reuse Phase 4 infrastructure, progressive enhancement, no JS needed |
| 05-01-D3 | 05 | useFormState from react-dom (not useActionState from react) | Project uses React 18.3.1 - useActionState is React 19+ only |
| 05-01-D4 | 05 | defaultValue (not value) for display name input | Uncontrolled input allows editing without onChange handler - simpler for forms with Server Actions |
| 06-01-D1 | 06 | Dynamic params as Promise pattern | Next.js 14+ requires async params for dynamic routes |
| 06-01-D2 | 06 | Server Components for all routes | Static content pages don't need client-side JavaScript - better performance and SEO |
| 06-01-D3 | 06 | Consistent placeholder messaging pattern | Dutch "komt binnenkort" messaging maintains professional tone |
| 06-02-D1 | 06 | Navigation order prioritizes OpenClaw then broader categories | OpenClaw primary focus per PRD, followed by broader categories (AI Assistenten, Q&A, Blog, Kennisbank) |
| 07-01-D1 | 07 | No openGraph on child pages - inherited from root layout | Avoids duplication and potential conflicts, root layout openGraph applies automatically |
| 07-01-D2 | 07 | Blog slug title capitalization: split/capitalize pattern | Produces readable titles (e.g. "Mijn Blog Artikel") from URL slugs ("mijn-blog-artikel") |
| 08-01-D1 | 08 | Sitemap includes all 14 live routes (Phase 06 already complete) | Sitemap reflects actual routes; will expand with dynamic content in later phases |
| 08-01-D2 | 08 | Login page included in sitemap at priority 0.3 | Low priority signals minor importance; aids discovery |
| 08-01-D3 | 08 | Dynamic routes excluded from sitemap (no data yet) | Will expand when blog/qa/tutorial content is available |
| 09-01-D1 | 09 | Navigation cards use div wrapper with Button asChild inside | Provides clear CTA affordance while preserving accessibility and asChild pattern |
| 09-01-D2 | 09 | Placeholder sections use notice boxes (bg-accent/30) | Visually distinguishes structural placeholders from real content for Phase 19 content editors |
| 09-02-D1 | 09 | Server Component for OpenClawNav using currentPath prop | Avoids 'use client' - Server-Components-first architecture maintained |
| 09-02-D2 | 09 | Active tab uses -mb-px to create flush border indicator | Clean tab indicator without double-border visual artifact |
| 09-02-D3 | 09 | Header unchanged - already correct for OpenClaw prominence | Task 3 was verification-only; href=/openclaw with label "OpenClaw" already in place |
| 10-01-D1 | 10 | Static data module in lib/data/ for typed content | Separates data from presentation; makes Phase 19 content updates straightforward without CMS |
| 10-01-D2 | 10 | generateStaticParams for SSG tutorial detail pages | Pre-renders 3 slug pages at build time - faster, no server round-trip needed |
| 10-01-D3 | 10 | redirect() over notFound() for unknown slugs | Better UX - lands user on working page rather than 404 |
| 10-01-D4 | 10 | OpenClawNav on tutorial detail pages too | Maintains section context for users navigating between tutorials and other OpenClaw sections |
| 11-01-D1 | 11 | Static data module in lib/data/blog.ts mirrors tutorials.ts | Consistent pattern, no migration needed, fully typed, git-versioned |
| 11-01-D2 | 11 | blogPosts sorted newest-first in data definition | Single source of truth; no runtime sort calls needed on overview or detail |
| 11-01-D3 | 11 | redirect('/blog') for unknown slugs (not 404) | Consistent with Phase 10 tutorials pattern; better UX than error page |
| 11-01-D4 | 11 | updatedAt conditional on both presence and difference from publishedAt | Avoids showing redundant "updated" date when content hasn't changed |
| 12-01-D1 | 12 | Native Response constructor (not NextResponse) for RSS Route Handler | Works correctly for non-JSON content types; no next/server import needed |
| 12-01-D2 | 12 | Use post.excerpt field (BlogPost uses excerpt, not description) | Matches actual BlogPost interface field name from lib/data/blog.ts |
| 12-01-D3 | 12 | Production domain as NEXT_PUBLIC_BASE_URL fallback (not localhost) | Committed feed XML references real domain; localhost would be wrong in production |
| 14-01-D1 | 14 | Manual validation instead of Zod (not in package.json) | Identical constraint behavior without new dependency; future phases may add zod if needed |
| 14-01-D2 | 14 | Read functions throw on DB error; actions return { error } | Idiomatic split: Server Components handle thrown errors via error.tsx; actions return safe discriminated unions |
| 14-01-D3 | 14 | UUID regex validation for foreign key inputs in actions | Validates question_id/answer_id before DB insert without Zod |
| 15-01-D1 | 15 | profiles JOIN added to all four Q&A query functions | Consistent author name availability; avoids partial coverage surprises |
| 15-01-D2 | 15 | Promise.all for per-answer reply fetching | Parallel DB calls (O(1) latency) vs sequential O(n) |
| 15-01-D3 | 15 | &middot; HTML entity for author/date separator in JSX | JSX best practice for special characters |
| 16-01-D1 | 16 | `as unknown as ActionFn` cast for useFormState with single-arg Server Actions | Safe runtime; avoids modifying actions.ts signatures; cast localized to form components |
| 17-01-D1 | 17 | Section-relative breadcrumbs (no Home crumb) per PRD 4.4 style | Concise crumbs; Home always accessible via header nav |
| 17-01-D2 | 17 | › separator with aria-hidden on all breadcrumbs | Screen reader friendly; consistent visual separator |
| 17-01-D3 | 17 | Named exports only on Breadcrumbs component (no default export) | Both Breadcrumbs and BreadcrumbItem importable together |
| 18-01-D1 | 18 | Author uses @type Organization with name 'AI Assistenten Hub' | No individual author fields on BlogPost or Tutorial types; Organization is accurate for a platform |
| 18-01-D2 | 18 | Tutorial uses tutorial.lastUpdated for both datePublished and dateModified | Tutorial type has only lastUpdated (no publishedAt/updatedAt) |
| 18-01-D3 | 18 | Blog dateModified uses updatedAt ?? publishedAt | updatedAt is optional on BlogPost; fallback ensures dateModified always present |
| 18-01-D4 | 18 | QAPage suggestedAnswer emits empty array when no answers | Valid Schema.org: answerCount: 0, suggestedAnswer: []; no conditional omission of script tag |
| 18-01-D5 | 18 | JSON-LD script tag as first Fragment child, never in shared layouts | Prevents duplicate JSON-LD blocks; each page controls its own structured data exactly once |
| 20-01-D1 | 20 | RelatedContent is a pure Server Component (no 'use client') | Consistent with project Server Components First architecture; no interactivity needed for a link list |
| 20-01-D2 | 20 | related.ts imports from static data arrays | No DB/API calls needed for MVP static content; same pattern as lib/data/blog.ts and lib/data/tutorials.ts |
| 20-01-D3 | 20 | Q&A "Relevante documentatie" is static (same links on every question page) | MVP scope; no per-question content classification needed; 4 core OpenClaw links are universally relevant |

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
| 05 | 05-01 | Session-aware header and protected profile page | components/layout/header.tsx, app/profiel/ | ✓ 12/12 |
| 06 | 06-01 | Complete URL structure with 15 functional routes | app/openclaw/, app/ai-assistenten/, app/qa/, app/blog/, app/kennisbank/ | ✓ 9/9 |
| 06 | 06-02 | Header navigation with complete site structure | components/layout/header.tsx | ✓ 9/9 |
| 07 | 07-01 | SEO metadata on all 15 route pages with unique Dutch titles and descriptions | app/openclaw/, app/ai-assistenten/, app/qa/, app/blog/, app/kennisbank/ | ✓ 10/10 |
| 07 | 07-02 | SEO documentation in docs/seo.md and CHANGELOG updated for Phase 7 completion | docs/seo.md, docs/CHANGELOG.md | ✓ 2/2 |
| 08 | 08-01 | Dynamic sitemap (14 URLs), robots.txt, canonical URLs on 3 pages | app/sitemap.ts, app/robots.ts, app/page.tsx, app/login/page.tsx, app/profiel/page.tsx | ✓ 3/3 |
| 09 | 09-01 | OpenClaw overview page with 4-card navigation and installation guide with 3 sections | app/openclaw/page.tsx, app/openclaw/installatie/page.tsx | ✓ 9/9 |
| 09 | 09-02 | OpenClawNav component with active states integrated into overview and installation pages | components/openclaw/openclaw-nav.tsx, app/openclaw/page.tsx, app/openclaw/installatie/page.tsx | ✓ 9/9 |
| 10 | 10-01 | Tutorials data module + overview page + SSG detail pages with 3 slugs | lib/data/tutorials.ts, app/openclaw/tutorials/page.tsx, app/openclaw/tutorials/[slug]/page.tsx | ✓ 6/6 |
| 11 | 11-01 | Blog data module + overview cards + SSG detail pages with 3 slugs | lib/data/blog.ts, app/blog/page.tsx, app/blog/[slug]/page.tsx, docs/blog.md | ✓ 9/9 |
| 12 | 12-01 | RSS 2.0 feed at /feed.xml + alternate link in root layout + docs | app/feed.xml/route.ts, app/layout.tsx, docs/rss.md | ✓ 2/2 |
| 13 | 13-01 | Q&A database schema: questions, answers, answer_replies with RLS, triggers, indexes | supabase/migrations/00002_qa_schema.sql, docs/database-schema.md | ✓ 2/2 |
| 14 | 14-01 | Q&A API layer: typed read functions, authenticated Server Actions, API contract docs | lib/qa/types.ts, lib/qa/queries.ts, app/qa/actions.ts, docs/qa.md | ✓ 3/3 |
| 15 | 15-01 | Q&A frontend: overview page with question list, detail page with answer/reply hierarchy, profiles JOIN | app/qa/page.tsx, app/qa/vraag/[id]/page.tsx, lib/qa/queries.ts, lib/qa/types.ts | ✓ 3/3 |
| 16 | 16-01 | Q&A write forms: ask-question page, AskQuestionForm, AnswerForm, ReplyForm with auth gates | app/qa/nieuwe-vraag/page.tsx, components/qa/ask-question-form.tsx, components/qa/answer-form.tsx, components/qa/reply-form.tsx | ✓ 3/3 |
| 17 | 17-01 | Breadcrumbs component + 404 not-found page integrated on 10 sub-pages | components/ui/breadcrumbs.tsx, app/not-found.tsx, 10 page files, docs/seo.md, docs/CHANGELOG.md | ✓ 3/3 |
| 18 | 18-01 | Schema.org JSON-LD on blog detail (Article), tutorial detail (Article), and Q&A detail (QAPage) pages | app/blog/[slug]/page.tsx, app/openclaw/tutorials/[slug]/page.tsx, app/qa/vraag/[id]/page.tsx, docs/seo.md, docs/CHANGELOG.md | ✓ 3/3 |
| 19 | 19-01 | Full Dutch editorial content for OpenClaw installation page and all 3 tutorials (4 steps each); no placeholders remain | app/openclaw/installatie/page.tsx, lib/data/tutorials.ts, docs/CHANGELOG.md | ✓ 6/6 |
| 20 | 20-01 | Internal linking: RelatedContent Server Component + related.ts utilities + cross-links on blog/tutorial/qa/installatie pages | lib/data/related.ts, components/shared/related-content.tsx, 4 page files, docs/CHANGELOG.md | ✓ 7/7 |

## Session Continuity

Last session: 2026-02-10T20:17:00Z
Stopped at: Completed 20-01-PLAN.md (RelatedContent component, related.ts utility, blog/tutorial/qa/installatie cross-links)
Resume file: None
