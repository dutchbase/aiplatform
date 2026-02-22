# Phase 4: Database & Auth - Research

**Researched:** 2026-02-09
**Domain:** Supabase Auth + PostgreSQL profiles table + RLS + Next.js App Router auth flows
**Confidence:** HIGH

## Summary

Phase 4 establishes the database schema for user profiles/roles, implements Supabase Auth flows (registration, login, logout), and ensures the middleware session refresh works correctly. This phase builds directly on Phase 3's Supabase client utilities (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `middleware.ts`).

The standard approach is: (1) Create a `profiles` table in the `public` schema with `id UUID` referencing `auth.users(id)`, a `display_name`, a `role` enum, and timestamps. (2) Use a PostgreSQL trigger (`handle_new_user`) to automatically create a profile row when a user signs up via Supabase Auth. (3) Enable Row Level Security on the profiles table so users can read/update their own profile and admins can do more. (4) Implement auth flows using Server Actions that call `supabase.auth.signUp()`, `supabase.auth.signInWithPassword()`, and `supabase.auth.signOut()`. (5) Create a login page and registration page with forms. (6) Set up an email confirmation callback route (`app/auth/confirm/route.ts`) for the PKCE flow.

The middleware for session refresh was already designed in Phase 3's plan. Phase 4 should NOT protect routes in middleware -- that is deferred. Phase 4 also does NOT build the profile page or header auth status -- those belong to Phase 5.

**Primary recommendation:** Use raw SQL scripts (not Drizzle ORM migrations) for the profiles table, trigger, and RLS policies. The project does not yet have Drizzle ORM installed or configured, and for this phase's simple schema, raw SQL executed via the Supabase Dashboard SQL Editor or a `.sql` migration file is simpler and more direct. Use Server Actions (not API routes) for auth flows, following the official Supabase + Next.js pattern.

## Standard Stack

### Core
| Library | Installed Version | Purpose | Why Standard |
|---------|-------------------|---------|--------------|
| `@supabase/supabase-js` | 2.46.1 | Auth methods: `signUp`, `signInWithPassword`, `signOut`, `getUser` | Official Supabase client with full Auth API |
| `@supabase/ssr` | 0.5.2 | Server-side client creation with cookie handling | Required for auth in SSR context |
| PostgreSQL (via Supabase) | 15+ | Database for `profiles` table, RLS policies, triggers | Supabase's built-in database |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/cache` (built-in) | N/A | `revalidatePath` after auth state changes | Call after login/signup/logout to invalidate cached pages |
| `next/navigation` (built-in) | N/A | `redirect` after auth actions | Redirect to home/error after auth |
| `next/headers` (built-in) | N/A | Cookie access in server context | Used by `lib/supabase/server.ts` |

### NOT Needed in This Phase
| Library | Why Not |
|---------|---------|
| Drizzle ORM | Not yet installed. Simple schema can be managed with raw SQL. Add ORM in a later phase when complex queries are needed. |
| Zod | Auth validation is handled by Supabase client. Input validation for forms can use HTML5 attributes for now; Zod comes in later phases with more complex forms. |
| `@supabase/auth-helpers-nextjs` | DEPRECATED. Use `@supabase/ssr` instead (already installed). |

**Installation:**
No new packages needed. All required libraries are already installed.

## Architecture Patterns

### Recommended File Structure
```
supabase/
  migrations/
    00001_profiles.sql           # Profiles table, trigger, RLS policies
app/
  login/
    page.tsx                     # Login page with form
    actions.ts                   # Server Actions: login, signup
  auth/
    confirm/
      route.ts                   # Email confirmation callback (PKCE)
    signout/
      route.ts                   # Sign out Route Handler (POST)
docs/
  database-schema.md             # Document the profiles table and RLS
```

### Pattern 1: Database Trigger for Auto Profile Creation
**What:** A PostgreSQL function triggered AFTER INSERT on `auth.users` that automatically creates a row in `public.profiles` with the same UUID.
**When to use:** Always. Every user who signs up via Supabase Auth gets a profile automatically.
**Why:** Eliminates the need for application-level logic to create profiles after signup. The trigger runs inside the database, ensuring consistency even if the application crashes mid-signup.

