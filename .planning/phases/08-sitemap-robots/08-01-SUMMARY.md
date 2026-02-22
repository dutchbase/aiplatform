---
phase: 08-sitemap-robots
plan: 01
subsystem: seo
tags: [sitemap, robots, canonical, seo, next.js, metadata]

dependency-graph:
  requires: [phase-01-nextjs-app-basis, phase-06-url-structuur, phase-07-seo-basis]
  provides: [sitemap-xml, robots-txt, canonical-urls]
  affects: [phase-09-openclaw-sectie, phase-20-production-ready]

tech-stack:
  added: []
  patterns:
    - "Next.js 14 MetadataRoute.Sitemap for /sitemap.xml generation"
    - "Next.js 14 MetadataRoute.Robots for /robots.txt generation"
    - "Metadata API alternates.canonical pattern for canonical URLs"
    - "NEXT_PUBLIC_BASE_URL env var for absolute URL construction"

file-tracking:
  key-files:
    created:
      - app/sitemap.ts
      - app/robots.ts
    modified:
      - app/page.tsx
      - app/login/page.tsx
      - app/profiel/page.tsx

decisions:
  - id: "08-01-D1"
    description: "Include all 14 static routes in sitemap including Phase 06 routes already implemented"
    rationale: "Phase 06 (URL structure) was already complete - sitemap reflects all live routes, not just the 3 originally planned"
  - id: "08-01-D2"
    description: "Login page included in sitemap at priority 0.3"
    rationale: "Low priority but still indexable; helps discovery and provides canonical reference"
  - id: "08-01-D3"
    description: "Dynamic routes ([slug], [id]) excluded from sitemap"
    rationale: "No actual data exists yet; will be added dynamically when blog/qa/tutorials data is available in later phases"

metrics:
  duration: "~2 minutes"
  completed: "2026-02-10"
  tasks: 3/3
---

# Phase 8 Plan 01: Sitemap and Robots Summary

**One-liner:** Dynamic sitemap (14 URLs) and robots.txt via Next.js 14 MetadataRoute API, plus canonical URL metadata on all existing pages.

## What Was Done

### Task 1: Implement dynamic sitemap (`app/sitemap.ts`)

Created `app/sitemap.ts` using Next.js 14's `MetadataRoute.Sitemap` type. Next.js automatically serves this at `/sitemap.xml`.

**All 14 routes included:**

| URL | changeFrequency | priority |
|-----|----------------|----------|
| / | weekly | 1.0 |
| /openclaw | weekly | 0.8 |
| /openclaw/tutorials | weekly | 0.7 |
| /openclaw/installatie | monthly | 0.6 |
| /openclaw/use-cases | weekly | 0.6 |
| /openclaw/nieuws | weekly | 0.6 |
| /blog | weekly | 0.8 |
| /qa | weekly | 0.8 |
| /ai-assistenten | monthly | 0.8 |
| /ai-assistenten/cursor | monthly | 0.6 |
| /ai-assistenten/claude-code | monthly | 0.6 |
| /ai-assistenten/overzicht | monthly | 0.6 |
| /kennisbank | weekly | 0.7 |
| /login | monthly | 0.3 |

**Dynamic routes excluded:** `/openclaw/tutorials/[slug]`, `/qa/vraag/[id]`, `/blog/[slug]` - no data exists yet.

### Task 2: Implement robots.txt (`app/robots.ts`)

Created `app/robots.ts` using Next.js 14's `MetadataRoute.Robots` type. Next.js automatically serves this at `/robots.txt`.

**Configuration:**
- `userAgent: '*'` - applies to all crawlers
- `allow: '/'` - full site access
- `disallow: ['/api/']` - prevents API route indexing
- `sitemap: ${baseUrl}/sitemap.xml` - links to sitemap for crawler discovery

### Task 3: Add canonical URLs to existing pages

Added `alternates.canonical` to metadata in all 3 existing pages:

