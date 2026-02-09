# Phase 3: Supabase-project - Research

**Researched:** 2026-02-09
**Domain:** Supabase client integration with Next.js 14 App Router
**Confidence:** HIGH

## Summary

Phase 3 establishes the Supabase client infrastructure for the project: browser client for Client Components, server client for Server Components / Route Handlers / Server Actions, and environment variable configuration. No database tables or auth flows are created in this phase -- only the connection layer.

The project already has `@supabase/supabase-js@2.46.1` and `@supabase/ssr@0.5.2` installed in `package.json`. The `.env.example` already contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The installed `@supabase/ssr@0.5.2` fully supports the modern `getAll`/`setAll` cookie API (verified from the type definitions in node_modules). The deprecated `get`/`set`/`remove` API should NOT be used.

**Primary recommendation:** Create `lib/supabase/client.ts` (browser) and `lib/supabase/server.ts` (server) using `@supabase/ssr` with the `getAll`/`setAll` cookie pattern. Add a middleware.ts for session refresh. Consider upgrading packages to latest versions (ssr 0.8.0, supabase-js 2.80.0) as the upgrade path is non-breaking.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Installed Version | Latest Version | Purpose | Why Standard |
|---------|-------------------|----------------|---------|--------------|
| `@supabase/ssr` | 0.5.2 | 0.8.0 | SSR-aware Supabase client factory | Official Supabase package for cookie-based auth in SSR frameworks; replaces deprecated `@supabase/auth-helpers-nextjs` |
| `@supabase/supabase-js` | 2.46.1 | 2.80.0 | Core Supabase client | The official JavaScript client for Supabase services (auth, database, storage, realtime) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next/headers` (built-in) | N/A | Cookie access in Server Components | Used inside `server.ts` to read/write cookies |
| `next/server` (built-in) | N/A | Middleware request/response | Used in `middleware.ts` for session refresh |

### Version Upgrade Consideration
| Current | Latest | Breaking Changes | Recommendation |
|---------|--------|-----------------|----------------|
| `@supabase/ssr@0.5.2` | `0.8.0` | None (additive only: cookie encoding option, console warning fixes) | Upgrade recommended but not blocking |
| `@supabase/supabase-js@2.46.1` | `2.80.0` | Node.js 18 dropped in 2.79.0 (project uses Node 24, no issue) | Upgrade recommended but not blocking |

**Note on API Key Naming:** Supabase is transitioning from `anon`/`service_role` JWT keys to new `sb_publishable_...`/`sb_secret_...` keys. The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable name works with all current library versions. The deadline for legacy key removal is late 2026 (TBC). For this phase, continue using `NEXT_PUBLIC_SUPABASE_ANON_KEY` as the project already has this configured. No action needed until the project creates a Supabase cloud project and receives new-format keys.

**Installation:**
No new packages needed. Both `@supabase/supabase-js` and `@supabase/ssr` are already in `package.json`.

Optional upgrade:
```bash
npm install @supabase/supabase-js@latest @supabase/ssr@latest
```

## Architecture Patterns

### Recommended File Structure
```
lib/
  supabase/
    client.ts          # Browser client (Client Components)
    server.ts          # Server client (Server Components, Route Handlers, Server Actions)
middleware.ts          # Root-level middleware for session refresh
.env.example          # Template with all required env vars (already exists)
.env.local            # Actual secrets (gitignored, never committed)
```

### Pattern 1: Browser Client (lib/supabase/client.ts)
**What:** Factory function that creates a Supabase client for use in Client Components. The `createBrowserClient` function is a singleton by default -- calling it multiple times returns the same instance.
**When to use:** Any Client Component (`'use client'`) that needs Supabase access.

```typescript
// lib/supabase/client.ts
// Source: @supabase/ssr type definitions (verified in node_modules) + official Supabase docs
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Key details:**
- No custom cookie configuration needed for browser client (handles cookies via document.cookie automatically)
- Returns a singleton by default (`isSingleton: true`), safe to call in every component
- The non-null assertion (`!`) is acceptable here because the app should fail fast if env vars are missing

