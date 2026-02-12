# Summary 28-01 – Admin Dashboard: Statistieken & KPI-overzicht

**Status:** COMPLETE
**Date:** 2026-02-12

## Wat is er gebouwd

- `lib/admin/stats.ts` – 6 statistiekenqueries (users, questions, answers, reports, growth, active users)
- `app/admin/statistieken/page.tsx` – KPI-kaarten, groeikaarten met PRD-voortgangsbalk, top 10 actieve gebruikers, externe meetpunten links

## Afwijkingen van plan

- `app/admin/page.tsx` was al correct in Phase 26 (Statistieken card met juiste link); geen update nodig
- Voortgangsbalk toegevoegd voor PRD-doel visueel bij te houden (niet in plan, zinvolle toevoeging)
- `getMostActiveUsers` filtert gebruikers met `total === 0` om lege rijen te vermijden

## Acceptance criteria

- [x] `/admin/statistieken` shows total users count
- [x] `/admin/statistieken` shows total questions and answers counts
- [x] `/admin/statistieken` shows open reports count with link to `/moderatie`
- [x] `/admin/statistieken` shows new questions in last 7 days and 30 days
- [x] `/admin/statistieken` shows top 10 most active users table
- [x] All data loaded in parallel via `Promise.all`
- [x] Page is admin-only (protected by Phase 26 layout guard)
- [x] PRD goal reference visible (50 Q&A interactions in 3 months)
- [x] External links to Vercel Analytics and Google Search Console
- [x] `getTotalUsers` uses admin client (requires service role for auth count)
