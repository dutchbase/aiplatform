# Architecture

**Analysis Date:** 2026-02-09

## Pattern Overview

**Overall:** Layered Next.js 14 App Router Architecture with Supabase Backend

**Key Characteristics:**
- Server Components-first approach with selective Client Components for interactivity
- Planned layered architecture (Frontend → API → Business Logic → Data → External Services)
- Multi-layer security strategy (authentication + authorization + Row Level Security)
- Service layer pattern for all business logic (never direct DB access from routes)
- Supabase-powered backend (PostgreSQL with RLS, Auth, Storage)

## Layers

**Frontend Layer (Next.js App Router):**
- Purpose: User interface, rendering, and client-side interactivity
- Location: `C:\Users\dutch\OneDrive\Bureaublad\aiassistentplatform\app`, `C:\Users\dutch\OneDrive\Bureaublad\aiassistentplatform\components`
- Contains: React Server Components (default), Client Components (selective), Pages, Layouts
- Depends on: API Layer (Server Actions), Business Logic Layer (direct in Server Components)
- Used by: End users (internal Admin/User roles only in MVP)
- Current state: Basic Next.js setup with root layout and home page

**API Layer (Supabase REST + Edge Functions):**
- Purpose: HTTP endpoints, authentication gates, request validation, response formatting
- Location: Supabase REST API (auto-generated), `supabase/functions/` (planned), Next.js Server Actions `app/actions/` (planned)
- Contains: REST endpoints, Server Actions, authentication middleware, input validation (Zod)
- Depends on: Business Logic Layer, Authentication services (Supabase Auth)
- Used by: Frontend components, external webhooks (n8n integration)
- Current state: Not yet implemented (Phase 0 complete, Phase 3-4 upcoming)

**Business Logic Layer (Service Classes):**
- Purpose: Domain logic, business rules, complex operations, cross-entity coordination
- Location: `lib/services/` (planned)
- Contains: Service classes (LeadService, CustomerService, etc.), business rule validation, workflow orchestration
- Depends on: Data Layer (Drizzle ORM, Supabase client)
- Used by: API routes, Server Actions, Server Components
- Pattern: Stateless service classes with async methods
- Current state: Not yet implemented (will be created in phases 4+)

**Data Layer (PostgreSQL via Supabase + Drizzle ORM):**
- Purpose: Database schema, type-safe queries, RLS policies, data persistence
- Location: `packages/database/` (planned), Supabase PostgreSQL database
- Contains: Drizzle schema definitions, database queries, migrations, RLS policies
- Depends on: PostgreSQL database (Supabase-hosted)
- Used by: Business Logic Layer
- Pattern: Supabase client (with RLS) for most operations, Drizzle for complex queries
- Current state: Not yet implemented (Phase 4: Database setup)

**External Services Layer:**
- Purpose: Third-party integrations, webhooks, external APIs
- Location: `lib/integrations/` (planned), n8n workflows (external)
- Contains: Webhook handlers, n8n integration, external API clients
- Depends on: Business Logic Layer
- Used by: API Layer (webhook endpoints)
- Key integrations: n8n (lead intake, automation), Supabase (storage, auth)
- Current state: Not yet implemented (Phase 13: Webhook integration)

## Data Flow

**Content Delivery (Server Components):**

1. User requests page → Next.js App Router
2. Server Component fetches data directly (via Supabase client with RLS or service layer)
3. Data rendered to HTML on server
4. HTML streamed to client (with React Suspense boundaries)
5. Client hydrates interactive islands (Client Components)

**Mutation Flow (Server Actions):**

1. Client Component triggers Server Action
2. Server Action authenticates user (Supabase Auth)
3. Server Action checks permissions (RBAC)
4. Server Action validates input (Zod schemas)
5. Server Action calls service layer for business logic
6. Service layer executes database operations (via Supabase/Drizzle)
7. Service layer logs audit trail
8. Response returned to client

**Webhook Flow (n8n → Supabase):**

1. External source triggers n8n workflow
2. n8n processes data and calls webhook endpoint (Supabase Edge Function)
3. Edge Function authenticates webhook (API key)
4. Edge Function validates payload (Zod)
5. Edge Function calls LeadService to create lead
6. LeadService inserts to database with initial status
7. LeadService checks for duplicates
8. LeadService logs activity to lead_activities table
9. Response sent back to n8n

