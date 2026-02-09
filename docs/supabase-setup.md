# Supabase Project Opzetten

Deze handleiding beschrijft hoe je een Supabase-project aanmaakt en koppelt aan de Nederlandse AI Assistenten Hub.

## Vereisten

- Een Supabase-account (gratis tier is voldoende)
- Account aanmaken: [supabase.com/dashboard](https://supabase.com/dashboard)

## Stappen

### 1. Nieuw Supabase Project Aanmaken

1. Ga naar [supabase.com/dashboard](https://supabase.com/dashboard)
2. Klik op **"New Project"**
3. Kies een organisatie (of maak er een aan)
4. Vul de projectgegevens in:
   - **Name:** `ai-assistenten-hub` (of een naam naar keuze)
   - **Database Password:** Kies een sterk wachtwoord en bewaar deze veilig
   - **Region:** Selecteer een regio dichtbij je gebruikers (bijv. Frankfurt voor Nederland)
   - **Pricing Plan:** Free tier is voldoende voor development en MVP
5. Klik op **"Create new project"**
6. Wacht tot het project volledig is ingericht (dit kan 1-2 minuten duren)

### 2. API Credentials Ophalen

1. Ga in je Supabase project naar **Settings** (tandwiel icoon in de linkerbalk)
2. Navigeer naar **API** in het settings menu
3. Noteer de volgende waarden:
   - **Project URL** - Te vinden onder "Project URL" (bijvoorbeeld: `https://abcdefghijk.supabase.co`)
   - **anon/public key** - Te vinden onder "Project API keys" (het `anon` `public` label)
   - **service_role key** - Te vinden onder "Project API keys" (het `service_role` `secret` label)

> **Belangrijk:** De `service_role` key heeft volledige toegang tot je database en bypassed Row Level Security. Bewaar deze veilig en deel hem nooit in client-side code of publieke repositories.

### 3. Environment Variabelen Instellen

1. Kopieer het `.env.example` bestand naar `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` en vul de waarden in die je in stap 2 hebt verkregen:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://jouw-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. Verifieer dat `.env.local` in `.gitignore` staat (dit zou standaard al zo moeten zijn):
   ```bash
   # .gitignore bevat al:
   .env.local
   ```

> **Waarschuwing:** Commit `.env.local` NOOIT naar git. Dit bestand bevat geheime credentials die privé moeten blijven.

### 4. Verbinding Verifiëren

Start de development server:
```bash
npm run dev
```

Als de applicatie start zonder runtime errors, is de Supabase-verbinding correct ingesteld.

**Let op:** In Phase 3 zijn er nog geen database-tabellen of queries. De Supabase-client libraries zijn wel klaar voor gebruik:
- `lib/supabase/client.ts` - Voor gebruik in Client Components
- `lib/supabase/server.ts` - Voor gebruik in Server Components, Route Handlers, en Server Actions
- `middleware.ts` - Voor automatische sessie-refresh

Database queries en authenticatie worden toegevoegd in Phase 4 en verder.

### 5. Service Role Key Gebruik (Fase 4+)

De `SUPABASE_SERVICE_ROLE_KEY` is momenteel nog niet nodig. Deze wordt gebruikt in latere fases voor:
- Admin-operaties die Row Level Security (RLS) policies moeten bypassen
- Server-side operaties zoals user management en geautomatiseerde taken
- Database migrations en setup scripts

**Belangrijk:** Gebruik de service role key alleen in server-side code, nooit in de browser.

## Officiële Documentatie

Voor meer informatie, zie de officiële Supabase documentatie:
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started)
- [Supabase with Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Server-Side Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)

## Probleemoplossing

### "Invalid API key" errors
- Controleer of je de juiste API keys hebt gekopieerd (inclusief eventuele trailing characters)
- Verifieer dat je de `anon` key gebruikt voor `NEXT_PUBLIC_SUPABASE_ANON_KEY` (niet de `service_role` key)

### Environment variables worden niet geladen
- Herstart de development server na het wijzigen van `.env.local`
- Controleer of de variabelnamen exact overeenkomen (inclusief `NEXT_PUBLIC_` prefix waar vereist)

### Project URL is niet bereikbaar
- Controleer of je Supabase project volledig is ingericht (groene status in dashboard)
- Verifieer dat de URL geen typfouten bevat en begint met `https://`
