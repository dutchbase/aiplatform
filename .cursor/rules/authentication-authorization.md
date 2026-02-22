# Authentication & Authorization Rules

**Layer:** Authentication & Authorization  
**Location:** `/apps/dashboard/lib/auth/` and `/apps/dashboard/lib/permissions/`  
**Last Updated:** 2026-01-20

---

## Purpose & Scope

This document defines the coding standards, patterns, and best practices for authentication and authorization. The system uses Supabase Auth for authentication and implements Role-Based Access Control (RBAC).

**This layer handles:**
- User authentication (Supabase Auth)
- Permission checking (RBAC)
- Session management

**PRD Section 3.3 & 4.2:** Only internal users have access. No customer visibility in MVP.

**Key Principle:** Security is enforced at multiple layers: database (RLS) and application (RBAC).

---

## Architecture Patterns

### Multi-Layer Security

**Layer 1: Database (RLS)**
- Row Level Security policies filter data at database level
- Automatic filtering based on user role (internal only)
- Cannot be bypassed by application code
- PRD Section 3.3: Only internal users (Admin, Sales/Operations) have access

**Layer 2: Application (RBAC)**
- Permission checks in API routes and services
- Fine-grained control over actions (Admin vs User)
- Logged for audit trail (PRD Section 14.2)

---

## Authentication

### Supabase Auth Integration

**MUST:**
- Use Supabase Auth for all authentication
- Create user record in `users` table after Supabase signup
- Link `users.auth_id` to `auth.users.id`
- Handle auth state changes

**Example:**
```typescript
// lib/auth/authenticate.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users } from '@repo/database/schema';
import { eq } from 'drizzle-orm';

export async function authenticate(request?: Request): Promise<User | null> {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !authUser) {
    return null;
  }

  // Get user from database
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.authId, authUser.id))
    .limit(1);

  if (!user) {
    return null;
  }

  return user;
}
```

### User Creation After Signup

**MUST:**
- Create user record in `users` table after Supabase signup
- Use database trigger or API webhook
- Link `auth_id` correctly

**Example:**
```typescript
// app/api/auth/signup/route.ts
import { createClient } from '@supabase/supabase-js';
import { db } from '@/lib/db';
import { users } from '@repo/database/schema';

export async function POST(request: NextRequest) {
  const { email, password, firstName, lastName, userType, primaryRole } = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return NextResponse.json({ error: authError?.message }, { status: 400 });
  }

  // 2. Create user record in database
  const [user] = await db
    .insert(users)
    .values({
      authId: authData.user.id,
      email,
      firstName,
      lastName,
      userType,
      primaryRole,
      status: 'active',
    })
    .returning();

  return NextResponse.json({ data: user }, { status: 201 });
}
```

---

## Authorization (RBAC)

### Permission System

**Permission Format:**
```
Module:Action
Examples:
- leads:read
- leads:create
- leads:update
- leads:delete
- leads:update_status
- sales_action:start
- customers:read
- customers:manage
- settings:manage (Admin only)
- webhooks:manage (Admin only)
```

### Permission Checking

**MUST:**
- Check permissions in API routes before executing business logic
- Use `checkPermission()` helper
- Return 403 Forbidden if permission denied
- Log permission denials

**Example:**
```typescript
// lib/permissions/check-permission.ts
import { db } from '@/lib/db';
import { users, roles, permissions, rolePermissions, userRoles } from '@repo/database/schema';
import { eq, inArray } from 'drizzle-orm';
import type { User } from '@/types/user';

export async function checkPermission(
  user: User,
  permission: string
): Promise<boolean> {
  // Get user's roles
  const userRoleRecords = await db
    .select({ role: roles })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, user.id));

  const roleIds = userRoleRecords.map(ur => ur.role.id);

  if (roleIds.length === 0) {
    return false;
  }

  // Get permissions for user's roles
  const permissionRecords = await db
    .select({ permission: permissions })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(inArray(rolePermissions.roleId, roleIds));

  const userPermissions = permissionRecords.map(pr => pr.permission.name);

  return userPermissions.includes(permission);
}
```

**Usage in API routes:**
```typescript
// app/api/candidates/route.ts
import { checkPermission } from '@/lib/permissions';

export async function POST(request: NextRequest) {
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hasPermission = await checkPermission(user, 'candidates:create');
  if (!hasPermission) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // ... rest of implementation
}
```

