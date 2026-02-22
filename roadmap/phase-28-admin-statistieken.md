# Fase 28 – Admin Dashboard: Statistieken & KPI-overzicht

**Doel:** Bouw een statistiekenpagina in het admin-dashboard die de PRD-succescriteria (50+ Q&A interacties, 10.000 bezoekers/maand) meetbaar maakt vanuit de applicatie zelf.

---

## Doel van deze fase

- Een `/admin/statistieken` pagina met KPI-kaarten: totale gebruikers, vragen, antwoorden, open rapporten.
- Groeistatistieken: nieuwe gebruikers en vragen de afgelopen 7 en 30 dagen.
- Meest actieve gebruikers (gerangschikt op vragen + antwoorden).
- Alle data wordt server-side opgehaald zonder client-side charting library (eenvoudige cijferkaarten volstaan voor MVP).

---

## Taken (2 kleine stappen)

1. **Statistieken query-laag**
   - Maak `lib/admin/stats.ts` met geïsoleerde server-side functies (alle gebruiken gewone server-client of `count()` queries via Supabase):
     - `getTotalUsers()` — count van `profiles`.
     - `getTotalQuestions()` — count van `questions`.
     - `getTotalAnswers()` — count van `answers`.
     - `getOpenReports()` — count van `reports` where `status = 'open'`.
     - `getNewUsersLastDays(days: number)` — gebruikers aangemaakt na `now() - interval`.
     - `getNewQuestionsLastDays(days: number)` — vragen aangemaakt na `now() - interval`.
     - `getMostActiveUsers(limit: number)` — gebruikers gesorteerd op `question_count + answer_count` (via Supabase join of RPC).
   - Alle functies gooien een fout bij DB-error (consistent met bestaand queries-patroon).

2. **Statistieken dashboard pagina**
   - Maak `app/admin/statistieken/page.tsx`:
     - 4 KPI-kaarten bovenaan: Gebruikers, Vragen, Antwoorden, Open rapporten.
     - Groeikaarten: Nieuwe gebruikers (7d / 30d) en Nieuwe vragen (7d / 30d).
     - Tabel: Top 10 meest actieve gebruikers (naam, vragen, antwoorden, totaal).
   - Alle data parallel opgehaald via `Promise.all` voor minimale laadtijd.
   - Voeg "Statistieken" navigatielink toe aan `app/admin/page.tsx`.

---

## Verwachte output

- Admin kan vanuit de applicatie de voortgang naar PRD-succescriteria meten.
- Statistieken pagina laadt snel (parallel queries, server-side rendered).
- Basis voor toekomstige uitbreiding met grafieken (Recharts/Chart.js) indien gewenst.

---

## Verplichte afsluiting

1. **Changelog:** `docs/CHANGELOG.md` bijwerken.
2. **Documentatie:** `docs/admin.md` bijwerken (statistieken-sectie toevoegen).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**
feat(phase-28): admin statistics – KPI cards, growth metrics, most active users
