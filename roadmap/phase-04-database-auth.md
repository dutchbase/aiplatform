# Fase 4 – Database & auth

**Doel:** Gebruikers kunnen zich registreren en inloggen. Database ondersteunt gebruikers en rollen; Supabase Auth wordt gebruikt voor authenticatie.

---

## Doel van deze fase

- Supabase Auth ingeschakeld: registratie (e-mail/wachtwoord) en login.
- Database-schema voor gebruikersprofiel en rollen (bijv. `profiles` gekoppeld aan `auth.users`; rol: user, moderator, admin). Zie PRD sectie 8.2 en Appendix B.
- Geen uitgebreide profielpagina; die komt in Fase 5. Focus op: aanmelden, inloggen, sessie.

---

## Taken (2–3 kleine stappen)

1. **Database-schema**
   - Maak een `profiles`-tabel (bijv. `id` UUID references `auth.users(id)`, `display_name`, `role`, `created_at`, `updated_at`). Maak een migratie of SQL-script en documenteer dit in `/docs/` (bijv. `docs/database-schema.md`).
   - Stel Row Level Security (RLS) in zodat gebruikers alleen hun eigen profiel kunnen lezen/updaten; admins kunnen meer (optioneel in deze fase: alleen eigen profiel).

2. **Auth-flows**
   - Registratie: pagina of modal met e-mail en wachtwoord; na succes redirect naar home of dashboard. Gebruik Supabase Auth `signUp`.
   - Login: formulier met e-mail en wachtwoord; `signInWithPassword`. Na login sessie cookie (Supabase handelt dit af met de juiste middleware).
   - Logout: knop of link die `signOut` aanroept.

3. **Middleware sessie**
   - Zet Next.js middleware op die de Supabase-sessie vernieuwt (zie Supabase docs voor Next.js). Bescherm nog geen routes; alleen sessie up-to-date houden.

---

## Verwachte output

- Nieuwe gebruikers kunnen zich registreren; bestaande kunnen inloggen en uitloggen.
- Sessie blijft behouden na refresh. Profiel/rol in database beschikbaar voor latere autorisatie.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (database schema, auth, registratie, login).
2. **Documentatie:** `/docs/database-schema.md` (of gelijknamig) bijwerken met `profiles` en RLS; in `docs/supabase-setup.md` of apart bestand auth-flows beschrijven.
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-4): database schema profiles, Supabase Auth – register, login, session middleware`
