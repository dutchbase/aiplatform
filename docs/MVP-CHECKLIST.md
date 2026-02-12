# MVP Checklist — Fase 25 Verificatie

**Datum:** 2026-02-12
**Doel:** Bevestig dat alle PRD 11.1 must-haves zijn geïmplementeerd vóór de MVP release.

---

## 1. OpenClaw sectie

| Item | Bestand | Status | Notitie |
|------|---------|--------|---------|
| Installatiepagina met echte inhoud | `app/openclaw/installatie/page.tsx` | PASS | Metadata aanwezig; Nederlandstalige inhoud: vereisten, 5 installatiestappen, verificatiesectie |
| 3 tutorials met echte content | `lib/data/tutorials.ts` | PASS | 3 tutorials: eerste-stappen, configuratie, tips; elk 4 stappen met volledige inhoud |
| Tutorial detail met SSG | `app/openclaw/tutorials/[slug]/page.tsx` | PASS | generateStaticParams aanwezig; pre-rendert 3 slugs bij build |

## 2. Q&A platform

| Item | Bestand | Status | Notitie |
|------|---------|--------|---------|
| createQuestion server action | `app/qa/actions.ts` | PASS | Geëxporteerd; auth-check via supabase.auth.getUser(); validatie titel ≥10 en body ≥20 tekens |
| createAnswer server action | `app/qa/actions.ts` | PASS | Geëxporteerd; auth-check via supabase.auth.getUser(); UUID-validatie op question_id |
| createReply server action | `app/qa/actions.ts` | PASS | Geëxporteerd; auth-check via supabase.auth.getUser(); UUID-validatie op answer_id |
| Q&A detailpagina met antwoorden | `app/qa/vraag/[id]/page.tsx` | PASS | AnswerForm geïmporteerd; antwoord-threads met replies; login-CTA voor niet-ingelogde bezoekers |

## 3. Accounts (auth)

| Item | Bestand | Status | Notitie |
|------|---------|--------|---------|
| Login (signIn) | `app/login/actions.ts` | PASS | Functie login aanwezig; signInWithPassword + logEvent + redirect |
| Registratie (signUp) | `app/login/actions.ts` | PASS | Functie signup aanwezig; signUp met display_name + logEvent + redirect |
| Profielpagina | `app/profiel/page.tsx` | PASS | createClient + auth.getUser(); redirect('/login') bij niet-geauthenticeerd |

## 4. Blog + RSS

| Item | Bestand | Status | Notitie |
|------|---------|--------|---------|
| 3 blogartikelen | `lib/data/blog.ts` | PASS | 3 artikelen: waarom-ai-assistenten-development-versnellen, ai-assistent-kiezen-2026, prompt-engineering-voor-developers |
| RSS feed endpoint | `app/feed.xml/route.ts` | PASS | GET-functie aanwezig; Content-Type: application/rss+xml; RSS 2.0 met Atom-namespace |

## 5. SEO structuur

| Item | Bestand | Status | Notitie |
|------|---------|--------|---------|
| Sitemap (inclusief OpenClaw, blog, Q&A) | `app/sitemap.ts` | PASS | /openclaw, /blog en /qa aanwezig; 14 URLs in totaal |
| Robots.txt | `app/robots.ts` | PASS | robots()-functie met allow: '/' en disallow: ['/api/'], sitemap-link aanwezig |
| Breadcrumbs component | `components/ui/breadcrumbs.tsx` | PASS | Breadcrumbs en BreadcrumbItem geëxporteerd; aria-label en aria-current aanwezig |
| 404 pagina | `app/not-found.tsx` | PASS | Custom not-found pagina met navigatie naar 4 secties (OpenClaw, Blog, Q&A, AI Assistenten) |

---

## Samenvatting

- **Totaal items:** 13
- **PASS:** 13
- **FAIL:** 0
- **Opmerkingen:** Alle PRD 11.1 must-haves zijn geïmplementeerd. Cookie banner (fase 24-02) en monitoring/legal (fases 23–24) zijn eveneens aanwezig maar vallen buiten de 13 kernpunten van deze checklist.

---

*Codebase verificatie door Claude (plan 25-01). Productie verificatie door gebruiker in checkpoint.*
