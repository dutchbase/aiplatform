# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Nederlandse AI Assistenten Hub** - A Dutch-language platform focused on AI assistants (starting with OpenClaw), featuring tutorials, Q&A community, blog, and SEO-driven content.

**Current Status:** Project in planning phase (Phase 0 not yet started)
**Goal:** Build an MVP in 25 phases following a phased roadmap approach

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14+ (App Router), React Server Components |
| Backend | Supabase (Auth, Postgres, Storage) |
| Hosting | Vercel |
| Database | PostgreSQL via Supabase |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS (expected) |

---

## Project Structure & Key Documents

### Core Planning Documents

- **`prd.md`** - Product Requirements Document (v1.1) - Full project specification, architecture, and requirements
- **`README.md`** - Project overview and quick reference
- **`roadmap/ROADMAP.md`** - Complete 25-phase development roadmap with phase-by-phase breakdown
- **`roadmap/phase-XX-*.md`** - Individual phase documents (2-3 tasks each)
- **`docs/CHANGELOG.md`** - Change log updated after each phase

### Cursor Rules (Apply to Claude Code)

The `.cursor/rules/` directory contains critical architectural standards:

- **`code-quality-standards.md`** - TypeScript standards, naming conventions, git workflow, commit format
- **`frontend-application.md`** - Next.js App Router patterns, Server Components, Client Components
- **`api-layer.md`** - API structure, authentication, authorization flow
- **`authentication-authorization.md`** - Supabase Auth integration, RBAC, permission model
- **`business-logic-layer.md`** - Service layer patterns and business rules
- **`data-layer.md`** - Database schema, RLS policies, Drizzle ORM patterns
- **`external-services-layer.md`** - External integrations (webhooks, etc.)

---

## Architecture Principles

### Layered Architecture

1. **Frontend** - Next.js App Router with Server/Client Components
2. **API Layer** - Supabase REST API + Custom Edge Functions
3. **Business Logic** - Service layer for complex operations
4. **Data Layer** - PostgreSQL with Row Level Security (RLS)
5. **External Services** - Webhooks and integrations

### Key Architectural Decisions

- **Server Components First:** Default to Server Components; only use Client Components for interactivity
- **Multi-Layer Security:** RLS at database + RBAC at application layer
- **Service Layer Pattern:** All business logic goes through service classes, never direct DB access from routes
- **Type Safety:** Strict TypeScript, use Drizzle-generated types, never use `any`
- **Dutch-First Content:** All content in Dutch, URLs in kebab-case with Dutch terms where logical

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Files | `kebab-case` | `lead-service.ts`, `lead-list.tsx` |
| Components | `PascalCase` | `LeadList`, `LeadCard` |
| Functions | `camelCase` | `getLeadById`, `createLead` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_LEADS_PER_PAGE` |
| Types/Interfaces | `PascalCase` | `Lead`, `CreateLeadInput` |

---

## Development Workflow

### Phase-Based Development

Each phase follows this pattern:

1. **Read phase document** (`roadmap/phase-XX-*.md`)
2. **Implement tasks** (2-3 small, focused tasks per phase)
3. **Update changelog** (`docs/CHANGELOG.md`)
4. **Update documentation** (add/update relevant docs)
5. **Git commit** with conventional commit format
6. **Push to GitHub**
7. **Mark phase complete** in `roadmap/ROADMAP.md`

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

**Examples:**
```
feat(auth): add Supabase Auth integration
fix(rls): correct lead RLS policy
docs(architecture): update technical architecture
```

### Git Workflow

- Main branch: `main`
- Feature branches: `phase-XX-description` or `feature/description`
- Keep branches short-lived
- Delete after merge

---

## URL Structure (SEO-First)

All URLs follow kebab-case, Dutch where logical:

```
/                          → Home
/openclaw                  → OpenClaw overview
/openclaw/installatie      → Installation guide
/openclaw/tutorials        → Tutorials overview
/openclaw/tutorials/[slug] → Individual tutorial
/qa                        → Q&A overview
/qa/vraag/[id]             → Q&A detail
/blog                      → Blog overview
/blog/[slug]               → Blog post
/ai-assistenten            → All AI tools overview
```

---

## Authentication & Authorization

### User Types (MVP - PRD Section 4.2)

**Internal Users Only:**
- `admin` - Full system access, manage settings, users, integrations
- `user` (Sales/Operations) - View leads, change status, start sales actions, log feedback

**No external users or customer portal in MVP**

### Permission Format

```
module:action
```

Examples: `leads:read`, `leads:update_status`, `sales_action:start`, `settings:manage`

### Security Flow (Every Protected Route)

1. **Authenticate** - Verify user identity (Supabase Auth)
2. **Check Permission** - Verify required permission (RBAC)
3. **Validate Input** - Validate with Zod schemas
4. **Execute** - Call service layer
5. **Log** - Audit trail for sensitive operations
6. **Return** - Standardized response

---

## Code Patterns

### Server Component (Data Fetching)

```typescript
// app/(dashboard)/leads/page.tsx
import { db } from '@/lib/db';
import { LeadList } from '@/components/leads/lead-list';

