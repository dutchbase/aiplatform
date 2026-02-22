# Fase 15 – Q&A-frontend

**Doel:** Bezoekers zien een Q&A-overzicht en kunnen een enkele vraag met alle antwoorden en reacties bekijken. Geen formulieren in deze fase; alleen weergave en navigatie.

---

## Doel van deze fase

- `/qa` toont een lijst van vragen (titel, auteur of anoniem, datum, eventueel excerpt). Klik op een vraag gaat naar `/qa/vraag/[id]`.
- `/qa/vraag/[id]` toont de vraag (titel, body, auteur, datum) en daaronder alle antwoorden; onder elk antwoord de reacties. Chronologische volgorde (PRD: in MVP geen upvotes). 404 als de vraag niet bestaat.

---

## Taken (2–3 kleine stappen)

1. **Q&A-overzicht**
   - In `app/qa/page.tsx`: haal vragen op via de read-functie uit Fase 14. Toon voor elke vraag: titel, link naar `/qa/vraag/[id]`, auteur (display name of “Gebruiker”), datum. Optioneel: korte excerpt van body. Metadata voor de pagina (title, description).

2. **Vraag-detailpagina**
   - In `app/qa/vraag/[id]/page.tsx`: haal de vraag op; haal antwoorden en per antwoord de reacties op. Toon vraag bovenaan; daaronder antwoorden met daaronder hun reacties. Duidelijke visuele hiërarchie (vraag → antwoord → reactie). Metadata dynamisch (titel van de vraag in page title).

3. **Lege en foutstates**
   - Overzicht: als er geen vragen zijn, toon een vriendelijke melding (“Nog geen vragen – stel de eerste!”). Detail: bij onbekend id 404 of notFound(). Geen ongecontroleerde errors in de UI.

---

## Verwachte output

- Q&A-overzicht en vraag-detail werken met echte data uit de database. Anonieme bezoekers kunnen alles lezen. Navigatie en metadata kloppen.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (Q&A frontend – overzicht, detail).
2. **Documentatie:** In `/docs/` kort beschrijven hoe Q&A-pagina’s data laden (bijv. in `docs/qa.md` of architecture).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-15): Q&A frontend – list and question detail with answers and replies`
