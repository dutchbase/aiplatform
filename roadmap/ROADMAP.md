# Roadmap – Nederlandse AI Assistenten Hub

**Bron:** PRD (prd.md) v1.1
**Doel:** Stapsgewijze, door AI-agents uitvoerbare bouw van het platform.
**Conventie:** Elke fase heeft 2–3 kleine taken, een eigen fase-document in `/roadmap/`, en eindigt met commit, changelog, documentatie en push naar GitHub.

---

## Overzicht

- **Fase 0–4:** Projectsetup, Next.js, design, Supabase, auth.
- **Fase 5–9:** SEO-basis, URL-structuur, OpenClaw-sectie, blog, RSS.
- **Fase 10–14:** Q&A (schema, API, frontend, formulieren).
- **Fase 15–19:** SEO-verfijning, content, eerste artikelen.
- **Fase 20–24:** Deploy, monitoring, legal, afronding MVP.

Vink een fase af door `[ ]` te vervangen door `[x]`. Na voltooiing: commit, `docs/CHANGELOG.md` bijwerken, relevante docs in `/docs/` toevoegen/updaten, en pushen naar GitHub.

---

## Fase 0 – Projectsetup

- [ ] **0 – Projectsetup** — Repo-structuur, dependencies, environment, README.

**Document:** [phase-00-project-setup.md](./phase-00-project-setup.md)

---

## Fase 1 – Next.js-appbasis

**Goal:** Next.js-appbasis — App Router, layout, homepagina, basisstyling.

**Plans:** 1 plan

Plans:
- [x] 01-01-PLAN.md — Enhance Next.js app basis with comprehensive metadata and Dutch content

**Document:** [phase-01-nextjs-app-basis.md](./phase-01-nextjs-app-basis.md)

---

## Fase 2 – Design & componenten

**Goal:** Design tokens (HSL CSS variables), Inter font, Header/Footer layout shell, and reusable Button component via shadcn/ui pattern.

**Plans:** 2 plans

Plans:
- [x] 02-01-PLAN.md — Design tokens, Tailwind config, cn() utility, Inter font, Header, Footer, layout shell
- [x] 02-02-PLAN.md — Button component, homepage update, changelog

**Document:** [phase-02-design-componenten.md](./phase-02-design-componenten.md)

---

## Fase 3 – Supabase-project

**Goal:** Supabase backend connection -- client utilities (browser + server), environment configuration, and middleware for session refresh.

**Plans:** 1 plan

Plans:
- [x] 03-01-PLAN.md — Supabase client utilities, session middleware, env config, and setup docs

**Document:** [phase-03-supabase-project.md](./phase-03-supabase-project.md)

---

## Fase 4 – Database & auth

**Goal:** Database schema for user profiles with RLS, Supabase Auth flows (registration, login, logout), and email confirmation callback.

**Plans:** 2 plans

Plans:
- [ ] 04-01-PLAN.md — SQL migration for profiles table, triggers, RLS policies, and schema docs
- [ ] 04-02-PLAN.md — Auth flows: login page, Server Actions, email confirm route, signout route

**Document:** [phase-04-database-auth.md](./phase-04-database-auth.md)

---

## Fase 5 – Sessie & profiel

**Goal:** Auth-aware header showing session status and protected profile page with display name editing.

**Plans:** 1 plan

Plans:
- [x] 05-01-PLAN.md — Auth-aware header, protected profile page with display name editing, changelog

**Document:** [phase-05-sessie-profiel.md](./phase-05-sessie-profiel.md)

---

## Fase 6 – URL-structuur & routing

**Goal:** Alle routes uit de PRD (Appendix A) bestaan als pagina's of placeholders, zodat navigatie en SEO-structuur kloppen en er later alleen inhoud hoeft te worden toegevoegd.

**Plans:** 2 plans

Plans:
- [ ] 06-01-PLAN.md — Create all route placeholders (OpenClaw, AI assistants, Q&A, blog, kennisbank)
- [ ] 06-02-PLAN.md — Update Header navigation with links to all sections

**Document:** [phase-06-url-structuur-routing.md](./phase-06-url-structuur-routing.md)

---

## Fase 7 – SEO-basis

**Goal:** Elke paginatype heeft een duidelijke meta title en description; Open Graph-basis voor delen. Geen dubbele titels; standaard waarden waar nodig.

**Plans:** 2 plans

Plans:
- [ ] 07-01-PLAN.md — Add metadata to all 15 route pages (static and dynamic)
- [ ] 07-02-PLAN.md — Create SEO documentation and update changelog

**Document:** [phase-07-seo-basis.md](./phase-07-seo-basis.md)

---

## Fase 8 – Sitemap & robots

**Goal:** Crawlers kunnen de site correct indexeren: werkende `sitemap.xml` en `robots.txt`; waar relevant canonical URLs om duplicate content te voorkomen.

**Plans:** 1 plan

Plans:
- [ ] 08-01-PLAN.md — Implement sitemap.ts, robots.ts, and canonical URLs on existing pages

**Document:** [phase-08-sitemap-robots.md](./phase-08-sitemap-robots.md)

---

## Fase 9 – OpenClaw-sectie

**Goal:** De OpenClaw-sectie is herkenbaar en bruikbaar: overzichtspagina met uitleg en links naar installatie, tutorials, use-cases en nieuws; installatiepagina met echte inhoudsstructuur.

**Plans:** 2 plans

Plans:
- [ ] 09-01-PLAN.md — OpenClaw overview and installation pages with Dutch content and structure
- [ ] 09-02-PLAN.md — OpenClaw subnavigation component and header integration

