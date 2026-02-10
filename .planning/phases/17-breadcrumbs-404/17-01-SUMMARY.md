---
phase: 17-breadcrumbs-404
plan: "01"
subsystem: ui
tags: [nextjs, server-components, breadcrumbs, 404, typescript, dutch, accessibility, seo]
one-liner: "Reusable Breadcrumbs Server Component integrated on 10 sub-pages + custom 404 not-found page with Dutch navigation links"

dependency-graph:
  requires:
    - phase 02 (Button component and semantic token system)
    - phase 06 (URL structure: all routes that receive breadcrumbs)
    - phase 10 (tutorials data for dynamic breadcrumb titles)
    - phase 11 (blog data for dynamic breadcrumb titles)
    - phase 15 (Q&A frontend with question.title for breadcrumb)
    - phase 16 (Q&A forms, provides full Q&A page structure)
  provides:
    - components/ui/breadcrumbs.tsx (reusable Breadcrumbs Server Component)
    - app/not-found.tsx (custom 404 page)
    - Breadcrumb nav on all 10 content sub-pages
  affects:
    - phase 18 (18-structured-data): breadcrumb component ready for BreadcrumbList JSON-LD structured data

tech-stack:
  added: []
  patterns:
    - "Server Component-only breadcrumbs (no 'use client')"
    - "aria-hidden separator for screen reader accessibility"
    - "aria-current='page' on last breadcrumb item"
    - "Next.js built-in not-found.tsx mechanism"
    - "Button asChild + Link composition for 404 navigation"

key-files:
  created:
    - components/ui/breadcrumbs.tsx
    - app/not-found.tsx
    - .planning/phases/17-breadcrumbs-404/17-01-SUMMARY.md
  modified:
    - app/openclaw/page.tsx
    - app/openclaw/installatie/page.tsx
    - app/openclaw/tutorials/page.tsx
    - app/openclaw/tutorials/[slug]/page.tsx
    - app/blog/page.tsx
    - app/blog/[slug]/page.tsx
    - app/qa/page.tsx
    - app/qa/vraag/[id]/page.tsx
    - app/ai-assistenten/page.tsx
    - app/kennisbank/page.tsx
    - docs/seo.md
    - docs/CHANGELOG.md

decisions:
  - id: 17-01-D1
    decision: "Section-relative breadcrumbs (no Home crumb) per PRD 4.4 style"
    rationale: "Keeps crumbs concise; Home is always accessible via header nav"
    impact: "All 10 pages start breadcrumbs from section root (e.g., 'OpenClaw', not 'Home > OpenClaw')"
  - id: 17-01-D2
    decision: "› (right angle quotation mark) as separator, aria-hidden"
    rationale: "Cleaner than / slash; aria-hidden prevents screen readers from announcing the separator"
    impact: "Consistent visual separator across all breadcrumb usages"
  - id: 17-01-D3
    decision: "Named exports only (no default export) on Breadcrumbs component"
    rationale: "Consistent with Button component pattern; both Breadcrumbs and BreadcrumbItem need to be importable"
    impact: "Consumers use: import { Breadcrumbs } from '@/components/ui/breadcrumbs'"

metrics:
  duration: "4 minutes (253 seconds)"
  completed: "2026-02-10"
  tasks: 3/3
---

# Phase 17 Plan 01: Breadcrumbs en 404 Summary

**One-liner:** Reusable Breadcrumbs Server Component integrated on 10 sub-pages + custom 404 not-found page with Dutch navigation links

## What Was Built

### Task 1: Breadcrumbs Component (`components/ui/breadcrumbs.tsx`)
Created a reusable Server Component (no `use client`) with:
- Single prop: `items: Array<{ label: string; href?: string }>`
- Items with `href` render as `<Link>` anchors
- Last item renders as `<span aria-current="page">` (no link)
- Separator `›` wrapped in `<span aria-hidden="true">`
- Outer `<nav aria-label="Breadcrumb">` containing `<ol>` semantic markup
- Semantic Tailwind token classes only (`text-muted-foreground`, `text-foreground`)
- Named exports: `Breadcrumbs` (component) and `BreadcrumbItem` (interface)

### Task 2: Breadcrumbs Integration (10 pages)
Integrated `<Breadcrumbs>` as first child inside content wrappers on:
- `/openclaw` — "OpenClaw" (single item)
- `/openclaw/installatie` — "OpenClaw > Installatie"
- `/openclaw/tutorials` — "OpenClaw > Tutorials"
- `/openclaw/tutorials/[slug]` — "OpenClaw > Tutorials > [Tutorial titel]" (dynamic)
- `/blog` — "Blog" (single item)
- `/blog/[slug]` — "Blog > [Artikel titel]" (dynamic)
- `/qa` — "Q&A" (single item)
- `/qa/vraag/[id]` — "Q&A > [Vraagtitel]" (dynamic)
- `/ai-assistenten` — "AI Assistenten" (single item)
- `/kennisbank` — "Kennisbank" (single item)

Replaced inline `<nav aria-label="Kruimelpad">` blocks on `tutorials/[slug]` and `blog/[slug]` with the new component.

### Task 3: 404 Page + Docs
- **`app/not-found.tsx`**: Dutch "Pagina niet gevonden" layout with `Button asChild + Link` CTAs to home, OpenClaw, Blog, Q&A, AI Assistenten. No `use client`. Next.js renders it automatically on unmatched routes and `notFound()` calls.
- **`docs/CHANGELOG.md`**: Phase 17 entry added at top of changelog above Phase 16.
- **`docs/seo.md`**: Breadcrumbs section (component usage, pages list, accessibility) and 404 Pagina section appended; "Last Updated" updated to Phase 17.

## Decisions Made

| ID | Decision | Impact |
|----|----------|--------|
| 17-01-D1 | Section-relative breadcrumbs (no Home crumb) | Concise crumbs; Home accessible via header nav |
| 17-01-D2 | `›` separator, aria-hidden | Screen reader friendly; consistent visual separator |
| 17-01-D3 | Named exports only (no default export) | Both Breadcrumbs and BreadcrumbItem importable |

## Verification Results

- `npx tsc --noEmit` — 0 errors
- `npx next build` — 30 pages generated, 0 build errors
- SSG pages: `/openclaw/tutorials/[slug]` (3 pages) and `/blog/[slug]` (3 pages) built with correct breadcrumb prop types
- `/_not-found` appears in build route table
- CHANGELOG Phase 17 at line 10 (topmost phase entry)
- seo.md has `## Breadcrumbs` at line 238 and `## 404 Pagina` at line 260

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 2497a65 | feat(17-01) | Create Breadcrumbs Server Component |
| c1cea4a | feat(17-01) | Integrate Breadcrumbs on all 10 sub-pages |
| 73a4f58 | feat(17-01) | Add 404 not-found page and update SEO docs |

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Phase 18 (Structured Data):** Breadcrumbs component is in place. Phase 18 can add `BreadcrumbList` JSON-LD structured data to the same pages using `question.title`, `tutorial.title`, and `post.title` already accessible in each page component.

No blockers or concerns for Phase 18.
