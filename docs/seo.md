# SEO & Metadata

This document describes the SEO metadata implementation for Nederlandse AI Assistenten Hub.

---

## Overview

The project uses Next.js 14 metadata API for SEO optimization. Every page has unique titles and descriptions, with Open Graph support for social sharing.

**Goals:**
- Unique meta title and description per page
- No duplicate titles across routes
- Open Graph support for social sharing
- Template-based title inheritance
- Dynamic metadata for parameterized routes

---

## Root Metadata (app/layout.tsx)

The root layout defines default metadata for the entire application:

**Title Template:**
```typescript
title: {
  default: 'Nederlandse AI Assistenten Hub',
  template: '%s | AI Assistenten Hub',
}
```

Child pages inherit this template. A page with `title: "OpenClaw"` renders as "OpenClaw | AI Assistenten Hub".

**Description:**
Default description covers the platform's purpose. Child pages override with specific descriptions.

**Open Graph:**
Root layout includes basic Open Graph fields:
- `openGraph.title`
- `openGraph.description`
- `openGraph.url`
- `openGraph.siteName`
- `openGraph.type`
- `openGraph.locale`

**metadataBase:**
Set via `NEXT_PUBLIC_BASE_URL` environment variable, defaults to `http://localhost:3000` for development.

See Decision 01-01-D1 (title template uses "AI Assistenten Hub" suffix) and Decision 01-01-D3 (metadataBase uses NEXT_PUBLIC_BASE_URL).

---

## Static Page Metadata

For static pages (no dynamic segments), export a `metadata` object:

**Pattern:**
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Dutch description (1-2 sentences)',
}

export default function PageName() {
  // Component code
}
```

**Example (app/openclaw/page.tsx):**
```typescript
export const metadata: Metadata = {
  title: 'OpenClaw',
  description: 'Alles over OpenClaw - de Nederlandse AI-assistent voor developers. Tutorials, handleidingen en praktische voorbeelden.',
}
```

**Rendered HTML:**
```html
<title>OpenClaw | AI Assistenten Hub</title>
<meta name="description" content="Alles over OpenClaw - de Nederlandse AI-assistent...">
```

---

## Dynamic Page Metadata

For pages with dynamic segments like `[slug]` or `[id]`, use `generateMetadata`:

**Pattern:**
```typescript
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  return {
    title: `Dynamic Title: ${slug}`,
    description: `Description using ${slug}`,
  }
}

export default async function DynamicPage({ params }: Props) {
  // Component code
}
```

**Example (app/openclaw/tutorials/[slug]/page.tsx):**
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  return {
    title: `OpenClaw Tutorial: ${slug}`,
    description: `Leer hoe je ${slug} gebruikt met OpenClaw in deze praktische tutorial.`,
  }
}
```

**Important:**
- `params` is a Promise in Next.js 14+ (must await) - see Decision 06-01-D1
- Function is async
- Returns Metadata object
- Use actual data when available (database queries for real titles/descriptions)

---

## Current Implementation

**Phase 7 Status:** Complete

All 15 routes have unique metadata:

| Route | Title | Type |
|-------|-------|------|
| / | Nederlandse AI Assistenten Hub | Root (app/layout.tsx) |
| /openclaw | OpenClaw | Static |
| /openclaw/installatie | OpenClaw Installatie | Static |
| /openclaw/tutorials | OpenClaw Tutorials | Static |
| /openclaw/tutorials/[slug] | OpenClaw Tutorial: {slug} | Dynamic |
| /openclaw/use-cases | OpenClaw Use Cases | Static |
| /openclaw/nieuws | OpenClaw Nieuws | Static |
| /ai-assistenten | AI Assistenten | Static |
| /ai-assistenten/cursor | Cursor | Static |
| /ai-assistenten/claude-code | Claude Code | Static |
| /ai-assistenten/overzicht | AI Assistenten Vergelijking | Static |
| /qa | Q&A | Static |
| /qa/vraag/[id] | Vraag #{id} | Dynamic |
| /blog | Blog | Static |
| /blog/[slug] | {Slug Title} | Dynamic |
| /kennisbank | Kennisbank | Static |

---

## Adding Metadata to New Pages

**Checklist:**

1. Import Metadata type: `import type { Metadata } from 'next'`
2. For static pages: export `metadata` object
3. For dynamic pages: export async `generateMetadata` function
4. Ensure title is unique (no duplicates)
5. Write 1-2 sentence Dutch description
6. Test with TypeScript compilation
7. Verify in browser DevTools

**Verification:**
```bash
# Check for duplicate titles
grep -rh "title:" app/ --include="page.tsx" | sort | uniq -d

# Verify metadata exports
grep -r "export const metadata" app/ --include="page.tsx"
```

---

## Open Graph Strategy

