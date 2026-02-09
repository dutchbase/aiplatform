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

## Toekomstige uitbreidingen

In latere fasen van het project worden de volgende tabellen toegevoegd:

- **Q&A tabellen:** `questions`, `answers`, `question_votes`, `answer_votes`
- **Content tabellen:** `blog_posts`, `tutorials`, `ai_tools`
- **Moderatie tabellen:** `moderation_queue`, `moderation_actions`

**Drizzle ORM:** Op termijn kan Drizzle ORM worden geïntroduceerd voor type-safe database queries en complexere relaties. Voorlopig wordt de Supabase client gebruikt voor database-interacties.

---

**Laatst bijgewerkt:** 2026-02-09
**Fase:** 4 - Database & Auth
**Migratie versie:** 00001
