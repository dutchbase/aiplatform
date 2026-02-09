# Fase 18 – Structured data

**Doel:** Schema.org structured data toevoegen waar relevant (PRD 4.3): Article voor blog en tutorials, FAQPage waar van toepassing, QAPage voor Q&A-vragen.

---

## Doel van deze fase

- Blogartikelen en tutorial-pagina's: JSON-LD Article (headline, datePublished, dateModified, author, description).
- Q&A-vraagpagina: JSON-LD QAPage met de vraag en antwoorden als Answer-items (of vergelijkbaar volgens Schema.org).
- Optioneel: FAQPage op een pagina met FAQ's als die bestaat; anders overslaan of placeholder.
- Script in head of in de pagina; geen dubbele blokken per type.

---

## Taken (2–3 kleine stappen)

1. **Article voor blog en tutorials**
   - Op blog/[slug] en openclaw/tutorials/[slug]: voeg een JSON-LD script tag toe met type Article. Vul headline, datePublished, dateModified (indien beschikbaar), author (naam of organisatie), description. Gebruik dezelfde data als voor metadata; geen hardcoded dummy-dates in productie.

2. **QAPage voor Q&A**
   - Op qa/vraag/[id]: voeg JSON-LD toe voor QAPage. MainEntity: de vraag; acceptedAnswer of suggestedAnswer: de antwoorden. Volg Schema.org-specificatie zodat zoekmachines de structuur kunnen herkennen.

3. **Validatie en documentatie**
   - Test met Google Rich Results Test of een andere validator (optioneel, lokaal). Documenteer in /docs/ welke paginatypes structured data hebben en welke properties worden gezet (bijv. in docs/seo.md).

---

## Verwachte output

- Blog- en tutorialpagina's hebben Article JSON-LD; Q&A-vraagpagina heeft QAPage. Geen syntaxfouten in JSON-LD. Documentatie bijgewerkt.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** docs/CHANGELOG.md bijwerken (Schema.org Article, QAPage).
2. **Documentatie:** In docs/seo.md (of gelijknamig) beschrijven welke structured data waar staat.
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-18): Schema.org structured data – Article, QAPage`