Open Graph tags enable proper social sharing previews on platforms like Twitter, LinkedIn, Facebook.

**Current Setup:**
- Root layout defines default OG tags
- Individual pages inherit og:title and og:description from metadata
- Child pages do not duplicate openGraph metadata (Decision 07-01-D1 - avoids redundancy and conflicts)
- Future: Add og:image for rich previews (Phase 8+)

**Testing Social Sharing:**
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

## Structured Data (JSON-LD)

Added in Phase 18. JSON-LD script tags are injected inline in Server Component page returns using `dangerouslySetInnerHTML`.

**Pattern:**
```typescript
const schema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  // ...fields
}

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
    {/* page content */}
  </>
)
```

### Article Schema (blog and tutorials)

Applied to: `app/blog/[slug]/page.tsx`, `app/openclaw/tutorials/[slug]/page.tsx`

| Field | Source |
|-------|--------|
| `@type` | `"Article"` |
| `headline` | `post.title` / `tutorial.title` |
| `description` | `post.excerpt` / `tutorial.description` |
| `datePublished` | `post.publishedAt` / `tutorial.lastUpdated` |
| `dateModified` | `post.updatedAt ?? post.publishedAt` / `tutorial.lastUpdated` |
| `author.@type` | `"Organization"` |
| `author.name` | `"AI Assistenten Hub"` |

### QAPage Schema (Q&A detail)

Applied to: `app/qa/vraag/[id]/page.tsx`

| Field | Source |
|-------|--------|
| `@type` | `"QAPage"` |
| `mainEntity.@type` | `"Question"` |
| `mainEntity.name` | `question.title` |
| `mainEntity.text` | `question.body` |
| `mainEntity.answerCount` | `answersWithReplies.length` |
| `mainEntity.dateCreated` | `question.created_at` |
| `mainEntity.suggestedAnswer[].@type` | `"Answer"` |
| `mainEntity.suggestedAnswer[].text` | `answer.body` |
| `mainEntity.suggestedAnswer[].dateCreated` | `answer.created_at` |

### No Duplicate Scripts Rule

Each page emits exactly one JSON-LD block of each `@type`. The script tag is placed as the first child of the Fragment in the page component return — never in shared layouts or multiple locations.

### Validation

- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

---

## Future Enhancements

**Planned for later phases:**

- **Open Graph Images:** Generate dynamic og:image for each page
- **Structured Data:** Implemented in Phase 18 (see Structured Data section below)
- **Twitter Cards:** Specific twitter:card configuration
- **Canonical URLs:** Dynamic canonical tags for pagination/filters
- **Alternate Languages:** When multi-language support added
- **Database-Driven Metadata:** Pull real titles/descriptions from CMS

---

## SEO Best Practices

**Title Best Practices:**
- Keep under 60 characters (with template)
- Front-load important keywords
- Be descriptive and unique
- Use natural language (no keyword stuffing)

**Description Best Practices:**
- Keep under 160 characters
- Write compelling copy (users will read this in search results)
- Include primary keyword naturally
- Be accurate about page content
- End with call-to-action when appropriate

**Common Mistakes to Avoid:**
- Duplicate titles across pages
- Empty or missing descriptions
- Title too long (gets truncated)
- Description too short (wasted opportunity)
- Using same description as title
- Not updating metadata when page content changes

---

## Breadcrumbs

Added in Phase 17. A reusable `Breadcrumbs` Server Component at `components/ui/breadcrumbs.tsx`.

**Usage:** Pass an array of `{ label: string; href?: string }` items. The last item (without `href`) renders as plain text with `aria-current="page"`. All preceding items render as `<Link>` elements.

**Pages with breadcrumbs:**
- `/openclaw` — "OpenClaw"
- `/openclaw/installatie` — "OpenClaw › Installatie"
- `/openclaw/tutorials` — "OpenClaw › Tutorials"
- `/openclaw/tutorials/[slug]` — "OpenClaw › Tutorials › [Tutorial titel]"
- `/blog` — "Blog"
- `/blog/[slug]` — "Blog › [Artikel titel]"
- `/qa` — "Q&A"
- `/qa/vraag/[id]` — "Q&A › [Vraagtitel]"
- `/ai-assistenten` — "AI Assistenten"
- `/kennisbank` — "Kennisbank"

Accessibility: `<nav aria-label="Breadcrumb">` with `<ol>` markup. Separator `›` is `aria-hidden="true"`.

---

## 404 Pagina

`app/not-found.tsx` — Next.js renders this automatically for unmatched routes and when `notFound()` is called. Contains Dutch "Pagina niet gevonden" message, a "Terug naar home" button, and section links to OpenClaw, Blog, Q&A, AI Assistenten.

---

**Last Updated:** 2026-02-10 (Phase 18)
