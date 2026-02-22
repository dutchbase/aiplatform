# Data Layer Rules

**Layer:** Data Layer (Drizzle ORM + PostgreSQL)  
**Location:** `/packages/database/` and database queries in services  
**Last Updated:** 2026-01-20

---

## Purpose & Scope

This document defines the coding standards, patterns, and best practices for the data layer. The data layer consists of Drizzle ORM schema definitions, database queries, migrations, and interactions with PostgreSQL via Supabase.

**This layer handles:**
- Database schema definitions (Drizzle)
- Type-safe database queries
- Migrations
- Row Level Security (RLS) considerations
- Transactions
- Query optimization

**Key Principle:** Always use Drizzle ORM for database access. Raw SQL only when absolutely necessary.

---

## Architecture Patterns

### Schema Organization

**MUST:**
- Define schemas in `/packages/database/schema/`
- One schema file per domain module (matches SQL schema files)
- Use Drizzle's type inference for TypeScript types
- Export schemas from index file

**Example (PRD Section 7.2):**
```typescript
// packages/database/schema/leads.ts
// Based on PRD Section 7.2: Lead entity
import { pgTable, uuid, text, timestamp, jsonb, pgEnum, boolean } from 'drizzle-orm/pg-core';

export const leadStatusEnum = pgEnum('lead_status', [
  'nieuw',              // Net binnen
  'te_beoordelen',      // Wacht op kwalificatie
  'goedgekeurd',        // Klaar om op te volgen/verkopen
  'in_opvolging',       // Actief contact / voorbereiding
  'aangeboden_aan_klant', // Verkoopactie gestart
  'verkocht',           // Deal bevestigd
  'afgewezen',          // Niet bruikbaar / niet passend
  'verlopen',           // Te oud / geen actie binnen tijd
]);

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  branche: text('branche'), // Bijv. hypotheken, bouw, websites
  bron: text('bron').notNull(), // Waar komt het vandaan
  contactNaam: text('contact_naam'), // Naam/bedrijf
  contactEmail: text('contact_email'),
  contactTelefoon: text('contact_telefoon'),
  rawPayload: jsonb('raw_payload'), // Onbewerkte metadata/payload voor herleiding
  status: leadStatusEnum('status').notNull().default('nieuw'),
  isDuplicate: boolean('is_duplicate').default(false), // Soft duplicate flag (PRD Section 8)
  duplicateOf: uuid('duplicate_of').references(() => leads.id), // Link naar originele lead
  customerId: uuid('customer_id').references(() => customers.id), // Klant waaraan aangeboden
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'), // Soft delete
});

// Customers (klanten) - afnemers die leads kunnen kopen (PRD Section 9.1)
export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  naam: text('naam').notNull(),
  email: text('email'),
  telefoon: text('telefoon'),
  branche: text('branche'), // Voor matching (PRD Section 9.2)
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Lead status history (audit trail) - PRD Section 6.2
export const leadStatusHistory = pgTable('lead_status_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull().references(() => leads.id),
  fromStatus: leadStatusEnum('from_status'),
  toStatus: leadStatusEnum('to_status').notNull(),
  changedBy: uuid('changed_by').notNull().references(() => users.id),
  reason: text('reason'), // Optionele reden/notitie
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Lead activities (tijdlijn) - PRD Section 5.1
export const leadActivities = pgTable('lead_activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull().references(() => leads.id),
  activityType: text('activity_type').notNull(), // 'status_change', 'webhook', 'feedback', 'sale_action'
  summary: text('summary').notNull(),
  description: text('description'),
  metadata: jsonb('metadata'), // Extra data (webhook payload, feedback, etc.)
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Webhook events (in/out) - PRD Section 13
export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: text('event_type').notNull(), // 'lead_created', 'status_changed', 'sale_action'
  direction: text('direction').notNull(), // 'inbound' (n8n → CRM) or 'outbound' (CRM → n8n)
  payload: jsonb('payload').notNull(),
  status: text('status').notNull(), // 'success', 'failed', 'pending'
  errorMessage: text('error_message'),
  leadId: uuid('lead_id').references(() => leads.id),
  triggeredBy: uuid('triggered_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Feedback (PRD Section 12)
export const feedback = pgTable('feedback', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull().references(() => leads.id),
  feedbackType: text('feedback_type').notNull(), // 'internal', 'external'
  uitkomst: text('uitkomst'), // 'verkocht', 'niet_verkocht', 'onduidelijk'
  reden: text('reden'), // Keuzelijst + vrije tekst
  kwaliteit: integer('kwaliteit'), // 1-5 (PRD Section 12.1)
  prijsindicatie: text('prijs_indicatie'), // Optioneel
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Export types
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
```

