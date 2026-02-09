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

Zie [roadmap/ROADMAP.md](../roadmap/ROADMAP.md) voor volledige planning van Fase 1-25.