export default async function LeadsPage() {
  const leads = await db.query.leads.findMany({
    where: (leads, { isNull }) => isNull(leads.deletedAt),
    orderBy: (leads, { desc }) => [desc(leads.createdAt)],
  });

  return <LeadList leads={leads} />;
}
```

### Client Component (Interactivity)

```typescript
// components/leads/lead-form.tsx
'use client';

import { useState } from 'react';
import { createLead } from '@/app/actions/leads';

export function LeadForm() {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await createLead(formData);
    } finally {
      setIsPending(false);
    }
  }

  return <form action={handleSubmit}>{/* fields */}</form>;
}
```

### Server Action (Mutations)

```typescript
// app/actions/leads.ts
'use server';

import { z } from 'zod';
import { authenticate } from '@/lib/auth';
import { checkPermission } from '@/lib/permissions';
import { LeadService } from '@/lib/services/lead-service';

const createLeadSchema = z.object({
  branche: z.string(),
  bron: z.string(),
  contactEmail: z.string().email(),
});

export async function createLead(formData: FormData) {
  const user = await authenticate();
  if (!user) throw new Error('Unauthorized');

  await checkPermission(user, 'leads:create');

  const data = createLeadSchema.parse({
    branche: formData.get('branche'),
    bron: formData.get('bron'),
    contactEmail: formData.get('contactEmail'),
  });

  const leadService = new LeadService();
  return await leadService.create(data, user);
}
```

---

## Important Constraints

### What NOT to Do (MVP Scope)

- ❌ No English version (100% Dutch focus)
- ❌ No external users or customer portal
- ❌ No real-time chat (Q&A is async/forum-style)
- ❌ No mobile app (responsive web only)
- ❌ No upvotes on Q&A in MVP
- ❌ No premium content or API in MVP
- ❌ Never use `any` type
- ❌ Never skip authentication/authorization checks
- ❌ Never access database directly from routes (use services)
- ❌ Never commit secrets or API keys

### Always Do

- ✅ Use TypeScript strict mode
- ✅ Validate all input with Zod
- ✅ Check permissions before executing
- ✅ Log sensitive operations (audit trail)
- ✅ Use Server Components by default
- ✅ Apply RLS policies at database level
- ✅ Update CHANGELOG.md after each phase
- ✅ Follow conventional commit format
- ✅ Run `pnpm format` before committing (when configured)

---

## SEO Requirements

Every content page must have:

- **Meta title** (unique, descriptive, <60 chars)
- **Meta description** (<160 chars)
- **Open Graph tags** (og:title, og:description, og:image)
- **Canonical URL**
- **Breadcrumbs** on sub-pages
- **Structured data** (Schema.org where relevant: Article, FAQPage, QAPage)

---

## Testing & Quality

### Pre-Commit Checklist (When Code Exists)

- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Prettier formatting applied
- [ ] No console.log statements (except intentional logging)
- [ ] No hardcoded secrets
- [ ] Commit message follows conventional format

### Future Testing Strategy

- Unit tests for business logic (services)
- Integration tests for API routes
- E2E tests for critical user flows
- Test error cases and edge cases

---

## Phase Roadmap Overview

### Phases 0-4: Foundation
Project setup, Next.js app, design system, Supabase, authentication

### Phases 5-9: Core Features
Sessions, URL structure, SEO basics, OpenClaw section, blog/news

### Phases 10-14: Q&A Platform
Q&A data model, API, frontend, forms

### Phases 15-19: Content & SEO
Breadcrumbs, 404, structured data, initial content

### Phases 20-25: Production Ready
Internal links, moderation, deploy, monitoring, legal/compliance, MVP finalization

**Current Phase:** 0 (Project Setup) - Not yet started

---

## Common Commands (Future - Not Yet Configured)

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # Run ESLint
pnpm format                 # Run Prettier
pnpm type-check             # TypeScript check

# Database
pnpm db:push                # Push schema changes
pnpm db:generate            # Generate migrations
pnpm db:migrate             # Run migrations

# Testing (future)
pnpm test                   # Run tests
pnpm test:watch             # Watch mode
```

---

## Key Success Criteria

| Metric | Target (6-12 months) |
|--------|----------------------|
| Organic traffic | ≥10,000 unique visitors/month |
| Q&A activity | Min. 50 questions + answers in 3 months |
| Page indexation | Key pages indexed in Google |
| Time on page | >3 min on key tutorials |

---

## References

- **PRD:** Full product requirements in `prd.md`
- **Roadmap:** Phase-by-phase plan in `roadmap/ROADMAP.md`
- **Architecture Rules:** All `.cursor/rules/*.md` files apply
- **Phase Documents:** Individual tasks in `roadmap/phase-XX-*.md`

---

**Last Updated:** 2026-02-09
**Project Version:** Planning Phase (Pre-MVP)