```sql
-- Source: https://supabase.com/docs/guides/auth/managing-user-data
-- Create the profiles table
create table public.profiles (
  id uuid not null references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**Key details:**
- `security definer set search_path = ''` is critical: the function runs with the privileges of the creator (postgres role), not the caller, and the empty search_path prevents search_path injection attacks
- `on delete cascade` ensures that when a user is deleted from `auth.users`, their profile is also deleted
- The `role` column uses a CHECK constraint with allowed values rather than a PostgreSQL ENUM, making it easier to add new roles later without a migration
- `raw_user_meta_data ->> 'display_name'` reads metadata passed during signup's `options.data`

### Pattern 2: RLS Policies for Profiles
**What:** Row Level Security policies that control who can read and update profiles.
**When to use:** Always on the profiles table.

```sql
-- Source: https://supabase.com/docs/guides/database/postgres/row-level-security
-- https://supabase.com/docs/guides/getting-started/ai-prompts/database-rls-policies

-- Anyone authenticated can view all profiles (needed for display_name on Q&A posts)
create policy "Profiles are viewable by authenticated users"
  on public.profiles
  for select
  to authenticated
  using ( true );

-- Users can update their own profile only
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- Only the trigger inserts profiles (no direct insert by users)
-- No INSERT policy for authenticated users needed

-- Admins can update any profile (for role changes)
create policy "Admins can update any profile"
  on public.profiles
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = (select auth.uid())
      and role = 'admin'
    )
  );
