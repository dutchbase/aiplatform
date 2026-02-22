# Phase 1: Next.js App Basis - Research

**Researched:** 2026-02-09
**Domain:** Next.js 14 App Router, TypeScript, Tailwind CSS
**Confidence:** HIGH

## Summary

This research covers the foundational setup of a Next.js 14 application using the App Router pattern with TypeScript strict mode and Tailwind CSS integration. The project currently has basic scaffolding in place (Next.js 14.2.16 installed, root layout created, homepage component exists), and this phase will formalize and validate that setup.

**Key findings:**
- Next.js 14.2 App Router is production-ready with stable Server Actions and enhanced metadata APIs
- Server Components are default behavior, requiring explicit `'use client'` only for interactive components
- Root layout MUST contain `<html>` and `<body>` tags and should define base metadata
- Tailwind CSS integration is already configured and working
- TypeScript strict mode is enabled and properly configured

**Primary recommendation:** Keep the root layout minimal and server-rendered, set up proper metadata for SEO/language, and ensure the homepage demonstrates Server Component patterns that future phases will extend (auth providers, data fetching, etc.).

---

## Standard Stack

The established libraries/tools for Next.js 14 App Router foundation:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 14.2.16 | React framework with App Router | Stable release with Server Actions, enhanced metadata, Turbopack improvements |
| react | 18.3.1 | UI library | Required by Next.js 14 |
| react-dom | 18.3.1 | React renderer | Required by Next.js 14 |
| typescript | 5.7.2 | Type-safe JavaScript | Strict mode enabled per project requirements |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwindcss | 3.4.17 | Utility-first CSS framework | Already configured; for all styling |
| postcss | 8.4.49 | CSS processing | Required by Tailwind |
| autoprefixer | 10.4.20 | CSS vendor prefixing | Required by Tailwind |
| eslint-config-next | 14.2.16 | Next.js ESLint rules | Already configured; enforces best practices |
| @types/react | 18.3.18 | React TypeScript definitions | Type safety for React components |
| @types/react-dom | 18.3.5 | React DOM type definitions | Type safety for React DOM |
| @types/node | 22.10.2 | Node.js type definitions | Type safety for Node APIs |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Next.js 14 App Router | Next.js Pages Router | App Router is modern standard; Pages Router deprecated for new projects |
| Tailwind CSS | CSS Modules / Styled Components | Tailwind aligns with Server Components; no runtime CSS-in-JS overhead |
| TypeScript strict | JavaScript / TypeScript non-strict | Strict mode catches errors early; required by project standards |

**Installation:**
```bash
# All dependencies already installed in Phase 0
# Verify with:
npm list next react react-dom typescript tailwindcss
```

---

## Architecture Patterns

### Recommended Project Structure
```
app/
├── layout.tsx           # Root layout (REQUIRED - html/body tags)
├── page.tsx             # Homepage (Server Component)
├── globals.css          # Tailwind directives + CSS variables
├── (dashboard)/         # Route group for future auth-protected routes
│   └── ...              # Future: leads, settings, etc.
├── openclaw/            # Public routes
│   ├── page.tsx         # /openclaw
│   └── installatie/
│       └── page.tsx     # /openclaw/installatie
└── actions/             # Server Actions (future phases)
    └── ...
```

