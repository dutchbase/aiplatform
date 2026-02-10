---
phase: 11-blog-nieuws
plan: 01
subsystem: ui
tags: [nextjs, typescript, static-data, ssg, blog, server-components]

# Dependency graph
requires:
  - phase: 10-openclaw-tutorials
    provides: lib/data/tutorials.ts static data pattern and SSG tutorial pages
  - phase: 07-seo-basis
    provides: generateMetadata pattern and placeholder blog pages
provides:
  - BlogPost TypeScript interface and typed blog data module (lib/data/blog.ts)
  - Data-driven blog overview page at /blog with 3 article cards
  - SSG blog detail pages at /blog/[slug] with full content and metadata
  - docs/blog.md documentation for adding new posts
affects: [12-qa-data-model, 15-breadcrumbs, 18-content, 20-sitemap-update]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Static data module in lib/data/ for typed content (extended from tutorials pattern)
    - generateStaticParams for SSG blog detail pages
    - generateMetadata using real content fields (not slug-derived text)
    - Conditional field rendering (updatedAt only shown when present and differs from publishedAt)

key-files:
  created:
    - lib/data/blog.ts
    - docs/blog.md
  modified:
    - app/blog/page.tsx
    - app/blog/[slug]/page.tsx
    - docs/CHANGELOG.md

key-decisions:
  - "Static data module in lib/data/blog.ts mirrors lib/data/tutorials.ts pattern from Phase 10"
  - "blogPosts array sorted newest-first in data definition itself (no sort call needed at runtime)"
  - "redirect('/blog') on unknown slugs consistent with tutorials redirect pattern"
  - "updatedAt conditionally rendered only when present and differs from publishedAt"

patterns-established:
  - "lib/data/ static data pattern: interface + typed array + helper function, mirrors tutorials.ts"
  - "Blog detail page: generateStaticParams + generateMetadata + redirect-not-404 for unknown slugs"

# Metrics
duration: 4min
completed: 2026-02-10
---

# Phase 11 Plan 01: Blog & Nieuws Summary

**Static blog end-to-end: BlogPost data module, 3-column overview cards, SSG detail pages with Dutch publish dates and conditional updatedAt**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-10T15:54:37Z
- **Completed:** 2026-02-10T15:58:03Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- `lib/data/blog.ts` with BlogPost interface, 3 Dutch seed articles, and `getBlogPost()` helper — mirrors tutorials.ts pattern exactly
- Blog overview at `/blog` with responsive 3-column article cards showing title, Dutch-formatted date, excerpt, and CTA link
- Blog detail pages at `/blog/[slug]` with `generateStaticParams` (SSG for 3 slugs), `generateMetadata` using real article fields, breadcrumb, full article content, and `redirect('/blog')` for unknown slugs
- Conditional `updatedAt` display: only rendered when field is present and differs from `publishedAt`
- `docs/blog.md` with data source rationale and step-by-step instructions for adding new posts

## Task Commits

Each task was committed atomically:

1. **Task 1: Create lib/data/blog.ts** - `3e5351f` (feat)
2. **Task 2: Update app/blog/page.tsx** - `f4e8960` (feat)
3. **Task 3: Blog detail page, docs, CHANGELOG** - `bbb081c` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `lib/data/blog.ts` - BlogPost interface, 3 seed articles sorted newest-first, getBlogPost helper
- `app/blog/page.tsx` - Data-driven overview with 3-column grid, formatDate, article cards
- `app/blog/[slug]/page.tsx` - Full SSG detail page with generateStaticParams, generateMetadata, breadcrumb, conditional updatedAt, sections, footer CTA
- `docs/blog.md` - Static data source documentation and add-post instructions
- `docs/CHANGELOG.md` - Phase 11 entry prepended at top

## Decisions Made

| ID | Decision | Rationale |
|----|----------|-----------|
| 11-01-D1 | Static data module in lib/data/blog.ts mirrors tutorials.ts | Consistent pattern, no migration needed, fully typed, git-versioned |
| 11-01-D2 | blogPosts sorted newest-first in data definition | Single source of truth; no runtime sort calls needed on overview or detail |
| 11-01-D3 | redirect('/blog') for unknown slugs (not 404) | Consistent with Phase 10 tutorials pattern; better UX than error page |
| 11-01-D4 | updatedAt conditional on both presence and difference from publishedAt | Avoids showing redundant "updated" date when content hasn't changed |

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Blog section fully functional with 3 seed articles, ready for Phase 19 content expansion
- Static data pattern established and documented in docs/blog.md
- SSG routes for all 3 blog slugs confirmed in production build (28 pages total)
- Sitemap will need updating in Phase 20 to include blog detail URLs
- No blockers for Phase 12 (Q&A data model)

---
*Phase: 11-blog-nieuws*
*Completed: 2026-02-10*
