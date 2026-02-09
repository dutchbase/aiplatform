# API Layer Rules

**Layer:** API Layer (Supabase REST API + Custom Functions)  
**Location:** Supabase API endpoints and custom Edge Functions  
**Last Updated:** 2026-01-20

---

## Purpose & Scope

This document defines the coding standards, patterns, and best practices for the API layer. The API layer consists of Supabase REST API endpoints (auto-generated from database schema) and custom Edge Functions for complex operations.

**This layer handles:**
- HTTP request/response handling via Supabase REST API
- Authentication and authorization (Supabase Auth)
- Input validation
- Business logic orchestration (via services)
- Error handling and responses
- Audit logging (via lead_activities table)
- Webhook handling (inbound from n8n, outbound to n8n)

**Key Entities (from PRD):**
- `leads` - Leads from multiple sources (PRD Section 7)
- `customers` - Klanten (afnemers die leads kunnen kopen) (PRD Section 9.1)
- `lead_status_history` - Status workflow audit trail (PRD Section 6.2)
- `lead_activities` - Lead timeline (status, acties, webhooks) (PRD Section 5.1)
- `webhook_events` - Webhook in/out events (PRD Section 13)
- `feedback` - Feedback loops (PRD Section 12)

**Note:** Most CRUD operations use Supabase REST API directly. Custom Edge Functions are used for complex operations like sales actions and webhook processing.

---

## Architecture Patterns

### Standard Request Flow

**MUST follow this order for all API routes:**

1. **Authenticate** - Verify user identity
2. **Check Permission** - Verify user has required permission
3. **Validate Input** - Validate request data with Zod
4. **Execute** - Call service layer for business logic
5. **Apply Redaction** - Redact sensitive data if external user
6. **Log Audit Trail** - Log the action
7. **Return Response** - Return standardized response

**Example - Supabase REST API (with RLS):**
```typescript
// Frontend uses Supabase JS Client directly
// RLS policies handle authentication and authorization automatically
// PRD Section 3.3: Only internal users (Admin, Sales/Operations) have access
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET leads - RLS automatically filters based on user role
const { data: leads, error } = await supabase
  .from('leads')
  .select('*')
  .eq('deleted_at', null)
  .eq('status', 'nieuw') // Filter by status (PRD Section 11.2)
  .order('created_at', { ascending: false })
  .range(page * pageSize, (page + 1) * pageSize - 1);
```

**Example - Custom Edge Function:**
```typescript
// supabase/functions/start-sales-action/index.ts
// PRD Section 9.3: Start verkoopactie (kritisch, MVP)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    // 1. Authenticate
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Check permission (PRD Section 4.1: Admin or User (Sales/Operations))
    const { data: userRecord } = await supabase
      .from('users')
      .select('primary_role, user_type')
      .eq('auth_id', user.id)
      .single();

    if (userRecord?.user_type !== 'internal') {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403 }
      );
    }

    // 3. Validate input
    const { lead_id, customer_id } = await req.json();
    if (!lead_id || !customer_id) {
      return new Response(
        JSON.stringify({ error: 'lead_id and customer_id are required' }),
        { status: 400 }
      );
    }

    // 4. Execute sales action (via service)
    // Update lead status
    await supabase
      .from('leads')
      .update({ 
        status: 'aangeboden_aan_klant',
        customer_id: customer_id 
      })
      .eq('id', lead_id);

    // 5. Send webhook to n8n (PRD Section 9.3)
    const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL')!;
    const webhookResponse = await fetch(`${webhookUrl}/sales-action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lead_id,
        customer_id,
        triggered_by_user_id: userRecord.id,
        triggered_at: new Date().toISOString(),
      }),
    });

    // 6. Log webhook event
    await supabase.from('webhook_events').insert({
      event_type: 'sale_action_started',
      direction: 'outbound',
      payload: { lead_id, customer_id },
      status: webhookResponse.ok ? 'success' : 'failed',
      lead_id,
      triggered_by: userRecord.id,
    });

    // 7. Log activity
    await supabase.from('lead_activities').insert({
      lead_id,
      activity_type: 'sale_action',
      summary: 'Verkoopactie gestart',
      created_by: userRecord.id,
    });

    // 8. Return response
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
});
```

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const user = await authenticate(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Check permission (PRD Section 4.1: Admin or User (Sales/Operations))
    const hasPermission = await checkPermission(user, 'leads:create');
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // 3. Validate input
    const body = await request.json();
    const validatedData = createLeadSchema.parse(body);

    // 4. Execute (via service)
    // PRD Section 7.1: Lead intake usually via n8n, but manual entry also possible
    const leadService = new LeadService();
    const lead = await leadService.create(validatedData, user);

    // 5. Log audit trail (PRD Section 14.2)
    await auditLog.log('leads:create', user.id, {
      leadId: lead.id,
      bron: lead.bron,
    });

    // 6. Return response
    return NextResponse.json(
      { data: lead },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## File Structure

**Supabase REST API (Auto-generated):**
- `GET /rest/v1/leads` - List leads (RLS enforced, PRD Section 11.2)
- `POST /rest/v1/leads` - Create lead (usually via n8n webhook, PRD Section 7.1)
- `GET /rest/v1/leads?id=eq.{id}` - Get lead by ID with timeline (PRD Section 5.1)
- `PATCH /rest/v1/leads?id=eq.{id}` - Update lead (status changes, PRD Section 6.2)
- `GET /rest/v1/customers` - List customers (PRD Section 9.1)
- `GET /rest/v1/lead_activities?lead_id=eq.{id}` - Get lead timeline (PRD Section 5.1)

**Custom Edge Functions (Supabase Functions):**
```
/supabase/functions/
├── start-sales-action/     # Sales action endpoint (PRD Section 9.3)
│   └── index.ts            # POST: Start verkoopactie (lead_id + customer_id)
├── webhooks/               # Incoming webhooks from n8n
│   ├── lead-intake/        # Lead intake from n8n (PRD Section 7.1)
│   │   └── index.ts        # POST: Create lead from n8n
│   └── n8n-callback/       # n8n workflow callbacks
└── duplicate-check/        # Duplicate detection (PRD Section 8)
    └── index.ts            # POST: Check for duplicates