```

**Key details:**
- `(select auth.uid())` wrapped in SELECT for performance optimization -- PostgreSQL caches the result per-statement instead of evaluating per-row (source: Supabase RLS performance docs, 179ms -> 9ms improvement)
- SELECT policy allows all authenticated users to see all profiles (needed for community features like showing display names)
- UPDATE policy restricts users to their own profile
- Separate admin UPDATE policy uses a subquery on the profiles table itself
- No INSERT policy for end users: only the database trigger inserts profiles
- No DELETE policy: profiles are deleted via cascade when the auth user is deleted
- Anonymous users (not logged in) cannot see profiles -- content pages can show author names via server-side queries

### Pattern 3: Server Actions for Auth Flows
**What:** Server Actions that handle signup, login, and logout using Supabase Auth.
**When to use:** For form submissions on login/registration pages.

```typescript
// app/login/actions.ts
// Source: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=invalid-credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        display_name: formData.get('display_name') as string,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?error=signup-failed')
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=check-email')
}
```

**Key details:**
- Server Actions use `await createClient()` from `@/lib/supabase/server` (Phase 3)
- `revalidatePath('/', 'layout')` invalidates the entire layout cache so auth state is reflected everywhere
- `redirect()` must be called OUTSIDE of try/catch (Next.js redirect throws an error internally)
- Signup passes `display_name` in `options.data` which lands in `raw_user_meta_data` and is picked up by the trigger
- Error handling redirects to the same page with query params rather than throwing

### Pattern 4: Email Confirmation Callback Route
**What:** A Route Handler that exchanges the token_hash from the email confirmation link for a session.
**When to use:** Required when email confirmation is enabled in Supabase Auth settings (recommended for production).

```typescript
// app/auth/confirm/route.ts
// Source: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = '/'

  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    }
  }

  redirectTo.pathname = '/error'
  return NextResponse.redirect(redirectTo)
}
```

**Key details:**
- This route handles the PKCE flow: when the user clicks the confirmation link in their email, they are redirected to this route
- The `token_hash` and `type` query parameters come from the email template
- Supabase email templates need to be configured to point to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
- The token_hash is valid for 5 minutes and can only be exchanged once

### Pattern 5: Sign Out Route Handler
**What:** A POST Route Handler that signs the user out.
**When to use:** Called from a form/button in the UI.

```typescript
// app/auth/signout/route.ts
// Source: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}
```

### Anti-Patterns to Avoid
- **Using `auth.getSession()` on the server:** Not secure. Always use `auth.getUser()` which validates the JWT with the Supabase Auth server.
- **Calling `redirect()` inside try/catch:** Next.js `redirect()` throws an error internally. If wrapped in try/catch, it will be caught and the redirect will not happen.
- **Creating profiles in application code after signup:** Use the database trigger instead. Application-level profile creation has race conditions and can fail silently.
- **Using PostgreSQL ENUM for roles:** CHECK constraints are easier to modify later. Adding a value to a PG ENUM requires a migration; adding to a CHECK constraint is simpler.
- **Forgetting `revalidatePath` after auth changes:** Without revalidation, cached Server Components will show stale auth state.
- **Putting `redirect()` after `revalidatePath` in wrong order:** Always `revalidatePath` FIRST, then `redirect`. Otherwise the cache invalidation may not take effect.
- **Using deprecated `@supabase/auth-helpers-nextjs`:** Use `@supabase/ssr` (already installed).
- **Using `get`/`set`/`remove` cookie methods:** Use `getAll`/`setAll` exclusively.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Profile creation after signup | Application-level POST after signUp | PostgreSQL trigger on `auth.users` | Trigger is atomic, consistent, cannot be skipped |
| Session refresh | Custom JWT refresh logic | Middleware with `supabase.auth.getUser()` | Handles token rotation, refresh tokens, edge cases |
| Password hashing | Custom bcrypt/argon2 | Supabase Auth built-in | Supabase uses bcrypt with proper salt; handles all edge cases |
| Email confirmation flow | Custom token generation/verification | Supabase Auth PKCE flow with `verifyOtp` | Handles token expiry, one-time use, security |
| CSRF protection for auth forms | Custom CSRF tokens | Server Actions (Next.js built-in CSRF protection) | Next.js Server Actions have built-in origin checking |
| Auth state management | Custom context/redux | Supabase `onAuthStateChange` + middleware cookie sync | Supabase handles the full lifecycle |

**Key insight:** Supabase Auth handles password hashing, token management, email sending, and session cookies. The application only needs to call the API methods and handle redirects. Do not build any custom auth logic.

## Common Pitfalls

### Pitfall 1: Circular RLS Policies
**What goes wrong:** An RLS policy on the `profiles` table queries the `profiles` table itself (e.g., to check if the current user is admin), creating infinite recursion.
**Why it happens:** Developers write `exists (select 1 from profiles where id = auth.uid() and role = 'admin')` in an UPDATE policy on the profiles table. PostgreSQL's RLS checks are recursive -- the subquery also triggers the RLS policies.
**How to avoid:** PostgreSQL is smart enough to not apply RLS to the same table when queried from within a policy on that same table in most cases. However, if issues arise, use `security definer` functions to bypass RLS for the admin check. For this MVP, the simple subquery approach works because Supabase's PostgreSQL handles same-table policy references correctly.
**Warning signs:** "infinite recursion" errors, queries that hang.

### Pitfall 2: Redirect Inside Try/Catch
**What goes wrong:** `redirect()` from `next/navigation` works by throwing a special error. If wrapped in try/catch, the redirect is caught and silently swallowed.
**Why it happens:** Developers wrap their entire Server Action in try/catch for error handling.
**How to avoid:** Call `redirect()` OUTSIDE of any try/catch block. If you need error handling, use a separate try/catch for the Supabase call and check the error result, then redirect after.
**Warning signs:** Auth actions complete but the page does not navigate.

### Pitfall 3: Missing Email Template Configuration
**What goes wrong:** Email confirmation links point to the wrong URL or use the wrong template variables, causing 404s or invalid token errors.
**Why it happens:** Supabase's default email templates use `{{ .ConfirmationURL }}` which does a client-side redirect. For SSR, templates need `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
**How to avoid:** Configure email templates in Supabase Dashboard -> Authentication -> Email Templates. Update the "Confirm signup" template specifically.
**Warning signs:** Users click the email link and get an error page or are not confirmed.

### Pitfall 4: Signup Returns Session=null When Email Confirmation is Enabled
**What goes wrong:** After calling `signUp()`, developers check for `session` to confirm success. But when email confirmation is enabled, `session` is `null` (the user is not yet confirmed).
**Why it happens:** Email confirmation is enabled by default on Supabase projects.
**How to avoid:** After signup, check for `error` (not `session`). If no error, redirect to a "check your email" message. The session is only created after the user confirms their email.
**Warning signs:** "Signup seems to fail" even though the user was created.

### Pitfall 5: RLS Blocking Trigger Inserts
**What goes wrong:** The `handle_new_user` trigger fails because RLS on the `profiles` table blocks the INSERT.
**Why it happens:** The trigger function needs to insert into a table with RLS enabled, but there is no INSERT policy that matches the trigger's execution context.
**How to avoid:** Use `security definer` on the trigger function. This makes the function execute as the postgres role, bypassing RLS. This is the official Supabase-recommended pattern.
**Warning signs:** Users can sign up (row in `auth.users`) but have no profile row.

