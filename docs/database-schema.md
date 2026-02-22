# Database Schema

Dit document beschrijft het database schema van de Nederlandse AI Assistenten Hub, geïmplementeerd in PostgreSQL via Supabase.

---

## `profiles` tabel

De `profiles` tabel slaat gebruikersprofiel informatie op, gekoppeld aan Supabase Auth.

| Kolom | Type | Nullable | Default | Beschrijving |
|-------|------|----------|---------|--------------|
| `id` | `uuid` | NOT NULL | - | Primary key, foreign key naar `auth.users(id)` |
| `display_name` | `text` | NULL | - | Weergavenaam van de gebruiker (zichtbaar bij Q&A, reacties) |
| `role` | `text` | NOT NULL | `'user'` | Gebruikersrol: `user`, `moderator`, of `admin` |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Tijdstip waarop het profiel is aangemaakt |
| `updated_at` | `timestamptz` | NOT NULL | `now()` | Tijdstip van laatste wijziging |

**Belangrijke kenmerken:**

- **Foreign key constraint:** `id` verwijst naar `auth.users(id)` met `ON DELETE CASCADE`. Als een gebruiker wordt verwijderd uit `auth.users`, wordt het bijbehorende profiel automatisch verwijderd.
- **CHECK constraint op role:** De `role` kolom accepteert alleen de waarden `'user'`, `'moderator'`, of `'admin'`. Er wordt bewust geen PostgreSQL ENUM gebruikt, zodat rolwaarden in de toekomst makkelijker aangepast kunnen worden.
- **Default role:** Nieuwe gebruikers krijgen automatisch de rol `'user'`.

---

## Triggers

### 1. `on_auth_user_created`

**Type:** `AFTER INSERT` trigger op `auth.users`

**Functie:** `public.handle_new_user()`

**Doel:** Automatisch een profiel aanmaken wanneer een nieuwe gebruiker zich registreert via Supabase Auth.

**Werking:**
- Wanneer een nieuwe gebruiker wordt toegevoegd aan `auth.users`, wordt deze trigger geactiveerd.
- De functie `handle_new_user()` voegt een nieuwe rij toe aan `public.profiles` met:
  - `id`: de UUID van de nieuwe gebruiker
  - `display_name`: overgenomen uit `raw_user_meta_data ->> 'display_name'` (metadata meegegeven tijdens signup)

**Beveiliging:**
- `security definer set search_path = ''`: De functie draait met verhoogde rechten (als `postgres` role) om RLS te omzeilen tijdens het aanmaken van het profiel. De lege `search_path` voorkomt search_path injection attacks.

### 2. `update_profiles_updated_at`

**Type:** `BEFORE UPDATE` trigger op `public.profiles`

**Functie:** `public.update_updated_at_column()`

**Doel:** Automatisch de `updated_at` kolom bijwerken bij elke wijziging van een profielrij.

**Werking:**
- Telkens wanneer een profiel wordt bijgewerkt, stelt deze trigger `updated_at` in op de huidige tijd (`now()`).

---

## Row Level Security (RLS)

Row Level Security is ingeschakeld op de `profiles` tabel. Hierdoor worden databaseregels afgedwongen op rijniveau, onafhankelijk van de applicatielaag.

### RLS Policies

| Policy | Operatie | Rol | Voorwaarde | Beschrijving |
|--------|----------|-----|------------|--------------|
| **Profiles are viewable by authenticated users** | SELECT | `authenticated` | `true` | Alle ingelogde gebruikers kunnen alle profielen lezen (nodig voor weergave van auteurs bij Q&A posts) |
| **Users can update their own profile** | UPDATE | `authenticated` | `(select auth.uid()) = id` | Gebruikers kunnen alleen hun eigen profiel bijwerken |
| **Admins can update any profile** | UPDATE | `authenticated` | `role = 'admin'` check | Admins kunnen elk profiel bijwerken |

