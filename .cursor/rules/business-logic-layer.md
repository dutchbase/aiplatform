# Business Logic Layer Rules

**Layer:** Business Logic Layer (Service Classes)  
**Location:** `/apps/dashboard/lib/services/`  
**Last Updated:** 2026-01-20

---

## Purpose & Scope

This document defines the coding standards, patterns, and best practices for the business logic layer. Business logic lives in service classes that encapsulate domain logic, validation, and database operations.

**This layer handles:**
- Domain logic and business rules
- Data validation with Zod schemas
- Database operations (via Drizzle ORM)
- Complex calculations and transformations
- Cross-entity operations
- Audit logging coordination
- Lead status workflow management (PRD Section 6)
- Duplicate detection (PRD Section 8)
- Sales action triggers (PRD Section 9.3)

**Key Principle:** Business logic MUST live in service classes, NOT in API routes or components.

---

## Architecture Patterns

### Service Class Structure

**MUST:**
- Use class-based services for domain logic
- One service per domain entity (e.g., `CandidateService`, `VacancyService`)
- Services are stateless (no instance state)
- Methods are async and return typed results

**Example:**
```typescript
// lib/services/lead-service.ts
import { db } from '@/lib/db';
import { leads, leadStatusHistory, leadActivities } from '@repo/database/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';
import type { User } from '@/types/user';
import { auditLog } from './audit-log-service';

const createLeadSchema = z.object({
  branche: z.string().optional(),
  bron: z.string().min(1), // PRD Section 7.2: bron is required
  contactNaam: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactTelefoon: z.string().optional(),
  rawPayload: z.record(z.unknown()).optional(),
});

export class LeadService {
  /**
   * Create a new lead (PRD Section 7.1: Lead intake via n8n → Supabase)
   * Usually called via webhook from n8n, not directly by users
   */
  async create(
    data: z.infer<typeof createLeadSchema>,
    user?: User // Optional - may be system/webhook
  ): Promise<typeof leads.$inferSelect> {
    // 1. Validate input
    const validatedData = createLeadSchema.parse(data);

    // 2. Check business rules
    await this.validateBusinessRules(validatedData);

    // 3. Determine initial status (PRD Section 7.3)
    // If kritieke velden ontbreken → status "Te beoordelen"
    const hasContact = validatedData.contactEmail || validatedData.contactTelefoon;
    const initialStatus = hasContact ? 'nieuw' : 'te_beoordelen';

    // 4. Execute database operations
    const [lead] = await db
      .insert(leads)
      .values({
        branche: validatedData.branche,
        bron: validatedData.bron,
        contactNaam: validatedData.contactNaam,
        contactEmail: validatedData.contactEmail,
        contactTelefoon: validatedData.contactTelefoon,
        rawPayload: validatedData.rawPayload,
        status: initialStatus,
      })
      .returning();

    // 5. Log status change (PRD Section 6.2)
    if (user) {
      await db.insert(leadStatusHistory).values({
        leadId: lead.id,
        toStatus: initialStatus,
        changedBy: user.id,
      });
    }

    // 6. Check for duplicates (PRD Section 8.2)
    await this.checkDuplicates(lead);

    // 7. Log activity (PRD Section 5.1)
    await db.insert(leadActivities).values({
      leadId: lead.id,
      activityType: 'lead_created',
      summary: `Lead aangemaakt via ${validatedData.bron}`,
      metadata: { source: validatedData.bron },
      createdBy: user?.id,
    });

    return lead;
  }

  /**
   * Get lead by ID with full timeline (PRD Section 5.1)
   */
  async getById(id: string): Promise<typeof leads.$inferSelect | null> {
    const [lead] = await db
      .select()
      .from(leads)
      .where(and(eq(leads.id, id), isNull(leads.deletedAt)))
      .limit(1);

    return lead || null;
  }

  /**
   * Get lead timeline (status, acties, webhooks) - PRD Section 5.1
   */
  async getTimeline(leadId: string) {
    const [statusHistory, activities] = await Promise.all([
      db.select().from(leadStatusHistory).where(eq(leadStatusHistory.leadId, leadId)),
      db.select().from(leadActivities).where(eq(leadActivities.leadId, leadId)),
    ]);

    return {
      statusHistory: statusHistory.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
      activities: activities.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    };
  }

  /**
   * List leads with pagination (PRD Section 11.2: Filters and search)
   */
  async list(options: {
    page?: number;
    pageSize?: number;
    filters?: {
      status?: string;
      branche?: string;
      bron?: string;
      isDuplicate?: boolean;
      dateFrom?: Date;
      dateTo?: Date;
      search?: string; // PRD Section 11.2: naam/bedrijf, e-mail, telefoon, domein
    };
  }): Promise<{
    leads: Array<typeof leads.$inferSelect>;
    total: number;
  }> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 20;
    const offset = (page - 1) * pageSize;

    // Build query conditions
    const conditions = [isNull(leads.deletedAt)];

    if (options.filters?.status) {
      conditions.push(eq(leads.status, options.filters.status));
    }

    if (options.filters?.branche) {
      conditions.push(eq(leads.branche, options.filters.branche));
    }

    if (options.filters?.bron) {
      conditions.push(eq(leads.bron, options.filters.bron));
    }

    if (options.filters?.isDuplicate !== undefined) {
      conditions.push(eq(leads.isDuplicate, options.filters.isDuplicate));
    }

    if (options.filters?.dateFrom) {
      conditions.push(gte(leads.createdAt, options.filters.dateFrom));
    }

    if (options.filters?.dateTo) {
      conditions.push(lte(leads.createdAt, options.filters.dateTo));
    }

    if (options.filters?.search) {
      // PRD Section 11.2: Search on naam/bedrijf, e-mail, telefoon
      conditions.push(
        or(
          like(leads.contactNaam, `%${options.filters.search}%`),
          like(leads.contactEmail, `%${options.filters.search}%`),
          like(leads.contactTelefoon, `%${options.filters.search}%`)
        )
      );
    }

    // Execute query
    const leadsList = await db
      .select()
      .from(leads)
      .where(and(...conditions))
      .orderBy(desc(leads.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Get total count
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(and(...conditions));

    return {
      leads: leadsList,
      total: totalResult.count,
    };
  }

  /**
   * Update lead status (PRD Section 6.2: Statuswijziging met audit trail)
   */
  async updateStatus(
    id: string,
    newStatus: string,
    user: User,
    reason?: string
  ): Promise<typeof leads.$inferSelect> {
    // 1. Get existing lead
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Lead not found');
    }

    // 2. Validate status transition (PRD Section 6.2)
    this.validateStatusTransition(existing.status, newStatus);

    // 3. Execute update
    const [updated] = await db
      .update(leads)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, id))
      .returning();

    // 4. Log status change (PRD Section 6.2)
    await db.insert(leadStatusHistory).values({
      leadId: id,
      fromStatus: existing.status,
      toStatus: newStatus,
      changedBy: user.id,
      reason,
    });

    // 5. Log activity
    await db.insert(leadActivities).values({
      leadId: id,
      activityType: 'status_change',
      summary: `Status gewijzigd van ${existing.status} naar ${newStatus}`,
      metadata: { fromStatus: existing.status, toStatus: newStatus, reason },
      createdBy: user.id,
    });

    return updated;
  }

  /**
   * Validate status transition (PRD Section 6.2)
   */
  private validateStatusTransition(fromStatus: string, toStatus: string): void {
    // Define allowed transitions (can be extended)
    const allowedTransitions: Record<string, string[]> = {
      nieuw: ['te_beoordelen', 'goedgekeurd', 'afgewezen'],
      te_beoordelen: ['goedgekeurd', 'afgewezen'],
      goedgekeurd: ['in_opvolging', 'afgewezen'],
      in_opvolging: ['aangeboden_aan_klant', 'afgewezen', 'verlopen'],
      aangeboden_aan_klant: ['verkocht', 'afgewezen', 'in_opvolging'],
      verkocht: [], // Final state
      afgewezen: [], // Final state
      verlopen: ['in_opvolging', 'afgewezen'], // Can be reactivated
    };

    if (!allowedTransitions[fromStatus]?.includes(toStatus)) {
      throw new Error(`Invalid status transition from ${fromStatus} to ${toStatus}`);
    }
  }

  /**
   * Check for duplicates (PRD Section 8.2: Soft deduplicatie)
   * Marks lead as possible duplicate, doesn't block workflow
   */
  private async checkDuplicates(lead: typeof leads.$inferSelect): Promise<void> {
    // PRD Section 8.2: Compare on e-mail, telefoonnummer, domeinnaam
    const conditions = [];

    if (lead.contactEmail) {
      conditions.push(eq(leads.contactEmail, lead.contactEmail));
    }

    if (lead.contactTelefoon) {
      conditions.push(eq(leads.contactTelefoon, lead.contactTelefoon));
    }

    // Extract domain from email if available
    if (lead.contactEmail) {
      const domain = lead.contactEmail.split('@')[1];
      if (domain) {
        conditions.push(like(leads.contactEmail, `%@${domain}`));
      }
    }

    if (conditions.length === 0) {
      return; // No contact info to check
    }

    const possibleDuplicates = await db
      .select()
      .from(leads)
      .where(
        and(
          ne(leads.id, lead.id), // Exclude self
          isNull(leads.deletedAt),
          or(...conditions)
        )
      )
      .limit(10);

    if (possibleDuplicates.length > 0) {
      // Mark as possible duplicate (soft, doesn't block)
      await db
        .update(leads)
        .set({ isDuplicate: true, duplicateOf: possibleDuplicates[0].id })
        .where(eq(leads.id, lead.id));

      // Log activity
      await db.insert(leadActivities).values({
        leadId: lead.id,
        activityType: 'duplicate_detected',
        summary: `Mogelijk duplicaat gedetecteerd (${possibleDuplicates.length} matches)`,
        metadata: { duplicateIds: possibleDuplicates.map(d => d.id) },
      });
    }
  }

  /**
   * Validate business rules
   */
  private async validateBusinessRules(
    data: Partial<z.infer<typeof createLeadSchema>>
  ): Promise<void> {
    // PRD Section 7.2: bron is required
    if (!data.bron) {
      throw new Error('Bron is verplicht');
    }

    // PRD Section 7.3: If kritieke velden ontbreken, status becomes "Te beoordelen"
    // This is handled in create() method
  }
}
```

