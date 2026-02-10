---
phase: 18-structured-data
plan: 01
subsystem: ui
tags: [schema.org, json-ld, seo, structured-data, next.js, server-components]

# Dependency graph
requires:
  - phase: 17-breadcrumbs-404
    provides: Breadcrumbs component integrated on all sub-pages
  - phase: 11-blog
    provides: BlogPost data module with slug, title, excerpt, publishedAt, updatedAt fields
  - phase: 10-tutorials
    provides: Tutorial data module with slug, title, description, lastUpdated fields
  - phase: 15-qa-frontend
    provides: Q&A detail page with question + answersWithReplies data
provides:
  - Article JSON-LD on blog detail pages (Schema.org Article with dateModified using updatedAt when present)
  - Article JSON-LD on tutorial detail pages (Schema.org Article with lastUpdated for both date fields)
  - QAPage JSON-LD on Q&A detail pages (Schema.org QAPage with mainEntity Question and suggestedAnswer items)
  - Structured data documentation in docs/seo.md
affects: [19-content, 20-interne-links, 25-mvp-finalisatie]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline JSON-LD via dangerouslySetInnerHTML in Server Component page returns"
    - "React Fragment wrapper to accommodate script tag alongside page content div"
    - "Schema object built before return statement, after all data fetching completes"

key-files:
  created: []
  modified:
    - app/blog/[slug]/page.tsx
    - app/openclaw/tutorials/[slug]/page.tsx
    - app/qa/vraag/[id]/page.tsx
    - docs/seo.md
    - docs/CHANGELOG.md

key-decisions:
  - "Author field uses @type Organization with name 'AI Assistenten Hub' (no individual author on BlogPost or Tutorial types)"
  - "Tutorial datePublished and dateModified both use tutorial.lastUpdated (no separate publishedAt field on Tutorial type)"
  - "Blog dateModified uses updatedAt ?? publishedAt (updatedAt is optional on BlogPost)"
  - "QAPage suggestedAnswer emits empty array when no answers exist (valid Schema.org, answerCount: 0)"
  - "Script tag placed as first child of Fragment in page return, never in shared layouts"

patterns-established:
  - "JSON-LD pattern: build schema const before return, inject as first Fragment child via dangerouslySetInnerHTML"
  - "No 'use client' needed for dangerouslySetInnerHTML in Server Components"

# Metrics
duration: 10min
completed: 2026-02-10
---

# Phase 18 Plan 01: Structured Data (JSON-LD) Summary

**Schema.org JSON-LD injected on blog, tutorial, and Q&A detail pages using inline script tags in Server Components**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-02-10T19:08:55Z
- **Completed:** 2026-02-10T19:18:00Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Article JSON-LD added to `app/blog/[slug]/page.tsx` with `headline`, `description`, `datePublished`, `dateModified` (uses `updatedAt ?? publishedAt`), and `author` (Organization: AI Assistenten Hub)
- Article JSON-LD added to `app/openclaw/tutorials/[slug]/page.tsx` with `headline`, `description`, `datePublished` and `dateModified` both from `tutorial.lastUpdated`
- QAPage JSON-LD added to `app/qa/vraag/[id]/page.tsx` with `mainEntity` Question (name, text, answerCount, dateCreated) and `suggestedAnswer` array mapping each answer to an Answer item
- `docs/seo.md` updated with a dedicated "Structured Data (JSON-LD)" section including field-to-source tables, no-duplicate-scripts rule, and validation links
- `docs/CHANGELOG.md` updated with Phase 18 as the latest entry

## Task Commits

Each task was committed atomically:

1. **Task 1: Article JSON-LD on blog/[slug] and openclaw/tutorials/[slug]** - `9ecf3ae` (feat)
2. **Task 2: QAPage JSON-LD on qa/vraag/[id]** - `e98fba8` (feat)
3. **Task 3: Update docs/seo.md and docs/CHANGELOG.md** - `24ee404` (docs)

## Files Created/Modified

- `app/blog/[slug]/page.tsx` - Added Article JSON-LD schema; return wrapped in React Fragment with script tag as first child
- `app/openclaw/tutorials/[slug]/page.tsx` - Added Article JSON-LD schema; return wrapped in React Fragment with script tag as first child
- `app/qa/vraag/[id]/page.tsx` - Added QAPage JSON-LD schema built from question and answersWithReplies; return wrapped in React Fragment
- `docs/seo.md` - Added "Structured Data (JSON-LD)" section with Article and QAPage tables; updated Future Enhancements bullet; updated Last Updated to Phase 18
- `docs/CHANGELOG.md` - Prepended Phase 18 entry as the latest changelog entry

## Decisions Made

| ID | Decision | Rationale |
|----|----------|-----------|
| 18-01-D1 | Author uses `@type: Organization` with `name: 'AI Assistenten Hub'` | No individual author fields exist on BlogPost or Tutorial types; Organization is accurate for a platform |
| 18-01-D2 | Tutorial uses `tutorial.lastUpdated` for both `datePublished` and `dateModified` | Tutorial type has only `lastUpdated` (no `publishedAt`/`updatedAt`); both date fields use the same value |
| 18-01-D3 | Blog `dateModified` uses `updatedAt ?? publishedAt` | `updatedAt` is optional on BlogPost; fallback to `publishedAt` ensures `dateModified` is always present |
| 18-01-D4 | QAPage `suggestedAnswer` emits empty array when no answers | Valid Schema.org: `answerCount: 0`, `suggestedAnswer: []`; no conditional omission of script tag |
| 18-01-D5 | Script tag as first Fragment child, never in shared layouts | Prevents duplicate JSON-LD blocks; each page controls its own structured data exactly once |

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three major content page types now emit Schema.org JSON-LD eligible for Google rich results
- Structured data validation can be done at https://search.google.com/test/rich-results and https://validator.schema.org/
- Phase 19 (content) can add new blog/tutorial posts and they will automatically inherit Article JSON-LD
- Phase 20 (internal links) can proceed without any structured data concerns

---
*Phase: 18-structured-data*
*Completed: 2026-02-10*
