# Fase 12 – RSS-feed

**Doel:** Ten minste één RSS-feed beschikbaar zodat lezers nieuwe content kunnen volgen (PRD 6.5). Bij voorkeur een feed voor alle nieuwe content of per sectie (bijv. blog).

---

## Doel van deze fase

- Een route die een geldige RSS XML teruggeeft (bijv. `/feed.xml` of `/rss`). Gebruik Next.js Route Handler of een dedicated route.
- Feed bevat: titel van het platform, link naar site, beschrijving, en items (bijv. laatste blogposts en/of laatste tutorials). Elk item: title, link, description (of excerpt), pubDate.
- Optioneel: aparte feed voor blog alleen (bijv. `/blog/feed.xml`); minimaal één algemene of blog-feed is verplicht.

---

## Taken (2–3 kleine stappen)

1. **RSS-endpoint**
   - Maak een route die RSS XML genereert (bijv. `app/feed.xml/route.ts` of `app/rss/route.ts`). Content-type: `application/rss+xml` of `application/xml`. Gebruik dezelfde data-bron als blog (en eventueel tutorials) om items te vullen.

2. **Feed-inhoud**
   - Stel channel title, link en description in. Voeg items toe: voor elk blogartikel (en optioneel openclaw/nieuws of tutorials) een item met title, link (absolute URL), description/excerpt, pubDate in RFC 822 of ISO 8601. Sorteer op datum; beperk tot bijv. laatste 20 items.

3. **Vindbaarheid**
   - Voeg in de root layout of in een `<head>`-component een `<link rel="alternate" type="application/rss+xml" href="...">` toe zodat lezers de feed kunnen ontdekken. Documenteer de feed-URL in `/docs/`.

---

## Verwachte output

- Bezoek aan de gekozen feed-URL levert geldige RSS XML. Een RSS-client kan de feed parsen. Link in HTML aanwezig.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (RSS-feed toegevoegd).
2. **Documentatie:** In `/docs/` beschrijven waar de feed staat en welke content erin zit (bijv. `docs/rss.md` of in `docs/content-structure.md`).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-12): RSS feed – endpoint, blog items, link in head`