### Pattern 2: Server Client (lib/supabase/server.ts)
**What:** Async factory function that creates a Supabase client for server-side use. Must use `getAll`/`setAll` cookie methods to properly manage HTTP-only auth cookies.
**When to use:** Server Components, Server Actions, Route Handlers.

```typescript
// lib/supabase/server.ts
// Source: Official Supabase AI prompt docs + @supabase/ssr type definitions
import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}
```

**Key details:**
- The function MUST be `async` because `cookies()` is async in Next.js 14+
- The `try/catch` in `setAll` is necessary because Server Components cannot write cookies; only middleware and Route Handlers can
- NEVER use the deprecated `get`/`set`/`remove` methods -- they are difficult to implement correctly and do not handle edge cases
- A new client instance must be created per request (no singleton)

### Pattern 3: Middleware for Session Refresh (middleware.ts)
**What:** Next.js middleware that refreshes Supabase auth tokens on every request. This is critical because Server Components cannot write cookies -- only middleware can update them before the response is sent.
**When to use:** Required for any Supabase auth to work correctly in an SSR context. Should be set up in this phase even though auth is Phase 4+, because the middleware structure is foundational.

```typescript
// middleware.ts (root level)
// Source: Official Supabase docs for Next.js server-side auth
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and supabase.auth.getUser().
  // A simple mistake could make it very hard to debug issues with users being
  // randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // For now, no auth redirects (auth is Phase 4+).
  // This middleware just refreshes the session cookie.

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Key details about the middleware pattern:**
- The `setAll` callback MUST set cookies on BOTH the request (for downstream Server Components) AND the response (for the browser)
- `supabaseResponse` is reassigned inside `setAll` -- this is intentional; creating a new `NextResponse.next({ request })` ensures the modified request cookies propagate
- `auth.getUser()` MUST be called to trigger token refresh; do NOT use `auth.getSession()` on the server (it reads from storage and does not validate the JWT)
- No code should run between `createServerClient` and `auth.getUser()`

### Anti-Patterns to Avoid
- **Using `@supabase/auth-helpers-nextjs`:** This package is deprecated. Use `@supabase/ssr` instead.
- **Using `get`/`set`/`remove` cookie methods:** Deprecated, error-prone, does not handle edge cases. Use `getAll`/`setAll` exclusively.
- **Using `auth.getSession()` on the server:** Not secure. Always use `auth.getUser()` which validates the JWT with the Supabase Auth server.
- **Creating a singleton server client:** Each request must get its own client instance because cookies differ per request.
- **Importing `cookies()` outside the function body:** The `cookies()` call must happen inside the `createClient` function, at request time.
- **Forgetting middleware:** Without middleware, auth tokens will not refresh, causing random logouts and session issues.
- **Using `createMiddlewareClient` from auth-helpers:** Deprecated. The middleware should use `createServerClient` from `@supabase/ssr` directly.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cookie-based auth in SSR | Custom cookie parsing/setting | `@supabase/ssr` with `getAll`/`setAll` | Token chunking, refresh logic, secure cookie attributes are all handled internally |
| Token refresh in middleware | Manual JWT refresh logic | `supabase.auth.getUser()` in middleware | Handles refresh tokens, token rotation, and error recovery |
| Browser client singleton | Manual singleton pattern | `createBrowserClient` (singleton by default) | Prevents multiple GoTrue instances, deduplicates network requests |
| Environment variable validation | Custom validation | Non-null assertions (`!`) + fail-fast at runtime | For this phase, non-null assertion is sufficient; Zod-based env validation can come in a later phase |

**Key insight:** The `@supabase/ssr` package handles all the complexity of cookie chunking (splitting large JWTs across multiple cookies), secure cookie attributes, and token refresh. Hand-rolling any of this leads to subtle auth bugs that are extremely hard to debug.

## Common Pitfalls

### Pitfall 1: Using getSession() Instead of getUser() on the Server
**What goes wrong:** `getSession()` reads from local storage/cookies without validating the JWT. A tampered or expired token is trusted.
**Why it happens:** `getSession()` works fine on the client. Developers assume it works the same on the server.
**How to avoid:** Always use `auth.getUser()` on the server. It makes a network request to the Supabase Auth server to validate the JWT.
**Warning signs:** Auth checks passing for expired or invalid tokens.

### Pitfall 2: Missing Middleware
**What goes wrong:** Auth tokens expire and are never refreshed. Users get randomly logged out.
**Why it happens:** The middleware seems optional because the app "works" without it initially (tokens are valid for an hour by default).
**How to avoid:** Set up middleware from the start (this phase), even before adding auth flows.
**Warning signs:** Users logged out after ~1 hour, "JWT expired" errors in console.

### Pitfall 3: Cookies Not Propagating in Server Components
**What goes wrong:** Server Components cannot write cookies. If `setAll` is called from a Server Component, the cookie update is silently lost.
**Why it happens:** Next.js Server Components are rendered as a streaming response and cannot modify response headers.
**How to avoid:** The `try/catch` in `server.ts` `setAll` handles this gracefully. The middleware is responsible for actually persisting cookie updates.
**Warning signs:** Console warnings from `@supabase/ssr` about being unable to set cookies.

### Pitfall 4: Code Between createServerClient and auth.getUser() in Middleware
**What goes wrong:** If code runs between client creation and `getUser()`, it can interfere with the cookie state and cause inconsistent auth behavior.
**Why it happens:** Developers add logging, header checks, or other logic in the wrong place.
**How to avoid:** Call `auth.getUser()` immediately after creating the server client in middleware. Add any custom logic after that call.
**Warning signs:** Intermittent auth failures, inconsistent user state.

### Pitfall 5: Environment Variables Missing at Runtime
**What goes wrong:** The app crashes or Supabase client fails silently with cryptic errors if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set.
**Why it happens:** Developer forgets to copy `.env.example` to `.env.local`, or Vercel deployment missing env vars.
**How to avoid:** Use non-null assertions to fail fast. Document the setup clearly. Consider adding a startup check.
**Warning signs:** `TypeError: Cannot read properties of undefined`, `Invalid URL` errors.

### Pitfall 6: Committing .env.local
**What goes wrong:** Secrets exposed in git history.
**Why it happens:** Developer adds `.env.local` before checking `.gitignore`.
**How to avoid:** Verify `.gitignore` includes `.env.local` and `.env*.local` patterns. The Next.js default `.gitignore` already includes these.
**Warning signs:** `git status` showing `.env.local` as untracked.

## Code Examples

Verified patterns from official sources and type definitions:

### Using Server Client in a Server Component
```typescript
// app/example/page.tsx
// This pattern will be used in Phase 4+ when tables exist
import { createClient } from '@/lib/supabase/server'

