# Code Quality Standards

**Scope:** All Code  
**Last Updated:** 2026-01-15

---

## Purpose & Scope

This document defines the general coding standards, conventions, and best practices that apply across all layers of the application. These standards ensure consistency, maintainability, and code quality throughout the codebase.

**This document covers:**
- TypeScript standards
- Naming conventions
- File structure
- Git workflow
- Commit messages
- Code formatting
- Documentation standards

---

## TypeScript Standards

### Type Safety

**MUST:**
- Use TypeScript strict mode
- Never use `any` type - use `unknown` if type is truly unknown
- Define types explicitly, don't rely on inference when unclear
- Use Drizzle-generated types from `@repo/database` when available

**Example:**
```typescript
// ❌ BAD
function processData(data: any) {
  return data.value;
}

// ✅ GOOD
function processData(data: { value: string }) {
  return data.value;
}

// ✅ GOOD - Unknown type
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}
```

### Type Definitions

**MUST:**
- Define types in `/types/` directory or co-located with components
- Use `type` for object shapes, `interface` for extensible contracts
- Export types that are reused across files
- Use Drizzle's `$inferSelect` and `$inferInsert` for database types

**Example:**
```typescript
// types/lead.ts
import type { leads } from '@repo/database/schema';

export type Lead = typeof leads.$inferSelect;
export type CreateLeadInput = typeof leads.$inferInsert;

// For API responses
export type LeadResponse = {
  data: Lead;
};

export type LeadListResponse = {
  data: Lead[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
```

---

## Naming Conventions

### Files

**MUST:**
- Use `kebab-case` for all file names
- Use descriptive names that indicate purpose
- Match file name to primary export (when single export)

**Examples:**
```
lead-list.tsx
lead-service.ts
create-lead.ts (Server Action)
lead-types.ts
use-lead-data.ts (React hook)
```

### Components

**MUST:**
- Use `PascalCase` for component names
- Use descriptive, feature-prefixed names
- Avoid generic names like `Card`, `Button` (use `CandidateCard`, `SubmitButton`)

**Examples:**
```typescript
// ✅ GOOD
export function LeadList() { }
export function LeadCard() { }
export function CustomerForm() { }

// ❌ BAD
export function List() { }
export function Card() { }
export function Form() { }
```

### Functions

**MUST:**
- Use `camelCase` for function names
- Use descriptive, action-oriented names
- Use verbs for functions that perform actions

**Examples:**
```typescript
// ✅ GOOD
function getLeadById(id: string) { }
function createLead(data: CreateInput) { }
function startSalesAction(leadId: string, customerId: string) { }

// ❌ BAD
function lead(id: string) { }
function create(data: CreateInput) { }
function action(leadId: string, customerId: string) { }
```

### Variables

**MUST:**
- Use `camelCase` for variables
- Use descriptive names
- Avoid abbreviations unless widely understood

**Examples:**
```typescript
// ✅ GOOD
const lead = await getLeadById(id);
const totalLeads = leads.length;
const isDuplicate = checkDuplicate(leadId);

// ❌ BAD
const l = await getLeadById(id);
const tot = leads.length;
const dup = checkDuplicate(leadId);
```

### Constants

**MUST:**
- Use `UPPER_SNAKE_CASE` for constants
- Group related constants together

**Examples:**
```typescript
// ✅ GOOD
const MAX_LEADS_PER_PAGE = 50;
const DEFAULT_PAGE_SIZE = 20;
const STATUS_CHANGE_TIMEOUT_HOURS = 24;

// ❌ BAD
const maxLeadsPerPage = 50;
const defaultPageSize = 20;
```

### Enums

**MUST:**
- Use `PascalCase` for enum names
- Use `UPPER_SNAKE_CASE` for enum values

**Examples:**
```typescript
// ✅ GOOD
enum LeadStatus {
  NIEUW = 'nieuw',
  TE_BEOORDELEN = 'te_beoordelen',
  GOEDGEKEURD = 'goedgekeurd',
  IN_OPVOLGING = 'in_opvolging',
  AANGEBODEN_AAN_KLANT = 'aangeboden_aan_klant',
  VERKOCHT = 'verkocht',
  AFGEWEZEN = 'afgewezen',
  VERLOPEN = 'verlopen',
}

// ❌ BAD
enum leadStatus {
  nieuw = 'nieuw',
  te_beoordelen = 'te_beoordelen',
}
```

---

## File Structure

### Directory Organization

**MUST:**
- Organize files by feature/domain, not by type
- Keep related files together
- Use index files for clean imports

**Example Structure:**
```
/apps/dashboard/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── leads/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── loading.tsx
│   │   └── customers/
│   └── api/
│       └── leads/
│           └── route.ts
├── components/
│   ├── leads/
│   │   ├── lead-list.tsx
│   │   ├── lead-card.tsx
│   │   └── lead-form.tsx
│   └── shared/
│       └── data-table.tsx
├── lib/
│   ├── services/
│   │   ├── lead-service.ts
│   │   └── customer-service.ts
│   └── utils/
└── types/
    ├── lead.ts
    └── customer.ts
```

### Import Organization

**MUST:**
- Group imports: external → internal → relative
- Use absolute imports with `@/` alias
- Sort imports alphabetically within groups