**Belangrijk:**
- **Cached `auth.uid()`:** In alle RLS policies wordt `(select auth.uid())` gebruikt in plaats van direct `auth.uid()`. De `SELECT` wrapper zorgt ervoor dat PostgreSQL de waarde per-statement cachet in plaats van per-row, wat de performance verbetert van 179ms naar 9ms bij grote tabellen.
- **Geen INSERT policy:** Alleen de `handle_new_user` trigger mag profielen aanmaken. Directe inserts door gebruikers zijn geblokkeerd.
- **Geen DELETE policy:** Profielen worden alleen verwijderd via de `ON DELETE CASCADE` wanneer de bijbehorende gebruiker uit `auth.users` wordt verwijderd.

---

## Migratie uitvoeren

De database migratie wordt handmatig uitgevoerd in de Supabase Dashboard:

### Stappen:

1. Open de **Supabase Dashboard** voor je project
2. Navigeer naar **SQL Editor** in het linkermenu
3. Klik op **New Query**
4. Plak de volledige inhoud van `supabase/migrations/00001_profiles.sql`
5. Klik op **Run** (of gebruik Ctrl+Enter)
6. Controleer of alle statements succesvol zijn uitgevoerd (groen vinkje)

**Let op:** Dit is een eenmalige operatie per environment (development, staging, production). Bij nieuwe environments moet de migratie opnieuw worden uitgevoerd.

---

---

## Q&A Tabellen

Aangemaakt in Phase 13. Ondersteunt de Q&A-functionaliteit van het platform.

### `questions` tabel

| Kolom | Type | Nullable | Default | Beschrijving |
|-------|------|----------|---------|--------------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | NOT NULL | - | Foreign key naar `auth.users(id)`, cascade delete |
| `title` | `text` | NOT NULL | - | Titel van de vraag |
| `body` | `text` | NOT NULL | - | Inhoud van de vraag (Markdown) |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Aanmaakdatum |
| `updated_at` | `timestamptz` | NOT NULL | `now()` | Datum laatste wijziging |

### `answers` tabel

| Kolom | Type | Nullable | Default | Beschrijving |
|-------|------|----------|---------|--------------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Primary key |
| `question_id` | `uuid` | NOT NULL | - | Foreign key naar `public.questions(id)`, cascade delete |
| `user_id` | `uuid` | NOT NULL | - | Foreign key naar `auth.users(id)`, cascade delete |
| `body` | `text` | NOT NULL | - | Inhoud van het antwoord (Markdown) |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Aanmaakdatum |
| `updated_at` | `timestamptz` | NOT NULL | `now()` | Datum laatste wijziging |

### `answer_replies` tabel

| Kolom | Type | Nullable | Default | Beschrijving |
|-------|------|----------|---------|--------------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Primary key |
| `answer_id` | `uuid` | NOT NULL | - | Foreign key naar `public.answers(id)`, cascade delete |
| `user_id` | `uuid` | NOT NULL | - | Foreign key naar `auth.users(id)`, cascade delete |
| `body` | `text` | NOT NULL | - | Inhoud van de reactie (Markdown) |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Aanmaakdatum |
| `updated_at` | `timestamptz` | NOT NULL | `now()` | Datum laatste wijziging |

**Cascade deletes:**
- Als een `question` verwijderd wordt, worden alle bijbehorende `answers` automatisch verwijderd.
- Als een `answer` verwijderd wordt, worden alle bijbehorende `answer_replies` automatisch verwijderd.
- Als een gebruiker uit `auth.users` verwijderd wordt, worden alle Q&A-bijdragen van die gebruiker verwijderd.

---

## Q&A RLS Policies

Alle drie Q&A-tabellen volgen hetzelfde RLS-patroon:

| Policy | Operatie | Rol | Voorwaarde | Beschrijving |
|--------|----------|-----|------------|--------------|
| **[Tabel] are publicly readable** | SELECT | `public` | `true` | Anonieme bezoekers kunnen alle Q&A-content lezen |
| **Authenticated users can insert [tabel]** | INSERT | `authenticated` | `user_id = (select auth.uid())` | Ingelogde gebruikers kunnen posten |
| **Users can update their own [tabel]** | UPDATE | `authenticated` | `user_id = (select auth.uid())` | Gebruikers kunnen alleen eigen rijen wijzigen |
| **Users can delete their own [tabel]** | DELETE | `authenticated` | `user_id = (select auth.uid())` | Gebruikers kunnen alleen eigen rijen verwijderen |