export default async function ExamplePage() {
  const supabase = await createClient()

  // Example: check if user is authenticated (Phase 4+)
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <p>User: {user?.email ?? 'Not logged in'}</p>
    </div>
  )
}
```

### Using Browser Client in a Client Component
```typescript
// components/example.tsx
'use client'

import { createClient } from '@/lib/supabase/client'

export function Example() {
  const supabase = createClient()

  // The supabase client is a singleton -- safe to call in every render
  // Use for realtime subscriptions, client-side queries, etc.

  return <div>Client component with Supabase access</div>
}
```

### Using Server Client in a Server Action
```typescript
// app/actions/example.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export async function exampleAction() {
  const supabase = await createClient()

  // Server Actions CAN write cookies (unlike Server Components)
  // so setAll will work here without the try/catch fallback
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // ... action logic
}
```

### Graceful Degradation When Env Vars Missing
```typescript
// Optional: lib/supabase/check-env.ts
// Can be used in development to provide better error messages

export function checkSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Copy .env.example to .env.local and fill in your Supabase project credentials. ' +
      'See docs/supabase-setup.md for instructions.'
    )
  }

  return { url, anonKey }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | 2024 | All auth-helpers packages consolidated into single SSR package |
| `get`/`set`/`remove` cookie methods | `getAll`/`setAll` cookie methods | @supabase/ssr 0.4+ | Simpler API, handles edge cases correctly, required going forward |
| `createClientComponentClient` | `createBrowserClient` | With @supabase/ssr migration | Same concept, different import/name |
| `createServerComponentClient` | `createServerClient` | With @supabase/ssr migration | Unified function for all server contexts |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Late 2025 (docs changed) | Both work with current libraries; legacy anon keys work until late 2026 |
| `auth.getSession()` on server | `auth.getUser()` on server | Supabase security advisory | getSession does not validate JWT; getUser does |

