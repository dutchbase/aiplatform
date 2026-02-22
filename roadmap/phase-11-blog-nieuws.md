# Fase 11 – Blog & nieuws

**Doel:** Blog/nieuws heeft een overzichtspagina en een detailpagina per artikel. Data kan uit een eenvoudige bron komen (JSON, Markdown of database); keuze documenteren.

---

## Doel van deze fase

- `/blog` toont een lijst van artikelen (titel, datum, korte beschrijving of excerpt, link naar detail).
- `/blog/[slug]` toont één artikel. Metadata (title, description) dynamisch op basis van het artikel.
- Minimaal één voorbeeldartikel zodat de flow werkt. Publicatiedatum en eventueel “Laatst bijgewerkt” tonen (PRD 6.4).

---

## Taken (2–3 kleine stappen)

1. **Data-bron blog**
   - Kies een bron voor blogposts: lokaal JSON/Markdown in de repo of een Supabase-tabel. Maak een utility of server-functie die alle posts ophaalt (voor overzicht) en één post op slug (voor detail). Documenteer de keuze in `/docs/`. Als je een tabel kiest: migratie toevoegen en documenteren.

2. **Blog-overzicht**
   - In `app/blog/page.tsx`: toon alle artikelen met titel, datum, excerpt en link naar `/blog/[slug]`. Sorteer op datum (nieuwste eerst). Metadata voor de blog-overzichtspagina.

3. **Blog-detail**
   - In `app/blog/[slug]/page.tsx`: toon één artikel; gebruik `generateMetadata` voor title en description. Toon publicatiedatum; optioneel “Laatst bijgewerkt” als veld aanwezig is. 404 voor onbekende slug. Zorg voor leesbare layout (koppen, alinea’s).

---

## Verwachte output

- Blog-overzicht en -detail werken; minimaal één artikel is zichtbaar. Datum en metadata kloppen. Structuur klaar voor meer artikelen in Fase 19 of later.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (blog overzicht, detail, data-bron).
2. **Documentatie:** In `/docs/` beschrijven waar blogdata vandaan komt en hoe nieuwe posts worden toegevoegd (bijv. `docs/content-structure.md` of `docs/blog.md`).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-11): blog – list, detail by slug, data source, metadata`
