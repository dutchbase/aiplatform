# Fase 5 – Sessie & profiel

**Doel:** De ingelogde gebruiker ziet zijn sessie in de UI (bijv. header) en kan een eenvoudige profielpagina bekijken en basisgegevens beheren.

---

## Doel van deze fase

- Header toont voor anonieme bezoekers “Inloggen”/“Registreren”; voor ingelogde gebruikers “Mijn profiel” en “Uitloggen”.
- Profielpagina toont display name en e-mail (uit auth); optioneel: bewerken van display name, opgeslagen in `profiles`.
- Uitloggen werkt overal waar de header zichtbaar is.

---

## Taken (2–3 kleine stappen)

1. **Header: auth-status**
   - In `components/Header.tsx`: gebruik Supabase om de huidige sessie op te halen (server-side of client-side, consistent met je setup). Toon conditioneel: links voor Login/Registreren of Profiel/Uitloggen.
   - Zorg dat “Uitloggen” de Supabase `signOut` aanroept en daarna een redirect (bijv. naar home).

2. **Profielpagina**
   - Maak een route `app/profiel/page.tsx` (of `/account`). Alleen toegankelijk voor ingelogde gebruikers; anders redirect naar login.
   - Toon gegevens uit `auth.users` (e-mail) en `profiles` (display_name). Laad profiel op basis van `auth.getUser()` en dan profiel ophalen uit database.

3. **Profiel bewerken**
   - Op de profielpagina: formulier om alleen `display_name` te wijzigen. Server Action of API-route die `profiles` update met RLS. Toon succes- of foutmelding.

---

## Verwachte output

- Ingelogde gebruikers zien in de header dat ze zijn ingelogd en kunnen naar profiel en uitloggen.
- Profielpagina toont en update display name; wijzigingen blijven na refresh behouden.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (sessie in header, profielpagina, uitloggen).
2. **Documentatie:** In `/docs/` beschrijven waar profiel en auth-UI zitten (bijv. in `docs/architecture.md` of `docs/auth.md`).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
`feat(phase-5): session in header, profile page, edit display name, logout`
