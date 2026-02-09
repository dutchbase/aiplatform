---
phase: 04
plan: 04-01
subsystem: database
tags: [postgresql, supabase, rls, triggers, profiles]
requires: [03-01]
provides: [profiles-table, user-identity-foundation]
affects: [04-02, 05-01, qa-features, moderation]
tech-stack:
  added: []
  patterns: [row-level-security, database-triggers, cached-auth-uid]
key-files:
  created:
    - supabase/migrations/00001_profiles.sql
    - docs/database-schema.md
  modified: []
decisions:
  - id: 04-01-D1
    decision: Use CHECK constraint instead of PostgreSQL ENUM for role column
    rationale: CHECK constraints are easier to modify later without complex migrations
  - id: 04-01-D2
    decision: Use (select auth.uid()) pattern in RLS policies instead of direct auth.uid()
    rationale: SELECT wrapper causes PostgreSQL to cache result per-statement vs per-row, improving performance from 179ms to 9ms
  - id: 04-01-D3
    decision: Use security definer set search_path = '' on handle_new_user trigger
    rationale: Allows function to bypass RLS while preventing search_path injection attacks
  - id: 04-01-D4
    decision: No INSERT or DELETE RLS policies on profiles table
    rationale: Only trigger inserts profiles, only CASCADE deletes them - simplifies security model
metrics:
  duration: 3m 16s
  completed: 2026-02-09
---

# Phase 04 Plan 01: Profiles Table & RLS Summary

**PostgreSQL profiles table with triggers for auto-creation on signup, auto-updating timestamps, and RLS policies for authenticated read and controlled updates**

---

## What Was Built

Created the foundation database table for user identity in the AI Assistenten Hub. The `profiles` table stores display names and roles for all users, linked to Supabase's `auth.users` table via foreign key with cascade delete.

Two PostgreSQL triggers automate profile management:
1. `on_auth_user_created` - Automatically creates a profile row when a user signs up
2. `update_profiles_updated_at` - Automatically updates the timestamp on any profile change

Row Level Security (RLS) policies enforce data access rules at the database level:
- All authenticated users can read all profiles (needed for Q&A author display)
- Users can only update their own profile
- Admins can update any profile

---

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Create SQL migration for profiles table, triggers, and RLS policies | 50a12b7 | supabase/migrations/00001_profiles.sql |
| 2 | Create database schema documentation | aaf276f | docs/database-schema.md |

---

## Decisions Made

### D1: CHECK Constraint Over ENUM for Roles

**Decision:** Use `CHECK (role in ('user', 'moderator', 'admin'))` instead of PostgreSQL ENUM type.

**Rationale:**
- ENUM types require `ALTER TYPE ... ADD VALUE` migrations to add new roles
- ENUMs can't easily remove values or reorder them
- CHECK constraints can be modified with simple `ALTER TABLE` commands
- Provides same validation guarantees with more flexibility

**Impact:** Future role additions (e.g., 'editor', 'contributor') are simpler migrations.

---

### D2: Cached auth.uid() Pattern

**Decision:** Use `(select auth.uid())` instead of direct `auth.uid()` in RLS policies.

**Rationale:**
- Direct `auth.uid()` calls execute once per row in large queries
- Wrapping in SELECT causes PostgreSQL to cache the result per-statement
- Performance improvement: 179ms → 9ms on large tables (20x faster)
- No functional difference, purely an optimization

**Impact:** All future RLS policies should follow this pattern. Will be documented in architecture standards.

---

### D3: Security Definer with Empty Search Path

**Decision:** Use `security definer set search_path = ''` on the `handle_new_user()` trigger function.

**Rationale:**
- `security definer` allows the function to bypass RLS (runs as postgres role)
- Without this, the INSERT into profiles would be blocked by RLS during signup
- `set search_path = ''` prevents search_path injection attacks
- Forces use of fully qualified table names (public.profiles) inside function

**Impact:** All future trigger functions that need elevated privileges must use this pattern.

---

### D4: No INSERT or DELETE Policies

**Decision:** Do not create INSERT or DELETE RLS policies on the profiles table.

