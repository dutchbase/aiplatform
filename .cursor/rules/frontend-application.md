# Frontend Application Rules

**Layer:** Frontend Application (Atomic CRM + Custom Extensions)  
**Location:** Atomic CRM codebase with custom extensions  
**Last Updated:** 2026-01-20

---

## Purpose & Scope

This document defines the coding standards, patterns, and best practices for the frontend application layer. The frontend is built on Atomic CRM (React Admin UI) with custom extensions for lead management and sales enablement.

**This layer handles:**
- User interface components (React Admin resources)
- Custom pages and views (leads, customers, dashboards)
- Lead timeline UI (PRD Section 5.1)
- Sales action button (PRD Section 9.3)
- Status workflow UI (PRD Section 6)
- Duplicate detection UI (PRD Section 8)
- Form handling and validation
- Loading and error states
- Route protection (via Atomic CRM auth)

**Key Principle:** Extend Atomic CRM, don't fork. Add custom resources and components where needed.

---

## Architecture Patterns

### Atomic CRM Integration

**Base Platform:**
- Atomic CRM provides React Admin UI framework
- Use React Admin resources for CRUD operations
- Extend with custom resources for new entities (candidates, vacancies)
- Customize views and filters as needed

**Data Fetching:**
- Use Supabase JS Client directly in components
- RLS automatically filters data based on user role
- Use React Admin data providers for standard CRUD
- Custom data providers for complex operations (matching, exports)

**Component Structure:**
- React Admin resources for standard CRUD
- Custom components for redaction display
- Custom components for matching interface
- Custom components for unlock workflow

### Extension Strategy (PRD Section 4.3)

**MUST:**
- Extend Atomic CRM via custom resources, not core changes
- Add new routes/pages for custom functionality
- Customize filters and views
- Add custom React Admin resources for:
  - Candidates (extended from contacts)
  - Vacancies (new entity)
  - Matching interface
  - Unlock workflow

**Example Server Component:**
```typescript
// app/(dashboard)/leads/page.tsx
import { db } from '@/lib/db';
import { LeadList } from '@/components/leads/lead-list';
import { leads } from '@repo/database/schema';
import { eq, isNull } from 'drizzle-orm';

export default async function LeadsPage() {
  // Fetch data directly in Server Component
  // PRD Section 11.2: List leads with filters
  const leadsList = await db
    .select()
    .from(leads)
    .where(isNull(leads.deletedAt))
    .orderBy(desc(leads.createdAt))
    .limit(50);

  return <LeadList leads={leadsList} />;
}
```

**Example Server Action:**
```typescript
// app/actions/leads.ts
'use server';

import { z } from 'zod';
import { authenticate } from '@/lib/auth';
import { checkPermission } from '@/lib/permissions';
import { LeadService } from '@/lib/services/lead-service';

const updateLeadStatusSchema = z.object({
  leadId: z.string().uuid(),
  newStatus: z.enum(['nieuw', 'te_beoordelen', 'goedgekeurd', 'in_opvolging', 'aangeboden_aan_klant', 'verkocht', 'afgewezen', 'verlopen']),
  reason: z.string().optional(),
});

export async function updateLeadStatus(formData: FormData) {
  // 1. Authenticate
  const user = await authenticate();
  if (!user) {
    throw new Error('Unauthorized');
  }

  // 2. Check permission (PRD Section 4.1)
  await checkPermission(user, 'leads:update_status');

  // 3. Validate input
  const data = updateLeadStatusSchema.parse({
    leadId: formData.get('leadId'),
    newStatus: formData.get('newStatus'),
    reason: formData.get('reason'),
  });

  // 4. Execute business logic (via service)
  // PRD Section 6.2: Statuswijziging met audit trail
  const leadService = new LeadService();
  await leadService.updateStatus(data.leadId, data.newStatus, user, data.reason);

  return { success: true };
}

// PRD Section 9.3: Start verkoopactie
export async function startSalesAction(formData: FormData) {
  const user = await authenticate();
  if (!user) {
    throw new Error('Unauthorized');
  }

  await checkPermission(user, 'sales_action:start');

  const leadId = formData.get('leadId') as string;
  const customerId = formData.get('customerId') as string;

  const salesActionService = new SalesActionService();
  await salesActionService.startSalesAction(leadId, customerId, user);

  return { success: true };
}
```

---

## File Structure

**Atomic CRM Base (do not modify):**
- Standard Atomic CRM structure
- React Admin resources
- Auth system