---

## File Structure

```
/lib/services/
├── lead-service.ts               # Lead domain logic (PRD Section 5.1, 6, 7)
├── customer-service.ts           # Customer (klant) domain logic (PRD Section 9.1)
├── sales-action-service.ts       # Sales action triggers (PRD Section 9.3)
├── duplicate-service.ts          # Duplicate detection (PRD Section 8)
├── feedback-service.ts           # Feedback loops (PRD Section 12)
├── webhook-service.ts            # Webhook handling (PRD Section 13)
├── automation-service.ts          # Automatiseringsregels (PRD Section 10.3)
├── dashboard-service.ts          # Dashboard data (PRD Section 11.1)
└── index.ts                      # Service exports
```

**Note:** Services extend Atomic CRM functionality. Use Atomic CRM services where possible, extend only when needed.

---

## Coding Standards

### Service Class Naming

**MUST:**
- Use PascalCase with "Service" suffix (e.g., `CandidateService`)
- One service per domain entity
- Group related operations in the same service

### Method Naming

**MUST:**
- Use descriptive, action-oriented names
- Follow CRUD conventions: `create`, `getById`, `list`, `update`, `delete`
- Use domain-specific names for business operations (e.g., `matchToVacancy`, `unlockProfile`)

**Examples:**
```typescript
// CRUD operations
async create(data, user)
async getById(id)
async list(options)
async update(id, data, user)
async delete(id, user)

// Business operations
async matchToVacancy(candidateId, vacancyId)
async unlockProfile(candidateId, requesterId)
async approveTimeEntry(entryId, approverId)
```