**Deprecated/outdated:**
- `@supabase/auth-helpers-nextjs`: Fully deprecated, replaced by `@supabase/ssr`
- `createMiddlewareClient()`: Deprecated helper; use `createServerClient()` in middleware instead
- `get`/`set`/`remove` cookie methods: Deprecated in @supabase/ssr; will be removed in next major version

## Open Questions

Things that couldn't be fully resolved:

1. **Package Version Upgrade**
   - What we know: The upgrade from `@supabase/ssr@0.5.2` to `0.8.0` and `@supabase/supabase-js@2.46.1` to `2.80.0` has no breaking changes per the changelog.
   - What's unclear: Whether upgrading should happen in this phase or be deferred to avoid scope creep.
   - Recommendation: Upgrade in this phase since there are no breaking changes and newer versions have bug fixes (cookie console warnings, etc.). If the planner prefers minimal risk, defer to a separate maintenance task.

2. **Service Role Key for Admin Operations**
   - What we know: The `.cursor/rules/data-layer.md` mentions `SUPABASE_SERVICE_ROLE_KEY` for admin/background operations that bypass RLS. The phase document says no database tables or auth in this phase.
   - What's unclear: Whether to add `SUPABASE_SERVICE_ROLE_KEY` to `.env.example` now or defer.
   - Recommendation: Add it to `.env.example` as a placeholder with a comment that it's needed in later phases, but do NOT create a service-role client in this phase.

3. **Supabase Project Type (Cloud vs Local)**
   - What we know: The phase doc says "cloud or local." Supabase CLI (`npx supabase init`) supports local development with Docker.
   - What's unclear: Whether the project should use Supabase Cloud from the start or set up local dev with the CLI.
   - Recommendation: Use Supabase Cloud for simplicity (the phase doc suggests it). Local dev with Docker can be added later if needed. Document both options in the setup guide.

## Sources

### Primary (HIGH confidence)
- `@supabase/ssr@0.5.2` type definitions (node_modules) -- Verified getAll/setAll API support, deprecated get/set/remove warnings
- `@supabase/supabase-js@2.46.1` -- Installed and verified in package.json
- [Supabase AI Prompt: Bootstrap Next.js with Supabase Auth](https://supabase.com/docs/guides/getting-started/ai-prompts/nextjs-supabase-auth) -- Official code patterns for client.ts, server.ts, middleware.ts
- [Setting up Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) -- Official middleware and cookie handling patterns
- [Creating a Supabase Client for SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client) -- Official createBrowserClient/createServerClient documentation

### Secondary (MEDIUM confidence)
- [Supabase API Keys Discussion #29260](https://github.com/orgs/supabase/discussions/29260) -- API key transition timeline (ANON_KEY to PUBLISHABLE_KEY)
- [Supabase SSR GitHub Releases](https://github.com/supabase/ssr/releases) -- Changelog from 0.5.x to 0.8.0
- [@supabase/ssr npm page](https://www.npmjs.com/package/@supabase/ssr) -- Latest version confirmation (0.8.0)
- [Supabase API Key Migration Discussion #40300](https://github.com/orgs/supabase/discussions/40300) -- Confirmation that old env var names continue working

### Tertiary (LOW confidence)
- Supabase docs mention of `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` -- The docs have already switched to this naming but both names work with current libraries

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Verified from installed node_modules type definitions and official docs
- Architecture: HIGH -- Patterns sourced from official Supabase documentation and AI prompt guide
- Pitfalls: HIGH -- Documented in official Supabase docs and @supabase/ssr JSDoc comments
- Version info: MEDIUM -- Latest versions confirmed via npm search but exact changelog details limited

**Research date:** 2026-02-09
**Valid until:** 2026-03-09 (30 days -- stable domain, packages are mature)