**Custom Extensions:**
```
/extensions/
├── resources/
│   ├── leads/                    # Lead resource (PRD Section 5.1, 7)
│   │   ├── LeadList.tsx         # Lead list with filters (PRD Section 11.2)
│   │   ├── LeadShow.tsx         # Lead detail + timeline (PRD Section 5.1)
│   │   ├── LeadEdit.tsx         # Lead edit form
│   │   └── LeadCreate.tsx       # Manual lead creation
│   ├── customers/               # Customer resource (PRD Section 9.1)
│   │   ├── CustomerList.tsx
│   │   ├── CustomerShow.tsx
│   │   └── CustomerMatching.tsx # Customer matching for leads (PRD Section 9.2)
│   └── dashboards/              # Dashboard views (PRD Section 11.1)
│       └── DashboardPage.tsx
│
├── components/
│   ├── leads/                   # Lead UI components
│   │   ├── LeadTimeline.tsx     # Timeline (status, acties, webhooks) (PRD Section 5.1)
│   │   ├── LeadStatusBadge.tsx  # Status indicator
│   │   ├── SalesActionButton.tsx # "Start verkoopactie" button (PRD Section 9.3)
│   │   ├── DuplicateIndicator.tsx # Duplicate detection UI (PRD Section 8)
│   │   └── LeadFilters.tsx      # Filters (PRD Section 11.2)
│   ├── customers/               # Customer UI components
│   │   ├── CustomerMatchList.tsx # Suitable customers for lead (PRD Section 9.2)
│   │   └── CustomerCard.tsx
│   └── dashboards/              # Dashboard components
│       ├── LeadVolumeChart.tsx  # Leads per periode (PRD Section 11.1)
│       ├── StatusOverview.tsx   # Leads per status
│       ├── SourceBreakdown.tsx   # Leads per bron
│       └── FollowupNeeded.tsx   # Leads zonder opvolging (PRD Section 6.3)
│
├── data-providers/
│   ├── supabase-data-provider.ts  # Custom Supabase data provider
│   └── lead-data-provider.ts      # Lead-specific data provider
│
└── utils/
    ├── status-workflow.ts       # Status transition utilities (PRD Section 6.2)
    └── duplicate-detection.ts   # Duplicate detection utilities (PRD Section 8)
```

---

## Coding Standards

### TypeScript

**MUST:**
- Use TypeScript strict mode
- Never use `any` type - use `unknown` if type is truly unknown
- Define types in `/types/` directory or co-located with components
- Use Drizzle-generated types from `packages/database` when available
- Export types from components when reused

**Example:**
```typescript
// types/candidate.ts
import type { candidateProfiles } from '@repo/database/schema';

export type Candidate = typeof candidateProfiles.$inferSelect;
export type CreateCandidateInput = typeof candidateProfiles.$inferInsert;
```

### Naming Conventions

**Files:**
- Components: `kebab-case.tsx` (e.g., `candidate-list.tsx`)
- Pages: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Server Actions: `kebab-case.ts` (e.g., `create-candidate.ts`)
- Types: `kebab-case.ts` (e.g., `candidate-types.ts`)

**Components:**
- PascalCase for component names (e.g., `CandidateList`)
- Descriptive, feature-prefixed names (e.g., `CandidateCard`, not `Card`)

**Functions:**
- camelCase for functions (e.g., `getCandidateById`)
- Server Actions: verb + noun (e.g., `createCandidate`, `updateVacancy`)

**Constants:**
- UPPER_SNAKE_CASE for constants (e.g., `MAX_CANDIDATES_PER_PAGE`)

### Component Structure

**Server Component Template:**
```typescript
// app/(dashboard)/candidates/page.tsx
import { Suspense } from 'react';
import { CandidateList } from '@/components/candidates/candidate-list';
import { CandidateListSkeleton } from '@/components/candidates/candidate-list-skeleton';

export default async function CandidatesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Candidates</h1>
      <Suspense fallback={<CandidateListSkeleton />}>
        <CandidateList />
      </Suspense>
    </div>
  );
}
```

**Client Component Template:**
```typescript
// components/candidates/candidate-form.tsx
'use client';

import { useState } from 'react';
import { createCandidate } from '@/app/actions/candidates';
import { Button } from '@/components/ui/button';

export function CandidateForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    try {
      await createCandidate(formData);
      // Handle success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      {error && <div className="text-red-500">{error}</div>}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Candidate'}
      </Button>
    </form>
  );
}
```

---

## Security Requirements

### Route Protection

**MUST:**
- Protect all dashboard routes with authentication middleware
- Use route groups `(dashboard)` for protected routes
- Redirect unauthenticated users to login
- Check permissions before rendering sensitive UI

