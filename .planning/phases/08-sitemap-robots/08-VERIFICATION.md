---
phase: 08-sitemap-robots
verified: 2026-02-10T00:00:00Z
status: passed
score: 4/4 must-haves verified
---

# Phase 8: Sitemap and Robots Verification Report

**Phase Goal:** Implement sitemap.xml and robots.txt so search engines can discover and index the site. Add canonical URLs to all pages.
**Verified:** 2026-02-10
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visiting /sitemap.xml returns valid XML sitemap | VERIFIED | `app/sitemap.ts` exports default function returning `MetadataRoute.Sitemap` array with 14 URLs, using NEXT_PUBLIC_BASE_URL for absolute URLs. Next.js serves this at /sitemap.xml automatically. |
| 2 | Visiting /robots.txt returns valid robots.txt with sitemap reference | VERIFIED | `app/robots.ts` exports default function returning `MetadataRoute.Robots` object with `userAgent: '*'`, `allow: '/'`, `disallow: ['/api/']`, and `sitemap: \`\${baseUrl}/sitemap.xml\`` |
| 3 | All pages have canonical URL in metadata | VERIFIED | All three existing pages have `alternates.canonical` set: `'/'` in page.tsx, `'/login'` in login/page.tsx, `'/profiel'` in profiel/page.tsx |
| 4 | Search engines can discover and index all content pages | VERIFIED | robots.ts allows all content (`allow: '/'`), disallows only `/api/`. Sitemap includes 14 routes covering all live sections. robots.ts points to sitemap for discovery. |

**Score:** 4/4 truths verified

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/sitemap.ts` | Dynamic sitemap generation (20+ lines) | VERIFIED | 105 lines, exports `default function sitemap(): MetadataRoute.Sitemap`, returns 14 URL entries with url/lastModified/changeFrequency/priority fields. No stubs. |
| `app/robots.ts` | Robots.txt configuration (10+ lines) | VERIFIED | 14 lines, exports `default function robots(): MetadataRoute.Robots`, substantive implementation with rules and sitemap reference. |
| `app/page.tsx` | Home page with canonical URL | VERIFIED | `alternates: { canonical: '/' }` present in exported `metadata` constant at line 6-8. |
| `app/login/page.tsx` | Login page with canonical URL | VERIFIED | `alternates: { canonical: '/login' }` present in exported `metadata` constant at lines 7-9. |
| `app/profiel/page.tsx` | Profile page with canonical URL | VERIFIED | `alternates: { canonical: '/profiel' }` present in exported `metadata` constant at lines 9-11. |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/robots.ts` | `/sitemap.xml` | sitemap reference in robots config | WIRED | Line 12: `sitemap: \`\${baseUrl}/sitemap.xml\`` — absolute URL using baseUrl from NEXT_PUBLIC_BASE_URL |
| `app/sitemap.ts` | `NEXT_PUBLIC_BASE_URL` | environment variable for absolute URLs | WIRED | Line 4: `const baseUrl = process.env.NEXT_PUBLIC_BASE_URL \|\| 'http://localhost:3000'` — all 14 URL entries use `baseUrl` as prefix |
| page metadata | `alternates.canonical` | Next.js Metadata API | WIRED | All three pages: `alternates: { canonical: '...' }`. `app/layout.tsx` lines 27-28 configure `metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL \|\| 'http://localhost:3000')` — converts relative canonical paths to absolute URLs in rendered HTML |

---

## Requirements Coverage

| Requirement | Status | Notes |
|-------------|--------|-------|
| `/sitemap.xml` returns valid XML with 10+ URLs | SATISFIED | 14 URLs in sitemap, using MetadataRoute.Sitemap which Next.js serves as valid XML |
| All existing routes included (/, /login, /profiel) | SATISFIED | All three present in sitemap at lines 8-13, 98-103, and pages have canonical metadata |
| Planned routes included (/openclaw, /blog, /qa, etc.) | SATISFIED | 11 additional routes included covering all planned sections |
| Each sitemap entry has url, lastModified, changeFrequency, priority | SATISFIED | Verified in every entry in sitemap.ts |
| `/robots.txt` allows content, disallows /api/ | SATISFIED | `allow: '/'` and `disallow: ['/api/']` in robots.ts |
| Robots references sitemap with absolute URL | SATISFIED | `sitemap: \`\${baseUrl}/sitemap.xml\`` confirmed |
| TypeScript types used correctly | SATISFIED | `import type { MetadataRoute } from 'next'` in both files, `import type { Metadata } from 'next'` in all pages |

---

## Anti-Patterns Found

None. Scanned all five modified files for TODO/FIXME/placeholder/stub patterns — zero matches.

---

## Human Verification Required

### 1. Rendered canonical tag in HTML head

**Test:** Run `pnpm dev`, visit `http://localhost:3000`, `http://localhost:3000/login`, and `http://localhost:3000/profiel`. View page source (Ctrl+U) on each.
**Expected:** `<link rel="canonical" href="http://localhost:3000/"/>`, `<link rel="canonical" href="http://localhost:3000/login"/>`, and `<link rel="canonical" href="http://localhost:3000/profiel"/>` in `<head>` for each respective page.
**Why human:** Static code analysis confirms the metadata object is configured correctly. Rendering into actual HTML output depends on Next.js metadataBase resolution at runtime.

### 2. /sitemap.xml XML structure

**Test:** Run `pnpm dev`, visit `http://localhost:3000/sitemap.xml`.
**Expected:** Valid XML starting with `<?xml` declaration, `<urlset>` wrapper, 14 `<url>` entries each with `<loc>`, `<lastmod>`, `<changefreq>`, and `<priority>` tags.
**Why human:** Next.js MetadataRoute.Sitemap rendering is validated at runtime. Static analysis confirms the function returns the correct data structure but not the actual XML serialization.

### 3. /robots.txt plain text format

**Test:** Run `pnpm dev`, visit `http://localhost:3000/robots.txt`.
**Expected:** Plain text response with `User-agent: *`, `Allow: /`, `Disallow: /api/`, and `Sitemap: http://localhost:3000/sitemap.xml`.
**Why human:** Same reason as sitemap — MetadataRoute.Robots rendering is validated at runtime.

---

## Gaps Summary

No gaps. All four observable truths are verified:

- `app/sitemap.ts` is a real implementation with 14 route entries, proper TypeScript types, and environment-aware base URL. It is not a stub.
- `app/robots.ts` is a complete implementation with all required directives and sitemap reference.
- All three existing pages (`/`, `/login`, `/profiel`) have `alternates.canonical` wired through exported `metadata` constants.
- The critical chain — `metadataBase` in layout.tsx + relative canonical paths in page metadata — is verified: `app/layout.tsx` sets `metadataBase` from `NEXT_PUBLIC_BASE_URL`, which converts the relative paths (`'/'`, `'/login'`, `'/profiel'`) to absolute canonical URLs.

Three human verification items remain but these are runtime rendering checks, not structural gaps. Automated structural verification is complete and all items pass.

---

_Verified: 2026-02-10_
_Verifier: Claude (gsd-verifier)_
