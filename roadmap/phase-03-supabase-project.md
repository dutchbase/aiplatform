# Fase 3 – Supabase-project

**Doel:** Supabase als backend koppelen: project aanmaken of koppelen, env-variabelen gebruiken en een eenvoudige “health check” zodat latere fases kunnen bouwen op een werkende verbinding.

---

## Doel van deze fase

- Supabase-project beschikbaar (cloud of lokaal); credentials in `.env.local` (niet in repo).
- `.env.example` uitgebreid met alle Supabase-variabelen die het project gebruikt.
- Een Supabase-client (browser + optioneel server) in `lib/` die in de rest van de app wordt gebruikt.
- Geen database-tabellen of auth in deze fase; alleen connectie en configuratie.

---

## Taken (2–3 kleine stappen)

1. **Supabase-client**
   - Maak `lib/supabase/client.ts` voor client-side gebruik (aan te roepen vanuit Client Components) en, indien nodig, `lib/supabase/server.ts` voor server-side (Server Components, Route Handlers, Server Actions). Gebruik `@supabase/supabase-js` en `@supabase/ssr` volgens de actuele Next.js + Supabase documentatie.
   - Lees URL en anon key uit `process.env.NEXT_PUBLIC_SUPABASE_URL` en `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`.

2. **Environment**
   - Update `.env.example` met: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Voeg een korte comment toe per variabele.
   - Documenteer in README of in `/docs/` dat een Supabase-project moet worden aangemaakt en dat `.env.local` moet worden gevuld.

3. **Connectie testen**
   - Voeg een eenvoudige check toe die de verbinding test (bijv. een Server Action of Route Handler die `supabase.from('_test').select().limit(1)` uitvoert, of een bestaande tabel). Als er nog geen tabel is: documenteer dat de “health check” in een volgende fase wordt toegevoegd; zorg wel dat de client zonder runtime-error wordt geïmporteerd als de env-vars ontbreken (graceful degradation).

---

## Verwachte output

- App start met geldige Supabase-credentials; geen hardcoded secrets.
- Andere developers kunnen met `.env.example` en documentatie zelf een project koppelen.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (Supabase-project, client, env).
2. **Documentatie:** In `/docs/` een bestand over Supabase-setup (bijv. `docs/supabase-setup.md`) met stappen om project en env in te vullen.
3. **Git:** Stagen, committen, pushen. Geen `.env` of `.env.local` committen.

**Commit message (voorbeeld):**  
`chore(phase-3): Supabase project – client, env vars, setup docs`
