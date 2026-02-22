# Fase 6 – URL-structuur & routing

**Doel:** Alle routes uit de PRD (Appendix A) bestaan als pagina’s of placeholders, zodat navigatie en SEO-structuur kloppen en er later alleen inhoud hoeft te worden toegevoegd.

---

## Doel van deze fase

- Volgende paden bestaan en renderen een pagina (placeholder-tekst mag): `/`, `/openclaw`, `/openclaw/installatie`, `/openclaw/tutorials`, `/openclaw/tutorials/[slug]`, `/openclaw/use-cases`, `/openclaw/nieuws`, `/ai-assistenten`, `/ai-assistenten/cursor`, `/ai-assistenten/claude-code`, `/ai-assistenten/overzicht`, `/qa`, `/qa/vraag/[id]`, `/blog`, `/blog/[slug]`, `/kennisbank`.
- Kebab-case en Nederlandstalige paden waar in de PRD aangegeven; geen wijziging van bestaande slugs later zonder redirects.

---

## Taken (2–3 kleine stappen)

1. **OpenClaw-routes**
   - Maak onder `app/openclaw/`: `page.tsx` (overzicht), `installatie/page.tsx`, `tutorials/page.tsx`, `tutorials/[slug]/page.tsx`, `use-cases/page.tsx`, `nieuws/page.tsx`. Elke pagina toont een duidelijke titel en korte placeholder-tekst (bijv. “OpenClaw – Overzicht”, “Installatie – binnenkort”).

2. **AI-assistenten en overige secties**
   - Maak `app/ai-assistenten/page.tsx`, `app/ai-assistenten/cursor/page.tsx`, `app/ai-assistenten/claude-code/page.tsx`, `app/ai-assistenten/overzicht/page.tsx`.
   - Maak `app/qa/page.tsx`, `app/qa/vraag/[id]/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/kennisbank/page.tsx`. Allemaal met titel en placeholder.

3. **Navigatie bijwerken**
   - Werk de Header (en eventueel footer) bij zodat links naar deze routes wijzen. Geen gebroken links; placeholder-pagina’s zijn voldoende.

---

## Verwachte output

- Alle URLs uit de PRD zijn bereikbaar; geen 404 voor deze paden. Dynamische routes ([slug], [id]) tonen een generieke placeholder (bijv. “Tutorial” of “Vraag”).

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (URL-structuur, alle routes toegevoegd).
2. **Documentatie:** In `/docs/` een overzicht van de URL-structuur (bijv. `docs/url-structure.md` of in `docs/architecture.md`).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-6): full URL structure and routing – openclaw, ai-assistenten, qa, blog, kennisbank`
