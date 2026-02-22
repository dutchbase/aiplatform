# Fase 7 – SEO-basis

**Doel:** Elke paginatype heeft een duidelijke meta title en description; Open Graph-basis voor delen. Geen dubbele titels; standaard waarden waar nodig.

---

## Doel van deze fase

- Root layout of default metadata levert een standaard title en description voor het hele platform.
- Sectie-pagina’s (openclaw, blog, qa, ai-assistenten, kennisbank) hebben eigen `metadata` of `generateMetadata` met titel en description.
- Detailpagina’s (blog/[slug], openclaw/tutorials/[slug], qa/vraag/[id]) zijn voorbereid op dynamische metadata (in deze fase mag je vaste placeholder-metadata gebruiken als de data er nog niet is).

---

## Taken (2–3 kleine stappen)

1. **Standaard metadata**
   - In `app/layout.tsx`: stel een default `metadata`-object in met `title` (template mag: “%s | Nederlandse AI Assistenten Hub”) en `description`. Zorg dat child-pagina’s dit kunnen overschrijven.

2. **Metadata per sectie**
   - Voor elke sectie-root (openclaw, blog, qa, ai-assistenten, kennisbank): voeg in de bijbehorende `layout.tsx` of `page.tsx` specifieke `metadata` toe met Nederlandse titel en korte description (1–2 zinnen). Gebruik geen dubbele of lege titles.

3. **Open Graph**
   - Voeg op ten minste de root layout basis Open Graph-velden toe: `openGraph.title`, `openGraph.description`, en indien mogelijk `openGraph.url` (of later dynamisch). Afbeelding is optioneel in deze fase.

---

## Verwachte output

- Elke belangrijke route heeft een unieke, zinvolle title en description in de HTML. Delen op socials toont titel en description (OG). Geen duplicate content-waarschuwing door identieke meta op alle pagina’s.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (SEO-basis, metadata, Open Graph).
2. **Documentatie:** In `/docs/` kort beschrijven hoe metadata en SEO zijn opgezet (bijv. `docs/seo.md`).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-7): SEO basis – metadata, Open Graph per section`