**Example:**
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
```

### Lead Display

**MUST:**
- Display lead with full timeline (PRD Section 5.1)
- Show status history and activities
- Display duplicate indicators (PRD Section 8)
- Show sales action button when appropriate (PRD Section 9.3)

**Example:**
```typescript
// components/leads/lead-card.tsx
import { LeadTimeline } from './lead-timeline';
import { DuplicateIndicator } from './duplicate-indicator';
import { SalesActionButton } from './sales-action-button';

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div>
      <h3>{lead.contactNaam || 'Naamloos'}</h3>
      <p>Bron: {lead.bron}</p>
      <p>Branche: {lead.branche}</p>
      <p>Status: {lead.status}</p>
      
      {/* PRD Section 8: Duplicate indicator */}
      {lead.isDuplicate && (
        <DuplicateIndicator leadId={lead.id} duplicateOf={lead.duplicateOf} />
      )}
      
      {/* PRD Section 9.3: Sales action button */}
      {lead.status === 'goedgekeurd' || lead.status === 'in_opvolging' && (
        <SalesActionButton leadId={lead.id} />
      )}
      
      {/* PRD Section 5.1: Timeline */}
      <LeadTimeline leadId={lead.id} />
    </div>
  );
}
```

---

## Error Handling

### Error Boundaries

**MUST:**
- Use Next.js `error.tsx` files for route-level error boundaries
- Provide user-friendly error messages
- Log errors to Sentry for monitoring
- Never expose sensitive error details to users

**Example:**
```typescript
// app/(dashboard)/candidates/error.tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-4">
        We're sorry, but something unexpected happened. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### Loading States

**MUST:**
- Provide loading UI for all async operations
- Use `loading.tsx` files for route-level loading states
- Show skeleton loaders for better UX
- Handle loading states in forms and buttons

**Example:**
```typescript
// app/(dashboard)/candidates/loading.tsx
import { CandidateListSkeleton } from '@/components/candidates/candidate-list-skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Candidates</h1>
      <CandidateListSkeleton />
    </div>
  );
}
```

---

## Common Patterns

### Form Handling with Server Actions

```typescript
// components/candidates/candidate-form.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createCandidate } from '@/app/actions/candidates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Candidate'}
    </Button>
  );
}

export function CandidateForm() {
  const [state, formAction] = useFormState(createCandidate, null);

  return (
    <form action={formAction}>
      <Input name="firstName" required />
      <Input name="lastName" required />
      <Input name="email" type="email" required />
      {state?.error && <div className="text-red-500">{state.error}</div>}
      <SubmitButton />
    </form>
  );
}
```

### Data Table with Pagination

```typescript
// components/candidates/candidate-list.tsx
import { db } from '@/lib/db';
import { DataTable } from '@/components/shared/data-table';
import { columns } from './columns';

export async function CandidateList({
  page = 1,
  pageSize = 20,
}: {
  page?: number;
  pageSize?: number;
}) {
  const offset = (page - 1) * pageSize;
  
  const [candidates, total] = await Promise.all([
    db.query.candidateProfiles.findMany({
      limit: pageSize,
      offset,
      where: (candidates, { eq }) => eq(candidates.deletedAt, null),
    }),
    db.query.candidateProfiles.findMany({
      where: (candidates, { eq }) => eq(candidates.deletedAt, null),
    }).then(results => results.length),
  ]);

  return (
    <DataTable
      data={candidates}
      columns={columns}
      total={total}
      page={page}
      pageSize={pageSize}
    />
  );
}
```

---

## Anti-Patterns

### ❌ DON'T

1. **Don't fetch data in Client Components when Server Components can do it**
   ```typescript
   // ❌ BAD
   'use client';
   export function CandidateList() {
     const [candidates, setCandidates] = useState([]);
     useEffect(() => {
       fetch('/api/candidates').then(...);
     }, []);
   }
   
   // ✅ GOOD
   export async function CandidateList() {
     const candidates = await db.query.candidateProfiles.findMany();
     return <div>{/* render */}</div>;
   }
   ```

2. **Don't use `'use client'` at the top level unnecessarily**
   - Only add when interactivity is required
   - Keep Client Components small and focused

3. **Don't expose sensitive data in component props**
   - Always redact before passing to components
   - Check user permissions before rendering

4. **Don't ignore loading and error states**
   - Always provide loading UI
   - Handle errors gracefully

5. **Don't mix Server and Client Component patterns**
   - Server Components cannot use hooks
   - Client Components cannot directly access database

---

## References

- [Technical Architecture](../../docs/04-data-architecture/technical-architecture.md)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Document Maintained By:** Development Team  
**Last Review Date:** 2026-01-15