**Example:**
```typescript
// External dependencies
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';

// Internal packages
import { leads } from '@repo/database/schema';

// App imports
import { db } from '@/lib/db';
import { LeadService } from '@/lib/services/lead-service';
import type { Lead } from '@/types/lead';

// Relative imports
import { LeadCard } from './lead-card';
```

---

## Git Workflow

### Branching Strategy

**MUST:**
- Use `main` branch for production-ready code
- Create feature branches: `feature/description` or `phase-XX-description`
- Keep branches short-lived
- Delete branches after merge

**Branch Naming:**
```
main                          # Production
phase-01-foundation           # Phase branches
feature/candidate-search      # Feature branches
fix/rls-policy-candidate     # Bug fixes
```

### Commit Messages

**MUST:**
- Follow conventional commit format
- Use present tense ("add" not "added")
- Keep first line under 72 characters
- Include scope in parentheses

**Format:**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `test`: Test changes
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add Supabase Auth integration
fix(rls): correct lead RLS policy
refactor(api): extract sales action logic to service
docs(architecture): update technical architecture
fix(leads): handle soft-deleted records in list query
feat(leads): add duplicate detection
```

### Pull Request Process

**MUST:**
1. Create feature branch from `main`
2. Make changes with regular commits
3. Push to remote daily
4. Create PR when feature/phase complete
5. Self-review before requesting review
6. Merge to `main` after approval

**PR Description Template:**
```markdown
## Description
Brief description of changes

## Related Issue/Phase
Links to issue or phase

## Changes Made
- Change 1
- Change 2

## Testing
How was this tested?

## Checklist
- [ ] Code follows project standards
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

---

## Code Formatting

### Prettier Configuration

**MUST:**
- Use Prettier for code formatting
- Run `pnpm format` before committing
- Configure editor to format on save

**Example `.prettierrc`:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### ESLint Configuration

**MUST:**
- Use ESLint for code linting
- Fix all linting errors before committing
- Configure editor to show linting errors

---

## Documentation Standards

### JSDoc Comments

**MUST:**
- Add JSDoc comments for public APIs
- Document parameters and return types
- Include examples for complex functions

**Example:**
```typescript
/**
 * Creates a new lead
 * 
 * @param data - Lead data to create
 * @param user - User creating the lead (optional for webhook intake)
 * @returns Created lead
 * @throws {BusinessRuleError} If bron is missing
 * 
 * @example
 * ```typescript
 * const lead = await leadService.create({
 *   branche: 'hypotheken',
 *   bron: 'website_formulier',
 *   contactEmail: 'lead@example.com',
 * }, user);
 * ```
 */
async create(
  data: CreateLeadInput,
  user?: User
): Promise<Lead> {
  // Implementation
}
```

### README Files

**MUST:**
- Include README.md in major directories
- Document purpose, usage, and examples
- Keep README up to date

---

## Code Review Guidelines

### What to Review

**MUST check:**
- Code follows project standards
- Security best practices followed
- Error handling is appropriate
- Tests are included (when applicable)
- Documentation is updated
- No breaking changes (or documented)

### Review Comments

**MUST:**
- Be constructive and specific
- Suggest improvements, don't just point out problems
- Approve when code meets standards

---

## Performance Guidelines

### General Principles

**MUST:**
- Optimize database queries (use indexes, avoid N+1)
- Use Server Components by default
- Implement pagination for list endpoints
- Cache when appropriate
- Monitor performance metrics

### Database Queries

**MUST:**
- Select only needed columns
- Use joins instead of N+1 queries
- Add indexes for frequently queried columns
- Use transactions for related operations

---

## Security Guidelines

### General Principles

**MUST:**
- Never commit secrets or API keys
- Always validate input
- Always authenticate and authorize
- Log sensitive operations
- Use parameterized queries (Drizzle handles this)

### Environment Variables

**MUST:**
- Use environment variables for all secrets
- Never hardcode API keys or passwords
- Document required environment variables
- Use `.env.example` as template

---

## Testing Guidelines

### Test Structure (Future)

**MUST (when tests are added):**
- Write tests for business logic
- Test error cases
- Use descriptive test names
- Keep tests simple and focused

**Example:**
```typescript
describe('LeadService', () => {
  describe('create', () => {
    it('should create lead with valid data', async () => {
      // Test implementation
    });

    it('should throw error if bron is missing', async () => {
      // Test implementation
    });
  });
});
```

---

## Anti-Patterns

### ❌ DON'T

1. **Don't use `any` type**
   - Use `unknown` and type guards instead

2. **Don't commit secrets**
   - Always use environment variables

3. **Don't skip error handling**
   - Always handle errors appropriately

4. **Don't ignore TypeScript errors**
   - Fix all type errors before committing

5. **Don't write overly complex code**
   - Prefer simple, readable code over clever solutions

6. **Don't duplicate code**
   - Extract common logic to shared utilities

7. **Don't forget to update documentation**
   - Keep docs in sync with code changes

---

## References

- [Technical Architecture](../../docs/04-data-architecture/technical-architecture.md)
- [Frontend Application Rules](./frontend-application.md)
- [API Layer Rules](./api-layer.md)
- [Business Logic Layer Rules](./business-logic-layer.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Document Maintained By:** Development Team  
**Last Review Date:** 2026-01-15