### Validation

**MUST:**
- Always validate input with Zod schemas
- Define schemas at the top of the service file
- Use `.partial()` for update operations
- Throw descriptive errors for validation failures

**Example:**
```typescript
import { z } from 'zod';

// Define schemas
const createVacancySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  employerProfileId: z.string().uuid(),
  professionId: z.string().uuid(),
  hourlyRateMin: z.number().positive(),
  hourlyRateMax: z.number().positive(),
  startDate: z.date(),
});

// In service method
async create(data: unknown, user: User) {
  // Validate
  const validatedData = createVacancySchema.parse(data);
  
  // Check business rule: max >= min
  if (validatedData.hourlyRateMax < validatedData.hourlyRateMin) {
    throw new Error('Maximum rate must be greater than or equal to minimum rate');
  }
  
  // ... rest of implementation
}
```

### Error Handling

**MUST:**
- Throw descriptive errors for business rule violations
- Use custom error classes for different error types
- Never expose database errors directly
- Log errors before throwing

**Example:**
```typescript
// lib/errors/business-errors.ts
export class BusinessRuleError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'BusinessRuleError';
  }
}

// In service
async create(data: CreateCandidateInput, user: User) {
  // Check business rule
  const existing = await this.findByEmail(data.email);
  if (existing) {
    throw new BusinessRuleError(
      'A candidate with this email already exists',
      'DUPLICATE_EMAIL'
    );
  }
  
  // ... rest of implementation
}
```

