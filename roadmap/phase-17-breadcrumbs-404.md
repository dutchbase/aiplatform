# Fase 17 – Breadcrumbs en 404

**Doel:** Breadcrumbs op alle relevante onderniveaus (PRD 4.4); een vriendelijke 404-pagina met zoeksuggestie en links naar hoofdsecties.

---

## Doel van deze fase

- Breadcrumb-component die het pad toont (bijv. Home, OpenClaw, Tutorials, [Titel]). Gebruik op openclaw, openclaw/installatie, openclaw/tutorials, openclaw/tutorials/[slug], blog, blog/[slug], qa, qa/vraag/[id], ai-assistenten, kennisbank.
- 404-pagina: eigen layout (niet alleen browser-default). Tekst zoals "Pagina niet gevonden", korte uitleg, link naar zoek of homepage, en links naar /openclaw, /blog, /qa. Optioneel: zoekveld dat naar een zoekpagina of later naar de zoekfunctie leidt.

---

## Taken (2–3 kleine stappen)

1. **Breadcrumb-component**
   - Maak een herbruikbare Breadcrumbs-component die een array van label en href accepteert. Gebruik semantische markup (nav, aria). Integreer in layout(s) of per pagina. Vul het pad per route: home, sectie, eventueel subniveau, huidige pagina (geen link op laatste item).

2. **Breadcrumbs per sectie**
   - Op elke relevante pagina het juiste breadcrumb-pad doorgeven (openclaw, tutorials, blog, qa, ai-assistenten, kennisbank). Geen dubbele of ontbrekende niveaus. Houd URLs stabiel (kebab-case, Nederlands waar in PRD).

3. **404-pagina**
   - Maak app/not-found.tsx. Toon een duidelijke titel en korte tekst. Links naar: home, OpenClaw, Blog, Q&A (en eventueel Kennisbank, AI-assistenten). Optioneel: zoekveld (placeholder totdat zoek in een latere fase komt). Styling consistent met de rest van de site.

---

## Verwachte output

- Elke onderniveau-pagina toont correcte breadcrumbs. Onbekende URLs tonen de custom 404 met nuttige links. Geen generieke browser-404.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** docs/CHANGELOG.md bijwerken (breadcrumbs, 404-pagina).
2. **Documentatie:** In /docs/ beschrijven waar breadcrumbs worden gebruikt en hoe de 404 is opgezet (bijv. docs/seo.md of docs/ux.md).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-17): breadcrumbs on all sections, custom 404 with links`
