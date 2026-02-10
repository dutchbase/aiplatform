---
phase: 20-interne-links
plan: 01
status: complete
completed: 2026-02-10
subsystem: content-navigation
tags: [internal-links, seo, related-content, server-components]
dependency-graph:
  requires: [19-01]
  provides: [RelatedContent component, related.ts utility, cross-linked content pages]
  affects: [blog detail pages, tutorial detail pages, installation page, Q&A detail pages]
tech-stack:
  added: []
  patterns: [Server Component with props, static data filtering, cross-page internal linking]
key-files:
  created:
    - lib/data/related.ts
    - components/shared/related-content.tsx
  modified:
    - app/blog/[slug]/page.tsx
    - app/openclaw/tutorials/[slug]/page.tsx
    - app/openclaw/installatie/page.tsx
    - app/qa/vraag/[id]/page.tsx
    - docs/CHANGELOG.md
decisions:
  - RelatedContent is a pure Server Component (no 'use client') — consistent with project architecture
  - related.ts imports from static data arrays (no DB/API calls needed for MVP content)
  - Q&A "Relevante documentatie" is static (same links on every question page) — sufficient for MVP
metrics:
  duration: 3 minutes
  completed: 2026-02-10
  tasks: 3
  files: 7
---

# Phase 20 Plan 01: Interne Links Summary

## One-liner

Internal linking system with reusable RelatedContent Server Component and related.ts utilities that cross-link blog posts, tutorials, Q&A, and the installation page.

## What was built

- `lib/data/related.ts`: `getRelatedPosts(currentSlug, limit?)` and `getRelatedTutorials(currentSlug, limit?)` utility functions that filter the current slug from the static data arrays and return up to 3 (configurable) related items as `{ title, href }` objects
- `components/shared/related-content.tsx`: Pure Server Component (no 'use client') rendering a heading + link list; returns `null` when items array is empty; used for "Zie ook" and "Andere tutorials" sections
- `app/blog/[slug]/page.tsx`: "Zie ook" section integrated between article body and "Terug naar blog" footer CTA; calls `getRelatedPosts(slug)` for dynamic related post links
- `app/openclaw/tutorials/[slug]/page.tsx`: "Andere tutorials" section integrated between tutorial steps and "Terug naar overzicht" footer CTA; calls `getRelatedTutorials(slug)` for dynamic related tutorial links
- `app/openclaw/installatie/page.tsx`: Two inline body cross-links added — one to `/openclaw/tutorials/eerste-stappen` at the end of the Vereisten section, one to `/openclaw/tutorials/configuratie` at the end of the Installatie section
- `app/qa/vraag/[id]/page.tsx`: Static "Relevante documentatie" block with 4 links to OpenClaw installation and tutorial pages, added after the answer form section
- `docs/CHANGELOG.md`: Phase 20 entry prepended describing all added functionality

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| RelatedContent is a pure Server Component (no 'use client') | Consistent with project Server Components First architecture; no interactivity needed for a link list |
| related.ts imports from static data arrays | No DB/API calls needed for MVP static content; same pattern as lib/data/blog.ts and lib/data/tutorials.ts |
| Q&A "Relevante documentatie" is static (same links on every question page) | MVP scope; no per-question content classification needed; 4 core OpenClaw links are universally relevant |

## Commits

| Hash | Message |
|------|---------|
| 780ddd9 | feat(20-01): add RelatedContent component and related.ts utility, integrate on blog and tutorial detail pages |
| 31c5040 | feat(20-01): add inline cross-links on installation page |
| aab53a7 | feat(20-01): add Relevante documentatie section to Q&A detail page and update CHANGELOG |

## Deviations from Plan

None — plan executed exactly as written.

## Verification

TypeScript: Manual review confirms all files have correct types, proper imports, valid JSX, no `any` usage, and no 'use client' in Server Components. TypeScript compiler could not be invoked directly due to WSL/Windows node PATH resolution issue (same environment constraint as all previous phases — build verification requires dev server).

All artifacts present: confirmed via file reads after each task.

Link resolution check:
- `/openclaw/tutorials/eerste-stappen` — exists (lib/data/tutorials.ts slug: 'eerste-stappen')
- `/openclaw/tutorials/configuratie` — exists (lib/data/tutorials.ts slug: 'configuratie')
- `/openclaw/tutorials/tips` — exists (lib/data/tutorials.ts slug: 'tips')
- `/openclaw/installatie` — exists (app/openclaw/installatie/page.tsx)
- All blog cross-links filtered from blogPosts array — all slugs exist

## Self-Check: PASSED

Files created/modified:
- lib/data/related.ts: FOUND
- components/shared/related-content.tsx: FOUND
- app/blog/[slug]/page.tsx: FOUND (contains RelatedContent, getRelatedPosts)
- app/openclaw/tutorials/[slug]/page.tsx: FOUND (contains RelatedContent, getRelatedTutorials)
- app/openclaw/installatie/page.tsx: FOUND (contains href="/openclaw/tutorials/eerste-stappen", href="/openclaw/tutorials/configuratie")
- app/qa/vraag/[id]/page.tsx: FOUND (contains "Relevante documentatie")
- docs/CHANGELOG.md: FOUND (contains "Phase 20")

Commits:
- 780ddd9: FOUND
- 31c5040: FOUND
- aab53a7: FOUND
