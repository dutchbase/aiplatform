# Phase 5: Sessie & Profiel - Research

**Researched:** 2026-02-09
**Domain:** Supabase Auth session in Next.js Server Components, auth-aware header, profile page with RLS-protected update
**Confidence:** HIGH

## Summary

Phase 5 builds directly on the infrastructure from Phases 2-4: the Header component (`components/layout/header.tsx`), Supabase client utilities (`lib/supabase/client.ts`, `lib/supabase/server.ts`), middleware for session refresh (`middleware.ts`), auth Server Actions (`app/login/actions.ts`), the signout Route Handler (`app/auth/signout/route.ts`), and the `profiles` table with RLS policies. This phase adds three capabilities: (1) session-aware header showing login/register for anonymous users and profile/logout for authenticated users, (2) a protected profile page at `/profiel` showing email and display_name, and (3) a profile edit form using a Server Action that updates `display_name` in the `profiles` table via RLS.

The standard approach is to make the Header an async Server Component that calls `supabase.auth.getUser()` to determine auth state, then conditionally renders navigation links. The profile page is also a Server Component that fetches the user and their profile, redirecting to `/login` if not authenticated. The profile edit form is a Client Component using `useFormState` from `react-dom` (React 18.3.1) paired with a Server Action that updates the `profiles` table. The Server Action receives a `prevState` argument (required by `useFormState`) and returns a state object with success/error messages for feedback.

There are two viable patterns for the auth-aware header: (A) a pure Server Component that calls `getUser()` directly, or (B) a Server Component that fetches the user and passes it as a prop to a Client Component child. Pattern A is simpler and sufficient for this phase since the header does not need real-time auth state updates (the middleware + `revalidatePath('/', 'layout')` after login/logout handles cache invalidation). Pattern B (with AuthProvider/context) is only needed if client-side auth state changes must be reflected without a full page reload, which is not a requirement here.

**Primary recommendation:** Use the Server Component approach (Pattern A) for the header. The Header becomes async, calls `getUser()`, and conditionally renders auth links. The profile page is a protected async Server Component. The profile edit form is a small Client Component with `useFormState` + a Server Action. No AuthProvider context is needed.

## Standard Stack

### Core (Already Installed)
| Library | Installed Version | Purpose | Why Standard |
|---------|-------------------|---------|--------------|
| `@supabase/supabase-js` | 2.46.1 | `auth.getUser()` for session check, `from('profiles').select/update` for profile data | Official Supabase client |
| `@supabase/ssr` | 0.5.2 | `createServerClient` for server-side Supabase operations | Required for SSR auth |
| `next` | 14.2.16 | App Router, Server Components, Server Actions, `redirect()`, `revalidatePath()` | Framework |
| `react` | 18.3.1 | UI rendering, `useFormState` from `react-dom` for form feedback | UI library |
| `react-dom` | 18.3.1 | `useFormState` hook, `useFormStatus` hook | Form state management |

### Supporting (Built-in to Next.js/React)
| API | Source | Purpose | When to Use |
|-----|--------|---------|-------------|
| `redirect()` | `next/navigation` | Redirect unauthenticated users to `/login` | In Server Components and Server Actions |
| `revalidatePath()` | `next/cache` | Invalidate cached pages after auth state changes | After signout in Server Action |
| `useFormState` | `react-dom` | Connect Server Action to form state for feedback | Profile edit form (Client Component) |
| `useFormStatus` | `react-dom` | Track form submission pending state | Submit button in profile edit form |

### NOT Needed in This Phase
| Library/Pattern | Why Not |
|-----------------|---------|
| AuthProvider / React Context | The server-side approach with `revalidatePath` after login/logout is sufficient. No real-time client-side auth state needed. |
| `onAuthStateChange` listener | Only needed for client-side auth state subscriptions. Server Components re-render with fresh data on navigation. |
| `useActionState` (React 19) | Not available in React 18.3.1. Use `useFormState` from `react-dom` instead. |
| Zod validation | The only editable field is `display_name` (a text string). HTML5 `required` attribute + simple server-side check is sufficient. Zod comes in later phases. |
| `@supabase/auth-helpers-nextjs` | DEPRECATED. Already using `@supabase/ssr`. |