---

## Security Requirements

### Permission Checking

**MUST:**
- Services should NOT check permissions (that's the API layer's responsibility)
- Services should trust that the caller has already verified permissions
- Services can validate business rules and data ownership

**Example:**
```typescript
// ❌ BAD - Don't check permissions in service
async update(id: string, data: UpdateInput, user: User) {
  const hasPermission = await checkPermission(user, 'candidates:update');
  if (!hasPermission) {
    throw new Error('Forbidden');
  }
  // ...
}

// ✅ GOOD - Trust API layer has checked permissions
async update(id: string, data: UpdateInput, user: User) {
  // Just validate business rules and execute
  // ...
}
```

### Data Ownership

**MUST:**
- Validate data ownership when applicable
- Check that user can modify the resource
- Throw errors for unauthorized modifications

**Example:**
```typescript
async update(id: string, data: UpdateInput, user: User) {
  const candidate = await this.getById(id);
  if (!candidate) {
    throw new Error('Candidate not found');
  }

  // Check ownership (if external user)
  if (user.userType === 'external' && candidate.userId !== user.id) {
    throw new Error('Cannot modify another user\'s candidate profile');
  }

  // ... rest of implementation
}
```

---

## Common Patterns

### Transactions

**MUST:**
- Use transactions for related operations
- Rollback on any error
- Use Drizzle's transaction API

**Example:**
```typescript
import { db } from '@/lib/db';

async createWithProfessions(
  candidateData: CreateCandidateInput,
  professionIds: string[],
  user: User
) {
  return await db.transaction(async (tx) => {
    // 1. Create candidate
    const [candidate] = await tx
      .insert(candidateProfiles)
      .values(candidateData)
      .returning();

    // 2. Create profession associations
    if (professionIds.length > 0) {
      await tx.insert(candidateProfessions).values(
        professionIds.map(professionId => ({
          candidateProfileId: candidate.id,
          professionId,
        }))
      );
    }

    // 3. Log audit
    await auditLog.log('candidates:create', user.id, {
      candidateId: candidate.id,
    });

    return candidate;
  });
}
```

### Complex Queries

**Example:**
```typescript
async getCandidatesWithMatches(vacancyId: string) {
  return await db
    .select({
      candidate: candidateProfiles,
      match: matches,
    })
    .from(candidateProfiles)
    .innerJoin(matches, eq(matches.candidateProfileId, candidateProfiles.id))
    .where(
      and(
        eq(matches.vacancyId, vacancyId),
        isNull(candidateProfiles.deletedAt)
      )
    )
    .orderBy(desc(matches.matchScore));
}
```

