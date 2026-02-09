# Fase 21 – Moderatie-basis (nice-to-have)

**Doel:** Eerste ondersteuning voor moderatie (PRD 11.2 nice-to-have): rapport-knop bij vragen/antwoorden en een eenvoudige queue voor moderators om gemelde posts te bekijken.

---

## Doel van deze fase

- Bij elke vraag en elk antwoord: een "Rapporteer" knop. Alleen voor ingelogde gebruikers (optioneel: anoniem rapporteren toestaan). Submit slaat een rapport op (tabel reports: post_id, post_type, user_id, reason, created_at).
- Moderator-queue: een eenvoudige pagina (bijv. /moderatie of /admin/reports) waar moderators gemelde items zien. Alleen toegankelijk voor gebruikers met rol moderator of admin (check in middleware of server-side).
- Geen acties op rapporten in deze fase (verbergen/verwijderen kan in een latere fase); alleen opslaan en tonen.

---

## Taken (2–3 kleine stappen)

1. **Rapport-knop en data**
   - Voeg een "Rapporteer" knop toe bij elke vraag en elk antwoord (en optioneel bij reacties). Bij klik: modal of pagina met korte reden (dropdown of vrije tekst). Server Action of API: sla rapport op in tabel reports (question_id of answer_id, user_id, reason, created_at). Bevestiging aan gebruiker.

2. **Reports-tabel en RLS**
   - Maak tabel reports (id, question_id nullable, answer_id nullable, user_id, reason, created_at, status). RLS: insert voor ingelogde users; select alleen voor moderator/admin. Documenteer in docs/database-schema.md.

3. **Moderator-queue**
   - Pagina /moderatie of /admin/reports: toon lijst van rapporten (post link, reden, datum). Alleen bereikbaar als profile.role in (moderator, admin). Toon geen rapporten voor andere rollen. Eenvoudige layout; geen actieknoppen vereist in deze fase.

---

## Verwachte output

- Gebruikers kunnen ongepaste content rapporteren. Moderators kunnen rapporten inzien. Structuur klaar voor latere acties (verbergen, waarschuwing).

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** docs/CHANGELOG.md bijwerken (moderatie-basis: rapport-knop, reports, queue).
2. **Documentatie:** In /docs/ beschrijven hoe rapporteren en de moderator-queue werken (bijv. docs/moderatie.md).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**  
feat(phase-21): moderation – report button, reports table, moderator queue (read-only)
