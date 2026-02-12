# Summary 26-01 – Admin Dashboard: Basis & Gebruikersbeheer

**Status:** COMPLETE
**Date:** 2026-02-12

## Wat is er gebouwd

- `lib/supabase/admin.ts` – service-role Supabase client (server-only)
- `app/admin/layout.tsx` – admin layout guard met dubbele redirect
- `app/admin/page.tsx` – dashboard homepage met 4 navigatiekaarten
- `app/admin/gebruikers/page.tsx` – gepagineerde gebruikerslijst via Admin API
- `app/admin/gebruikers/[id]/page.tsx` – gebruikersdetailpagina
- `app/admin/gebruikers/actions.ts` – `updateUserRole` en `deleteUser` Server Actions
- `components/layout/header.tsx` – admin link toegevoegd voor admin-rol

## Afwijkingen van plan

- `app/admin/page.tsx` bevat al alle 4 kaarten (incl. Inhoudsbeheer uit Phase 27) om dubbele wijziging te voorkomen
- Delete knop heeft geen `window.confirm` (kan niet in Server Component) – waarschuwingstekst is aanwezig
- `deleteUser` accepteert `FormData` ipv `(userId: string)` voor directe form action binding

## Acceptance criteria

- [x] `/admin` redirects non-admins to `/`
- [x] `/admin` redirects unauthenticated users to `/login`
- [x] Admin dashboard homepage shows navigation cards
- [x] Header shows "Admin" link only for admin-role users
- [x] `/admin/gebruikers` lists all users with email, role, signup date
- [x] Pagination works (50 users per page)
- [x] `/admin/gebruikers/[id]` shows user detail with question/answer counts
- [x] Role change form updates `profiles.role` in database
- [x] Delete user removes user from `auth.users`
- [x] Both actions re-verify admin role before executing
- [x] `lib/supabase/admin.ts` has no `'use client'` directive
- [x] No `any` types