### Role Definitions (from PRD Section 4.1)

**Internal Roles (MVP):**
- `admin` - Full system access, kan instellingen beheren (bronnen, branches, statusregels, automatiseringsregels), kan integratie-instellingen beheren (webhook endpoints/tokens), kan gebruikers beheren
- `user` (Sales/Operations) - Kan leads zien en opvolgen, kan status wijzigen (binnen toegestane stappen), kan verkoopacties starten, kan feedback vastleggen

**PRD Section 4.2:** Alleen interne gebruikers hebben toegang; er is geen externe rol in MVP.

**Role Permissions Matrix (from PRD Section 4.1):**

| Permission | Admin | User (Sales/Operations) |
|------------|-------|-------------------------|
| leads:read | ✅ All | ✅ All |
| leads:create | ✅ | ✅ |
| leads:update | ✅ | ✅ |
| leads:update_status | ✅ | ✅ (binnen toegestane stappen) |
| leads:delete | ✅ | ❌ |
| sales_action:start | ✅ | ✅ |
| feedback:create | ✅ | ✅ |
| customers:read | ✅ All | ✅ All |
| customers:manage | ✅ | ❌ |
| settings:manage | ✅ | ❌ |
| webhooks:manage | ✅ | ❌ |
| users:manage | ✅ | ❌ |

---

## Access Control

### PRD Section 3.3: No Customer Visibility

**MUST:**
- Only internal users (Admin, Sales/Operations) have access
- No external users or customer portal in MVP
- All users see all leads (no data redaction needed)
- RLS policies enforce internal-only access

**Example:**
```typescript
// lib/permissions/check-access.ts
import type { User } from '@/types/user';

export function checkInternalAccess(user: User): boolean {
  // PRD Section 4.2: Only internal users have access
  return user.userType === 'internal' && user.status === 'active';
}

export function checkAdminAccess(user: User): boolean {
  // PRD Section 4.1: Admin role
  return user.primaryRole === 'admin' && user.userType === 'internal';
}
```

---

## Common Patterns

### Middleware for Route Protection

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

  // Protect dashboard routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Protect API routes
  if (!session && req.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

### Permission Checking Helper

**Example:**
```typescript
// lib/permissions/require-permission.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import { checkPermission } from './check-permission';

export async function requirePermission(
  request: NextRequest,
  permission: string
): Promise<{ user: User } | NextResponse> {
  // Authenticate
  const user = await authenticate(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check permission
  const hasPermission = await checkPermission(user, permission);
  if (!hasPermission) {
    await auditLog.log(`${permission}:denied`, user.id, {
      path: request.nextUrl.pathname,
    });
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return { user };
}
```

**Usage:**
```typescript
// app/api/candidates/route.ts
import { requirePermission } from '@/lib/permissions/require-permission';

export async function POST(request: NextRequest) {
  const authResult = await requirePermission(request, 'candidates:create');
  if (authResult instanceof NextResponse) {
    return authResult; // Error response
  }

  const { user } = authResult;
  // ... rest of implementation
}
```

---

## Anti-Patterns

### ❌ DON'T

1. **Don't skip authentication checks**
   ```typescript
   // ❌ BAD
   export async function GET() {
     const candidates = await db.select().from(candidateProfiles);
     return NextResponse.json({ data: candidates });
   }
   
   // ✅ GOOD
   export async function GET(request: NextRequest) {
     const user = await authenticate(request);
     if (!user) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     // ... rest
   }
   ```

2. **Don't skip permission checks**
   - Always check permissions before executing business logic

3. **Don't bypass RLS**
   - Never use service role key unless absolutely necessary
   - Trust RLS to filter data

4. **Don't expose sensitive data**
   - Always apply redaction for external users
   - Never return full profiles without unlock

5. **Don't forget audit logging**
   - Log all sensitive operations
   - Log permission denials
   - Log unlock requests and approvals

---

## References

- [Technical Architecture](../../docs/04-data-architecture/technical-architecture.md)
- [Database Schema Documentation](../../docs/04-data-architecture/data-schemas/README.md)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [API Layer Rules](./api-layer.md)

---

**Document Maintained By:** Development Team  
**Last Review Date:** 2026-01-15
