# Fase 2 – Design & componenten

**Doel:** Een herbruikbare basis voor layout en navigatie: design tokens (kleuren, typografie), header, footer en een paar basis-UI-componenten.

---

## Doel van deze fase

- Eén plek voor design-beslissingen (bijv. CSS-variabelen in `globals.css` of Tailwind-config).
- Header met sitenaam en plaats voor navigatielinks (links kunnen nog `#` of placeholder-URLs zijn).
- Footer met minimaal copyright en plek voor links (bijv. privacy, voorwaarden – later ingevuld).
- Basiscomponenten (bijv. `Button`, `Link`) in `components/` zodat volgende fases deze kunnen hergebruiken.

---

## Taken (2–3 kleine stappen)

1. **Design tokens**
   - In `app/globals.css` (of de gekozen styling-oplossing): CSS-variabelen voor kleuren, font-family, eventueel spacing. Houd het minimaal maar consistent.

2. **Header en footer**
   - Maak `components/Header.tsx` en `components/Footer.tsx`. Header: sitenaam, navigatie (placeholder-links voor /, /openclaw, /blog, /qa). Footer: copyrighttekst, placeholder voor “Privacy” en “Gebruiksvoorwaarden”.
   - Integreer Header en Footer in `app/layout.tsx` zodat ze op elke pagina zichtbaar zijn.

3. **Basis-UI-componenten**
   - Maak minimaal één herbruikbare component (bijv. `components/ui/Button.tsx` of `Link.tsx`) en gebruik die op de homepagina of in de header om het patroon te tonen.

---

## Verwachte output

- Elke pagina toont dezelfde header en footer.
- Eén gezamenlijk CSS-bestand (of Tailwind) zonder duplicaat-styling; geen nieuwe CSS-bestanden met dezelfde tokens onder andere namen.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken met Fase 2 (design tokens, header, footer, basiscomponenten).
2. **Documentatie:** In `/docs/` beschrijven waar design tokens en componenten staan (bijv. `docs/design-system.md` of uitbreiding van `docs/project-structure.md`).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-2): design tokens, Header, Footer, base UI components`
