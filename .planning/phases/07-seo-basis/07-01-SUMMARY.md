---
phase: 07-seo-basis
plan: 01
subsystem: ui
tags: [next.js, seo, metadata, open-graph, typescript]

# Dependency graph
requires:
  - phase: 06-url-structuur-routing
    provides: 15 functional route pages with basic metadata stubs
  - phase: 01-metadata-homepage
    provides: Root layout with title template and Open Graph foundation
provides:
  - Comprehensive SEO metadata on all 15 route pages
  - Unique Dutch titles and descriptions for every page
  - Dynamic generateMetadata for slug/id-based routes
  - Full title template inheritance from root layout
affects: [08-openclaw-sectie, 09-blog-news, 10-qa-data-model, breadcrumbs, structured-data]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Static metadata: export const metadata with title and description per page
    - Dynamic metadata: generateMetadata async function with awaited params
    - Title template inheritance from root layout (no openGraph duplication on children)
    - Blog slug title transformation: split('-').map(capitalize).join(' ')

key-files:
  created: []
  modified:
    - app/openclaw/page.tsx
    - app/openclaw/installatie/page.tsx
    - app/openclaw/tutorials/page.tsx
    - app/openclaw/tutorials/[slug]/page.tsx
    - app/openclaw/use-cases/page.tsx
    - app/openclaw/nieuws/page.tsx
    - app/ai-assistenten/page.tsx
    - app/ai-assistenten/cursor/page.tsx
    - app/ai-assistenten/claude-code/page.tsx
    - app/ai-assistenten/overzicht/page.tsx
    - app/qa/page.tsx
    - app/qa/vraag/[id]/page.tsx
    - app/blog/page.tsx
    - app/blog/[slug]/page.tsx
    - app/kennisbank/page.tsx

key-decisions:
  - "No openGraph on child pages - inherited from root layout to avoid duplication"
  - "Blog [slug] title uses split/capitalize pattern for readable titles from URL slugs"
  - "Dynamic pages use generateMetadata with blank line before return for consistency"

patterns-established:
  - "Static metadata: import type Metadata, export const metadata before default export"
  - "Dynamic metadata: generateMetadata with Promise<Metadata> return type"
  - "Description length: 1-2 Dutch sentences, descriptive, unique per page"
  - "Title inheritance: root template '%s | AI Assistenten Hub' applies to all children"

# Metrics
duration: 2min
completed: 2026-02-10
---

# Phase 7 Plan 01: SEO Basis Summary

**Comprehensive Dutch SEO metadata added to all 15 route pages with unique titles, detailed descriptions, and dynamic generateMetadata for slug/id-based pages**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-10T07:00:07Z
- **Completed:** 2026-02-10T07:03:01Z
- **Tasks:** 2/2
- **Files modified:** 15

## Accomplishments
- Enhanced all 15 route pages with comprehensive, unique Dutch metadata descriptions
- Updated 3 dynamic pages (tutorials/[slug], qa/vraag/[id], blog/[slug]) with improved generateMetadata
- Blog [slug] title transformer now capitalizes each word for readable titles
- Zero duplicate titles across entire application
- TypeScript compiles without errors across all 15 updated pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Add metadata to OpenClaw section pages** - `373e4aa` (feat)
2. **Task 2: Add metadata to remaining section pages** - `d26c6c4` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

**OpenClaw section (6 pages updated):**
- `app/openclaw/page.tsx` - Updated description with tutorials and handleidingen detail
- `app/openclaw/installatie/page.tsx` - Updated description with system configuration detail
- `app/openclaw/tutorials/page.tsx` - Updated description with use cases mention
- `app/openclaw/tutorials/[slug]/page.tsx` - Updated generateMetadata description template
- `app/openclaw/use-cases/page.tsx` - Updated description with ontwikkelsituaties detail
- `app/openclaw/nieuws/page.tsx` - Updated description with AI-assistenten scope

**AI Assistenten section (4 pages updated):**
- `app/ai-assistenten/page.tsx` - Updated description with features/mogelijkheden detail
- `app/ai-assistenten/cursor/page.tsx` - Updated description with GPT-4 integration mention
- `app/ai-assistenten/claude-code/page.tsx` - Updated description with Anthropic attribution
- `app/ai-assistenten/overzicht/page.tsx` - Updated description with features/prijs/gebruik

**Q&A section (2 pages updated):**
- `app/qa/page.tsx` - Updated description with community-driven angle
- `app/qa/vraag/[id]/page.tsx` - Updated generateMetadata with community reference

**Blog section (2 pages updated):**
- `app/blog/page.tsx` - Updated description with development trends and tips
- `app/blog/[slug]/page.tsx` - Updated generateMetadata with capitalize transformer and richer description

**Kennisbank (1 page updated):**
- `app/kennisbank/page.tsx` - Updated description with handleidingen and referentiemateriaal

## Decisions Made

**07-01-D1: No openGraph on individual pages**
- Child pages do not duplicate openGraph metadata
- Rationale: Root layout openGraph is inherited by Next.js, adding again creates redundancy and potential conflicts
- Applied to: All 15 section pages

**07-01-D2: Blog slug title capitalization pattern**
- `slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')`
- Rationale: Produces readable titles like "Mijn Blog Artikel" from slugs like "mijn-blog-artikel"
- Previous approach `slug.replace(/-/g, ' ')` left lowercase, less title-appropriate

## Deviations from Plan

None - plan executed exactly as written. All 15 pages already had metadata stubs from Phase 6 (06-01), so this phase upgraded descriptions to the comprehensive versions specified in the plan.

## Issues Encountered

None - all updates applied cleanly, TypeScript compilation successful, no runtime errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 15 route pages now have SEO-ready metadata with unique titles and descriptions
- Title template (`%s | AI Assistenten Hub`) inherited from root layout on all pages
- Open Graph data inherited from root layout for social sharing
- Ready for Phase 7-02: breadcrumbs and structured data
- Ready for Phase 8+: actual content population with real metadata when content exists

**Readiness checklist:**
- [x] All 13 static pages have `export const metadata` with unique title + description
- [x] All 3 dynamic pages use `generateMetadata` with async params
- [x] No duplicate titles across entire application
- [x] All descriptions are 1-2 Dutch sentences, unique per page
- [x] TypeScript compilation passes with no errors
- [x] Title template inheritance confirmed from root layout
- [x] Open Graph inherited from root (no duplication on child pages)

---
*Phase: 07-seo-basis*
*Completed: 2026-02-10*
