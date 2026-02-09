# External Integrations

**Analysis Date:** 2026-02-09

## APIs & External Services

**Backend Services:**
- Supabase - All-in-one backend platform
  - SDK/Client: `@supabase/supabase-js` 2.46.1, `@supabase/ssr` 0.5.2
  - Auth: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Purpose: Database, authentication, storage, real-time subscriptions

## Data Storage

**Databases:**
- PostgreSQL via Supabase
  - Connection: `NEXT_PUBLIC_SUPABASE_URL`
  - Client: Supabase JavaScript client (abstracts direct database access)
  - ORM/Query Builder: Drizzle ORM (planned per `.cursor/rules/data-layer.md`)
  - Access Pattern: Row Level Security (RLS) enforced at database level

**File Storage:**
- Supabase Storage
  - Bucket Structure: Private documents (ID cards, contracts), Public documents (CVs, certificates)
  - Access Control: RLS policies on `storage.objects`

**Caching:**
- None (MVP phase)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth
  - Implementation: Email/password authentication with session management
  - User Types: Internal only (Admin, Sales/Operations) per PRD Section 3.3 & 4.2
  - Session Handling: `@supabase/ssr` for server-side auth state
  - User Linking: `users.auth_id` → `auth.users.id` relationship
  - Authorization: RBAC (Role-Based Access Control) at application layer

## Monitoring & Observability

**Error Tracking:**
- None (MVP phase)

**Logs:**
- Console logging (development)
- Audit trail stored in database (planned per PRD Section 14.2)

## CI/CD & Deployment

**Hosting:**
- Vercel (planned deployment platform per PRD and CLAUDE.md)

**CI Pipeline:**
- None configured (MVP planning phase)

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (client-side safe)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations (planned, not yet in use)
- `DATABASE_URL` - Direct database connection for Drizzle ORM (planned)

**Secrets location:**
- Local development: `.env.local` (gitignored)
- Production: Vercel environment variables (planned)

## Webhooks & Callbacks

**Incoming:**
- Webhook endpoints for external integrations (planned per PRD Section 13)
  - n8n → CRM lead intake
  - Status change notifications

**Outgoing:**
- CRM → n8n webhook events (planned per PRD Section 13)
  - Lead created, status changed, sales action triggered

## Integration Patterns

**Planned Integrations (not yet implemented):**

**n8n Workflow Automation:**
- Purpose: Lead intake automation, external system communication
- Direction: Bidirectional (inbound lead creation, outbound status notifications)
- Authentication: Webhook tokens/API keys
- Storage: `webhook_events` table for audit trail

**Email Services:**
- Not yet configured (future integration for notifications)

**Payment Processing:**
- Not applicable (MVP scope - no customer portal or payments per PRD Section 3.3)

## Database Integration Details

**Supabase Features in Use:**
- **Auth:** User authentication, session management
- **Database:** PostgreSQL with Row Level Security (RLS)
- **Storage:** File uploads with bucket-level security
- **Realtime:** Not yet in use (planned for future phases)

**Security Model:**
- Layer 1: Database RLS policies filter data based on `auth.uid()`
- Layer 2: Application RBAC checks permissions before operations
- Internal users only per PRD Section 3.3 (no external customer access in MVP)

**RLS Policy Pattern:**
```sql
-- All internal users can see all leads
CREATE POLICY "leads_internal_access_select" ON leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_id = auth.uid()
      AND u.user_type = 'internal'
      AND u.status = 'active'
    )
    AND deleted_at IS NULL
  );
```

---

*Integration audit: 2026-02-09*