### Database Client

**MUST:**
- Use Supabase JS Client for most operations (RLS enforced)
- Use Drizzle ORM only when needed for complex queries
- Configure Supabase client in frontend (Atomic CRM)
- Use connection pooling (Supabase handles this)
- Never bypass RLS unless using service role (admin operations only)

**Example - Supabase Client:**
```typescript
// Frontend (Atomic CRM)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// RLS automatically filters data based on user role
// PRD Section 3.3: Only internal users have access (no customer visibility)
const { data: leads } = await supabase
  .from('leads')
  .select('*')
  .eq('deleted_at', null)
  .order('created_at', { ascending: false });
```

**Example - Drizzle (when needed):**
```typescript
// lib/db.ts (for complex queries or admin operations)
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@repo/database/schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
```

---

## Coding Standards

### Query Patterns

**MUST:**
- Use Drizzle's query builder, not raw SQL
- Use type-safe queries with schema references
- Always filter out soft-deleted records
- Use transactions for related operations

**Basic Query - Supabase (Preferred):**
```typescript
// Use Supabase client - RLS handles filtering automatically
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Get by ID - RLS automatically filters based on user role
// PRD Section 3.3: Only internal users (Admin, Sales/Operations)
const { data: lead } = await supabase
  .from('leads')
  .select('*')
  .eq('id', id)
  .is('deleted_at', null)
  .single();
```

**Basic Query - Drizzle (Complex queries only):**
```typescript
import { db } from '@/lib/db';
import { leads } from '@repo/database/schema';
import { eq, and, isNull } from 'drizzle-orm';

// Get by ID (use service role if bypassing RLS needed)
const lead = await db
  .select()
  .from(leads)
  .where(
    and(
      eq(leads.id, id),
      isNull(leads.deletedAt)
    )
  )
  .limit(1);
```

**List with Filters:**
```typescript
import { like, or, gte, lte } from 'drizzle-orm';

// PRD Section 11.2: Filters for branche, status, bron, datum, duplicaat-flag
const leads = await db
  .select()
  .from(leads)
  .where(
    and(
      isNull(leads.deletedAt),
      filters.status ? eq(leads.status, filters.status) : undefined,
      filters.branche ? eq(leads.branche, filters.branche) : undefined,
      filters.bron ? eq(leads.bron, filters.bron) : undefined,
      filters.isDuplicate !== undefined ? eq(leads.isDuplicate, filters.isDuplicate) : undefined,
      filters.search
        ? or(
            like(leads.contactNaam, `%${filters.search}%`),
            like(leads.contactEmail, `%${filters.search}%`),
            like(leads.contactTelefoon, `%${filters.search}%`)
          )
        : undefined,
      filters.dateFrom ? gte(leads.createdAt, filters.dateFrom) : undefined,
      filters.dateTo ? lte(leads.createdAt, filters.dateTo) : undefined,
    )
  )
  .orderBy(desc(leads.createdAt))
  .limit(pageSize)
  .offset(offset);
```

