# Fase 16 – Q&A-formulieren

**Doel:** Ingelogde gebruikers kunnen een vraag stellen, een antwoord geven en een reactie plaatsen via formulieren. Auth-check: niet-ingelogde gebruikers worden naar login geleid of zien een duidelijke oproep om in te loggen.

---

## Doel van deze fase

- Formulier "Vraag stellen" op /qa of op een aparte pagina "Nieuwe vraag"; na succes redirect naar de nieuwe vraag.
- Op de vraag-detailpagina: formulier "Antwoord geven"; na submit wordt het antwoord getoond (refresh of optimistic update).
- Bij elk antwoord: formulier "Reageer"; na submit wordt de reactie getoond. Alle acties gebruiken de Server Actions uit Fase 14.

---

## Taken (2–3 kleine stappen)

1. **Formulier: vraag stellen**
   - Een pagina of sectie met formulier (titel, body). Client-side of server-side validatie (verplicht, max lengte). Bij submit: aanroep createQuestion Server Action. Bij succes: redirect naar /qa/vraag/[id]. Bij niet ingelogd: redirect naar login of toon melding om in te loggen om een vraag te stellen. Toon foutmelding bij validatie- of serverfout.

2. **Formulier: antwoord geven**
   - Op /qa/vraag/[id]: formulier "Plaats antwoord" (body). Alleen zichtbaar of bruikbaar als gebruiker is ingelogd; anders "Log in om te antwoorden". Submit: createAnswer; daarna pagina vernieuwen of antwoord toevoegen aan de lijst. Foutafhandeling en succesfeedback.

3. **Formulier: reactie op antwoord**
   - Bij elk antwoord een knop/link "Reageer" die een klein formulier opent of toont (body). Alleen voor ingelogde gebruikers. Submit: createReply; daarna reactie zichtbaar onder het antwoord. Geen volledige paginareload vereist; herladen van de reacties is voldoende.

---

## Verwachte output

- Ingelogde gebruikers kunnen vragen stellen, antwoorden en reacties plaatsen. Niet-ingelogde gebruikers zien een duidelijke CTA om in te loggen. Geen posten zonder account (PRD 5.2).

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** docs/CHANGELOG.md bijwerken (Q&A-formulieren – vraag, antwoord, reactie).
2. **Documentatie:** In /docs/ beschrijven waar de formulieren staan en hoe auth wordt gecontroleerd (bijv. in docs/qa.md).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
feat(phase-16): Q&A forms – ask question, post answer, post reply (auth required)
