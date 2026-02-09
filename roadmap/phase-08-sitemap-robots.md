# Fase 8 – Sitemap & robots

**Doel:** Crawlers kunnen de site correct indexeren: werkende `sitemap.xml` en `robots.txt`; waar relevant canonical URLs om duplicate content te voorkomen.

---

## Doel van deze fase

- `/sitemap.xml` toont een geldige XML-sitemap met alle belangrijke statische en (indien al bekend) dynamische URLs. Next.js `app/sitemap.ts` (of gelijkwaardig) gebruiken.
- `/robots.txt` staat toe dat content-pagina’s worden gecrawld; geen onnodige blokkering.
- Canonical URL waar mogelijk (bijv. op blog- en tutorial-detailpagina’s); in deze fase mag dit een vaste basis-URL zijn uit env.

---

## Taken (2–3 kleine stappen)

1. **Sitemap**
   - Implementeer `app/sitemap.ts` (of `app/sitemap.xml` route) die ten minste de home, openclaw, openclaw/installatie, openclaw/tutorials, blog, qa, ai-assistenten, kennisbank bevat. Voor dynamische routes (blog/[slug], tutorials/[slug]): als er nog geen data is, alleen de overzichtspagina’s; anders alle bekende slugs toevoegen. `lastModified` en `changeFrequency` optioneel maar aanbevolen.

2. **Robots.txt**
   - Implementeer `app/robots.ts` (of `public/robots.txt`) die `User-agent: *` toestaat voor `/` en een `Sitemap:`-verwijzing naar de absolute URL van `sitemap.xml`. Geen `Disallow` voor content-pagina’s tenzij expliciet gewenst (bijv. /api of /admin).

3. **Canonical**
   - Voeg op blog- en tutorial-detailpagina’s een canonical link toe in de metadata (bijv. `metadataBase` in layout en `alternates.canonical` per pagina). Gebruik een basis-URL uit env (bijv. `NEXT_PUBLIC_SITE_URL`) als die beschikbaar is.

---

## Verwachte output

- Bezoek aan `/sitemap.xml` en `/robots.txt` geeft correcte, valide responses. Geen blokkering van belangrijke pagina’s in robots.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (sitemap, robots, canonical).
2. **Documentatie:** In `/docs/` beschrijven waar sitemap/robots zijn geconfigureerd en hoe canonical wordt gezet (bijv. in `docs/seo.md`).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-8): sitemap.xml, robots.txt, canonical URLs`