**State Management:**
- Server state: Database (PostgreSQL) as single source of truth
- Client state: React state hooks (useState, useReducer) for UI-only state
- Form state: React Server Actions with useFormState/useFormStatus hooks
- No global state management library needed (leveraging Server Components)

## Key Abstractions

**Server Components:**
- Purpose: Default rendering pattern for all pages and components
- Examples: `C:\Users\dutch\OneDrive\Bureaublad\aiassistentplatform\app\page.tsx`, `C:\Users\dutch\OneDrive\Bureaublad\aiassistentplatform\app\layout.tsx`
- Pattern: Async functions that fetch data and render on server, zero client-side JavaScript

**Client Components:**
- Purpose: Interactive UI elements requiring hooks, event handlers, or browser APIs
- Examples: Forms, modals, interactive buttons (to be created in later phases)
- Pattern: Marked with `'use client'` directive, kept small and focused

**Server Actions:**
- Purpose: Type-safe mutations called from Client Components
- Examples: createLead, updateLeadStatus, startSalesAction (planned)
- Pattern: Async functions marked with `'use server'`, follow auth → permission → validate → execute → log flow

**Service Classes:**
- Purpose: Encapsulate domain logic and business rules
- Examples: LeadService, CustomerService, SalesActionService (planned)
- Pattern: Stateless classes with async methods, handle transactions, coordinate between entities

**RLS Policies:**
- Purpose: Database-level security enforcing access control
- Examples: Internal-only policies (Admin/User access), role-based policies (planned)
- Pattern: SQL policies on Supabase tables filtering rows based on auth.uid() and user role

## Entry Points

**Root Layout:**
- Location: `C:\Users\dutch\OneDrive\Bureaublad\aiassistentplatform\app\layout.tsx`
- Triggers: All page requests
- Responsibilities: HTML shell, metadata, global CSS, root providers (future: auth, theme)

**Home Page:**
- Location: `C:\Users\dutch\OneDrive\Bureaublad\aiassistentplatform\app\page.tsx`
- Triggers: User navigates to `/`
- Responsibilities: Landing page content, currently shows project status

**Middleware (Planned):**
- Location: `middleware.ts` (to be created in Phase 4)
- Triggers: All requests to protected routes
- Responsibilities: Authentication check, redirect to login if unauthenticated

**API Routes (Planned):**
- Location: `app/api/*/route.ts` (to be created in phases 5+)
- Triggers: HTTP requests from frontend or webhooks
- Responsibilities: Request handling, auth/permission checks, calling service layer

**Webhook Endpoints (Planned):**
- Location: `supabase/functions/webhooks/` (to be created in Phase 13)
- Triggers: n8n workflow HTTP requests
- Responsibilities: Webhook authentication, payload validation, lead creation

## Error Handling

**Strategy:** Multi-level error boundaries with graceful degradation

**Patterns:**
- Route-level error boundaries (`error.tsx` files in Next.js App Router)
- Component-level try-catch in Server Actions
- Service-level exceptions for business logic violations
- Database-level constraints and RLS policies
- Global error tracking (Sentry planned for Phase 23)

**Error Flow:**
1. Error occurs in service/database/API
2. Service throws typed error (ValidationError, AuthorizationError, etc.)
3. API route/Server Action catches error
4. Error handler returns user-friendly message (no sensitive details)
5. Error logged to monitoring service (Sentry in production)
6. Client displays error UI via error boundary or inline message

## Cross-Cutting Concerns

**Logging:**
- Audit trail logging in `lead_activities` table (planned Phase 5+)
- Application logs via console (dev) and Sentry (production, Phase 23)
- Webhook event logging in `webhook_events` table (Phase 13)
- Status change history in `lead_status_history` table (Phase 6)

**Validation:**
- Input validation with Zod schemas at API/Server Action layer
- Business rule validation in service layer
- Database constraints (CHECK, NOT NULL, FOREIGN KEY)
- RLS policies for access control validation

**Authentication:**
- Supabase Auth for identity management (Phase 4)
- Session-based authentication with cookies
- JWT tokens for API authentication
- Middleware protection for all protected routes
- auth.uid() used in RLS policies

**Authorization:**
- Role-Based Access Control (RBAC) at application layer
- Two roles in MVP: Admin (full access), User (Sales/Operations - limited)
- Permission checks before all sensitive operations
- Permission format: `module:action` (e.g., `leads:update_status`, `settings:manage`)
- RLS policies enforce permissions at database level (defense in depth)

---

*Architecture analysis: 2026-02-09*