**Installation:**
No new packages needed. All required libraries are already installed.

## Architecture Patterns

### Recommended File Structure
```
components/
  layout/
    header.tsx               # MODIFY: Add auth-aware conditional rendering (async Server Component)
app/
  profiel/
    page.tsx                 # NEW: Protected profile page (Server Component)
    actions.ts               # NEW: Server Action for updating display_name
    profile-form.tsx         # NEW: Client Component form for editing profile
docs/
  CHANGELOG.md              # UPDATE: Phase 5 entry
```

### Pattern 1: Auth-Aware Header (Async Server Component)
**What:** The existing Header component is converted to an async Server Component that fetches the current user via `supabase.auth.getUser()` and conditionally renders navigation links.
**When to use:** For any shared layout component that needs to show different content based on auth state.
**Why this approach:** Server Components can call async functions directly. The middleware refreshes the session cookie on every request, so `getUser()` always returns the current auth state. After login/logout, `revalidatePath('/', 'layout')` invalidates the layout cache, causing the Header to re-render with fresh auth state.

```typescript
// components/layout/header.tsx
// Source: Supabase official Next.js example (AuthButton pattern)
// https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/openclaw', label: 'OpenClaw' },
  { href: '/blog', label: 'Blog' },
  { href: '/qa', label: 'Q&A' },
] as const

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">AI Assistenten Hub</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link key={href} href={href} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/profiel" className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors">
                Mijn profiel
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors">
                  Uitloggen
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors">
                Inloggen
              </Link>
              <Link href="/login" className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors">
                Registreren
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
```

**Key details:**
- The function is now `async` (was not before) -- this is required to `await createClient()` and `await getUser()`
- The signout button uses a plain HTML `<form>` with `action="/auth/signout"` and `method="post"` -- this POSTs to the existing Route Handler from Phase 4
- No `'use client'` directive needed -- this is a pure Server Component
- `getUser()` is called (NOT `getSession()`) per security requirements
- The `Registreren` link also points to `/login` because Phase 4 combined login and registration on one page

### Pattern 2: Protected Profile Page (Server Component)
**What:** A Server Component that checks auth, redirects if not logged in, fetches the profile from the database, and renders the page.
**When to use:** For any page that should only be accessible to logged-in users.

```typescript
// app/profiel/page.tsx
// Source: Supabase official pattern for protected pages
// https://supabase.com/docs/guides/auth/server-side/nextjs
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { ProfileForm } from './profile-form'

export const metadata: Metadata = {
  title: 'Mijn profiel',
  description: 'Bekijk en bewerk je profiel op de AI Assistenten Hub.',
}

export default async function ProfielPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch profile from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-6">Mijn profiel</h1>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">E-mailadres</p>
        <p>{user.email}</p>
      </div>
      <ProfileForm
        displayName={profile?.display_name ?? ''}
        userId={user.id}
      />
    </div>
  )
}
```

**Key details:**
- `redirect('/login')` is called if `getUser()` returns error or no user -- this sends a 307 redirect
- `redirect()` must NOT be inside a try/catch (it throws internally)
- Profile data is fetched from the `profiles` table using `.eq('id', user.id).single()`
- The RLS policy "Profiles are viewable by authenticated users" allows this query
- The `ProfileForm` Client Component receives the current `displayName` as a prop

### Pattern 3: Profile Edit via Server Action + useFormState
**What:** A Server Action that updates `display_name` in the `profiles` table, paired with a Client Component form using `useFormState` for feedback.
**When to use:** For any form that needs to show success/error messages after a Server Action.