**Rationale:**
- **INSERT:** Only the `handle_new_user` trigger should create profiles (automatic on signup)
- **DELETE:** Profiles are deleted via `ON DELETE CASCADE` when auth.users row is deleted
- Preventing direct INSERT/DELETE simplifies security model and prevents orphaned/duplicate profiles

**Impact:** Application code cannot directly insert or delete profiles. Must use Supabase Auth methods.

---

## Deviations from Plan

None - plan executed exactly as written.

---

## Files Created

### supabase/migrations/00001_profiles.sql (96 lines)

Complete SQL migration containing:
- **profiles table** with 5 columns (id, display_name, role, created_at, updated_at)
- **RLS enabled** on profiles table
- **handle_new_user() function** with security definer
- **on_auth_user_created trigger** on auth.users
- **update_updated_at_column() function**
- **update_profiles_updated_at trigger** on profiles
- **3 RLS policies**: authenticated SELECT, self UPDATE, admin UPDATE

Ready to execute in Supabase Dashboard SQL Editor.

---

### docs/database-schema.md (109 lines)

Comprehensive Dutch-language documentation covering:
- Complete profiles table schema with all columns and constraints
- Explanation of both triggers and their purposes
- Detailed RLS policy descriptions with security rationale
- Step-by-step migration instructions for Supabase Dashboard
- Security design decisions (cached auth.uid(), security definer, CHECK constraints)
- Future expansion plans (Q&A tables, blog tables, Drizzle ORM)

---

## Technical Details

### Security Patterns Implemented

1. **Row Level Security (RLS):** All database-level access control, no reliance on application layer
2. **Cached auth.uid():** Performance optimization for RLS policies
3. **Security Definer:** Elevated privileges for trigger function with search_path protection
4. **Foreign Key Cascade:** Automatic profile cleanup when auth user deleted
5. **CHECK Constraint Validation:** Enforced role values at database level

### Database Objects Created

- 1 table (public.profiles)
- 2 functions (handle_new_user, update_updated_at_column)
- 2 triggers (on_auth_user_created, update_profiles_updated_at)
- 3 RLS policies (SELECT, self UPDATE, admin UPDATE)

---

## Next Phase Readiness

### Blockers

None.

### Prerequisites for Phase 04-02 (Authentication Implementation)

This plan provides:
- ✓ profiles table exists for storing user data after signup
- ✓ trigger automatically creates profile on signup
- ✓ RLS policies ready to enforce access control
- ✓ documentation for developers

Phase 04-02 can now implement Supabase Auth signup/login flows, knowing that profiles will be created automatically.

---

## Verification Results

All verification criteria passed:

1. ✓ **File existence:** Both SQL migration and documentation files created
2. ✓ **SQL correctness:** Migration contains all required objects (table, 2 triggers, 2 functions, 3 RLS policies)
3. ✓ **Security patterns:** `security definer set search_path = ''` present, `(select auth.uid())` used in all RLS policies
4. ✓ **No ENUM:** File uses CHECK constraint, not PostgreSQL ENUM
5. ✓ **Documentation:** Schema doc in Dutch covers table, triggers, RLS, and migration instructions
6. ✓ **TypeScript build:** `npm run build` passes successfully (SQL files don't affect TS build)

---

## Lessons Learned

### What Went Well

- **Security-first design:** RLS policies enforce access control at database level
- **Performance optimization:** Cached auth.uid() pattern proactively implemented
- **Clear documentation:** Dutch documentation makes it accessible for team
- **Automated triggers:** Profile creation and timestamp updates require no application code

### What to Improve

- **Migration execution:** Currently manual via Dashboard - could automate with Supabase CLI in CI/CD
- **Testing:** No automated tests for RLS policies yet (future phase)
- **Type generation:** No TypeScript types generated from schema yet (could use Supabase CLI)

---

## Links

- **Migration file:** `supabase/migrations/00001_profiles.sql`
- **Documentation:** `docs/database-schema.md`
- **Related plan:** 04-02 (Authentication Implementation)
- **Supabase RLS docs:** https://supabase.com/docs/guides/auth/row-level-security

---

**Completed:** 2026-02-09
**Duration:** 3 minutes 16 seconds
**Tasks:** 2/2
**Commits:** 2
