# Fase 22 – Deploy en CI/CD

**Doel:** Applicatie draait in productie op Vercel (of vergelijkbaar); productie-environment variabelen zijn geconfigureerd; bij push op main wordt automatisch gedeployed (PRD 8.5).

---

## Doel van deze fase

- Vercel-project gekoppeld aan de repo (of andere hosting); productie-URL bereikbaar.
- Environment variables in Vercel (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, evt. NEXT_PUBLIC_SITE_URL) ingesteld. Geen secrets in code.
- CI: bij push/PR op main (of release-branch) worden lint en eventueel tests gedraaid. Documenteer in README of docs hoe deploy werkt.

---

## Taken (2–3 kleine stappen)

1. **Vercel-deploy**
   - Koppel de repository aan Vercel; kies Next.js als framework. Zorg dat de build slaagt (npm run build). Stel productie-env in (Supabase URL en anon key, en indien gebruikt SITE_URL voor canonical/sitemap). Eerste deploy uitvoeren; controleer dat de site bereikbaar is.

2. **Environment en build**
   - Documenteer in README en in /docs/ welke env vars nodig zijn voor productie. Zorg dat .env.example up-to-date is. Optioneel: staging environment met eigen Supabase-project of branch. Geen .env of .env.local in repo.

3. **CI (lint en optional tests)**
   - GitHub Actions workflow (of Vercel built-in checks): bij push op main (en evt. PRs) run npm run lint. Optioneel: npm run test als tests bestaan. Bij falen: deployment blokkeren of status melden. Documenteer in docs/deployment.md.

---

## Verwachte output

- Productie-URL werkt; auth en content laden correct. Wijzigingen op main resulteren in een nieuwe deploy. Lint (en evt. tests) draaien automatisch.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** docs/CHANGELOG.md bijwerken (deploy Vercel, productie-env, CI).
2. **Documentatie:** docs/deployment.md (of gelijknamig) met stappen voor deploy en vereiste env vars.
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
chore(phase-22): Vercel deploy, production env, CI lint (and optional tests)