```typescript
// app/profiel/actions.ts
// Source: Next.js Server Actions pattern + Supabase update
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ProfileFormState = {
  message: string | null
  error: string | null
}

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { message: null, error: 'Je bent niet ingelogd.' }
  }

  const displayName = formData.get('display_name') as string

  if (!displayName || displayName.trim().length === 0) {
    return { message: null, error: 'Weergavenaam mag niet leeg zijn.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName.trim() })
    .eq('id', user.id)

  if (error) {
    return { message: null, error: 'Er is een fout opgetreden bij het opslaan.' }
  }

  revalidatePath('/profiel')
  return { message: 'Profiel succesvol bijgewerkt.', error: null }
}
```

```typescript
// app/profiel/profile-form.tsx
// Source: React 18 useFormState pattern
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { updateProfile, type ProfileFormState } from './actions'

const initialState: ProfileFormState = {
  message: null,
  error: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
    >
      {pending ? 'Opslaan...' : 'Opslaan'}
    </button>
  )
}

export function ProfileForm({
  displayName,
  userId,
}: {
  displayName: string
  userId: string
}) {
  const [state, formAction] = useFormState(updateProfile, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="display_name" className="block text-sm font-medium mb-1">
          Weergavenaam
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={displayName}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {state.error}
        </p>
      )}

      {state.message && (
        <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
```

**Key details:**
- `useFormState` from `react-dom` (NOT `useActionState` from `react` which is React 19+ only)
- The Server Action signature is `(prevState: ProfileFormState, formData: FormData) => Promise<ProfileFormState>` -- the `prevState` first argument is required by `useFormState`
- `SubmitButton` is a separate component because `useFormStatus` can only access form status from a child component of the form
- `defaultValue` (not `value`) is used on the input so it is an uncontrolled component that still allows editing
- The RLS policy "Users can update their own profile" allows `.update().eq('id', user.id)` because the authenticated user's UUID matches
- `revalidatePath('/profiel')` ensures the page re-renders with the updated display name after a successful update

### Anti-Patterns to Avoid
- **Using `getSession()` instead of `getUser()` on the server:** `getSession()` does not validate the JWT. Always use `getUser()`.
- **Wrapping `redirect()` in try/catch:** Next.js `redirect()` works by throwing. A try/catch will swallow it.
- **Making the Header a Client Component for auth:** Unnecessary complexity. A Server Component with `getUser()` is simpler and more secure.
- **Using `useActionState` (React 19 API):** The project uses React 18.3.1. Use `useFormState` from `react-dom` instead.
- **Creating an AuthProvider context:** Not needed when using Server Components + `revalidatePath` for auth state. The AuthProvider pattern adds unnecessary complexity for this phase.
- **Using `value` instead of `defaultValue` on uncontrolled inputs:** Using `value` without `onChange` makes the input read-only. Use `defaultValue` for Server Action forms.
- **Calling `supabase.auth.signOut()` from a Server Action inline in the Header:** Phase 4 already created the `/auth/signout` Route Handler. Use a form POST to that endpoint.
- **Fetching profile data client-side in the profile page:** Use the Server Component to fetch data. The profile page should be a Server Component that passes data down to the Client Component form.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auth state in header | Custom client-side auth context + useEffect fetch | Server Component `getUser()` | Simpler, secure, no client JS needed |
| Form submission feedback | Custom `useState` + `try/catch` + manual state | `useFormState` from `react-dom` | Built-in React pattern, handles prev state, works with Server Actions |
| Pending state on submit button | Custom `isPending` state with `useState` | `useFormStatus` from `react-dom` | Built-in, automatically tracks parent form |
| Session refresh | Custom auth refresh logic | Existing middleware from Phase 3 | Already handles token rotation on every request |
| Profile update authorization | Manual auth checks before DB update | RLS policy "Users can update their own profile" | Database-level security, cannot be bypassed |
| Signout functionality | New signout logic | Existing `/auth/signout` Route Handler from Phase 4 | Already built, handles `revalidatePath` and redirect |
| Cache invalidation after auth change | Manual state management | `revalidatePath('/', 'layout')` (already in Phase 4 actions) | Built-in Next.js cache invalidation |

**Key insight:** Almost all the infrastructure for this phase already exists from Phases 3 and 4. This phase is primarily about USING that infrastructure in the UI, not building new backend logic. The only new server-side code is the profile update Server Action.

