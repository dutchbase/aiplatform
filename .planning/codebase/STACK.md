# Technology Stack

**Analysis Date:** 2026-02-09

## Languages

**Primary:**
- TypeScript 5.7.2 - Full project implementation (strict mode enabled)

**Secondary:**
- CSS - Styling via Tailwind CSS directives

## Runtime

**Environment:**
- Node.js 24.12.0

**Package Manager:**
- npm 11.6.2
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 14.2.16 - React framework with App Router
- React 18.3.1 - UI library
- React DOM 18.3.1 - React renderer

**Testing:**
- Not configured (MVP planning phase)

**Build/Dev:**
- TypeScript Compiler 5.7.2 - Type checking and transpilation
- ESLint 8.57.1 - Code linting
- eslint-config-next 14.2.16 - Next.js ESLint configuration

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.46.1 - Supabase client for database, auth, storage
- `@supabase/ssr` 0.5.2 - Server-side rendering helpers for Supabase Auth

**Infrastructure:**
- `tailwindcss` 3.4.17 - Utility-first CSS framework
- `postcss` 8.4.49 - CSS processing
- `autoprefixer` 10.4.20 - CSS vendor prefixing

**Development:**
- `@types/node` 22.10.2 - Node.js type definitions
- `@types/react` 18.3.18 - React type definitions
- `@types/react-dom` 18.3.5 - React DOM type definitions

## Configuration

**Environment:**
- Configuration via `.env.local` (template in `.env.example`)
- Required variables:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

**Build:**
- `tsconfig.json` - TypeScript configuration (strict mode, path aliases `@/*`)
- `next.config.mjs` - Next.js configuration (minimal configuration)
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `.eslintrc.json` - ESLint configuration (extends `next/core-web-vitals`)

## Platform Requirements

**Development:**
- Node.js 24.x
- npm 11.x
- Operating System: Windows, macOS, or Linux

**Production:**
- Vercel (planned deployment target per PRD)
- Node.js runtime environment
- PostgreSQL database via Supabase

---

*Stack analysis: 2026-02-09*
