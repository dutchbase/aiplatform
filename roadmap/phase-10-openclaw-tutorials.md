# Fase 10 – OpenClaw-tutorials

**Doel:** Een tutorials-overzichtspagina en drie tutorial-detailpagina’s (op slug) met een vaste layout; inhoud kan placeholder of kort zijn en wordt in Fase 19 ingevuld.

---

## Doel van deze fase

- `/openclaw/tutorials` toont een lijst van tutorials (minimaal drie items) met titel, korte beschrijving en link naar de detailpagina.
- `/openclaw/tutorials/[slug]` toont één tutorial. Drie vaste slugs (bijv. `eerste-stappen`, `configuratie`, `tips`) met elk een titel en placeholder-inhoud; 404 of fallback voor onbekende slugs.
- Data mag hardcoded in code of in een simpel JSON/array; een database voor tutorials is optioneel en kan later.

---

## Taken (2–3 kleine stappen)

1. **Tutorials-overzicht**
   - In `app/openclaw/tutorials/page.tsx`: haal de lijst met tutorials op (uit een lokaal array of bestand). Toon voor elk: titel, korte omschrijving, link naar `/openclaw/tutorials/[slug]`. Metadata voor de overzichtspagina (title, description).

2. **Tutorial-detail en slugs**
   - Zorg dat `app/openclaw/tutorials/[slug]/page.tsx` drie tutorials ondersteunt (bijv. slugs: `eerste-stappen`, `configuratie`, `tips`). Gebruik `generateStaticParams` of een lookup; voor onbekende slug een 404 of redirect naar overzicht. Elke detailpagina heeft eigen title en description (generateMetadata).

3. **Layout en leesbaarheid**
   - Op de detailpagina: duidelijke titel, datum-placeholder (of “Laatst bijgewerkt”), en secties voor intro en stappen. Styling geschikt voor leesbare content (alinea’s, koppen). Geen volledige tutorialtekst nodig; placeholder-tekst is voldoende.

---

## Verwachte output

- Overzichtspagina toont drie tutorials; elke tutorial is bereikbaar via zijn slug. Onbekende slug geeft 404 of redirect. Pagina’s zijn SEO-vriendelijk (metadata).

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (OpenClaw tutorials overzicht + 3 detailpagina’s).
2. **Documentatie:** In `/docs/` beschrijven hoe tutorials zijn gestructureerd (slugs, data-bron) (bijv. in `docs/content-structure.md`).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-10): OpenClaw tutorials – list page, 3 detail pages by slug`