## Common Pitfalls

### Pitfall 1: Header Becomes a Client Component Unnecessarily
**What goes wrong:** Developer adds `'use client'` to the header to use `useState` or `useEffect` for auth state, losing Server Component benefits.
**Why it happens:** Habit from SPA patterns where auth state is managed client-side.
**How to avoid:** Keep the Header as an async Server Component. `getUser()` works in Server Components. The signout form uses a plain HTML `<form action="/auth/signout" method="post">` which works without JavaScript.
**Warning signs:** `'use client'` in header.tsx, `useState` for auth state, `useEffect` for auth fetching.

### Pitfall 2: useFormState vs useActionState Confusion
**What goes wrong:** Developer imports `useActionState` from `react` which does not exist in React 18.3.1, causing a runtime error.
**Why it happens:** `useActionState` is the React 19 replacement for `useFormState`. Documentation and tutorials mix the two.
**How to avoid:** In React 18.3.1 (this project), always import `useFormState` from `react-dom`. The API is the same: `const [state, formAction] = useFormState(serverAction, initialState)`.
**Warning signs:** Import error, "useActionState is not a function" error.

### Pitfall 3: Server Action Signature Mismatch with useFormState
**What goes wrong:** Server Action has signature `(formData: FormData)` but `useFormState` expects `(prevState: State, formData: FormData)`.
**Why it happens:** Developer writes the Server Action first without considering `useFormState` integration.
**How to avoid:** When using `useFormState`, the Server Action's first parameter MUST be `prevState` (the previous state), and the second parameter is `formData`. The return type must match the state type.
**Warning signs:** Type errors, `prevState` is actually the `FormData`, form data extraction fails.

### Pitfall 4: Redirect in Profile Page Fails Silently
**What goes wrong:** `redirect('/login')` does not work because it is inside a try/catch block.
**Why it happens:** Developer wraps the entire `getUser()` call and profile fetch in try/catch.
**How to avoid:** Call `redirect()` outside of any try/catch. Check `error` or `!user` from `getUser()`, then call `redirect()` at the top level of the function.
**Warning signs:** Unauthenticated users see the profile page with empty data instead of being redirected.

### Pitfall 5: Profile Update Returns No Data
**What goes wrong:** `supabase.from('profiles').update({...}).eq('id', user.id)` returns no data by default.
**Why it happens:** Supabase's `.update()` does not return rows by default (unlike traditional ORMs).
**How to avoid:** If you need the updated row, chain `.select()` after `.update()`. For this phase, we only need to check for `error`, so no `.select()` is needed.
**Warning signs:** Checking `data` from the update and finding it null/empty.

### Pitfall 6: RLS Blocks Profile Update
**What goes wrong:** The `.update()` call fails with an RLS error or silently updates zero rows.
**Why it happens:** The Supabase client uses the anon key, and the RLS policy requires the authenticated user's UUID to match.
**How to avoid:** Ensure the server client is created with `await createClient()` from `lib/supabase/server.ts` which inherits the session cookie. The middleware must be running to refresh the session. The `.eq('id', user.id)` must match the authenticated user.
**Warning signs:** Update "succeeds" (no error) but zero rows affected; or RLS policy violation error.

### Pitfall 7: searchParams Typing in Next.js 14
**What goes wrong:** Developer uses `await searchParams` (Next.js 15 pattern) in the profile page.
**Why it happens:** Documentation and tutorials mix Next.js 14 and 15 patterns. In Next.js 14, `searchParams` is a synchronous prop. In Next.js 15, it becomes a Promise.
**How to avoid:** In this project (Next.js 14.2.16), access `searchParams` directly as a prop without `await`. Type as `{ [key: string]: string | string[] | undefined }`.
**Warning signs:** TypeScript error about `Promise`, or runtime error about awaiting a non-promise.

## Code Examples