**Insert:**
```typescript
// PRD Section 7.2: Lead intake via n8n → Supabase
const [newLead] = await db
  .insert(leads)
  .values({
    branche: data.branche,
    bron: data.bron,
    contactNaam: data.contactNaam,
    contactEmail: data.contactEmail,
    contactTelefoon: data.contactTelefoon,
    rawPayload: data.rawPayload,
    status: 'nieuw', // PRD Section 6.1
  })
  .returning();

// Log status change (PRD Section 6.2)
await db.insert(leadStatusHistory).values({
  leadId: newLead.id,
  toStatus: 'nieuw',
  changedBy: user.id,
});
```

**Update:**
```typescript
// PRD Section 6.2: Statuswijziging met audit trail
const [updated] = await db
  .update(leads)
  .set({
    status: data.status,
    updatedAt: new Date(),
  })
  .where(eq(leads.id, id))
  .returning();

// Log status change
if (data.status) {
  await db.insert(leadStatusHistory).values({
    leadId: id,
    fromStatus: existing.status,
    toStatus: data.status,
    changedBy: user.id,
    reason: data.reason,
  });
}
```

**Soft Delete:**
```typescript
await db
  .update(leads)
  .set({
    deletedAt: new Date(),
  })
  .where(eq(leads.id, id));
```

### Joins

**Example:**
```typescript
import { candidateProfiles, users, candidateProfessions, professions } from '@repo/database/schema';

const candidatesWithProfessions = await db
  .select({
    candidate: candidateProfiles,
    user: users,
    profession: professions,
  })
  .from(candidateProfiles)
  .innerJoin(users, eq(candidateProfiles.userId, users.id))
  .leftJoin(candidateProfessions, eq(candidateProfessions.candidateProfileId, candidateProfiles.id))
  .leftJoin(professions, eq(professions.id, candidateProfessions.professionId))
  .where(isNull(candidateProfiles.deletedAt));
```

### Transactions

**MUST:**
- Use transactions for related operations
- Rollback on any error
- Keep transactions short

**Example:**
```typescript
await db.transaction(async (tx) => {
  // 1. Create candidate
  const [candidate] = await tx
    .insert(candidateProfiles)
    .values(candidateData)
    .returning();

  // 2. Create professions
  if (professionIds.length > 0) {
    await tx.insert(candidateProfessions).values(
      professionIds.map(professionId => ({
        candidateProfileId: candidate.id,
        professionId,
      }))
    );
  }

  // 3. Create certificates
  if (certificates.length > 0) {
    await tx.insert(certificates).values(
      certificates.map(cert => ({
        candidateProfileId: candidate.id,
        ...cert,
      }))
    );
  }

  return candidate;
});
```

---

## Row Level Security (RLS)

### Understanding RLS

**IMPORTANT:**
- RLS policies are enforced at the database level
- Drizzle queries automatically respect RLS policies
- Always use authenticated user context when querying
- RLS policies filter rows based on `auth.uid()` in Supabase
- RLS is the first line of defense - never bypass for convenience

**Key Questions to Ask:**
- Who owns this row?
- Who is allowed to see it?
- Who is allowed to mutate it?
- Under what conditions?

### RLS Policy Patterns

**MUST:**
- Write correct, minimal, and safe RLS policies
- Separate read, write, update, delete concerns cleanly
- Use explicit policies over clever hacks
- Test policies with different user roles
- Document policy intent

**PRD Section 3.3 & 4.2:** Only internal users have access. No customer visibility in MVP.

**Policy Types:**

1. **Internal-Only Policies** - Only Admin and Sales/Operations users
```sql
-- PRD Section 4.1: Admin and User (Sales/Operations) roles only
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

CREATE POLICY "leads_internal_access_insert" ON leads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_id = auth.uid()
      AND u.user_type = 'internal'
      AND u.status = 'active'
    )
  );

CREATE POLICY "leads_internal_access_update" ON leads
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_id = auth.uid()
      AND u.user_type = 'internal'
      AND u.status = 'active'
    )
  );

-- Admin can delete, Users (Sales/Operations) can only soft delete
CREATE POLICY "leads_admin_delete" ON leads
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_id = auth.uid()
      AND u.primary_role = 'admin'
      AND u.status = 'active'
    )
  );
```