```

**Atomic CRM Extensions:**
- Custom React Admin resources for leads, customers
- Custom filters and views (PRD Section 11.2)
- Lead timeline UI (PRD Section 5.1)
- Sales action button (PRD Section 9.3)

---

## Coding Standards

### Route Handler Naming

**MUST:**
- Export named functions: `GET`, `POST`, `PATCH`, `DELETE`, `PUT`
- Use TypeScript types for request/response
- Follow RESTful conventions

**Example:**
```typescript
// app/api/candidates/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Implementation
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Implementation
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Implementation
}
```

### Request Validation

**MUST:**
- Always validate input with Zod schemas
- Validate both body and query parameters
- Return 400 Bad Request for validation errors
- Include validation error details in response

**Example:**
```typescript
import { z } from 'zod';

const updateCandidateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validatedData = updateCandidateSchema.parse(body);
    // ... rest of implementation
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### Response Format

**MUST:**
- Use consistent response format
- Include `data` for successful responses
- Include `error` and `details` for errors
- Include pagination metadata for list endpoints

**Success Response:**
```typescript
// Single resource
{
  data: {
    id: "...",
    // ... resource fields
  }
}

// List with pagination
{
  data: [...],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 100,
    totalPages: 5,
  }
}
```

**Error Response:**
```typescript
{
  error: "Error message",
  details?: {
    // Additional error details
  }
}
```

---

## Security Requirements

### Authentication

**MUST:**
- Authenticate every request (except public endpoints)
- Use `authenticate()` helper from `lib/auth`
- Return 401 Unauthorized if authentication fails
- Never expose sensitive error details

**Example:**
```typescript
import { authenticate } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  // ... rest of implementation
}
```

### Authorization

**MUST:**
- Check permissions before executing business logic
- Use `checkPermission()` helper from `lib/permissions`
- Return 403 Forbidden if permission check fails
- Log permission denials for security monitoring

**Example:**
```typescript
import { checkPermission } from '@/lib/permissions';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hasPermission = await checkPermission(user, 'candidates:delete');
  if (!hasPermission) {
    await auditLog.log('candidates:delete:denied', user.id, { candidateId: params.id });
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  // ... rest of implementation
}
```

### Lead Timeline Access

**MUST:**
- Return lead with full timeline (status, acties, webhooks) - PRD Section 5.1
- Include status history and activities
- Never expose customer data to unauthorized users
- Log when leads are accessed

**Example:**
```typescript
import { LeadService } from '@/lib/services/lead-service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await authenticate(request);
  // ... permission checks

  const leadService = new LeadService();
  const lead = await leadService.getById(params.id);
  const timeline = await leadService.getTimeline(params.id);
  
  // PRD Section 5.1: Lead detail + tijdlijn
  return NextResponse.json({ 
    data: {
      lead,
      timeline: {
        statusHistory: timeline.statusHistory,
        activities: timeline.activities,
      },
    }
  });
}
```