### Checking Auth State in Any Server Component
```typescript
// Pattern: reusable across any Server Component
// Source: https://supabase.com/docs/guides/auth/server-side/nextjs
import { createClient } from '@/lib/supabase/server'

// In any async Server Component:
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

// user is null if not logged in, or a User object if logged in
// user.id is the UUID
// user.email is the email address
```

### Fetching Profile from Database
```typescript
// Source: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
const { data: profile } = await supabase
  .from('profiles')
  .select('display_name, role')
  .eq('id', user.id)
  .single()

// profile.display_name is string | null
// profile.role is 'user' | 'moderator' | 'admin'
```

### Updating Profile via Server Action
```typescript
// Source: Supabase JS client .update() API
const { error } = await supabase
  .from('profiles')
  .update({ display_name: displayName.trim() })
  .eq('id', user.id)

// error is null on success
// RLS policy "Users can update their own profile" authorizes this
```

### useFormState Import for React 18
```typescript
// CORRECT for React 18.3.1 (this project):
import { useFormState, useFormStatus } from 'react-dom'

// WRONG (React 19+ only):
// import { useActionState } from 'react'
```

### Signout from Header via Form POST
```typescript
// Source: Supabase official Next.js tutorial
// POSTs to the existing /auth/signout Route Handler from Phase 4
<form action="/auth/signout" method="post">
  <button type="submit">Uitloggen</button>
</form>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client Component header with `useEffect` + `getSession()` | Async Server Component header with `getUser()` | Next.js 13+ App Router | Simpler, more secure, less client JS |
| AuthProvider context for auth state | Server Components + `revalidatePath` | Next.js 13+ App Router | No context needed for server-rendered auth UI |
| `useActionState` from `react` | `useFormState` from `react-dom` | React 19 renamed it | In React 18.3.1, use `useFormState`; in React 19+, use `useActionState` |
| Custom `isPending` state for forms | `useFormStatus` from `react-dom` | React 18 | Built-in hook, no manual state |
| Client-side profile fetch with `useEffect` | Server Component direct fetch | Next.js 13+ App Router | Data fetched at render time, no loading state needed |
| API route for profile update | Server Action with `'use server'` | Next.js 14 | Built-in CSRF protection, simpler code |

**Deprecated/outdated:**
- `useActionState` from `react`: Only available in React 19+. This project uses React 18.3.1.
- `@supabase/auth-helpers-nextjs`: Fully deprecated. Use `@supabase/ssr`.
- `auth.getSession()` on server: Insecure. Use `auth.getUser()`.
- AuthProvider context for server-rendered auth: Unnecessary with App Router Server Components.

## Integration Points with Prior Phases

This phase modifies and depends on artifacts from Phases 2, 3, and 4:

| Artifact | Phase | How Phase 5 Uses It |
|----------|-------|---------------------|
| `components/layout/header.tsx` | Phase 2 | MODIFY: Convert to async, add `getUser()` call, add auth-conditional rendering |
| `lib/supabase/server.ts` | Phase 3 | USE: `createClient()` in header, profile page, and Server Action |
| `middleware.ts` | Phase 3 | DEPENDS ON: Session cookie refresh must be running for `getUser()` to work |
| `app/auth/signout/route.ts` | Phase 4 | USE: Header's signout form POSTs to this Route Handler |
| `app/login/actions.ts` | Phase 4 | DEPENDS ON: Login/signup call `revalidatePath('/', 'layout')` which refreshes the header |
| `profiles` table + RLS | Phase 4 | USE: Profile page reads from it; edit form updates it; RLS authorizes both |
| `handle_new_user` trigger | Phase 4 | DEPENDS ON: Profile row must exist for users who signed up (trigger ensures this) |

## Scope Boundaries

### IN Scope (Phase 5)
- Modify `components/layout/header.tsx` to show auth-conditional navigation
- Create `app/profiel/page.tsx` (protected profile page)
- Create `app/profiel/actions.ts` (Server Action for display_name update)
- Create `app/profiel/profile-form.tsx` (Client Component form with useFormState)
- Update `docs/CHANGELOG.md` with Phase 5 entry
- SEO metadata on profile page

### OUT of Scope (Later Phases)
- Route protection in middleware (middleware only refreshes session, does not redirect)
- Password change / email change
- Avatar upload
- RBAC permission checking (simple "is user logged in?" check suffices for Phase 5)
- Mobile hamburger menu for header
- Role display on profile page (visible data only: email + display_name)
- Drizzle ORM (still using raw Supabase client queries)
- Separate registration page (login + registration remain combined at `/login` from Phase 4)

## Open Questions

1. **Should the "Registreren" link go to `/login` or a separate route?**
   - What we know: Phase 4 combined login and registration on `/login` with two buttons.
   - What's unclear: Whether the header "Registreren" link should point to `/login` or to `/login#register` or a separate page.
   - Recommendation: Point both "Inloggen" and "Registreren" to `/login` for now. The combined page already has both actions. A separate registration page can be added later if needed.