2. **Role-Based Policies** - Different permissions for Admin vs User
```sql
-- Admin can manage all settings
CREATE POLICY "settings_admin_access" ON settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_id = auth.uid()
      AND u.primary_role = 'admin'
    )
  );

-- Users (Sales/Operations) can only read settings
CREATE POLICY "settings_user_read" ON settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_id = auth.uid()
      AND u.user_type = 'internal'
      AND u.status = 'active'
    )
  );
```

3. **Status History Policies** - All internal users can see status history
```sql
-- All internal users can see lead status history
CREATE POLICY "lead_status_history_internal_access" ON lead_status_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_id = auth.uid()
      AND u.user_type = 'internal'
      AND u.status = 'active'
    )
  );
```

4. **Webhook Events Policies** - Admin can manage, Users can view
```sql
-- Admin can manage webhook events
CREATE POLICY "webhook_events_admin_access" ON webhook_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_id = auth.uid()
      AND u.primary_role = 'admin'
    )
  );

-- Users can view webhook events for their leads
CREATE POLICY "webhook_events_user_read" ON webhook_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.auth_id = auth.uid()
      AND u.user_type = 'internal'
      AND u.status = 'active'
    )
  );
```

### RLS Best Practices

**MUST:**
- Enable RLS on all tables: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Create policies for each operation (SELECT, INSERT, UPDATE, DELETE) separately
- Use `auth.uid()` to get current user's auth ID
- Join with `users` table to get application user ID
- Test policies with different user contexts

**Common Mistakes to Avoid:**
```sql
-- ❌ BAD - Over-permissive policy
CREATE POLICY "bad_policy" ON candidate_profiles
  FOR ALL
  TO authenticated
  USING (true);  -- Allows everyone to see everything!

-- ❌ BAD - Recursive policy (references same table)
CREATE POLICY "bad_recursive" ON candidate_profiles
  FOR SELECT
  USING (
    id IN (
      SELECT candidate_id FROM candidate_profiles  -- Recursive!
    )
  );

-- ❌ BAD - Using user_id directly without checking auth.uid()
CREATE POLICY "bad_auth" ON candidate_profiles
  FOR SELECT
  USING (user_id = auth.uid());  -- Wrong! auth.uid() is auth.users.id, not users.id

-- ✅ GOOD - Correct pattern
CREATE POLICY "good_policy" ON candidate_profiles
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
    AND deleted_at IS NULL
  );
```

### RLS Testing

**MUST:**
- Test queries with different user roles
- Verify policies work as expected
- Test edge cases (soft-deleted records, network sharing, etc.)

**Example Test Pattern:**
```sql
-- Test as specific user
SET LOCAL role TO 'authenticated';
SET LOCAL request.jwt.claim.sub TO 'user-auth-uuid-here';

-- Run query
SELECT * FROM candidate_profiles;

-- Should only return rows allowed by RLS policies
```

### Service Role Queries

**MUST:**
- Use service role key only when necessary (admin operations, background jobs)
- Create separate client instance for service role
- Document why service role is needed
- Never use service role for regular user operations

**When to Use Service Role:**
- Background jobs and cron tasks
- Admin operations that need to bypass RLS
- Data migrations
- System maintenance tasks

**Example:**
```typescript
// lib/db-service-role.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@repo/database/schema';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Service role client bypasses RLS
// WARNING: Only use for admin operations and background jobs
const client = postgres(`${supabaseUrl}/rest/v1`, {
  headers: {
    apikey: serviceRoleKey,
    authorization: `Bearer ${serviceRoleKey}`,
  },
  prepare: false,
});

export const dbServiceRole = drizzle(client, { schema });

// Example usage (admin operation)
export async function adminGetAllCandidates() {
  // This bypasses RLS - only use in admin contexts
  return await dbServiceRole
    .select()
    .from(candidateProfiles)
    .where(isNull(candidateProfiles.deletedAt));
}
```

---

## Supabase Auth Integration

### Linking Auth Users to Application Users

