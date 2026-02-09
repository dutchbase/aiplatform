# Fase 24 – Legal en compliance

**Doel:** Voldoen aan PRD 16: privacyverklaring, cookiebanner/consent waar nodig, en gebruiksvoorwaarden. AVG-proof en transparant.

---

## Doel van deze fase

- Privacyverklaring: welke data worden verzameld, doel, bewaartermijn, rechten (inzage, correctie, verwijdering). Pagina bereikbaar (bijv. /privacy) en link in footer.
- Cookiebanner/consent: als er niet-strikt-noodzakelijke cookies worden gezet (analytics, ads later), toon een consent-banner. Informatie over welke cookies worden gebruikt (pagina of sectie in privacy).
- Gebruiksvoorwaarden: algemene voorwaarden voor gebruik van het platform (aanmelding, gedrag, intellectueel eigendom van posts). Link in footer en evt. bij registratie.

---

## Taken (2–3 kleine stappen)

1. **Privacyverklaring**
   - Schrijf of plaats een privacyverklaring (Nederlands) op /privacy. Behandel: verantwoordelijke, verzamelde gegevens (account, posts, logs), doelen, rechtsgrond, bewaartermijn, rechten (inzage, correctie, verwijdering, klacht), beveiliging, wijzigingen. Link in footer op elke pagina. Documenteer in /docs/ dat de tekst juridisch kan worden getoetst.

2. **Cookiebanner en consent**
   - Als er analytics of andere niet-noodzakelijke cookies zijn: toon bij eerste bezoek een cookiebanner (accepteer/weiger/meer info). Sla keuze op (cookie of localStorage). Meer info linkt naar /privacy#cookies of een cookie-sectie. Als er nog geen niet-noodzakelijke cookies zijn: placeholder-banner of alleen link "Cookiebeleid" in footer is oké.

3. **Gebruiksvoorwaarden**
   - Pagina /gebruiksvoorwaarden (of /terms) met algemene voorwaarden: aanmelding, gebruik van de dienst, gedragsregels, intellectueel eigendom van user content, aansprakelijkheid, wijzigingen. Link in footer en optioneel bij registratie ("Ik ga akkoord met de gebruiksvoorwaarden").

---

## Verwachte output

- Privacy, cookies en gebruiksvoorwaarden zijn vindbaar en leesbaar. Cookiebanner verschijnt waar nodig. AVG en transparantie ondersteund.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** docs/CHANGELOG.md bijwerken (legal: privacy, cookiebanner, gebruiksvoorwaarden).
2. **Documentatie:** In /docs/ beschrijven waar de legal-pagina's staan en dat teksten juridisch kunnen worden getoetst (bijv. docs/legal.md).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
feat(phase-24): legal – privacy policy, cookie banner, terms of use
