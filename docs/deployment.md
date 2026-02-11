# Deployment

Handleiding voor het deployen van de Nederlandse AI Assistenten Hub naar Vercel.

---

## Benodigde omgevingsvariabelen

| Variabele | Verplicht | Omschrijving | Waar te vinden |
|-----------|-----------|-------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Ja | Supabase project-URL | Supabase Dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ja | Publieke anon key (veilig voor browser, respecteert RLS) | Supabase Dashboard → Project Settings → API → Project API keys → anon/public |
| `SUPABASE_SERVICE_ROLE_KEY` | Ja (server-only) | Service role key voor server-side admin-operaties (bypasses RLS) — **NOOIT client-side blootstellen** | Supabase Dashboard → Project Settings → API → service_role key |
| `NEXT_PUBLIC_BASE_URL` | Ja | Productie-URL inclusief `https://` (bijv. `https://aiassistentenhub.nl`) — gebruikt door `metadataBase` in `app/layout.tsx` en de RSS-feed | Jouw productiedomein |

Zie `.env.example` voor een volledig overzicht met placeholder-waarden.

---

## Vercel deployment — stapsgewijs

1. Ga naar [vercel.com](https://vercel.com) en log in (of maak een gratis account aan).
2. Klik op **"Add New..."** → **"Project"** en kies **"Import Git Repository"**.
3. Zoek en selecteer de `aiassistentplatform` repository.
4. Vercel detecteert Next.js automatisch — laat het **Framework Preset** op "Next.js" staan.
5. Voeg onder **"Environment Variables"** de vier variabelen uit de tabel hierboven toe met productiewaarden.
   - Stel `NEXT_PUBLIC_BASE_URL` in op het Vercel-domein (bijv. `https://aiassistentplatform.vercel.app`) of jouw eigen domein.
   - Beperk `SUPABASE_SERVICE_ROLE_KEY` tot **Production** scope (zie beveiligingsnotities hieronder).
6. Klik op **"Deploy"** — Vercel voert automatisch `npm run build` uit (duurt 2–3 minuten).
7. Na het deployen: controleer de productie-URL op correcte Nederlandse inhoud en werkende auth.

---

## Automatische deployments

Na de initiële setup triggert elke push naar de `main`-branch automatisch een nieuwe Vercel productie-deployment. Pull requests krijgen automatisch een preview-deployment.

---

## CI-pipeline

Het project gebruikt een GitHub Actions workflow op `.github/workflows/ci.yml`:

- **Trigger:** elke push naar `main` en elke pull request gericht op `main`
- **Stappen:** afhankelijkheden installeren (`npm ci`), linting (`npm run lint`), bouwen (`npm run build`)
- **Effect:** een gefaalde lint of build blokkeert de CI-check — pull requests tonen een rode ✗
- **Placeholder env vars:** de CI-build gebruikt placeholder-waarden voor Supabase (geen echte credentials nodig in GitHub Actions secrets)

---

## Lokale ontwikkeling

```bash
cp .env.example .env.local
# Vul .env.local in met jouw eigen waarden
npm run dev
```

`.env.local` staat in `.gitignore` en mag **nooit** worden gecommit.

---

## Beveiligingsnotities

- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security (RLS). Voeg deze variabele alleen toe in Vercel met **Production**-scope, tenzij preview/development ook admin-operaties nodig hebben.
- Voeg `SUPABASE_SERVICE_ROLE_KEY` **nooit** toe aan `.github/workflows/ci.yml` — de CI-build heeft deze sleutel niet nodig.
- Commit nooit `.env.local` of andere bestanden met echte credentials.
