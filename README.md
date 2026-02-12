# Nederlandse AI Assistenten Hub

**De centrale Nederlandstalige hub voor AI-assistenten** – met praktische kennis, eerlijke ervaringen en een Q&A-community. Het platform richt zich in de startfase op **OpenClaw**, maar is opgezet om eenvoudig uit te breiden naar andere tools (Cursor, Claude Code, enz.).

> **Status:** MVP live — 25 fases afgerond (februari 2026)

---

## Wat is dit project?

Een Nederlandstalig online platform dat:

- **Eén herkenbare plek** biedt voor informatie, discussie en hulp rond AI-assistenten
- **Praktisch en functioneel** is: concrete stappen, codevoorbeelden en eerlijke ervaringen (geen marketingpraat)
- **Zowel beginners als developers** bedient: laagdrempelige uitleg én geavanceerde use cases
- **SEO-gedreven** traffic wil genereren (doel: minimaal 10.000 unieke bezoekers per maand, organisch)
- **Op termijn monetiseerbaar** is via advertenties, sponsoring en premium content, zonder de gebruikerservaring te schaden

### Doelgroepen

| Doelgroep | Behoefte |
| --------- | -------- |
| **Developers** | Snel installeren, fouten oplossen, best practices |
| **Solo builders / ondernemers** | Betrouwbare uitleg, use cases, tijd besparen |
| **Power users** | Geavanceerde tutorials, vergelijkingen, tips & tricks |
| **Beginners** | Stap-voor-stap uitleg, veilige eerste stappen |

---

## Structuur van het platform (informatie-architectuur)

De site is opgebouwd volgens een vaste URL-structuur (SEO-vriendelijk, kebab-case, Nederlandstalig waar logisch):

| Pad | Inhoud |
| --- | ------ |
| `/` | Home |
| `/openclaw` | OpenClaw overzicht |
| `/openclaw/installatie` | Installatiehandleiding |
| `/openclaw/tutorials` | Overzicht tutorials |
| `/openclaw/tutorials/[slug]` | Enkele tutorial |
| `/openclaw/use-cases` | Use cases |
| `/openclaw/nieuws` | Nieuws |
| `/ai-assistenten` | Overzicht alle tools |
| `/ai-assistenten/cursor` | Cursor |
| `/ai-assistenten/claude-code` | Claude Code |
| `/ai-assistenten/overzicht` | Vergelijking |
| `/qa` | Q&A-overzicht (vragen en antwoorden) |
| `/qa/vraag/[id]` | Enkele vraag + antwoorden |
| `/blog` | Blog overzicht |
| `/blog/[slug]` | Blogartikel |
| `/kennisbank` | Kennisbank |

---

## Technische stack

| Onderdeel | Keuze |
| --------- | ------ |
| **Frontend** | Next.js (App Router), server-side rendering voor SEO |
| **Backend / data** | Supabase (Auth, Postgres, Storage) |
| **Hosting** | Vercel (of vergelijkbaar) |
| **Zoek** (later) | Meilisearch of Typesense |

- **Accounts:** registratie, login, profiel via Supabase Auth; rollen: User, Moderator, Admin, AI-bot
- **Q&A:** forumachtig – vragen, antwoorden, reacties; anoniem lezen, account nodig om te posten
- **SEO:** meta titles/descriptions, sitemap, robots.txt, breadcrumbs, structured data (Schema.org)

---

## Roadmap – hoe we bouwen

De ontwikkeling verloopt in **fases** (zie [roadmap/ROADMAP.md](roadmap/ROADMAP.md)). Elke fase heeft een eigen document in de map `roadmap/` met concrete taken.

### Overzicht fases