- `app/page.tsx` - Added full metadata export with `canonical: '/'`
- `app/login/page.tsx` - Added `canonical: '/login'` to existing metadata
- `app/profiel/page.tsx` - Added `canonical: '/profiel'` to existing metadata

Combined with `metadataBase` in `app/layout.tsx`, Next.js converts relative canonical paths to absolute URLs (e.g., `http://localhost:3000/login`).

## Commits

| Commit | Type | Description |
|--------|------|-------------|
| `8091a63` | feat | Implement dynamic sitemap with 14 routes |
| `b27e915` | feat | Implement robots.txt configuration |
| `4e97458` | feat | Add canonical URLs to home, login, and profiel pages |

## Deviations from Plan

### Auto-applied context update

**Found during:** Task 1

**Context:** The plan frontmatter stated "Current routes: /, /login, /profiel" and listed Phase 06 routes as "Planned (not yet implemented)". However, Phase 06 was fully completed before this plan executed (see STATE.md - Phase 6 complete with all routes).

**Action:** Included all 14 live routes in the sitemap instead of just the 9 originally planned. This is the correct behavior - sitemap should reflect actual live routes.

**Files modified:** `app/sitemap.ts`

No other deviations - plan executed correctly with updated route count.

## How to Verify Locally

1. Start dev server: `npm run dev` (or `pnpm dev`)

2. Verify sitemap XML:
   ```
   curl http://localhost:3000/sitemap.xml
   ```
   Expected: Valid XML with `<urlset>` containing 14 `<url>` entries

3. Verify robots.txt:
   ```
   curl http://localhost:3000/robots.txt
   ```
   Expected:
   ```
   User-agent: *
   Allow: /
   Disallow: /api/

   Sitemap: http://localhost:3000/sitemap.xml
   ```

4. Verify canonical URLs (view page source or curl):
   ```
   curl http://localhost:3000 | grep canonical
   curl http://localhost:3000/login | grep canonical
   ```
   Expected: `<link rel="canonical" href="http://localhost:3000/..."/>`

## How to Add New Routes to Sitemap (Future Phases)

### Static routes (Phase 09+)

Add entries to the array in `app/sitemap.ts`:

```typescript
{
  url: `${baseUrl}/nieuwe-route`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.7,
},
```

### Dynamic routes (when data exists)

For blog posts, Q&A questions, or tutorials - fetch from database and map to entries:

```typescript
// Example for future blog posts
const posts = await db.query.blogPosts.findMany({ ... })
const blogEntries = posts.map(post => ({
  url: `${baseUrl}/blog/${post.slug}`,
  lastModified: post.updatedAt,
  changeFrequency: 'monthly' as const,
  priority: 0.6,
}))

return [...staticRoutes, ...blogEntries]
```

This pattern keeps the sitemap current with actual content without manual updates.

## Decisions Made

| ID | Decision | Rationale |
|----|----------|-----------|
| 08-01-D1 | Sitemap includes all 14 live routes (Phase 06 already complete) | Reflect actual live routes, not just originally planned 3+9 |
| 08-01-D2 | Login page included in sitemap at priority 0.3 | Discovery and canonical reference, low priority signals minor importance |
| 08-01-D3 | Dynamic routes excluded (no data yet) | Will expand when blog/qa/tutorial content is available |

## Verification Results

- TypeScript: Compiles without errors (`npx tsc --noEmit` passes)
- sitemap.ts: 14 routes, proper MetadataRoute.Sitemap types
- robots.ts: Allow + Disallow rules, sitemap reference
- Canonical URLs: All 3 pages have `alternates.canonical` in metadata
- No breaking changes to existing functionality

## Next Phase Readiness

Phase 9 (OpenClaw sectie) can proceed. SEO infrastructure is complete:
- Sitemap auto-updates when static routes are added
- Robots.txt grants full crawler access except /api/
- Canonical URLs prevent duplicate content issues
- When dynamic content (blog/qa) is added, sitemap.ts dynamic pattern is ready for expansion

No blockers or concerns.