### Pattern 1: Root Layout with Metadata
**What:** Root layout defines HTML structure, global metadata, and global styles
**When to use:** Every Next.js App Router project (required)
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/getting-started/layouts-and-pages
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Nederlandse AI Assistenten Hub',
    template: '%s | Nederlandse AI Assistenten Hub',
  },
  description: 'Jouw centrale platform voor Nederlandse AI-assistenten, beginnend met OpenClaw',
  keywords: ['AI assistenten', 'OpenClaw', 'Nederlands', 'tutorials', 'Q&A'],
  authors: [{ name: 'Nederlandse AI Assistenten Hub' }],
  creator: 'Nederlandse AI Assistenten Hub',
  publisher: 'Nederlandse AI Assistenten Hub',
  metadataBase: new URL('https://yourdomain.com'), // Set in production
  alternates: {
    canonical: '/',
    languages: {
      'nl-NL': '/', // Dutch is primary language
    },
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: '/',
    siteName: 'Nederlandse AI Assistenten Hub',
    title: 'Nederlandse AI Assistenten Hub',
    description: 'Jouw centrale platform voor Nederlandse AI-assistenten',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
```

### Pattern 2: Server Component Homepage
**What:** Default async Server Component that fetches data and renders on server
**When to use:** All pages by default; only use Client Components for interactivity
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/getting-started/server-and-client-components
// app/page.tsx - Server Component (no 'use client' directive)
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Nederlandse AI Assistenten Hub
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Jouw centrale platform voor Nederlandse AI-assistenten
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Fase 1: Next.js-appbasis voltooid
        </p>
      </div>
    </main>
  )
}
```

### Pattern 3: Future Auth Provider Pattern
**What:** Prepare root layout structure for future Supabase Auth integration
**When to use:** Phase 4 (Supabase setup) will extend this pattern
**Key insight:** Root layout should remain a Server Component, but will wrap children in a Client Component auth provider
**Example (Future Phase 4):**
```typescript
// app/layout.tsx - Remains Server Component
import { AuthProvider } from '@/components/auth-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

// components/auth-provider.tsx - Client Component for auth context
'use client'
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Future: Supabase auth context, session management
  return <>{children}</>
}
```

### Anti-Patterns to Avoid
- **Don't add authentication checks in layouts** - Layouts don't re-run on every navigation due to partial rendering; put auth checks in middleware or data access layer instead (Source: https://github.com/vercel/next.js/discussions/50507)
- **Don't use `'use client'` by default** - Only add when component needs useState, useEffect, or browser APIs
- **Don't manually add `<head>` tags** - Use Metadata API instead; Next.js handles deduplication and streaming
- **Don't fetch data with useEffect in Client Components** - Use Server Components for data fetching or Server Actions for mutations
- **Don't forget to restart dev server after tsconfig.json changes** - Path alias changes require restart

---

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Metadata management | Custom `<Head>` component | Next.js Metadata API | Automatic deduplication, streaming support, SEO optimization |
| Route-level error handling | Custom error wrappers | `error.tsx` convention | Built-in error boundaries, automatic recovery |
| Loading states | Custom loading components | `loading.tsx` convention | Automatic Suspense boundaries, instant loading states |
| Route protection | Layout-based auth checks | Middleware + Data Access Layer | Guaranteed execution, no partial rendering gotchas |
| Path aliases | Relative imports everywhere | TypeScript `paths` in tsconfig.json | Cleaner imports, easier refactoring |
| Dark mode toggle | Custom CSS variable management | Tailwind `dark:` variant + next-themes (future) | Automatic class switching, system preference support |
| Form state management | Custom form hooks | Server Actions with useFormState/useFormStatus (Phase 5+) | Type-safe, single network roundtrip, automatic revalidation |

**Key insight:** Next.js 14 App Router provides conventions for almost every common need. Follow the framework conventions rather than inventing custom solutions.

---

## Common Pitfalls

### Pitfall 1: Root Layout Missing Required Tags
**What goes wrong:** Build fails or runtime errors if root layout doesn't have `<html>` and `<body>` tags
**Why it happens:** Developers coming from Pages Router expect Next.js to provide these automatically
**How to avoid:** Always include both tags in `app/layout.tsx`; it's a hard requirement in App Router
**Warning signs:** TypeScript error "Property 'html' is missing" or build failure

### Pitfall 2: Confusing Server vs Client Components
**What goes wrong:** Adding `'use client'` everywhere or getting "You're importing a component that needs X but the page is a Server Component" errors
**Why it happens:** Unclear mental model of server/client boundary
**How to avoid:**
  - Default to Server Components
  - Only add `'use client'` when you need: useState, useEffect, onClick handlers, browser APIs
  - Remember: once a file has `'use client'`, all its imports are client-side
  - Use composition pattern: Server Component passes data to small Client Components
**Warning signs:** Error messages mentioning "use client" or large client bundle sizes

**Example of correct composition:**
```typescript
// app/page.tsx - Server Component (no directive)
import { getPosts } from '@/lib/data'
import { LikeButton } from '@/components/like-button'

export default async function Page() {
  const posts = await getPosts() // Server-side data fetching
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <LikeButton postId={post.id} /> {/* Only this is client-side */}
        </div>
      ))}
    </div>
  )
}

// components/like-button.tsx - Client Component
'use client'
import { useState } from 'react'

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  return <button onClick={() => setLiked(!liked)}>Like</button>
}
```

### Pitfall 3: Metadata Not Displaying Correctly
**What goes wrong:** SEO tags missing, wrong titles showing, Open Graph images not appearing
**Why it happens:** Metadata inheritance/merging not understood, or metadataBase not set for relative URLs
**How to avoid:**
  - Set `metadataBase` in root layout if using relative URLs for Open Graph images
  - Use `title.template` in root layout for consistent title format across pages
  - Remember metadata merges shallowly; child pages can override parent fields
  - Test with social media preview tools (Twitter Card Validator, Facebook Debugger)
**Warning signs:** Social media previews show wrong images/text, page titles don't follow template

### Pitfall 4: Path Alias Not Working
**What goes wrong:** Import like `import { db } from '@/lib/db'` shows red underline or build fails
**Why it happens:** IDE not recognizing tsconfig.json paths, or dev server not restarted after config change
**How to avoid:**
  - Verify tsconfig.json has `"paths": { "@/*": ["./*"] }`
  - Restart dev server after any tsconfig.json changes
  - Reload TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")
**Warning signs:** Red squiggles in editor but build works, or build fails with module not found

### Pitfall 5: Dark Mode Not Working with Tailwind
**What goes wrong:** `dark:` classes don't apply, or dark mode styling inconsistent
**Why it happens:** Tailwind dark mode not configured, or CSS variables not scoped correctly
**How to avoid:**
  - Ensure `tailwind.config.ts` has correct content paths (already configured)
  - For Tailwind v3: `darkMode: 'class'` in config (default behavior)
  - For manual dark mode toggle (future): use next-themes package to manage `<html class="dark">` attribute
  - Use CSS custom properties in `:root` and `@media (prefers-color-scheme: dark)` for consistent theming
**Warning signs:** Dark mode works in some places but not others, or requires page refresh

### Pitfall 6: Exposing Server-Only Code to Client
**What goes wrong:** API keys or server-only logic accidentally included in client bundle
**Why it happens:** Importing server-side code in a Client Component
**How to avoid:**
  - Install `server-only` package: `npm install server-only`
  - Import at top of server-only files: `import 'server-only'`
  - If client tries to import, build will fail with clear error
  - Never put secrets in files that could be imported by Client Components
**Warning signs:** Build warnings about server-only code in client bundle, or env variables showing in browser console

---

## Code Examples

Verified patterns from official sources:

### Root Layout with Dutch Metadata
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Nederlandse AI Assistenten Hub',
    template: '%s | AI Assistenten Hub', // Child pages: "OpenClaw | AI Assistenten Hub"
  },
  description: 'Jouw centrale platform voor Nederlandse AI-assistenten, beginnend met OpenClaw. Tutorials, Q&A community, en praktische handleidingen.',
  keywords: ['AI assistenten', 'OpenClaw', 'Nederlands', 'tutorials', 'Q&A', 'handleidingen'],
  authors: [{ name: 'Nederlandse AI Assistenten Hub' }],
  creator: 'Nederlandse AI Assistenten Hub',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'nl-NL': '/', // Primary language
    },
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL', // Dutch locale
    url: '/',
    siteName: 'Nederlandse AI Assistenten Hub',
    title: 'Nederlandse AI Assistenten Hub',
    description: 'Jouw centrale platform voor Nederlandse AI-assistenten',
    // images: ['/og-image.png'], // Add in future phase with actual image
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nederlandse AI Assistenten Hub',
    description: 'Jouw centrale platform voor Nederlandse AI-assistenten',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