**Document:** [phase-09-openclaw-sectie.md](./phase-09-openclaw-sectie.md)

---

## Fase 10 – OpenClaw-tutorials

**Goal:** Een tutorials-overzichtspagina en drie tutorial-detailpagina's (op slug) met een vaste layout; inhoud kan placeholder of kort zijn en wordt in Fase 19 ingevuld.

**Plans:** 1 plan

Plans:
- [ ] 10-01-PLAN.md — Tutorials data structure, overview page, and dynamic slug-based detail pages

**Document:** [phase-10-openclaw-tutorials.md](./phase-10-openclaw-tutorials.md)

---

## Fase 11 – Blog & nieuws

**Goal:** Blog/nieuws heeft een overzichtspagina en een detailpagina per artikel. Data komt uit een statische module (lib/data/blog.ts), consistent met het tutorials-patroon. Keuze gedocumenteerd in docs/blog.md.

**Plans:** 1 plan

Plans:
- [ ] 11-01-PLAN.md — Blog data module, overview page, detail page with generateMetadata and redirect

**Document:** [phase-11-blog-nieuws.md](./phase-11-blog-nieuws.md)

---

## Fase 12 – RSS-feed

- [ ] **12 – RSS-feed** — Minimaal één RSS-feed (alle content of per sectie).

**Document:** [phase-12-rss-feed.md](./phase-12-rss-feed.md)

---

## Fase 13 – Q&A-datamodel

- [ ] **13 – Q&A-datamodel** — Tabellen vragen, antwoorden, reacties; RLS; rollen.

**Document:** [phase-13-qa-datamodel.md](./phase-13-qa-datamodel.md)

---

## Fase 14 – Q&A-API

- [ ] **14 – Q&A-API** — Server actions / API: vraag stellen, antwoord posten, reactie.

**Document:** [phase-14-qa-api.md](./phase-14-qa-api.md)

---

## Fase 15 – Q&A-frontend

- [ ] **15 – Q&A-frontend** — Q&A-overzicht, vraag-detail met antwoorden en reacties.

**Document:** [phase-15-qa-frontend.md](./phase-15-qa-frontend.md)

---

## Fase 16 – Q&A-formulieren

- [ ] **16 – Q&A-formulieren** — Formulieren: vraag stellen, antwoord geven, reactie (auth-check).

**Document:** [phase-16-qa-formulieren.md](./phase-16-qa-formulieren.md)

---

## Fase 17 – Breadcrumbs & 404

- [ ] **17 – Breadcrumbs & 404** — Breadcrumbs op onderniveaus, 404-pagina met zoek/links.

**Document:** [phase-17-breadcrumbs-404.md](./phase-17-breadcrumbs-404.md)

---

## Fase 18 – Structured data

- [ ] **18 – Structured data** — Schema.org (Article, FAQPage, QAPage) waar relevant.

**Document:** [phase-18-structured-data.md](./phase-18-structured-data.md)

---

## Fase 19 – Eerste content

- [ ] **19 – Eerste content** — Installatietekst + 3 tutorials inhoudelijk invullen (Nederlands).

**Document:** [phase-19-eerste-content.md](./phase-19-eerste-content.md)

---

## Fase 20 – Interne links

- [ ] **20 – Interne links** — Gerelateerde artikelen, links tussen OpenClaw/blog/QA.

**Document:** [phase-20-interne-links.md](./phase-20-interne-links.md)

---

## Fase 21 – Moderatie-basis (nice-to-have)

- [ ] **21 – Moderatie-basis** — Rapport-knop, eenvoudige moderator-queue (optioneel).

**Document:** [phase-21-moderatie-basis.md](./phase-21-moderatie-basis.md)

---

## Fase 22 – Deploy & CI/CD

- [ ] **22 – Deploy & CI/CD** — Vercel-deploy, productie-env, CI (lint/test) bij push.

**Document:** [phase-22-deploy-cicd.md](./phase-22-deploy-cicd.md)

---

## Fase 23 – Monitoring

- [ ] **23 – Monitoring** — Uptime, error tracking (bijv. Sentry), basis logging.

**Document:** [phase-23-monitoring.md](./phase-23-monitoring.md)

---

## Fase 24 – Legal & compliance

- [ ] **24 – Legal & compliance** — Privacyverklaring, cookiebanner/consent, gebruiksvoorwaarden.

**Document:** [phase-24-legal-compliance.md](./phase-24-legal-compliance.md)

---

## Fase 25 – MVP-afronding

- [ ] **25 – MVP-afronding** — Laatste checks, documentatie compleet, README, release.

**Document:** [phase-25-mvp-afronding.md](./phase-25-mvp-afronding.md)

---

## Na MVP (niet in deze roadmap uitgewerkt)

- **Fase 2 (PRD):** Meer tools (Cursor, Claude Code), AI-bots, ads, zoek, nieuwsbrief.
- **Fase 3 (PRD):** Premium content, API, managed AI-diensten.

Deze worden in latere roadmap-iteraties opgedeeld in kleine fases.

---

## Git & documentatie (elke fase)

Na elke fase moet de AI-agent:

1. **Changelog:** `docs/CHANGELOG.md` bijwerken met korte entry (wat is toegevoegd/gewijzigd).
2. **Documentatie:** Nieuwe/gewijzigde onderdelen documenteren in `/docs/` (bijv. architectuur, API, deployment).
3. **Git:** Alle wijzigingen stagen, committen met duidelijke message, en naar GitHub pushen.

In elk fase-document staat dit expliciet bij **Verplichte afsluiting**.