**MUST:**
- Create user record in `users` table after Supabase Auth signup
- Link `users.auth_id` to `auth.users.id`
- Use database trigger or API webhook to sync
- Never store sensitive auth data in public tables

**Example Trigger:**
```sql
-- Function to create user record after auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, user_type, primary_role, status)
  VALUES (
    NEW.id,
    NEW.email,
    'external',  -- Default, can be updated
    'candidate', -- Default, can be updated
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Using JWT Claims in RLS

**MUST:**
- Use `auth.uid()` to get current authenticated user ID
- Join with `users` table to get application user context
- Never trust JWT claims without verification

**Example:**
```sql
-- Policy using auth.uid() correctly
CREATE POLICY "user_own_profile" ON candidate_profiles
  FOR SELECT
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  );
```

### Extending User Profiles

**MUST:**
- Keep auth data in `auth.users`
- Store application-specific data in `public.users`
- Use foreign key relationship: `users.auth_id` → `auth.users.id`
- Never duplicate sensitive auth data

---

## Supabase Storage

### Bucket Structure

**MUST:**
- Design clean bucket structures
- Use RLS on `storage.objects` properly
- Understand public vs private buckets
- Use signed URLs for private files

**Recommended Bucket Structure:**
```
documents-private/     # Private documents (ID cards, contracts)
  candidate/
    {candidate_id}/
      id_card/
      contract/
  employer/
    {employer_id}/
      contracts/

documents-public/      # Public documents (CVs, certificates)
  candidate/
    {candidate_id}/
      cv/
      certificates/
```

### Storage RLS Policies

**MUST:**
- Create RLS policies for storage buckets
- Control access based on ownership
- Use signed URLs for temporary access

**Example Storage Policies:**
```sql
-- Policy: Users can upload to their own candidate folder
CREATE POLICY "candidates_upload_own_documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents-private'
  AND (storage.foldername(name))[1] = 'candidate'
  AND (storage.foldername(name))[2] = (
    SELECT id::text FROM users WHERE auth_id = auth.uid()
  )
);

-- Policy: Users can read their own documents
CREATE POLICY "candidates_read_own_documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents-private'
  AND (storage.foldername(name))[1] = 'candidate'
  AND (storage.foldername(name))[2] = (
    SELECT id::text FROM users WHERE auth_id = auth.uid()
  )
);

