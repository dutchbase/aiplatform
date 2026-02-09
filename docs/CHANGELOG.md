# Changelog

Alle belangrijke wijzigingen aan het Nederlandse AI Assistenten Hub project worden in dit bestand gedocumenteerd.

Het format is gebaseerd op [Keep a Changelog](https://keepachangelog.com/nl/1.0.0/),
en dit project volgt [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-02-09

### Fase 0: Projectsetup

**Doel:** Stabiele projectbasis met repo-structuur, dependencies en environment voor Next.js + Supabase stack.

#### Toegevoegd

- **Project structuur:**
  - Directories aangemaakt: `app/`, `components/`, `lib/`, `public/`, `docs/`
  - `.cos/` directory voor Chief of Staff governance (ceo-decisions.md, cos-assumptions.md)

- **Next.js 14+ initialisatie:**
  - App Router configuratie met TypeScript strict mode
  - Root layout (`app/layout.tsx`) met Nederlandse locale (lang="nl")
  - Homepage (`app/page.tsx`) met welkomstbericht
  - Tailwind CSS integratie met PostCSS

- **Dependencies (locked versions):**
  - next: 14.2.16
  - react: 18.3.1
  - react-dom: 18.3.1
  - @supabase/supabase-js: 2.46.1
  - @supabase/ssr: 0.5.2
  - TypeScript 5.7.2 met strict mode
  - Tailwind CSS 3.4.17

- **Configuratiebestanden:**
  - `package.json` - Dependencies en scripts
  - `tsconfig.json` - TypeScript configuratie (strict mode, path aliases)
  - `next.config.mjs` - Next.js configuratie
  - `tailwind.config.ts` - Tailwind configuratie
  - `postcss.config.mjs` - PostCSS met autoprefixer
  - `.eslintrc.json` - ESLint configuratie (next/core-web-vitals)
  - `.gitignore` - Git ignore regels

- **Environment:**
  - `.env.example` met Supabase variabelen template

- **Documentatie:**
  - `docs/project-structure.md` - Volledige projectstructuur documentatie
  - `docs/CHANGELOG.md` - Dit bestand
  - `README.md` - Uitgebreid met lokale development sectie en setup instructies

#### Scripts beschikbaar

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Bouwt productie versie
- `npm run start` - Start productie server
- `npm run lint` - ESLint checks

#### Verwacht gedrag

- `npm install` werkt zonder errors
- `npm run dev` start Next.js development server
- Applicatie draait op http://localhost:3000 (zelfs zonder Supabase credentials)
- Homepage toont "Nederlandse AI Assistenten Hub" met fase-status

#### Volgende stappen

**Fase 1:** Next.js App Basis - Layout componenten, navigatie, footer en basis styling.

---

## [Unreleased]

### Geplande wijzigingen

Zie [roadmap/ROADMAP.md](../roadmap/ROADMAP.md) voor volledige planning van Fase 4-25.

---

## [0.4.0] - 2026-02-09

### Fase 3: Supabase-project

**Doel:** Supabase client infrastructuur opzetten voor browser, server en middleware.

#### Toegevoegd

- **Supabase client utilities:**
  - `lib/supabase/client.ts` - Browser client factory met `createBrowserClient` van `@supabase/ssr`
  - `lib/supabase/server.ts` - Server client factory met `createServerClient` en `getAll`/`setAll` cookie pattern
  - Async server client voor Next.js 14+ `cookies()` requirement
  - Non-null assertions voor fail-fast gedrag bij ontbrekende environment variabelen

- **Next.js middleware voor session refresh:**
  - `middleware.ts` - Automatische JWT validatie en token refresh via `auth.getUser()`
  - Cookie propagatie op zowel request als response voor Server Components
  - Matcher configuratie sluit statische bestanden uit (_next/static, images, favicon)
  - Geen auth redirects (fase 4+) - enkel session cookie refresh

- **Environment configuratie:**
  - `.env.example` uitgebreid met beschrijvende comments
  - `SUPABASE_SERVICE_ROLE_KEY` toegevoegd voor toekomstige admin operaties (Fase 4+)
  - `NEXT_PUBLIC_BASE_URL` gedocumenteerd voor metadata/canonical URLs

- **Documentatie:**
  - `docs/supabase-setup.md` - Nederlandstalige setup handleiding met:
    - Stapsgewijze instructies voor Supabase project aanmaken
    - API credentials ophalen uit dashboard
    - Environment variabelen instellen
    - Verbinding verificatie
    - Probleemoplossing sectie
    - Links naar officiële Supabase documentatie

#### Technische details

- **Gebruikte patterns:**
  - `@supabase/ssr` package (niet deprecated auth-helpers)
  - `getAll`/`setAll` cookie methods (niet deprecated get/set/remove)
  - `auth.getUser()` voor JWT validatie (niet insecure `getSession()`)
  - Async server client voor Next.js 14+ compatibility

- **Security:**
  - Service role key warning: server-only, nooit in client code
  - `.env.local` blijft in .gitignore (geen secrets in git)
  - Non-null assertions dwingen expliciete configuratie

#### Volgende stappen

**Fase 4:** Authenticatie - Supabase Auth integratie met login/logout flows.

---

## [0.3.0] - 2026-02-09

### Fase 2: Design & componenten

**Doel:** Design tokens, Inter font, Header/Footer layout shell, reusable Button component (shadcn/ui pattern), homepage update met semantic tokens.

#### Toegevoegd

- **Design tokens:** HSL-based CSS custom properties in `globals.css` (light + dark mode)
- **Tailwind config:** Extended with semantic color tokens, container config (centered, 1400px max), border-radius tokens
- **Inter font:** Loaded via `next/font/google`, applied globally as `font-sans`
- **`cn()` utility:** Class merging helper at `lib/utils.ts` (clsx + tailwind-merge)
- **Header component:** Sticky header with site name and navigation (Home, OpenClaw, Blog, Q&A)
- **Footer component:** Copyright with dynamic year, placeholder links (Privacy, Gebruiksvoorwaarden)
- **Button component:** Reusable UI primitive with 6 variants and 4 sizes (shadcn/ui pattern)
- **Layout shell:** Flex-column structure in root layout with Header, main, Footer

#### Gewijzigd

- `globals.css` - Replaced RGB variables with HSL design token system
- `tailwind.config.ts` - Extended with semantic colors, container, font, border-radius, animations plugin
- `app/layout.tsx` - Added Inter font, Header, Footer, flex-column layout
- `app/page.tsx` - Updated to use Button component and semantic token classes

#### Dependencies

- Added: class-variance-authority, clsx, tailwind-merge, tailwindcss-animate, lucide-react, @radix-ui/react-slot

#### Volgende stappen

**Fase 3:** Supabase-project - Client utilities, session middleware, environment configuration.

---

## [0.2.0] - 2026-02-09

### Fase 1: Next.js-appbasis

**Doel:** Next.js-appbasis formaliseren met productie-klare metadata, Nederlandse taalconfiguratie en SEO-geoptimaliseerde homepagina.

#### Toegevoegd

- **Uitgebreide metadata in root layout:**
  - Title template patroon (`%s | AI Assistenten Hub`) voor consistente paginatitels
  - Keywords array: AI assistenten, OpenClaw, Nederlands, tutorials, Q&A, handleidingen
  - Authors, creator, publisher velden
  - metadataBase met `NEXT_PUBLIC_BASE_URL` environment variabele ondersteuning
  - Canonical URL en taalverwijzingen (`nl-NL`)
  - Complete Open Graph configuratie met `nl_NL` locale
  - Twitter card configuratie (`summary_large_image`)
  - Robots configuratie met googleBot instellingen

- **Verbeterde homepagina:**
  - Responsief ontwerp met `p-8 md:p-24` en `max-w-3xl` container
  - Responsieve heading (`text-4xl md:text-5xl`)
  - Ondertitel met OpenClaw vermelding
  - Actiegerichte introductietekst (tutorials, vragen, AI-assistenten)
  - Dark mode tekstkleuren (`dark:text-gray-300/400/500`)

- **Taalconfiguratie:**
  - `<html lang="nl">` voor Nederlandse taal
  - `openGraph.locale: 'nl_NL'` voor zoekmachines
  - `antialiased` class op body voor betere letterweergave

#### Volgende stappen

**Fase 2:** Design & componenten - Design tokens, header, footer, basiscomponenten.