```

### Simple Homepage Server Component
```typescript
// Source: https://nextjs.org/docs/app/getting-started/server-and-client-components
// app/page.tsx - Server Component by default
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Nederlandse AI Assistenten Hub
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
          Jouw centrale platform voor Nederlandse AI-assistenten, beginnend met OpenClaw
        </p>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Ontdek tutorials, stel vragen, en leer hoe je AI-assistenten effectief inzet.
        </p>
      </div>
    </main>
  )
}
```

### TypeScript Configuration (Already Correct)
```json
// tsconfig.json - Verified correct configuration
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true, // ✅ Strict mode enabled per project requirements
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"] // ✅ Path alias configured correctly
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind Global Styles (Enhanced)
```css
/* app/globals.css - Tailwind + CSS variables for theming */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

/* Utility layer for custom classes (if needed in future) */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router (`pages/` directory) | App Router (`app/` directory) | Next.js 13+ | Server Components by default, nested layouts, streaming, improved performance |
| getServerSideProps / getStaticProps | async Server Components | Next.js 13+ | Simpler data fetching, better composition, no prop drilling |
| API Routes for mutations | Server Actions | Next.js 14 (stable) | Type-safe mutations, no manual API routes, single network roundtrip |
| Manual metadata in `_app.js` | Metadata API | Next.js 13+ | Automatic deduplication, streaming support, type-safe |
| next/font (old import) | next/font (built-in) | Next.js 14+ | `@next/font` removed; use `next/font` directly |
| darkMode: 'media' (Tailwind) | darkMode: 'class' | Tailwind 3.0+ | Manual toggle support, better UX control |

**Deprecated/outdated:**
- **`@next/font` package** - Removed in Next.js 14; use `next/font` directly
- **`next export` command** - Removed; use `output: 'export'` in next.config.js instead
- **Pages Router for new projects** - Still supported but App Router is recommended standard
- **Metadata in viewport/themeColor/colorScheme** - Deprecated; use `generateViewport()` function instead (breaking in future major version)

---

## Open Questions

Things that couldn't be fully resolved:

1. **Environment variable for metadataBase**
   - What we know: `metadataBase` should be set to production URL for Open Graph images to work
   - What's unclear: Should this be `NEXT_PUBLIC_BASE_URL` or `VERCEL_URL` (auto-provided by Vercel)?
   - Recommendation: Use `process.env.NEXT_PUBLIC_BASE_URL` for now; add to `.env.local` in Phase 2 when deploying

2. **Dark mode implementation timing**
   - What we know: Project has CSS variables for dark mode; Tailwind supports `dark:` variant
   - What's unclear: Should Phase 1 include manual dark mode toggle or just system preference?
   - Recommendation: Keep system preference only (`prefers-color-scheme`) for Phase 1; add manual toggle with `next-themes` in Phase 5+ if needed

3. **Prettier configuration**
   - What we know: No Prettier config detected; ESLint is configured
   - What's unclear: Should project use Prettier or rely on ESLint formatting?
   - Recommendation: Add Prettier in Phase 2 for consistent code formatting; low priority for Phase 1

---

## Sources

### Primary (HIGH confidence)
- [Next.js Official Docs - Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Next.js Official Docs - Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js Official Docs - Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js 14 Release Blog](https://nextjs.org/blog/next-14)
- [Next.js 14.2 Release Blog](https://nextjs.org/blog/next-14-2)
- [Tailwind CSS Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)

### Secondary (MEDIUM confidence)
- [Common Next.js App Router Mistakes - Vercel Blog](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them)
- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [Supabase Auth with Next.js App Router](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Next.js SEO Optimization Guide 2026](https://www.djamware.com/post/697a19b07c935b6bb054313e/next-js-seo-optimization-guide--2026-edition)

### Tertiary (LOW confidence)
- Various Medium articles on Next.js 14 patterns (cross-referenced with official docs)
- Community discussions on GitHub about App Router best practices (verified against official sources)

---

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** - All packages official Next.js/React/Tailwind with verified versions
- Architecture: **HIGH** - Official Next.js docs and verified blog posts from Vercel
- Pitfalls: **HIGH** - Official Vercel blog post on common mistakes, cross-referenced with documentation
- Dutch language SEO: **MEDIUM** - General SEO best practices verified, but no Dutch-specific official guidance found
- Future auth integration: **MEDIUM** - Based on Supabase official docs but not yet implemented in this project

**Research date:** 2026-02-09
**Valid until:** 60 days (stable stack; Next.js 15 may introduce changes but 14.x is LTS)

**Key verification performed:**
- Cross-referenced all major recommendations with official Next.js documentation
- Verified version numbers against actual installed packages in project
- Checked current state of codebase files (layout.tsx, page.tsx, tsconfig.json, globals.css)
- Validated against project's existing architecture rules in `.cursor/rules/`

**Phase 1 readiness:** Ready to plan. All research verified with official sources. No blocking unknowns. This is an enhancement/validation phase since basic setup already exists from Phase 0.
