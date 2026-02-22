# Fase 26 – Admin Dashboard: Basis & Gebruikersbeheer

**Doel:** Creëer de `/admin` sectie met een service-role Supabase-client, een admin-only layout-guard, een dashboardhomepagina, en een volledig gebruikersbeheerscherm (lijst, rolwijziging, verwijderen).

---

## Doel van deze fase

- `/admin` sectie is uitsluitend toegankelijk voor gebruikers met `role = 'admin'`. Elke andere gebruiker wordt doorgestuurd naar `/`.
- Een admin-dashboardhomepagina met navigatiekaarten naar Gebruikers, Moderatie en Statistieken.
- Gebruikerslijst met paginering: toont `display_name`, `email` (via service-role `auth.admin.listUsers()`), `role`, `aangemaakt op`.
- Admin kan de rol van een gebruiker wijzigen (`user` → `moderator` → `admin`) via een dropdown + Server Action.
- Admin kan een gebruiker verwijderen (soft-delete via service-role `auth.admin.deleteUser()`).
- Conditionele admin-link in de header (zichtbaar alleen als `profile.role === 'admin'`).

---

## Taken (3 kleine stappen)

1. **Service-role Supabase-client & admin-guard layout**
   - Maak `lib/supabase/admin.ts` met een Supabase-client geïnitialiseerd via `SUPABASE_SERVICE_ROLE_KEY` (server-only, nooit naar browser exporteren).
   - Maak `app/admin/layout.tsx`: laad het profiel van de ingelogde gebruiker, controleer `role === 'admin'`, redirect naar `/` als niet admin.
   - Maak `app/admin/page.tsx`: eenvoudige dashboardhomepagina met 3 navigatiekaarten (Gebruikers, Moderatie, Statistieken).
   - Voeg conditionele admin-link toe aan `components/layout/header.tsx`.

2. **Gebruikerslijst pagina**
   - Maak `app/admin/gebruikers/page.tsx`: roep `auth.admin.listUsers()` aan (via admin-client), join met `profiles` tabel voor `display_name` en `role`, toon in een tabel met paginering (50 per pagina via `page` query param).
   - Maak `app/admin/gebruikers/[id]/page.tsx`: detailpagina voor één gebruiker (naam, email, rol, aangemeldingsdatum, aantal vragen/antwoorden).

3. **Rolbeheer & gebruiker verwijderen Server Actions**
   - Maak `app/admin/gebruikers/actions.ts` met:
     - `updateUserRole(userId: string, role: 'user' | 'moderator' | 'admin')` — update `profiles.role` via gewone server-client na verificatie dat aanroeper admin is.
     - `deleteUser(userId: string)` — roep `auth.admin.deleteUser(userId)` aan via admin-client; cascade verwijdert het profiel via de bestaande trigger.
   - Beide actions re-verifiëren dat de aanroepende gebruiker nog steeds admin is voor uitvoering.
   - Voeg rol-dropdown en verwijder-knop toe op de gebruikersdetailpagina.

---

## Verwachte output

- `/admin` sectie met werkende layout-guard (niet-admins worden doorgestuurd).
- Admin kan alle gebruikers zien, rollen wijzigen, en gebruikers verwijderen.
- Service-role client geïsoleerd in `lib/supabase/admin.ts` (nooit geëxporteerd naar client-code).

---

## Verplichte afsluiting

1. **Changelog:** `docs/CHANGELOG.md` bijwerken.
2. **Documentatie:** `docs/admin.md` aanmaken (admin-sectie, toegangsbeheer, service-role veiligheid).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**
feat(phase-26): admin dashboard foundation – layout guard, user management, role assignment