2. **Should the profile page show the user's role?**
   - What we know: The `profiles` table has a `role` column (user/moderator/admin).
   - What's unclear: Whether end users should see their role on the profile page.
   - Recommendation: Do not show the role for now. Role management is an admin feature for later phases. The profile page should focus on `display_name` and `email`.

3. **Should `display_name` update also update `auth.users.raw_user_meta_data`?**
   - What we know: During signup, `display_name` is stored in `raw_user_meta_data` AND the `profiles` table (via the trigger). After the profile edit, only the `profiles` table is updated.
   - What's unclear: Whether `supabase.auth.updateUser({ data: { display_name } })` should also be called to keep `raw_user_meta_data` in sync.
   - Recommendation: Only update the `profiles` table. The `profiles` table is the single source of truth for display names in the application. The `raw_user_meta_data` is only used during initial profile creation by the trigger. Keeping both in sync adds complexity with no benefit.

## Sources

### Primary (HIGH confidence)
- [Supabase Next.js Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs) -- Account form pattern, getUser() in Server Components, signout Route Handler
- [Supabase Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) -- Protected page pattern, getUser() vs getSession(), middleware integration
- [React useFormState (React 18)](https://react.dev/reference/react/useActionState) -- Confirmed useFormState is the React 18 name for what became useActionState in React 19
- [React useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus) -- Pending state for form buttons
- Phase 3 Plan (`03-01-PLAN.md`) -- Supabase client utilities, middleware pattern
- Phase 4 Research (`04-RESEARCH.md`) -- Profiles table, RLS policies, auth flows, signout handler
- Phase 4 Plans (`04-01-PLAN.md`, `04-02-PLAN.md`) -- Exact file locations and patterns for auth infrastructure

### Secondary (MEDIUM confidence)
- [AuthButton Component Pattern](https://github.com/vercel/next.js/discussions/65471) -- GitHub discussion showing the standard Supabase + Next.js auth button pattern
- [Managing Auth State Across Components](https://dev.to/jais_mukesh/managing-supabase-auth-state-across-server-client-components-in-nextjs-2h2b) -- Server vs Client auth patterns, AuthProvider alternative
- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication) -- Official Next.js recommendation against auth checks in layouts

### Tertiary (LOW confidence)
- `.cursor/rules/authentication-authorization.md` -- Project auth rules (some patterns are from a different project context, e.g., CRM/leads system)
- `.cursor/rules/frontend-application.md` -- Frontend patterns (references deprecated `createMiddlewareClient`, use current patterns instead)

## Metadata

**Confidence breakdown:**
- Header auth pattern: HIGH -- Official Supabase AuthButton pattern, verified with multiple sources
- Profile page protection: HIGH -- Official Supabase `getUser()` + `redirect()` pattern
- Profile edit Server Action: HIGH -- Standard Supabase `.update()` with RLS, verified
- useFormState usage: HIGH -- Confirmed React 18.3.1 exports this from `react-dom`
- Integration with Phase 3/4 artifacts: HIGH -- Read exact plan files, know file locations and patterns

**Research date:** 2026-02-09
**Valid until:** 2026-03-09 (30 days -- stable domain, patterns are well-established)