### Pitfall 6: Forgetting `set search_path = ''` on Security Definer Functions
**What goes wrong:** Without `set search_path = ''`, a security definer function could be exploited via search_path manipulation.
**Why it happens:** Developers copy trigger examples that omit this clause.
**How to avoid:** Always add `set search_path = ''` after `security definer`. Use fully qualified table names inside the function (e.g., `public.profiles`).
**Warning signs:** Security audit flags, potential privilege escalation.

### Pitfall 7: Not Using `(select auth.uid())` in RLS
**What goes wrong:** Poor query performance on tables with many rows.
**Why it happens:** Using `auth.uid()` directly causes PostgreSQL to call the function per-row instead of caching it.
**How to avoid:** Always wrap in a SELECT: `(select auth.uid()) = id`. Documented improvement from 179ms to 9ms.
**Warning signs:** Slow page loads that get worse as the user base grows.

## Code Examples

### Login Page (Minimal, Dutch-language)
```typescript
// app/login/page.tsx
// Source: Official Supabase Next.js tutorial pattern
import { login, signup } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <div>
      <h1>Inloggen</h1>

      {searchParams?.error && (
        <p className="text-red-600">
          {searchParams.error === 'invalid-credentials'
            ? 'Ongeldige inloggegevens. Probeer opnieuw.'
            : 'Er is een fout opgetreden.'}
        </p>
      )}

      {searchParams?.message === 'check-email' && (
        <p className="text-green-600">
          Controleer je e-mail om je account te bevestigen.
        </p>
      )}

      <form>
        <label htmlFor="email">E-mailadres</label>
        <input id="email" name="email" type="email" required />

        <label htmlFor="password">Wachtwoord</label>
        <input id="password" name="password" type="password" required />

        <button formAction={login}>Inloggen</button>
        <button formAction={signup}>Registreren</button>
      </form>
    </div>
  )
}
```

### Automatic Updated_at Trigger
```sql
-- Source: Common PostgreSQL pattern, referenced in .cursor/rules/data-layer.md
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();
```

### Checking Current User in Server Component
```typescript
// Example: how to check auth state in a Server Component (for Phase 5)
// Included here so planner understands the integration point
import { createClient } from '@/lib/supabase/server'

export default async function SomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // User is not logged in
    return <p>Niet ingelogd</p>
  }

  // Fetch profile from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .single()

  return <p>Welkom, {profile?.display_name ?? user.email}</p>
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` with `getAll`/`setAll` | 2024 | All auth-helpers deprecated |
| `auth.getSession()` on server | `auth.getUser()` on server | 2024 security advisory | getSession does not validate JWT |
| API routes for auth | Server Actions for auth | Next.js 14+ | Server Actions have built-in CSRF, simpler code |
| Custom profile creation after signup | Database trigger `handle_new_user` | Always recommended | Atomic, cannot be skipped |
| `auth.uid()` in RLS | `(select auth.uid())` in RLS | Performance optimization | 20x faster on large tables |
| PostgreSQL ENUM for roles | CHECK constraint for roles | Best practice | Easier to modify without migration |
| `{{ .ConfirmationURL }}` in email template | `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email` | SSR/PKCE flow adoption | Required for server-side auth |

**Deprecated/outdated:**
- `@supabase/auth-helpers-nextjs`: Fully deprecated
- `createMiddlewareClient()`: Deprecated, use `createServerClient()` from `@supabase/ssr`
- `auth.getSession()` on server: Insecure, does not validate JWT
- `get`/`set`/`remove` cookie methods: Deprecated in `@supabase/ssr`

## Scope Boundaries

### IN Scope (Phase 4)
- `profiles` table with `id`, `display_name`, `role`, `created_at`, `updated_at`
- `handle_new_user` trigger on `auth.users`
- RLS policies for profiles (SELECT, UPDATE)
- `updated_at` auto-update trigger
- Login page with form
- Server Actions for `signUp`, `signInWithPassword`
- Sign out Route Handler
- Email confirmation callback route (`auth/confirm`)
- Documentation of schema and auth flows

### OUT of Scope (Phase 5+)
- Profile page UI (Phase 5)
- Header auth status (login/logout buttons in header) (Phase 5)
- Profile editing form (Phase 5)
- Route protection in middleware (Phase 5+)
- RBAC permission checking (later phases)
- Drizzle ORM setup (later phases)
- Password reset flow (later phases)
- OAuth/social login (not in MVP)

## Supabase Dashboard Configuration

