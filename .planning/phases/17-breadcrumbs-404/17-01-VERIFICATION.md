---
phase: 17-breadcrumbs-404
verified: 2026-02-10T00:00:00Z
status: passed
score: 9/9 must-haves verified
re_verification: false
---

# Phase 17: Breadcrumbs en 404 Verification Report

**Phase Goal:** Create a reusable Breadcrumbs component, integrate it on all relevant sub-pages, and add a custom 404 not-found page. This fulfills PRD requirement 4.4 (breadcrumbs on sub-pages) and provides a professional user experience for navigation errors.
**Verified:** 2026-02-10
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | Breadcrumbs visible on all 10 sub-pages | VERIFIED | All 10 pages import and render `<Breadcrumbs items={[...]} />` confirmed in source |
| 2  | Last breadcrumb item is plain text (no link), preceding items are clickable links | VERIFIED | Component logic: `isLast` renders `<span aria-current="page">`, all others render `<Link>` |
| 3  | Breadcrumb nav element has aria-label='Breadcrumb' | VERIFIED | `<nav aria-label="Breadcrumb">` at line 14 of breadcrumbs.tsx |
| 4  | Last breadcrumb item has aria-current='page' | VERIFIED | `aria-current={isLast ? 'page' : undefined}` at line 28 of breadcrumbs.tsx |
| 5  | Separator character is aria-hidden | VERIFIED | `<span aria-hidden="true">` wraps `›` at line 21 of breadcrumbs.tsx |
| 6  | Dynamic pages show actual content title as last crumb | VERIFIED | tutorials/[slug] uses `tutorial.title` (line 58), blog/[slug] uses `post.title` (line 56), qa/vraag/[id] uses `question.title` (line 48) |
| 7  | 404 page renders with friendly Dutch message and links to home, /openclaw, /blog, /qa | VERIFIED | app/not-found.tsx: "Pagina niet gevonden" heading, Link href="/" (line 28), links to /openclaw (36), /blog (39), /qa (42), /ai-assistenten (45) |
| 8  | CHANGELOG updated with Phase 17 entry | VERIFIED | docs/CHANGELOG.md line 10: `## [Phase 17] - 2026-02-10 - Breadcrumbs en 404` (topmost phase entry, above Phase 16) |
| 9  | docs/seo.md contains Breadcrumbs section and 404 Pagina section | VERIFIED | seo.md line 238: `## Breadcrumbs`, line 260: `## 404 Pagina`; Last Updated updated to Phase 17 (line 266) |

**Score:** 9/9 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components/ui/breadcrumbs.tsx` | Reusable Breadcrumbs Server Component; exports Breadcrumbs + BreadcrumbItem; min 25 lines | VERIFIED | 46 lines, named exports confirmed, no 'use client', no stub patterns |
| `app/not-found.tsx` | Custom 404 page containing "Pagina niet gevonden"; min 20 lines | VERIFIED | 52 lines, "Pagina niet gevonden" at line 19, no 'use client', no stub patterns |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/openclaw/tutorials/[slug]/page.tsx` | `components/ui/breadcrumbs.tsx` | `import { Breadcrumbs } from '@/components/ui/breadcrumbs'` | WIRED | Import confirmed at line 7; `<Breadcrumbs>` rendered at line 55 with dynamic `tutorial.title` |
| `app/qa/vraag/[id]/page.tsx` | `components/ui/breadcrumbs.tsx` | `import { Breadcrumbs } from '@/components/ui/breadcrumbs'` | WIRED | Import confirmed at line 8; `<Breadcrumbs>` rendered at line 46 with dynamic `question.title` |
| `app/not-found.tsx` | `app/page.tsx (home)` | `Link href="/"` | WIRED | Link href="/" confirmed at line 28 with "Terug naar home" label |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| PRD 4.4 — Breadcrumbs on sub-pages | SATISFIED | Breadcrumbs on all 10 sub-pages with correct accessibility markup |
| Professional 404 experience | SATISFIED | Dutch-language 404 with navigation links to all main sections |

### Anti-Patterns Found

None. No TODO/FIXME/placeholder comments, no stub returns (return null/{}), no 'use client' in either Server Component, no raw Tailwind color classes in primary artifacts.

### Human Verification Required

The following items require a browser to fully confirm but are supported by structural evidence:

#### 1. Breadcrumb rendering at runtime

**Test:** Visit `/openclaw/installatie` in a browser
**Expected:** Breadcrumb shows "OpenClaw" (as clickable link) followed by "›" separator followed by "Installatie" (plain text, no link)
**Why human:** Visual rendering and link interactivity cannot be confirmed programmatically

#### 2. 404 page triggers on unmatched routes

**Test:** Navigate to `/deze-pagina-bestaat-niet` in a browser
**Expected:** Custom 404 page with "Pagina niet gevonden" heading renders (not Next.js default 404)
**Why human:** Next.js route matching and not-found.tsx invocation requires a running server

#### 3. Dynamic breadcrumb title on Q&A detail

**Test:** Navigate to a valid Q&A question detail page
**Expected:** Breadcrumb shows "Q&A" (link) › "[actual question title]" (plain text)
**Why human:** Requires a live Supabase connection to fetch a real question record

### Gaps Summary

No gaps. All 9 must-have truths verified against the actual codebase. Both required artifacts exist, are substantive (46 and 52 lines respectively), and are wired into all 10 consumer pages. Old inline `<nav aria-label="Kruimelpad">` blocks have been removed from both `tutorials/[slug]` and `blog/[slug]` (grep confirms zero remaining matches). Accessibility requirements (aria-label, aria-current, aria-hidden) are implemented exactly as specified. CHANGELOG and seo.md documentation is present and correct.

---

_Verified: 2026-02-10_
_Verifier: Claude (gsd-verifier)_
