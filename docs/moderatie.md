# Moderatiesysteem

Dit document beschrijft het moderatiesysteem van de Nederlandse AI Assistenten Hub, geïmplementeerd in Phase 21.

---

## Overzicht

Het moderatiesysteem stelt gebruikers in staat om ongepaste content te rapporteren. Moderators en admins kunnen de rapporten bekijken via een moderatiepagina.

**Huidige functionaliteit (Phase 21 — Basis):**
- Gebruikers kunnen vragen en antwoorden rapporteren via een "Rapporteer"-knop
- Rapporten worden opgeslagen in de `reports` tabel met reden en tijdstip
- Moderators/admins kunnen alle rapporten inzien op `/moderatie`

**Uitbreidingen (Phase 27 — Moderatie Acties):**
- Rapporten kunnen worden gesloten ("Sluit rapport" → status `dismissed`) of opgelost na verwijdering van content
- Content (vraag of antwoord) kan worden verwijderd via "Verwijder content" (bypassed RLS via admin client)
- Moderatiewachtrij heeft twee tabs: "Open" en "Afgehandeld"
- Afgehandelde rapporten tonen de afrondingsdatum

## Rapportworkflow (Phase 27+)

Een rapport doorloopt de volgende statussen:

```
open → dismissed  (moderator sluit rapport zonder actie)
open → resolved   (moderator verwijdert de gemelde content)
```

### Acties vanuit `/moderatie`

| Actie | Server Action | Beschrijving |
|-------|--------------|-------------|
| Sluit rapport | `resolveReport(reportId, 'dismissed')` | Markeert rapport als afgehandeld zonder content te verwijderen |
| Verwijder content | `deleteContent(reportId, contentType, contentId)` | Verwijdert content via service-role client + markeert rapport als resolved |

### Vereisten
- Alleen moderators en admins (`role IN ('moderator', 'admin')`) kunnen acties uitvoeren
- Elke Server Action roept `verifyModerator()` aan voor authorisatie
- `deleteContent` gebruikt `lib/supabase/admin.ts` (service-role) omdat content niet van de moderator hoeft te zijn

---

## Rapporteer-knop

De rapporteerfunctie verschijnt alleen voor ingelogde gebruikers op:
- De vraagpagina (`/qa/vraag/[id]`) — onder elke vraag en elk antwoord

### Stappen voor gebruikers

1. Klik op "Rapporteer" onder een vraag of antwoord
2. Kies een reden uit het dropdown-menu:
   - **Spam** — inhoud heeft geen waarde, is herhaaldelijk gepost
   - **Ongewenste inhoud** — beledigend, ongepast of schadelijk materiaal
   - **Onjuiste informatie** — feitelijk onjuiste of misleidende informatie
   - **Anders** — andere reden niet hierboven vermeld
3. Klik op "Verzenden"
4. Bevestigingsbericht verschijnt: "Rapport verzonden. Bedankt voor je melding."

---

## Moderatiepagina

URL: `/moderatie`

Alleen toegankelijk voor gebruikers met `role = 'moderator'` of `role = 'admin'` (gecontroleerd server-side via profielrol). Andere gebruikers worden omgeleid naar `/`.

### Wat de pagina toont

- Totaal aantal rapporten
- Per rapport:
  - Type (Vraag of Antwoord)
  - Preview van de inhoud (titel voor vragen, eerste 80 tekens voor antwoorden)
  - Reden van het rapport
  - Datum van het rapport
  - Link naar het gemelde bericht

### Rol toewijzen

Rollen worden direct in de Supabase Database beheerd (via Dashboard of SQL Editor):

```sql
-- Geef een gebruiker de moderator-rol
update public.profiles
  set role = 'moderator'
  where id = '<user-uuid>';

-- Geef een gebruiker de admin-rol
update public.profiles
  set role = 'admin'
  where id = '<user-uuid>';
```

De standaard rol voor nieuwe gebruikers is `'user'`.

---

## Database

### `reports` tabel

Zie [docs/database-schema.md](./database-schema.md) voor het volledige schema.

Samenvatting:
- `question_id` of `answer_id` — precies één is ingevuld (CHECK constraint)
- `reason` — één van: spam, ongewenste inhoud, onjuiste informatie, anders
- `user_id` — de rapporterende gebruiker
- Geen `updated_at` — rapporten zijn append-only

### RLS

- INSERT: alle ingelogde gebruikers
- SELECT: alleen moderators en admins

---

**Fase:** 21 - Moderatie Basis
**Migratie:** 00003_reports.sql
**Aangemaakt:** 2026-02-11