The following must be configured in the Supabase Dashboard (cannot be done via code):

1. **Email confirmation:** Authentication -> Settings -> Enable "Confirm email" (recommended for production; can be disabled during development for faster testing)
2. **Email templates:** Authentication -> Email Templates -> Confirm Signup -> Change URL to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`
3. **Site URL:** Authentication -> URL Configuration -> Set Site URL to `http://localhost:3000` (development) or production URL
4. **Redirect URLs:** Authentication -> URL Configuration -> Add allowed redirect URLs

## Open Questions

1. **Email confirmation enabled or disabled during development?**
   - What we know: When enabled, signup returns `session: null` and requires email confirmation. When disabled, signup returns both user and session immediately.
   - What's unclear: Whether to enable during development (more realistic) or disable (faster iteration).
   - Recommendation: Disable during development for faster iteration. The `auth/confirm` route should still be created so it works when enabled in production. Document both configurations.

2. **Role column: CHECK constraint vs separate roles table?**
   - What we know: PRD Appendix B defines roles: user, moderator, admin, ai-bot. A CHECK constraint is simpler; a separate roles table is more flexible.
   - What's unclear: Whether the ai-bot role should be on the profiles table or handled differently (PRD says AI bots get "own accounts").
   - Recommendation: Use CHECK constraint with `('user', 'moderator', 'admin')` for now. AI-bot accounts can use the `user` role with an additional `is_bot` boolean flag if needed later. Keep it simple for MVP.

3. **Anonymous read access to profiles?**
   - What we know: Q&A posts show author names. Anonymous visitors should see author display names. But RLS policy targets `authenticated` role.
   - What's unclear: Whether to allow anonymous SELECT on profiles.
   - Recommendation: Keep profiles SELECT restricted to `authenticated` for now. On public pages (Q&A, blog), author names can be fetched server-side using the service role or included as denormalized data in the content tables. This decision can be revisited in Q&A phases (10-14).

## Sources

### Primary (HIGH confidence)
- [Supabase Managing User Data](https://supabase.com/docs/guides/auth/managing-user-data) -- Official profiles table pattern, `handle_new_user` trigger
- [Supabase Next.js Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs) -- Official login/signup Server Actions, auth/confirm route, signout handler
- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security) -- Policy patterns, `auth.uid()` usage
- [Supabase RLS AI Prompt](https://supabase.com/docs/guides/getting-started/ai-prompts/database-rls-policies) -- Policy per-operation guidelines, `(select auth.uid())` optimization
- [Supabase RLS Performance](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv) -- `(select auth.uid())` performance optimization (179ms -> 9ms), indexing recommendations
- [Supabase signUp API](https://supabase.com/docs/reference/javascript/auth-signup) -- Parameters, metadata options, email confirmation behavior
- [Supabase signInWithPassword API](https://supabase.com/docs/reference/javascript/auth-signinwithpassword) -- Parameters, return type
- [Supabase signOut API](https://supabase.com/docs/reference/javascript/auth-signout) -- Scope options (global, local, others)
- [Supabase Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) -- Middleware session refresh pattern, `getUser()` vs `getSession()`

### Secondary (MEDIUM confidence)
- [Supabase PKCE Flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow) -- Email confirmation token exchange
- [Supabase General Auth Configuration](https://supabase.com/docs/guides/auth/general-configuration) -- Email confirmation enable/disable settings
- Phase 3 Research (`.planning/phases/03-supabase-project/03-RESEARCH.md`) -- Client utilities, middleware pattern, cookie handling

### Tertiary (LOW confidence)
- `.cursor/rules/authentication-authorization.md` -- Project's auth patterns reference (some patterns are from a different project context, e.g., leads/CRM, not the AI hub)
- `.cursor/rules/data-layer.md` -- Database patterns reference (Drizzle ORM patterns not applicable to this phase's raw SQL approach)

## Metadata

**Confidence breakdown:**
- Database schema (profiles table, trigger): HIGH -- Official Supabase docs pattern, widely used
- RLS policies: HIGH -- Official documentation with performance optimization verified
- Auth flows (Server Actions): HIGH -- Official Supabase + Next.js tutorial pattern
- Email confirmation (PKCE): HIGH -- Official documentation
- Middleware session: HIGH -- Already researched in Phase 3, verified pattern

**Research date:** 2026-02-09
**Valid until:** 2026-03-09 (30 days -- stable domain, Supabase Auth API is mature)