| Fase | Onderwerp |
| ---- | --------- |
| **0–4** | Projectsetup, Next.js-basis, design & componenten, Supabase, database & auth |
| **5–9** | Sessie & profiel, URL-structuur, SEO-basis, sitemap/robots, OpenClaw-sectie |
| **10–14** | OpenClaw-tutorials, blog & nieuws, RSS-feed, Q&A-datamodel en API |
| **15–19** | Q&A-frontend en formulieren, breadcrumbs & 404, structured data, eerste content |
| **20–25** | Interne links, moderatie-basis, deploy & CI/CD, monitoring, legal & compliance, MVP-afronding |

Na elke fase: commit, changelog in `docs/CHANGELOG.md` bijwerken, documentatie in `/docs/` aanvullen, en push naar GitHub.

### Na de MVP

- **Fase 2 (PRD):** Meer tools (Cursor, Claude Code), AI-bots, advertenties/sponsoring, zoekfunctie, nieuwsbrief
- **Fase 3 (PRD):** Premium content, API, managed AI-diensten en leadgeneratie

---

## Lokale ontwikkeling

### Vereisten

- Node.js 24+ geïnstalleerd
- npm of yarn
- Git

### Installatie en opstart

1. **Clone de repository**
   ```bash
   git clone <repository-url>
   cd aiassistentplatform
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Configureer environment variabelen**
   - Kopieer `.env.example` naar `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Vul in `.env.local` je Supabase credentials in (zie Fase 3 voor Supabase setup)

4. **Start de development server**
   ```bash
   npm run dev
   ```

5. **Open de applicatie**
   - Navigeer naar [http://localhost:3000](http://localhost:3000)
   - De applicatie start zelfs zonder Supabase-credentials (deze zijn pas nodig vanaf Fase 4)

### Beschikbare scripts

| Script | Beschrijving |
| ------ | ------------ |
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Bouwt productie-versie |
| `npm run start` | Start productie server |
| `npm run lint` | Draait ESLint code checks |

---

## Documentatie

| Document | Beschrijving |
| -------- | ------------ |
| [prd.md](prd.md) | Product Requirements Document – doel, doelgroepen, architectuur, MVP, KPI's, risico's |
| [roadmap/ROADMAP.md](roadmap/ROADMAP.md) | Volledige roadmap met alle fases en links naar fase-documenten |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Wijzigingslogboek per fase/release |
| [docs/database-schema.md](docs/database-schema.md) | Database schema, RLS policies en indexen (Supabase/Postgres) |
| [docs/supabase-setup.md](docs/supabase-setup.md) | Supabase project setup en configuratie |
| [docs/seo.md](docs/seo.md) | SEO-implementatie: metadata, sitemap, breadcrumbs, structured data |
| [docs/blog.md](docs/blog.md) | Blog data-structuur en instructies voor nieuwe artikelen |
| [docs/qa.md](docs/qa.md) | Q&A API-contract: server actions en query-functies |
| [docs/rss.md](docs/rss.md) | RSS feed implementatie en configuratie |

---

## Succescriteria (eerste 6–12 maanden)

| Criterium | Doel |
| --------- | ---- |
| Organisch verkeer | ≥ 10.000 unieke bezoekers/maand |
| Indexatie | Belangrijke pagina’s in Google |
| Community | Min. 50 Q&A-vragen + antwoorden in eerste 3 maanden |
| Tijd op pagina (tutorials) | Gemiddeld > 3 min op key-tutorials |

---

## Wat we bewust níet doen (MVP)

- Geen Engelstalige versie; focus 100% Nederlands
- Geen eigen AI-model trainen of hosten
- Geen real-time chat; Q&A is asynchroon (forumachtig)
- Geen mobiele app; responsive website is voldoende
- Geen upvotes op Q&A, geen premium content of API in de eerste release

---

*Dit project volgt het PRD (prd.md) en de stapsgewijze roadmap in [roadmap/ROADMAP.md](roadmap/ROADMAP.md). Voor vragen of wijzigingen: PRD en roadmap bijwerken en versienummers/documentstatus aanpassen.*
