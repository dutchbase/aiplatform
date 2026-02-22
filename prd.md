# PRD – Nederlandse AI Assistenten Hub (met focus op OpenClaw)

**Documentversie:** 1.1  
**Laatst bijgewerkt:** 2025-02-09  
**Status:** Verrijkt en uitgebreid

---

## Inhoudsopgave

1. [Doel & Ambitie](#1-doel--ambitie)
2. [Positionering](#2-positionering)
3. [Doelgroepen](#3-doelgroepen)
4. [Informatie-architectuur (SEO-first)](#4-informatie-architectuur-seo-first)
5. [Community & Q&A](#5-community--qa)
6. [Contentstrategie](#6-contentstrategie)
7. [Monetisatie](#7-monetisatie)
8. [Technische Architectuur](#8-technische-architectuur)
9. [Governance & Moderatie](#9-governance--moderatie)
10. [KPI's & Succesmeting](#10-kpis--succesmeting)
11. [MVP Scope & User Stories](#11-mvp-scope--user-stories)
12. [Roadmap](#12-roadmap)
13. [Risico's & Mitigatie](#13-risicos--mitigatie)
14. [Open punten & Beslismatrix](#14-open-punten--beslismatrix)
15. [Niet-functionele eisen](#15-niet-functionele-eisen)
16. [Recht & Compliance](#16-recht--compliance)
17. [Glossarium](#17-glossarium)
18. [Referenties & Appendix](#18-referenties--appendix)

---

## 1. Doel & Ambitie

### 1.1 Doel

Een Nederlandstalig online platform bouwen dat:

* **Dé centrale hub** is voor AI-assistenten in Nederland – één herkenbare plek voor informatie, discussie en praktische hulp.
* **Primair inspeelt op de OpenClaw-hype**, maar **schaalbaar** is naar andere AI-assistenten (Cursor, Claude Code, etc.) zonder lock-in.
* **SEO-gedreven traffic** genereert – eerste mijlpaal: **minimaal 10.000 maandelijkse bezoekers** (unieke bezoeken, organisch).
* **Op termijn monetiseerbaar** is via advertenties, sponsoring en premium content, zonder de gebruikerservaring te schaden.
* **Functioneert als leadmachine** voor toekomstige managed AI-diensten (consultancy, implementatie, training).

### 1.2 Ambitie

Het platform moet:

* **Praktisch en functioneel** zijn – geen marketingpraat; concrete stappen, codevoorbeelden en eerlijke ervaringen.
* **Zowel beginners als developers/power users** bedienen – laagdrempelige uitleg én geavanceerde use cases.
* **Onafhankelijk** blijven van één specifieke tool – OpenClaw is het startpunt, geen exclusieve binding.

### 1.3 Succescriteria (hoe meten we dat het doel gehaald is?)

| Criterium | Doel (eerste 6–12 maanden) | Meetmethode |
|-----------|----------------------------|-------------|
| Organisch verkeer | ≥ 10.000 unieke bezoekers/maand | Google Analytics / Search Console |
| Indexatie | Belangrijke pagina’s geïndexeerd in Google | Search Console |
| Community-activiteit | Min. 50 Q&A-vragen + antwoorden in eerste 3 maanden | Database / admin dashboard |
| Tijd op pagina (tutorials) | Gem. > 3 min op key tutorials | Analytics |
| Nieuwsbrief/conversie | Optioneel: eerste 500 inschrijvingen | E-mailplatform |

### 1.4 Scope boundaries (wat doen we bewust níet?)

* Geen Engelstalige versie in MVP; focus 100% Nederlands.
* Geen eigen AI-model trainen of hosten; we zijn een hub voor bestaande tools.
* Geen real-time chat in MVP; Q&A is asynchroon (forum-achtig).
* Geen mobiele app in MVP; responsive website is voldoende.

---

## 2. Positionering

### 2.1 Merkpositionering

* **OpenClaw** wordt in de beginfase gepositioneerd als “de standaard” waar het platform op inspeelt.
* De **architectuur en contentstructuur** zijn **tool-agnostisch**: nieuwe AI-assistenten kunnen zonder grote refactor worden toegevoegd.
* Het platform profileert zich als:

  > “De Nederlandse hub voor AI-assistenten, met praktische kennis, eerlijke ervaringen en een actieve Q&A-community.”

### 2.2 Unique Value Proposition (UVP)

* **Enige Nederlandstalige hub** die OpenClaw + andere AI-assistenten combineert met docs, tutorials en Q&A.
* **Praktijkgericht**: echte use cases, foutoplossingen en vergelijkingen, geen vage beloftes.
* **Community-gedreven**: vragen beantwoorden door gebruikers en (goedgekeurde) AI-bots, met duidelijke labeling.

### 2.3 Tone of Voice

* **Toegankelijk** – begrijpelijk voor niet-experts, maar niet kinderachtig.
* **Eerlijk** – ook nadelen en beperkingen van tools benoemen.
* **Actiegericht** – “zo doe je het” met concrete stappen.

### 2.4 Concurrentie (kort)

* Generieke tech-fora (bijv. Reddit, Tweakers): breder, niet AI-specifiek en vaak Engels.
* Officiële documentatie van tools: vaak Engels, weinig vergelijkingen of community.
* **Onze plek**: Nederlandstalig, AI-assistenten-specifiek, combinatie van gecurateerde content en community.

---

## 3. Doelgroepen

### 3.1 Primaire doelgroepen

| Doelgroep | Beschrijving | Behoefte / Job-to-be-done |
|-----------|--------------|----------------------------|
| **Developers** | Gebruiken AI-assistenten voor coding, automation, agents | Snel installeren, fouten oplossen, best practices vinden |
| **Solo builders / technische ondernemers** | Bouwen producten of diensten met AI-tools | Betrouwbare uitleg, use cases, tijd besparen |
| **Power users** | Intensieve gebruikers van OpenClaw, Cursor, Claude Code | Geavanceerde tutorials, vergelijkingen, tips & tricks |

### 3.2 Secundaire doelgroepen

| Doelgroep | Beschrijving | Behoefte |
|-----------|--------------|----------|
| **Beginners** | Willen AI-assistenten leren gebruiken | Stap-voor-stap uitleg, geen jargon, veilige eerste stappen |
| **Professionals** | Willen AI inzetten in werkprocessen | Use cases per branche, ROI, praktische integratie |

### 3.3 Persona-schetsen (verkort)

* **“Dev Dave”** – developer, 28–40, wil snel kunnen werken met OpenClaw/Cursor, zoekt codevoorbeelden en troubleshooting.
* **“Builder Britt”** – ondernemer, bouwt side projects, wil geen tijd verliezen aan verkeerde keuzes; behoefte aan vergelijkingen en eerlijke reviews.
* **“Starter Sam”** – beginner, wil eerst begrijpen wat AI-assistenten zijn en hoe hij veilig kan beginnen.

### 3.4 Waar bereiken we ze? (kanalen)

* Zoekmachines (SEO) – longtail queries, how-to’s, “OpenClaw installatie”, “Cursor vs Claude”.
* Social (later): X/Twitter, LinkedIn, relevante Discord/Slack communities.
* Nieuwsbrief (na MVP): wekelijkse of maandelijkse round-up.

---

## 4. Informatie-architectuur (SEO-first)

### 4.1 Structuur (keuze B – bevestigd)

Het platform krijgt duidelijke secties per AI-assistent en thema:

* **/openclaw**
  * /openclaw/installatie
  * /openclaw/tutorials
  * /openclaw/use-cases
  * /openclaw/nieuws
* **/ai-assistenten**
  * /ai-assistenten/cursor
  * /ai-assistenten/claude-code
  * /ai-assistenten/overzicht
* **/qa** (Q&A-platform)
* **/blog**
* **/kennisbank**

Deze structuur is SEO-vriendelijk, verkoopbaar als contentplatform en eenvoudig uitbreidbaar naar nieuwe tools.

### 4.2 URL-conventies

* **Kebab-case**, Nederlandstalig waar logisch: `/openclaw/installatie`, `/ai-assistenten/overzicht`.
* **Stabiele URLs** – geen wijziging van slugs na publicatie (redirects bij hernoemen).
* **Canonical URLs** – één canonieke URL per pagina; duplicate content vermijden.

### 4.3 Sitemap & indexatie

* **XML sitemap** beschikbaar voor crawlers (`/sitemap.xml`).
* **Robots.txt** correct geconfigureerd (geen blokkering van content-pagina’s).
* **Structured data** (Schema.org) waar relevant: Article, FAQPage, QAPage voor Q&A.

### 4.4 Navigatie & vindbaarheid

* **Breadcrumbs** op alle onderniveaus (bijv. Home > OpenClaw > Tutorials > [Titel]).
* **Interne links** tussen gerelateerde artikelen en Q&A.
* **404-pagina** met zoeksuggestie en links naar hoofdsecties.

---

## 5. Community & Q&A

### 5.1 Q&A-model (keuze B)

* **Discussie-gedreven** (forumachtig): vragen met meerdere antwoorden mogelijk.
* **Reacties op antwoorden** – draad-achtige discussie onder een antwoord.
* **Upvotes** later toevoegen (fase 2); in MVP geen upvotes, wel chronologische volgorde.

### 5.2 Toegang

| Actie | Toegang |
|-------|---------|
| Lezen (Q&A, artikelen) | Anoniem toegestaan |
| Vraag stellen / antwoorden posten | Account verplicht |
| Bepaalde secties (premium/expert) | Later afgeschermd (fase 2) |

### 5.3 AI-accounts

* AI-assistenten kunnen **eigen accounts** krijgen (bijv. “OpenClaw Bot”).
* Duidelijk **gelabeld** als “AI Bot” bij elke post.
* AI mag content posten **nadat het account door een moderator is goedgekeurd**.
* AI-posts moeten voldoen aan de **communityrichtlijnen**; anders worden ze gemodereerd of verwijderd.

### 5.4 Gedragsregels (kort)

* Respectvol blijven; geen haat, spam of illegale content.
* Ruimte voor **kritische discussie** over tools en leveranciers.
* Geen persoonlijke aanvallen; focus op inhoud.

### 5.5 Spam- en misbruikpreventie

* Rate limiting op posten (bijv. max. X vragen/antwoorden per uur per gebruiker).
* Optioneel: CAPTCHA of vergelijkbare check bij registratie of eerste post.
* Rapport-knop bij elke vraag/antwoord; moderators kunnen actie ondernemen.

### 5.6 Notificaties (scope MVP / later)

* **MVP**: optioneel e-mail bij antwoord op eigen vraag.
* **Fase 2**: instelbare notificaties (e-mail, in-app), herinneringen bij onbeantwoorde vragen.

---

## 6. Contentstrategie

### 6.1 Contenttypes

| Type | Doel | Voorbeeld |
|------|------|-----------|
| Installatiehandleidingen | Snel aan de slag | “OpenClaw installeren op Windows” |
| Vergelijkingen | Keuze ondersteunen | “OpenClaw vs Cursor vs Claude Code” |
| Use cases | Inspiratie en herkenning | “Automatiseer je deployment met OpenClaw” |
| Troubleshooting / fouten | Problemen oplossen | “Fout X bij OpenClaw: oorzaak en oplossing” |
| Nieuws & updates | Actualiteit | “OpenClaw versie 1.2 uit” |
| Opinies en analyses | Eerlijke blik | “Waarom ik overstapte van tool A naar B” |

### 6.2 Contentcreatie

* **AI mag content genereren** – eerste versies van artikelen of antwoorden.
* **Publicatie pas na menselijke goedkeuring** – geen volledig geautomatiseerde publicatie van AI-content zonder review.
* **Community kan bijdragen** – gebruikers kunnen vragen stellen en antwoorden geven; optioneel later: guest posts of ingezonden artikelen (met redactie).
* **AI-bots mogen publiceren** zodra het account is goedgekeurd, met **logging en moderatie** (zie sectie 8.4 en 9).

### 6.3 Kwaliteitscriteria voor content

* **Correct en actueel** – stappen kloppen, versienummers en links gecontroleerd.
* **Nederlandstalig** – tenzij een Engelstalige term standaard is (bijv. “pull request”).
* **Toegankelijk** – duidelijke koppen, korte alinea’s, code in codeblokken.
* **Eerlijk** – nadelen en beperkingen noemen waar relevant.

### 6.4 Content lifecycle

* **Datum van publicatie** zichtbaar; bij grote updates “Laatst bijgewerkt” tonen.
* **Review-moment** – periodiek (bijv. per kwartaal) key-pagina’s controleren op actualiteit.
* **Archiveren** – verouderde artikelen markeren als “archief” in plaats van verwijderen (behoud voor SEO).

### 6.5 Distributie

* **RSS-feeds** vanaf MVP (per sectie en totaal).
* **API** mogelijk in fase 2 (betaald of met rate limit).
* **Nieuwsbrief** (fase 2): samenvatting nieuwe content + highlights Q&A.

---

## 7. Monetisatie

### 7.1 Fase 1 (kortetermijn)

* **Advertenties** – niche-relevant: AI-tools, hosting, developer tools; niet opdringerig (geen takeover, beperkt aantal units).
* **Sponsoring** van content of secties – bijv. “Deze sectie wordt mede mogelijk gemaakt door [sponsor]”, met duidelijke scheiding redactie/sponsor.

### 7.2 Fase 2

* **Premium content** – deep dives, scripts, templates, exclusieve tutorials (abonnement of eenmalige betaling).
* **Gesponsorde plaatsingen** – “Aanbevolen tool” of vergelijkbare units, gelabeld als advertentie.

### 7.3 Fase 3 (toekomst)

* **Managed AI-assistenten** voor bedrijven – implementatie, training, beheer.
* **Leadgeneratie** voor implementatieprojecten – contactformulier of CTA naar diensten.

### 7.4 Randvoorwaarden monetisatie

* Gebruikerservaring mag niet significant verslechteren door ads.
* Transparantie: advertenties en sponsoring altijd herkenbaar.
* Privacy: geen tracking voor ads zonder toestemming (AVG); cookiebanner/consent waar nodig.

---

## 8. Technische Architectuur

### 8.1 Frontend

* **Next.js** (App Router), **SSR** voor SEO – belangrijke content server-side rendered.
* **Server Components** waar mogelijk; Client Components alleen voor interactiviteit.
* **Snelle laadtijden** – Core Web Vitals (LCP, FID/INP, CLS) als KPI; afbeeldingen geoptimaliseerd (next/image of equivalent).
* **Responsive** – bruikbaar op desktop en mobiel; geen aparte app in MVP.

### 8.2 Backend

* **Supabase**:
  * **Auth** – registratie, login, wachtwoord vergeten, sessiebeheer.
  * **Postgres** – alle relationele data (gebruikers, Q&A, artikelen, etc.).
  * **Storage** – assets (afbeeldingen, bijlagen in posts indien gewenst).
* **Role-based access**:
  * **User** – kan posten, eigen profiel beheren.
  * **Moderator** – kan posts bewerken/verbergen, gebruikers waarschuwen.
  * **Admin** – volledige rechten, inclusief AI-accounts en instellingen.
  * **AI-bot** – specifiek rol/label voor goedgekeurde AI-accounts.

### 8.3 Zoek

* **Meilisearch of Typesense** – full-text search over:
  * Q&A (vragen en antwoorden),
  * Artikelen (blog, docs, tutorials),
  * Kennisbank.
* **Filters** (fase 1 of 2): op sectie, datum, auteur, tag.

### 8.4 AI-integratie

* **Webhook/API** om:
  * Posts (vragen/antwoorden) aan te leveren,
  * Content (concepten) aan te leveren voor review.
* **Moderatie-laag**:
  * AI-posts kunnen automatisch worden gepubliceerd **na** account-goedkeuring (per bot-account).
  * **Logging** van alle AI-acties (wie, wanneer, welke post) voor audit en eventuele terugtrekking.

### 8.5 Hosting & omgeving

* **Hosting**: Vercel of vergelijkbaar voor Next.js; Supabase cloud voor database en auth.
* **Omgevingen**: ten minste **development** en **production**; optioneel **staging** voor acceptatie.
* **CI/CD**: automatische deploy bij push op main (of release-branch); tests en lint in pipeline.

### 8.6 Monitoring & beschikbaarheid

* **Uptime-monitoring** – basis (bijv. externe ping of Vercel analytics).
* **Error tracking** – bijv. Sentry voor frontend/backend-fouten.
* **Logging** – gestructureerde logs voor kritieke acties (aanmelden, posten, moderatie).

---

## 9. Governance & Moderatie

### 9.1 Communityrichtlijnen

* **Respectvol** – geen haat, discriminatie of intimidatie.
* **Geen illegale content** – geen inbreuk op intellectueel eigendom, geen oproep tot illegale activiteiten.
* **Ruimte voor kritische discussie** – over tools, leveranciers en keuzes; persoonlijke aanvallen blijven niet toegestaan.

### 9.2 AI-content

* **Altijd gelabeld** – elke post van een AI-account is zichtbaar als “AI Bot” (of vergelijkbaar).
* **Disclaimers** waar nodig – bij code of advies dat direct wordt overgenomen (“controleer altijd in je eigen omgeving”).

### 9.3 Privacy

* **AVG** – verwerking van persoonsgegevens volgens geldende wetgeving; privacyverklaring beschikbaar.
* **Industry standards** – veilige opslag van wachtwoorden (Supabase), geen onnodige data-retentie.

### 9.4 Escalatie

* Gebruikers kunnen **rapporteren**; moderators beoordelen en nemen actie (waarschuwing, verbergen, schorsing).
* **Appeals** (fase 2): mogelijkheid om een beslissing aan te vechten bij een andere moderator of admin.
* **Transparantie** – waar mogelijk korte toelichting bij verwijdering (bijv. “in strijd met richtlijn X”).

---

## 10. KPI's & Succesmeting

### 10.1 KPI-overzicht

| KPI | Doel (voorbeeld) | Bron |
|-----|------------------|------|
| Organisch verkeer | ≥ 10.000 unieke bezoekers/maand | Google Analytics |
| Aantal Q&A-posts | Groei maand-op-maand; min. 50 in eerste 3 mnd | Database |
| Actieve gebruikers | Registraties + terugkerende bezoekers | Analytics + Auth |
| Indexatie | Belangrijke URLs geïndexeerd | Google Search Console |
| Tijd op pagina (tutorials) | Gem. > 3 min op key-pagina’s | Analytics |
| Conversies | Nieuwsbrief-inschrijvingen, premium (later) | E-mailplatform / backend |

### 10.2 Rapportage

* **Maandelijks** – verkeer, top-pagina’s, Q&A-activiteit, eventuele incidenten.
* **Kwartaal** – voortgang richting mijlpalen, besluiten over roadmap.

---

## 11. MVP Scope & User Stories

### 11.1 Must-have (eerste release)

* **OpenClaw-sectie**: installatiepagina + min. 3 tutorials (concrete onderwerpen nog bepalen).
* **Q&A basisfunctionaliteit**: vragen stellen, antwoorden posten, reacties op antwoorden; anoniem lezen, account voor posten.
* **Accountsysteem**: registratie, login, profielbasis (Supabase Auth).
* **Blog/nieuws**: minimaal een overzichtspagina + detailpagina; eerste artikelen handmatig of via CMS.
* **RSS-feed**: ten minste één feed (bijv. alle nieuwe content of per sectie).
* **SEO-structuur**: URLs, meta titles/descriptions, sitemap, breadcrumbs.

### 11.2 Nice-to-have (als tijd is)

* Basis **moderatie**: rapport-knop, eenvoudige queue voor moderators.
* **AI-posting** met goedgekeurd account en logging.
* **Zoekfunctie** (Meilisearch/Typesense) over Q&A en artikelen.

### 11.3 User stories (voor MVP)

| Als … | wil ik … | zodat … |
|-------|-----------|----------|
| Bezoeker | OpenClaw kunnen installeren via een duidelijke handleiding | ik snel kan starten zonder te zoeken. |
| Bezoeker | Een vraag stellen over een fout of gebruik | ik antwoord krijg van de community of docs. |
| Bezoeker | Tutorials en vergelijkingen lezen | ik betere keuzes kan maken. |
| Gebruiker | Een account aanmaken en inloggen | ik vragen kan stellen en antwoorden kan geven. |
| Moderator | Ongepaste posts kunnen verbergen of verwijderen | de community veilig en relevant blijft. |
| Bezoeker | Via zoekmachine op de site komen | ik oplossingen vind voor mijn zoekvraag. |

### 11.4 Out-of-scope voor MVP

* Upvotes op Q&A.
* Premium content of betaalmuren.
* API voor derden.
* Meerdere talen.
* Mobiele app.
* Real-time chat.

---

## 12. Roadmap

### 12.1 Fase 1 – MVP (2–4 weken)

* Platform live (hosting, domein, basis-SSL).
* OpenClaw-content: installatie + 3 tutorials.
* Q&A werkend (stellen, beantwoorden, reacties).
* Accounts (registreren, inloggen).
* Blog/nieuws + RSS.
* SEO-structuur (URLs, meta, sitemap).

### 12.2 Fase 2 – Groei

* Meer tools toevoegen (Cursor, Claude Code, overzicht).
* AI-bots actiever laten meedoen (goedgekeurde accounts, logging).
* Ads/sponsoring integreren (zonder UX-schade).
* Zoekfunctie verfijnen; eventueel upvotes.
* Nieuwsbrief en/of notificaties.

### 12.3 Fase 3 – Opschalen

* Premium content.
* API (betaald of gelimiteerd).
* Managed AI-diensten en leadgeneratie.

### 12.4 Afhankelijkheden

* Domein en hosting geregeld vóór of tijdens MVP.
* Content (min. 3 tutorials + installatie) klaar of in beheer vóór launch.
* Moderatoren beschikbaar zodra Q&A live gaat (kan initieel dezelfde persoon zijn als beheerder).

---

## 13. Risico's & Mitigatie

| Risico | Impact | Kans | Mitigatie |
|--------|--------|------|------------|
| Te weinig community-activiteit | Laag verkeer, weinig UGC | Middel | Zelf actief content seeden; eigen team stelt en beantwoordt vragen. |
| AI-content van lage kwaliteit | Slechte indruk, spam | Middel | Kwaliteitsfilter + menselijke review vóór goedkeuring AI-account; duidelijke richtlijnen. |
| Te OpenClaw-heavy | Platform wordt als “alleen OpenClaw” gezien | Middel | Andere tools snel toevoegen (Cursor, Claude Code); positionering benadrukken. |
| SEO groeit traag | Mijlpaal 10k bezoekers niet gehaald | Middel | Longtail how-to content prioriteren; consistent publiceren; backlinks via community en partners. |
| Technische problemen (downtime, lekken) | Vertrouwen, AVG | Laag | Hosting bij betrouwbare partij; security review; backups. |

---

## 14. Open punten & Beslismatrix

### 14.1 Bewust nog open

* **Domeinnaam & branding** – definitieve naam en domein.
* **Naamgeving van het platform** – “Nederlandse AI Assistenten Hub” of een kortere merknaam.
* **Definitieve merkpositionering** t.o.v. OpenClaw (hoe prominent, hoe onafhankelijk communiceren).

### 14.2 Beslismatrix (wie beslist wat?)

| Onderwerp | Eigenaar | Opmerking |
|-----------|----------|-----------|
| Contentkalender | Product/content | Welke tutorials, wanneer |
| Moderatierichtlijnen | Product + eventueel community | Eerste versie door product |
| Technische stack (wijziging) | Tech lead / ontwikkelaar | Binnen kader PRD |
| Monetisatie (timing, partners) | Product/business | Na MVP |
| Branding/domein | Product/business | Voor launch |

---

## 15. Niet-functionele eisen

### 15.1 Performance

* **LCP** (Largest Contentful Paint): < 2,5 s op gemiddelde verbinding.
* **CLS** (Cumulative Layout Shift): < 0,1.
* **Time to First Byte (TTFB)**: acceptabel voor SSR (afhankelijk van hosting).

### 15.2 Beschikbaarheid

* Doel: **99% uptime** (exclusief gepland onderhoud); monitoring om uitval te detecteren.

### 15.3 Toegankelijkheid

* **WCAG 2.1 niveau AA** als streven (contrast, toetsenbordnavigatie, focus, alt-teksten).
* Formulieren: duidelijke labels en foutmeldingen.

### 15.4 Security

* **HTTPS** overal.
* Geen gevoelige data in URLs (geen tokens in query strings).
* Auth via Supabase (best practices voor wachtwoorden en sessies).
* Input validatie en sanitization tegen XSS en injectie.

---

## 16. Recht & Compliance

### 16.1 AVG / Privacy

* **Privacyverklaring** – welke data worden verzameld, voor welk doel, bewaartermijn, rechten (inzage, correctie, verwijdering).
* **Rechtsgrond** – waar nodig toestemming (bijv. nieuwsbrief, niet-strict-noodzakelijke cookies).
* **Data minimalisatie** – alleen verzamelen wat nodig is voor het product.
* **Beveiliging** – passende maatregelen (encryptie, toegangsbeheer).

### 16.2 Cookies

* **Cookiebanner/consent** indien er niet-strikt-noodzakelijke cookies worden gezet (analytics, ads).
* Informatie over welke cookies worden gebruikt en waarvoor.

### 16.3 Gebruiksvoorwaarden

* **Algemene voorwaarden** voor gebruik van het platform (aanmelding, gedrag, intellectueel eigendom van posts).
* **Moderatieregels** zichtbaar en vindbaar (bijv. in footer of bij eerste post).

---

## 17. Glossarium

| Term | Betekenis in dit document |
|------|----------------------------|
| **OpenClaw** | AI-assistent (tool) waar het platform in de startfase op focust. |
| **Hub** | Centrale plek voor informatie en community rond AI-assistenten. |
| **Q&A** | Vragen-en-antwoorden sectie (forumachtig). |
| **UGC** | User Generated Content – door gebruikers gegenereerde inhoud. |
| **SSR** | Server-Side Rendering – pagina’s op de server gegenereerd voor SEO en snelheid. |
| **MVP** | Minimum Viable Product – eerste bruikbare versie. |
| **Core Web Vitals** | Google-metrics voor gebruikerservaring (LCP, FID/INP, CLS). |
| **AVG** | Algemene Verordening Gegevensbescherming (GDPR). |

---

## 18. Referenties & Appendix

### 18.1 Referenties

* Next.js (App Router): [nextjs.org/docs](https://nextjs.org/docs)
* Supabase: [supabase.com/docs](https://supabase.com/docs)
* Meilisearch: [meilisearch.com/docs](https://www.meilisearch.com/docs)
* WCAG 2.1: [W3C WCAG](https://www.w3.org/WAI/WCAG21/quickref/)

### 18.2 Appendix A – Voorbeeld-URL-structuur (uitgewerkt)

```
/                          → Home
/openclaw                  → OpenClaw overzicht
/openclaw/installatie      → Installatie
/openclaw/tutorials        → Overzicht tutorials
/openclaw/tutorials/[slug] → Enkele tutorial
/openclaw/use-cases        → Use cases
/openclaw/nieuws           → Nieuws
/ai-assistenten            → Overzicht alle tools
/ai-assistenten/cursor     → Cursor
/ai-assistenten/claude-code → Claude Code
/ai-assistenten/overzicht  → Vergelijking
/qa                        → Q&A overzicht
/qa/vraag/[id]             → Enkele vraag + antwoorden
/blog                      → Blog overzicht
/blog/[slug]               → Blogartikel
/kennisbank                → Kennisbank
/sitemap.xml               → Sitemap
```

### 18.3 Appendix B – Rol-permissies (technisch)

| Rol | Rechten (samenvatting) |
|-----|------------------------|
| **Anoniem** | Alles lezen (artikelen, Q&A). |
| **User** | Lezen + eigen vragen/antwoorden posten, eigen profiel beheren. |
| **Moderator** | User + posts verbergen/verwijderen, rapporten afhandelen, geen gebruikersbeheer. |
| **Admin** | Alles inclusief gebruikers, AI-accounts, instellingen. |
| **AI-bot** | Posten namens bot-account (na goedkeuring); gelabeld als AI. |

---

**Einde PRD.**  
Voor vragen of wijzigingen: document bijwerken en versienummer/status aanpassen.