### Sales Action Service (PRD Section 9.3)

**Critical MVP Feature:**
```typescript
// lib/services/sales-action-service.ts
// Implements PRD Section 9.3: Verkoopactie (kritisch, MVP)

export class SalesActionService {
  /**
   * Start verkoopactie (PRD Section 9.3)
   * Triggers webhook to n8n with lead_id + customer_id
   */
  async startSalesAction(
    leadId: string,
    customerId: string,
    user: User
  ): Promise<void> {
    // 1. Validate lead exists
    const lead = await leadService.getById(leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }

    // 2. Validate customer exists
    const customer = await customerService.getById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // 3. Update lead status to "aangeboden_aan_klant"
    await leadService.updateStatus(leadId, 'aangeboden_aan_klant', user);
    
    // Update customer reference
    await db.update(leads)
      .set({ customerId })
      .where(eq(leads.id, leadId));

    // 4. Send webhook to n8n (PRD Section 9.3)
    await webhookService.sendOutbound({
      eventType: 'sale_action_started',
      payload: {
        lead_id: leadId,
        customer_id: customerId,
        triggered_by_user_id: user.id,
        triggered_at: new Date().toISOString(),
      },
      leadId,
      triggeredBy: user.id,
    });

    // 5. Log activity
    await db.insert(leadActivities).values({
      leadId,
      activityType: 'sale_action',
      summary: `Verkoopactie gestart voor klant ${customer.naam}`,
      metadata: { customerId, customerName: customer.naam },
      createdBy: user.id,
    });
  }
}
```

### Customer Matching Service (PRD Section 9.2)

**Customer Matching for Leads:**
```typescript
// lib/services/customer-service.ts
// Implements PRD Section 9.2: Klantmatching (MVP)

export class CustomerService {
  /**
   * Get suitable customers for lead (PRD Section 9.2)
   * Sorted by branchematch, historische koopkans, historische prijsbereidheid
   */
  async getSuitableCustomers(leadId: string): Promise<CustomerMatch[]> {
    const lead = await leadService.getById(leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }

    // Get all active customers
    const customers = await db
      .select()
      .from(customers)
      .where(and(isNull(customers.deletedAt)));

    const matches: CustomerMatch[] = [];

    for (const customer of customers) {
      let score = 0;
      const matchedCriteria: string[] = [];

      // Branchematch (PRD Section 9.2)
      if (lead.branche && customer.branche && lead.branche === customer.branche) {
        score += 3; // High weight
        matchedCriteria.push('branche');
      }

      // TODO: Historische koopkans (fase 2+)
      // TODO: Historische prijsbereidheid (fase 2+)

      matches.push({
        customer,
        score,
        matchedCriteria,
      });
    }

    // Sort by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    return matches;
  }
}
```

---

## Anti-Patterns

### ❌ DON'T

1. **Don't put business logic in API routes**
   ```typescript
   // ❌ BAD
   export async function POST(request: NextRequest) {
     const data = await request.json();
     // Business logic here
     const candidate = await db.insert(candidateProfiles).values(data);
     return NextResponse.json({ data: candidate });
   }
   
   // ✅ GOOD
   export async function POST(request: NextRequest) {
     const data = await request.json();
     const candidateService = new CandidateService();
     const candidate = await candidateService.create(data, user);
     return NextResponse.json({ data: candidate });
   }
   ```

2. **Don't access database directly from API routes**
   - Always go through service layer

3. **Don't skip validation**
   - Always validate with Zod schemas
   - Validate business rules

4. **Don't forget audit logging**
   - Log all create, update, delete operations
   - Include context in audit logs

5. **Don't use hard deletes**
   - Always use soft deletes
   - Preserve data for audit trail

---

## References

- [Technical Architecture](../../docs/04-data-architecture/technical-architecture.md)
- [Data Layer Rules](./data-layer.md)
- [API Layer Rules](./api-layer.md)
- [Zod Documentation](https://zod.dev/)

---

**Document Maintained By:** Development Team  
**Last Review Date:** 2026-01-15
