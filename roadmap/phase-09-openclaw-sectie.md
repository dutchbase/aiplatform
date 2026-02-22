# Fase 9 – OpenClaw-sectie

**Doel:** De OpenClaw-sectie is herkenbaar en bruikbaar: overzichtspagina met uitleg en links naar installatie, tutorials, use-cases en nieuws; installatiepagina met echte inhoudsstructuur (tekst kan in een volgende fase).

---

## Doel van deze fase

- `/openclaw` toont een overzicht met korte introductie en duidelijke links/subnavigatie naar installatie, tutorials, use-cases, nieuws.
- `/openclaw/installatie` heeft een vaste structuur (stappen of secties) zodat alleen de inhoud later hoeft te worden ingevuld (Fase 19).
- Styling en navigatie consistent met de rest van de site (header, footer, breadcrumbs kunnen in Fase 17; interne links hier al wel).

---

## Taken (2–3 kleine stappen)

1. **OpenClaw-overzicht**
   - In `app/openclaw/page.tsx`: Nederlandse introductietekst over OpenClaw en het platform; knoppen of links naar Installatie, Tutorials, Use cases, Nieuws. Gebruik bestaande componenten (Header/Footer) en design tokens.

2. **Installatiepagina-structuur**
   - In `app/openclaw/installatie/page.tsx`: plaatshouders voor secties (bijv. “Vereisten”, “Stap 1”, “Stap 2”, “Controleren”). Geen volledige handleidingtekst; wel duidelijke koppen en eventueel genummerde stappen. Metadata (title, description) voor deze pagina instellen.

3. **Subnavigatie OpenClaw**
   - Voeg binnen de OpenClaw-sectie een eenvoudige subnavigatie toe (tabs of links) op overzicht en installatie zodat bezoekers snel naar tutorials, use-cases en nieuws kunnen. Werk eventueel de Header bij met een dropdown of duidelijke link naar “OpenClaw” die naar het overzicht gaat.

---

## Verwachte output

- Bezoekers zien een duidelijke OpenClaw-sectie met overzicht en installatiepagina; navigatie tussen onderdelen werkt. Installatiepagina is klaar om in Fase 19 met echte tekst te worden gevuld.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (OpenClaw-sectie, overzicht, installatie-structuur).
2. **Documentatie:** In `/docs/` kort beschrijven hoe de OpenClaw-contentstructuur is opgezet (bijv. in `docs/content-structure.md`).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-9): OpenClaw section – overview, install page structure, subnav`
