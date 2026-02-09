# Fase 1 – Next.js-appbasis

**Doel:** Een minimale Next.js-app met App Router, root layout en een eenvoudige homepagina, zodat alle verdere pagina’s in dezelfde app worden gebouwd.

---

## Doel van deze fase

- App Router-structuur onder `app/` (layout, page).
- Eén root layout met basis-HTML (lang, charset, viewport) en een plek voor globale styling.
- Homepagina (`/`) die een korte welkomsttekst toont (Nederlands).
- Geen externe styling-bibliotheek verplicht; wel consistente basis (bijv. één CSS-file of Tailwind als al gekozen).

---

## Taken (2–3 kleine stappen)

1. **Root layout**
   - In `app/layout.tsx`: `<html>`, `<body>`, metadata (title, description), en een eenvoudige structuur (bijv. `<main>`).
   - Zorg dat een globale stylesheet wordt geïmporteerd (bijv. `app/globals.css`).

2. **Homepagina**
   - In `app/page.tsx`: een duidelijke titel en korte introductietekst voor “Nederlandse AI Assistenten Hub” (Nederlands), zonder verdere navigatie of formulieren.

3. **Basis metadata**
   - Stel in de root layout (of op de homepagina) een standaard `metadata`-object in voor title en description, zodat SEO-basis aanwezig is.

---

## Verwachte output

- `npm run dev` toont de homepagina met Nederlandse tekst.
- Geen console-errors; pagina is server-side rendered.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken met entry voor Fase 1 (Next.js app basis, layout, homepagina).
2. **Documentatie:** In `/docs/` documenteren hoe de app-structuur eruitziet (bijv. in `docs/project-structure.md` of `docs/architecture.md`).
3. **Git:** Wijzigingen stagen, committen, pushen naar GitHub.

**Commit message (voorbeeld):**  
`feat(phase-1): Next.js app basis – root layout, home page, metadata`
