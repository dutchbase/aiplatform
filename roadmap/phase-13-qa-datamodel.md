# Fase 13 – Q&A-datamodel

**Doel:** Database ondersteunt het Q&A-model: vragen, antwoorden en reacties op antwoorden; RLS en rollen volgens PRD (anoniem lezen, posten met account).

---

## Doel van deze fase

- Tabellen: `questions`, `answers`, `answer_replies` (of gelijkwaardige namen). Relaties: vraag → meerdere antwoorden; antwoord → meerdere reacties. Koppeling naar `auth.users` / `profiles` voor auteur.
- RLS: iedereen mag lezen; alleen ingelogde gebruikers mogen insert (vraag, antwoord, reactie). Update/delete alleen voor eigen posts of moderators (moderator-rol kan in een latere fase worden geïmplementeerd).
- Documentatie van het schema en RLS in `/docs/`.

---

## Taken (2–3 kleine stappen)

1. **Tabellen aanmaken**
   - `questions`: id, user_id (FK naar auth.users), title, body, created_at, updated_at, eventueel slug of status.
   - `answers`: id, question_id, user_id, body, created_at, updated_at.
   - `answer_replies` (of comments): id, answer_id, user_id, body, created_at, updated_at.
   - Migratie(s) of SQL-script; uitvoeren en versie beheren (documenteren in docs).

2. **RLS en rechten**
   - RLS inschakelen op alle drie de tabellen. SELECT: toegestaan voor iedereen (of alleen niet-verborgen posts als je een “hidden” veld hebt). INSERT: alleen voor authenticated users (user_id = auth.uid()). UPDATE/DELETE: alleen eigen rijen (of later moderator). Documenteer het beleid in `/docs/database-schema.md`.

3. **Indexen en foreign keys**
   - Foreign keys en indexen voor question_id, answer_id, user_id zodat lijsten en joins snel zijn. Geen onnodige indexen; wel ondersteuning voor “vragen ophalen”, “antwoorden bij vraag”, “reacties bij antwoord”.

---

## Verwachte output

- Schema staat in de database; RLS voorkomt ongeautoriseerd schrijven. Documentatie beschrijft tabellen en beleid. Geen frontend in deze fase; alleen data-laag.

---

## Verplichte afsluiting (elke fase)

1. **Changelog:** `docs/CHANGELOG.md` bijwerken (Q&A-datamodel, tabellen, RLS).
2. **Documentatie:** `/docs/database-schema.md` (of gelijknamig) uitbreiden met questions, answers, answer_replies en RLS-regels.
3. **Git:** Stagen, committen, pushen (inclusief migratiebestanden of SQL in repo, geen gevoelige data).

**Commit message (voorbeeld):**  
`feat(phase-13): Q&A data model – questions, answers, replies, RLS`