**Verschil met profiles:** Q&A-tabellen hebben wél INSERT en DELETE policies (gebruikers plaatsen actief content), terwijl profiles alleen via triggers worden aangemaakt.

---

## Q&A Indexes

| Index | Tabel | Kolom(men) | Doel |
|-------|-------|------------|------|
| `idx_questions_user_id` | `questions` | `user_id` | Vragen ophalen per gebruiker |
| `idx_questions_created_at` | `questions` | `created_at DESC` | Sorteren op nieuwste vragen |
| `idx_answers_question_id` | `answers` | `question_id` | Antwoorden ophalen bij een vraag |
| `idx_answers_user_id` | `answers` | `user_id` | Antwoorden per gebruiker |
| `idx_answers_created_at` | `answers` | `created_at DESC` | Sorteren op nieuwste antwoorden |
| `idx_answer_replies_answer_id` | `answer_replies` | `answer_id` | Reacties ophalen bij een antwoord |
| `idx_answer_replies_user_id` | `answer_replies` | `user_id` | Reacties per gebruiker |
| `idx_answer_replies_created_at` | `answer_replies` | `created_at DESC` | Sorteren op nieuwste reacties |

---

---

## Moderatie Tabellen

Aangemaakt in Phase 21. Ondersteunt de rapportage- en moderatiefunctionaliteit.

### `reports` tabel

| Kolom | Type | Nullable | Default | Beschrijving |
|-------|------|----------|---------|--------------|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | Primary key |
| `question_id` | `uuid` | NULL | - | Foreign key naar `public.questions(id)`, cascade delete. Null als het rapport een antwoord betreft. |
| `answer_id` | `uuid` | NULL | - | Foreign key naar `public.answers(id)`, cascade delete. Null als het rapport een vraag betreft. |
| `user_id` | `uuid` | NOT NULL | - | Foreign key naar `auth.users(id)`, cascade delete. Gebruiker die het rapport heeft ingediend. |
| `reason` | `text` | NOT NULL | - | Reden voor het rapport: `spam`, `ongewenste inhoud`, `onjuiste informatie`, of `anders`. |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Tijdstip van aanmaken. |

**Beperkingen:**
- `reports_target_check`: CHECK constraint die afdwingt dat precies één van `question_id` of `answer_id` is ingevuld (nooit allebei null, nooit allebei ingevuld).
- Geen `updated_at` kolom: rapporten worden alleen toegevoegd, nooit gewijzigd.

### Reports RLS Policies

| Policy | Operatie | Rol | Voorwaarde | Beschrijving |
|--------|----------|-----|------------|--------------|
| **Authenticated users can insert reports** | INSERT | `authenticated` | `user_id = (select auth.uid())` | Ingelogde gebruikers kunnen een rapport indienen |
| **Moderators and admins can view reports** | SELECT | `authenticated` | `exists (select from profiles where role in ('moderator','admin'))` | Alleen moderators en admins kunnen rapporten inzien |

### Reports Indexes

| Index | Tabel | Kolom | Doel |
|-------|-------|-------|------|
| `idx_reports_question_id` | `reports` | `question_id` WHERE NOT NULL | Rapporten per vraag opzoeken |
| `idx_reports_answer_id` | `reports` | `answer_id` WHERE NOT NULL | Rapporten per antwoord opzoeken |
| `idx_reports_user_id` | `reports` | `user_id` | Rapporten per gebruiker opzoeken |
| `idx_reports_created_at` | `reports` | `created_at DESC` | Sorteren op nieuwste rapporten |

---

## Toekomstige uitbreidingen

In latere fasen van het project worden de volgende tabellen toegevoegd:

- **Content tabellen:** `blog_posts`, `tutorials`, `ai_tools`
- **Moderatie tabellen:** `reports` (Phase 21, geïmplementeerd) — `moderation_actions` (toekomstig)

**Drizzle ORM:** Op termijn kan Drizzle ORM worden geïntroduceerd voor type-safe database queries en complexere relaties. Voorlopig wordt de Supabase client gebruikt voor database-interacties.

---

**Laatst bijgewerkt:** 2026-02-11
**Fase:** 13 - Q&A Datamodel
**Migratie versie:** 00003
