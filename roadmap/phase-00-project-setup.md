# Fase 0 – Projectsetup

**Doel:** Een stabiele projectbasis met repo-structuur, dependencies en environment, zodat alle volgende fases op dezelfde stack bouwen.

---

## Doel van deze fase

- Projectmap en bestandsstructuur klaar voor Next.js + Supabase.
- Dependencies vastgelegd (package.json met versies).
- Environment-variabelen gedocumenteerd (template `.env.example`).
- README bijgewerkt met korte projectbeschrijving en instructies om lokaal te starten.

---

## Taken (2–3 kleine stappen)

1. **Repo-structuur**
   - Zorg dat de volgende mappen bestaan: `app/`, `components/`, `lib/`, `public/`, `docs/`.
   - Zorg dat `docs/CHANGELOG.md` bestaat (mag leeg of met één initiële regel).

2. **Next.js en dependencies**
   - Initialiseer een Next.js-project (App Router) als dat nog niet bestaat, of voeg ontbrekende dependencies toe: `next`, `react`, `react-dom`, `@supabase/supabase-js`, `@supabase/ssr` (of actuele aanbeveling voor Next.js).
   - Leg versies vast in `package.json`; gebruik geen wildcards voor productiedependencies.

3. **Environment en README**
   - Maak `.env.example` met alle benodigde variabelen (bijv. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), zonder echte waarden.
   - Werk `README.md` bij: projectnaam, korte beschrijving (Nederlandse AI Assistenten Hub), en stappen om lokaal te starten (install, env kopiëren, `npm run dev`).

---

## Verwachte output

- Duidelijke mapstructuur.
- Werkend `npm install` en `npm run dev` (Next.js start, ook zonder Supabase-keys).
- `.env.example` en README genoeg voor een andere developer of AI-agent om verder te bouwen.

---

## Verplichte afsluiting (elke fase)

Na het uitvoeren van de taken moet de AI-agent:

1. **Changelog:** In `docs/CHANGELOG.md` een korte entry toevoegen voor deze fase (bijv. “Fase 0: projectsetup – Next.js, dependencies, .env.example, README”).
2. **Documentatie:** In `/docs/` een bestand toevoegen of bijwerken dat de projectstructuur beschrijft (bijv. `docs/project-structure.md` of een bestaand overzicht).
3. **Git:** Alle wijzigingen stagen (`git add`), committen met onderstaande commit message, en naar GitHub pushen (`git push`).

**Commit message (voorbeeld):**  
`chore(phase-0): project setup – structure, dependencies, .env.example, README`
