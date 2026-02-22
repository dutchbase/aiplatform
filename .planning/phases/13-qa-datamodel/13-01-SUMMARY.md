---
phase: 13-qa-datamodel
plan: 01
status: complete
subsystem: database
tech-stack:
  used: [PostgreSQL, Supabase RLS, SQL]
  added: []
affects: [14-qa-api, 15-qa-frontend]
key-files:
  - supabase/migrations/00002_qa_schema.sql
  - docs/database-schema.md
decisions: []
---

# Phase 13 Plan 01: Q&A Datamodel Summary

**One-liner:** SQL migration with questions/answers/answer_replies tables, RLS policies, cascade-delete chain, and per-statement-cached auth.uid() in all write policies.

---

## Wat is gebouwd

SQL migration `00002_qa_schema.sql` aangemaakt met het volledige Q&A datamodel:

- **3 tabellen:** questions, answers, answer_replies met uuid primary keys en timestamptz tijdstempels
- **Foreign key cascade chain:** answer_replies -> answers -> questions -> auth.users
- **RLS:** ingeschakeld op alle 3 tabellen; publiek SELECT, authenticated INSERT/UPDATE/DELETE op eigen rijen
- **Triggers:** updated_at auto-update op alle 3 tabellen via `update_updated_at_column()` (create or replace, idempotent)
- **8 indexes:** question_id, answer_id, user_id en created_at DESC per relevante tabel
- `docs/database-schema.md` uitgebreid met Q&A Tabellen, Q&A RLS Policies, en Q&A Indexes secties
- `docs/CHANGELOG.md` bijgewerkt voor Phase 13

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | SQL migration aanmaken — tabellen, RLS, triggers, indexes | dca9d92 | supabase/migrations/00002_qa_schema.sql |
| 2 | docs/database-schema.md uitbreiden + CHANGELOG bijwerken | 1da5e2c | docs/database-schema.md, docs/CHANGELOG.md |

## Decisions Made

None - plan executed exactly as written. All patterns followed existing 00001_profiles.sql conventions.

## Deviations from Plan

None - plan executed exactly as written.

**Note on index count:** The plan narrative mentions "9 indexes" but the SQL spec in the plan body lists 8 (questions: 2, answers: 3, answer_replies: 3). The implementation matches the SQL spec exactly — 8 indexes were created.

## Hoe de migration uit te voeren

1. Open Supabase Dashboard -> SQL Editor -> New Query
2. Plak inhoud van `supabase/migrations/00002_qa_schema.sql`
3. Klik Run — verwacht: geen errors, alle statements groen

## Klaar voor Phase 14

Phase 14 (Q&A API) kan nu:
- `SELECT` uitvoeren op questions/answers/answer_replies zonder auth
- `INSERT` met authenticated users via Supabase client
- Queries met `question_id` filter voor "antwoorden bij vraag" (index aanwezig)
- Queries met `answer_id` filter voor "reacties bij antwoord" (index aanwezig)

## Next Phase Readiness

Phase 14 (Q&A API) and Phase 15 (Q&A frontend) are unblocked. The migration must be run in the Supabase Dashboard before API or frontend code that queries these tables will work.