---

## Error Handling

### Standard Error Handler

**MUST:**
- Use consistent error handling across all routes
- Log errors to Sentry
- Return user-friendly error messages
- Never expose stack traces or sensitive details

**Example:**
```typescript
// lib/api/error-handler.ts
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleApiError(error: unknown): NextResponse {
  // Log to Sentry
  Sentry.captureException(error);

  // Handle known error types
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    // Don't expose internal error messages
    return NextResponse.json(
      {
        error: 'An error occurred',
      },
      { status: 500 }
    );
  }

  // Unknown error
  return NextResponse.json(
    {
      error: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}
```

### HTTP Status Codes

**MUST use appropriate status codes:**

- `200 OK` - Successful GET, PATCH, DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate)
- `500 Internal Server Error` - Server errors

---

## Audit Logging

### What to Log

**MUST log (PRD Section 14.2):**
- Statuswijzigingen (status changes)
- Verkoopacties ("Start verkoopactie")
- Webhook events (in/out) met resultaat (success/fail)
- Lead creation and updates
- Permission denials

**Example:**
```typescript
import { auditLog } from '@/lib/services/audit-log-service';
import { LeadService } from '@/lib/services/lead-service';

export async function POST(request: NextRequest) {
  const user = await authenticate(request);
  // ... validation and execution

  const leadService = new LeadService();
  const lead = await leadService.create(data, user);

  // Log audit trail (PRD Section 14.2)
  await auditLog.log('leads:create', user.id, {
    leadId: lead.id,
    bron: lead.bron,
    status: lead.status,
    ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  });

  return NextResponse.json({ data: lead }, { status: 201 });
}
```

---

## Common Patterns

### Pagination

**MUST:**
- Support pagination for all list endpoints
- Use `page` and `pageSize` query parameters
- Return pagination metadata
- Default to reasonable page sizes (20-50 items)

**Example:**
```typescript
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));

  const { items, total } = await service.list({
    page,
    pageSize,
  });

  return NextResponse.json({
    data: items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}
```

### Filtering and Search

**Example:**
```typescript
const searchParams = request.nextUrl.searchParams;
const filters = {
  status: searchParams.get('status'),
  professionId: searchParams.get('professionId'),
  search: searchParams.get('search'),
};

const candidates = await candidateService.list({
  filters,
  page,
  pageSize,
});
```

### File Upload

**Example:**
```typescript
// app/api/documents/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import { checkPermission } from '@/lib/permissions';
import { DocumentService } from '@/lib/services/document-service';

export async function POST(request: NextRequest) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await checkPermission(user, 'documents:upload');

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const documentTypeId = formData.get('documentTypeId') as string;
  const ownerId = formData.get('ownerId') as string;

  if (!file || !documentTypeId || !ownerId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const documentService = new DocumentService();
  const document = await documentService.upload({
    file,
    documentTypeId,
    ownerId,
    uploadedBy: user.id,
  });

  await auditLog.log('documents:upload', user.id, {
    documentId: document.id,
    documentTypeId,
    ownerId,
  });

  return NextResponse.json({ data: document }, { status: 201 });
}
```

---

## Anti-Patterns

### ❌ DON'T

1. **Don't access database directly from API routes**
   ```typescript
   // ❌ BAD
   export async function GET() {
     const candidates = await db.query.candidateProfiles.findMany();
     return NextResponse.json({ data: candidates });
   }
   
   // ✅ GOOD
   export async function GET() {
     const candidateService = new CandidateService();
     const candidates = await candidateService.list();
     return NextResponse.json({ data: candidates });
   }
   ```

2. **Don't skip authentication or permission checks**
   - Always authenticate first
   - Always check permissions before executing

3. **Don't return raw database errors**
   - Always catch and handle errors
   - Return user-friendly messages

4. **Don't forget audit logging**
   - Log all sensitive operations
   - Include context in audit logs

5. **Don't expose sensitive data**
   - Always apply redaction for external users
   - Never return full profiles without unlock

---

## References

- [Technical Architecture](../../docs/04-data-architecture/technical-architecture.md)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Business Logic Layer Rules](./business-logic-layer.md)
- [Authentication & Authorization Rules](./authentication-authorization.md)

---

**Document Maintained By:** Development Team  
**Last Review Date:** 2026-01-15