-- Policy: Internal users can read all documents
CREATE POLICY "internal_read_all_documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.auth_id = auth.uid()
    AND u.user_type = 'internal'
  )
);
```

### Using Storage in Application

**Example:**
```typescript
// lib/storage/document-storage.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadDocument(
  file: File,
  candidateId: string,
  documentType: string
): Promise<string> {
  const filePath = `candidate/${candidateId}/${documentType}/${file.name}`;

  const { data, error } = await supabase.storage
    .from('documents-private')
    .upload(filePath, file, {
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return filePath;
}

export async function getSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from('documents-private')
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
}
```

---

## Triggers and Functions

### When to Use Triggers

**MUST:**
- Use triggers only when necessary
- Have clear justification for each trigger
- Prefer explicit data flow where possible
- Document trigger purpose

**Common Use Cases:**
- Automatic `updated_at` timestamp
- Audit logging
- Computed fields
- Data validation

### Automatic Timestamps

**Example:**
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on candidate_profiles
CREATE TRIGGER update_candidate_profiles_updated_at
  BEFORE UPDATE ON candidate_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Audit Logging Trigger

**Example:**
```sql
-- Function to log changes to audit_log table
CREATE OR REPLACE FUNCTION log_candidate_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_log (
      user_id,
      action,
      entity_type,
      entity_id,
      changes
    ) VALUES (
      NEW.created_by,
      'candidates:create',
      'candidate_profiles',
      NEW.id,
      row_to_json(NEW)
    );
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_log (
      user_id,
      action,
      entity_type,
      entity_id,
      changes
    ) VALUES (
      NEW.updated_by,
      'candidates:update',
      'candidate_profiles',
      NEW.id,
      jsonb_build_object(
        'before', row_to_json(OLD),
        'after', row_to_json(NEW)
      )
    );
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_log (
      user_id,
      action,
      entity_type,
      entity_id,
      changes
    ) VALUES (
      OLD.deleted_by,
      'candidates:delete',
      'candidate_profiles',
      OLD.id,
      row_to_json(OLD)
    );
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER candidate_profiles_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON candidate_profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_candidate_changes();
```

### Computed Fields

**Example:**
```sql
-- Generated column for document expiry check
ALTER TABLE documents
ADD COLUMN is_expired BOOLEAN GENERATED ALWAYS AS (
  expires_at IS NOT NULL AND expires_at < CURRENT_DATE
) STORED;

-- Generated column for net hours calculation
ALTER TABLE time_entries
ADD COLUMN net_hours DECIMAL(5,2) GENERATED ALWAYS AS (
  CASE WHEN clock_out IS NOT NULL 
  THEN (EXTRACT(EPOCH FROM (clock_out - clock_in)) / 3600.0) - (break_minutes / 60.0)
  ELSE NULL END
) STORED;
```

---

## Security & Data Integrity

### Database Constraints

**MUST:**
- Use CHECK constraints for data validation
- Use NOT NULL for required fields
- Use FOREIGN KEYS for referential integrity
- Use UNIQUE constraints where appropriate
- Never rely solely on frontend validation

**Example Schema with Constraints:**
```typescript
// packages/database/schema/candidate-profiles.ts
import { pgTable, uuid, varchar, timestamp, integer, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const candidateProfiles = pgTable('candidate_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  status: varchar('status', { length: 50 }).notNull(),
  maxTravelDistanceKm: integer('max_travel_distance_km'),
  // ... other fields
}, (table) => ({
  // CHECK constraint: max travel distance must be positive
  maxTravelDistanceCheck: check('max_travel_distance_km_positive', 
    sql`${table.maxTravelDistanceKm} >= 0 OR ${table.maxTravelDistanceKm} IS NULL`
  ),
}));
```

**SQL Constraints:**
```sql
-- CHECK constraint for rate validation
ALTER TABLE vacancies
ADD CONSTRAINT check_rate_range CHECK (
  hourly_rate_max >= hourly_rate_min
  OR (hourly_rate_max IS NULL AND hourly_rate_min IS NULL)
);

-- CHECK constraint for positive values
ALTER TABLE time_entries
ADD CONSTRAINT check_break_minutes_positive CHECK (
  break_minutes >= 0 OR break_minutes IS NULL
);

-- UNIQUE constraint
ALTER TABLE candidate_profiles
ADD CONSTRAINT unique_candidate_email UNIQUE (email)
WHERE deleted_at IS NULL;  -- Partial unique index for soft deletes
```

### Data Validation at Database Level

**MUST:**
- Validate data at database level, not just application level
- Use CHECK constraints for business rules
- Use ENUM types for fixed value sets
- Use NOT NULL for required fields

**Example:**
```sql
-- Enum for candidate status
CREATE TYPE candidate_status AS ENUM (
  'prospect',
  'active',
  'placed',
  'inactive',
  'archived'
);

-- Table with enum and constraints
CREATE TABLE candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  status candidate_status NOT NULL DEFAULT 'prospect',
  email VARCHAR(255) NOT NULL,
  max_travel_distance_km INTEGER CHECK (max_travel_distance_km >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  -- Partial unique index (excludes soft-deleted records)
  CONSTRAINT unique_email_active UNIQUE (email)
    WHERE deleted_at IS NULL
);
```

---

## Migrations

### Migration Workflow

**MUST:**
1. Update Drizzle schema files
2. Generate migration: `pnpm db:generate`
3. Review generated SQL
4. Apply migration: `pnpm db:migrate`
5. Update TypeScript types: `pnpm db:generate`

**Example:**
```bash
# 1. Update schema file
# packages/database/schema/candidate-profiles.ts

# 2. Generate migration
pnpm db:generate

# 3. Review generated SQL
# packages/database/migrations/0001_add_candidate_field.sql

# 4. Apply migration
pnpm db:migrate

# 5. Types are automatically updated
```

### Migration Best Practices

**MUST:**
- Never edit generated migration files directly
- Always review generated SQL before applying
- Test migrations on dev/staging before production
- Use transactions in migrations when possible
- Add rollback SQL if needed

**Example Migration:**
```sql
-- packages/database/migrations/0001_add_candidate_field.sql
ALTER TABLE "candidate_profiles" ADD COLUMN "new_field" varchar(255);
```

---

## Query Optimization

### Indexes

**MUST:**
- Add indexes for frequently queried columns
- Index foreign keys
- Index columns used in WHERE clauses
- Index columns used in ORDER BY

**Example:**
```typescript
// In schema definition
import { index } from 'drizzle-orm/pg-core';

export const candidateProfiles = pgTable('candidate_profiles', {
  // ... columns
}, (table) => ({
  userIdIdx: index('candidate_profiles_user_id_idx').on(table.userId),
  statusIdx: index('candidate_profiles_status_idx').on(table.status),
  deletedAtIdx: index('candidate_profiles_deleted_at_idx').on(table.deletedAt),
}));
```

### Query Performance

**MUST:**
- Use `limit()` and `offset()` for pagination
- Select only needed columns (not `select()` with all columns)
- Use `innerJoin` when possible (faster than `leftJoin`)
- Avoid N+1 queries (use joins or batch queries)

**Example:**
```typescript
// ❌ BAD - N+1 query
const leads = await db.select().from(leads);
for (const lead of leads) {
  const activities = await db
    .select()
    .from(leadActivities)
    .where(eq(leadActivities.leadId, lead.id));
}

// ✅ GOOD - Single query with join
// PRD Section 5.1: Lead detail + tijdlijn (status, acties, webhooks)
const leadsWithActivities = await db
  .select({
    lead: leads,
    activity: leadActivities,
  })
  .from(leads)
  .leftJoin(leadActivities, eq(leadActivities.leadId, leads.id))
  .where(isNull(leads.deletedAt))
  .orderBy(desc(leadActivities.createdAt));
```

---

## Common Patterns

### Soft Deletes

**MUST:**
- Always use soft deletes (never hard delete)
- Filter out deleted records in queries
- Include `deletedAt` column

**Example:**
```typescript
// Always filter soft-deleted records
const activeLeads = await db
  .select()
  .from(leads)
  .where(isNull(leads.deletedAt));
```

### Timestamps

**MUST:**
- Include `createdAt`, `updatedAt` in all tables
- Include `createdBy`, `updatedBy` for audit trail
- Use database defaults for timestamps
- Update `updatedAt` via triggers (not in application code)

### Enums

**MUST:**
- Define enums in schema files
- Use TypeScript enums for type safety
- Match database enum values exactly

**Example:**
```typescript
import { pgEnum } from 'drizzle-orm/pg-core';

// PRD Section 6.1: Lead statussen
export const leadStatusEnum = pgEnum('lead_status', [
  'nieuw',
  'te_beoordelen',
  'goedgekeurd',
  'in_opvolging',
  'aangeboden_aan_klant',
  'verkocht',
  'afgewezen',
  'verlopen',
]);

export const leads = pgTable('leads', {
  status: leadStatusEnum('status').notNull().default('nieuw'),
  // ...
});
```

---

## Anti-Patterns

### ❌ DON'T

1. **Don't use raw SQL unless absolutely necessary**
   ```typescript
   // ❌ BAD
   const result = await db.execute(sql`SELECT * FROM candidate_profiles WHERE id = ${id}`);
   
   // ✅ GOOD
   const result = await db
     .select()
     .from(candidateProfiles)
     .where(eq(candidateProfiles.id, id));
   ```

2. **Don't forget to filter soft-deleted records**
   ```typescript
   // ❌ BAD
   const candidates = await db.select().from(candidateProfiles);
   
   // ✅ GOOD
   const candidates = await db
     .select()
     .from(candidateProfiles)
     .where(isNull(candidateProfiles.deletedAt));
   ```

3. **Don't create multiple database clients**
   - Use single `db` instance
   - Import from `@/lib/db`

4. **Don't ignore RLS policies**
   - Test queries with different user roles
   - Understand what RLS filters automatically

5. **Don't use hard deletes**
   - Always use soft deletes
   - Preserve data for audit trail

6. **Don't select all columns when you only need some**
   ```typescript
   // ❌ BAD - selects all columns
   const candidates = await db.select().from(candidateProfiles);
   
   // ✅ GOOD - selects only needed columns
   const candidates = await db
     .select({
       id: candidateProfiles.id,
       firstName: candidateProfiles.firstName,
       lastName: candidateProfiles.lastName,
     })
     .from(candidateProfiles);
   ```

---

## Supabase Performance Considerations

### Connection Pooling

**MUST:**
- Use Supabase connection pooler for serverless environments
- Use direct connection for long-lived processes
- Configure connection limits appropriately

**Connection String Patterns:**
```typescript
// For serverless (Vercel, etc.) - use pooler
const connectionString = `postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:6543/postgres?pgbouncer=true`;

// For long-lived processes - use direct connection
const directConnectionString = `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`;
```

### Query Optimization for Supabase

**MUST:**
- Monitor query performance in Supabase dashboard
- Use EXPLAIN ANALYZE for slow queries
- Add indexes based on query patterns
- Avoid full table scans

**Example:**
```sql
-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM candidate_profiles
WHERE status = 'active'
AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20;

-- Add index if needed
CREATE INDEX idx_candidate_profiles_status_created_at
ON candidate_profiles(status, created_at DESC)
WHERE deleted_at IS NULL;
```

### Avoiding Lock Contention

**MUST:**
- Keep transactions short
- Avoid long-running queries in transactions
- Use appropriate isolation levels
- Batch operations when possible

---

## Integration Patterns

### Background Jobs & Cron Tasks

**MUST:**
- Use service role key for background jobs
- Design for idempotency
- Handle retries gracefully
- Log all operations

**Example:**
```typescript
// lib/jobs/document-expiry-check.ts
import { dbServiceRole } from '@/lib/db-service-role';
import { documents } from '@repo/database/schema';
import { lt, isNotNull } from 'drizzle-orm';

export async function checkDocumentExpiry() {
  // Use service role to bypass RLS
  const expiringDocuments = await dbServiceRole
    .select()
    .from(documents)
    .where(
      and(
        isNotNull(documents.expiresAt),
        lt(documents.expiresAt, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 7 days
      )
    );

  // Send notifications
  for (const doc of expiringDocuments) {
    await sendExpiryNotification(doc);
  }
}
```

### Idempotency

**MUST:**
- Design operations to be idempotent
- Use unique constraints to prevent duplicates
- Handle retries gracefully

**Example:**
```typescript
// Idempotent candidate creation
async function createCandidateIdempotent(
  email: string,
  data: CreateCandidateInput
) {
  return await db.transaction(async (tx) => {
    // Check if exists
    const [existing] = await tx
      .select()
      .from(candidateProfiles)
      .where(
        and(
          eq(candidateProfiles.email, email),
          isNull(candidateProfiles.deletedAt)
        )
      )
      .limit(1);

    if (existing) {
      return existing; // Return existing, don't error
    }

    // Create new
    const [newCandidate] = await tx
      .insert(candidateProfiles)
      .values(data)
      .returning();

    return newCandidate;
  });
}
```

---

## References

- [Technical Architecture](../../docs/04-data-architecture/technical-architecture.md)
- [Database Schema Documentation](../../docs/04-data-architecture/data-schemas/README.md)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

---

**Document Maintained By:** Development Team  
**Last Review Date:** 2026-01-15
