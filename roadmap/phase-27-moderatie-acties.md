# Fase 27 – Admin Dashboard: Moderatie Acties

**Doel:** Maak de moderatie-queue volledig operationeel door een resolutie-workflow toe te voegen aan de `reports` tabel en actieknoppen aan de `/moderatie` pagina.

---

## Doel van deze fase

- De `reports` tabel krijgt `status` (`open` | `resolved` | `dismissed`), `resolved_by`, en `resolved_at` kolommen.
- Moderators en admins kunnen rapporten afhandelen: content verwijderen, rapport sluiten/dismisssen.
- De `/moderatie` pagina toont tabs: "Open rapporten" en "Afgehandeld".
- Admins krijgen een extra `/admin/content` pagina voor directe contentbeheer (vragen/antwoorden verwijderen zonder rapport nodig).

---

## Taken (3 kleine stappen)

1. **Reports resolutie database migratie**
   - Maak `supabase/migrations/00004_reports_resolution.sql`:
     - Voeg `status text not null default 'open' check (status in ('open', 'resolved', 'dismissed'))` toe aan `reports`.
     - Voeg `resolved_by uuid null references auth.users(id)` toe.
     - Voeg `resolved_at timestamptz null` toe.
     - Voeg index `idx_reports_status` toe op `reports(status)`.
     - UPDATE RLS-policy: moderators/admins mogen `status`, `resolved_by`, `resolved_at` updaten.
   - Update `lib/qa/types.ts`: voeg `ReportStatus` type toe en update `Report` interface met nieuwe velden.

2. **Moderatie Server Actions & werkende knoppen**
   - Maak `app/moderatie/actions.ts` met:
     - `resolveReport(reportId: string, status: 'resolved' | 'dismissed')` — update rapport-status, sla `resolved_by` en `resolved_at` op.
     - `deleteContent(reportId: string, contentType: 'question' | 'answer' | 'reply', contentId: string)` — verwijder content via admin-client (bypast RLS), markeer rapport als `resolved`.
   - Beide actions verifiëren dat aanroeper `moderator` of `admin` rol heeft.
   - Update `app/moderatie/page.tsx`: voeg tab-navigatie toe (Open/Afgehandeld), voeg "Verwijder content" en "Sluit rapport" knoppen toe per rapport.

3. **Admin content beheer pagina**
   - Maak `app/admin/content/page.tsx`: toont alle vragen (gepagineerd, nieuwste eerst) met admin-verwijder actie. Zoekbalk voor filteren op titel.
   - Maak `app/admin/content/actions.ts`: `adminDeleteQuestion`, `adminDeleteAnswer` Server Actions (admin-only, via admin-client).

---

## Verwachte output

- Moderators kunnen rapporten verwerken: content verwijderen of rapport sluiten/dismisssen.
- Volledige audit-trail via `resolved_by` en `resolved_at`.
- Admins hebben directe content-moderatie buiten de rapport-workflow om.

---

## Verplichte afsluiting

1. **Changelog:** `docs/CHANGELOG.md` bijwerken.
2. **Documentatie:** `docs/moderatie.md` bijwerken (resolutie-workflow, actieknoppen, admin-content beheer).
3. **Git:** Stagen, committen, pushen.

**Commit message (voorbeeld):**
feat(phase-27): moderation actions – report resolution workflow, content deletion, admin content management
