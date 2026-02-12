# Admin Dashboard – Documentatie

## Overzicht

Het admin-paneel is bereikbaar via `/admin` en is uitsluitend toegankelijk voor gebruikers met `role = 'admin'` in de `profiles` tabel.

## Toegangsbeheer

De `/admin` route is beveiligd via `app/admin/layout.tsx`:
1. Controleert of de gebruiker ingelogd is via `auth.getUser()` — redirect naar `/login` als niet ingelogd
2. Controleert het profiel: `profiles.role === 'admin'` — redirect naar `/` als niet admin
3. Elke Server Action in het admin-paneel roept ook `verifyAdmin()` aan (defense in depth)

## Service-role Client (`lib/supabase/admin.ts`)

```typescript
import { supabaseAdmin } from '@/lib/supabase/admin'
```

⚠️ **Beveiligingswaarschuwing:** De service-role sleutel bypassed alle RLS policies. Dit bestand:
- Mag **NOOIT** worden geïmporteerd in Client Components
- Mag **NOOIT** worden geïmporteerd in pagina-bestanden die `'use client'` hebben
- Mag **ALLEEN** worden gebruikt in Server Actions en server-only functies

De service-role sleutel staat in `.env.local` als `SUPABASE_SERVICE_ROLE_KEY`. Dit bestand wordt nooit gecommit.

## Routes

| Route | Beschrijving |
|-------|-------------|
| `/admin` | Dashboard homepage met navigatiekaarten |
| `/admin/gebruikers` | Lijst van alle gebruikers (gepagineerd, 50/pagina) |
| `/admin/gebruikers/[id]` | Gebruikersdetail: info, rolwijziging, verwijdering |
| `/admin/content` | Q&A inhoudbeheer (zie Phase 27) |
| `/admin/statistieken` | Platform KPI's en groeidata (zie Phase 28) |

## Gebruikersbeheer

### Gebruikerslijst
- Gebruikt `supabaseAdmin.auth.admin.listUsers()` om auth-gebruikers op te halen (inclusief e-mailadressen)
- Jointed met `profiles` tabel voor `display_name`, `role` en `updated_at`
- Paginering via `?page=N` query parameter

### Rolwijziging
- Geldige rollen: `user`, `moderator`, `admin`
- Update `profiles.role` via de admin client
- Vereist admin-verificatie in de Server Action

### Gebruiker verwijderen
- Roept `supabaseAdmin.auth.admin.deleteUser(userId)` aan
- Door de cascade-relatie in `profiles` wordt ook het profiel verwijderd
- Content (vragen, antwoorden) blijft behouden maar wordt anoniem

## Statistieken (Phase 28)

Zie `docs/admin.md` (uitgebreid na Phase 28 implementatie).
