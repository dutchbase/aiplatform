# Coding Conventions

**Analysis Date:** 2026-02-09

## Naming Patterns

**Files:**
- `kebab-case` for all file names
- Components: `kebab-case.tsx` (e.g., `lead-list.tsx`)
- Pages: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Server Actions: `kebab-case.ts` (e.g., `create-lead.ts`)
- Types: `kebab-case.ts` (e.g., `lead-types.ts`)
- Config files: lowercase with extension (e.g., `tsconfig.json`, `tailwind.config.ts`)

**Functions:**
- `camelCase` for function names
- Server Actions: verb + noun (e.g., `createLead`, `updateLeadStatus`)
- Use verbs for actions (e.g., `getLeadById`, `startSalesAction`)

**Variables:**
- `camelCase` for variables
- Descriptive names, avoid abbreviations
- Boolean variables: prefix with `is`, `has`, `should` (e.g., `isPending`, `hasError`)

**Types:**
- `PascalCase` for type names and interfaces
- `PascalCase` for component names (e.g., `LeadList`, `LeadCard`)
- Descriptive, feature-prefixed names (e.g., `LeadCard`, not `Card`)

**Constants:**
- `UPPER_SNAKE_CASE` for constants (e.g., `MAX_LEADS_PER_PAGE`)

## Code Style

**Formatting:**
- No Prettier configuration detected in project root
- Next.js default formatting applies
- Semi-colons: Not consistently enforced
- Single quotes: Not consistently enforced
- Line width: Not configured (default)

**Linting:**
- ESLint with `next/core-web-vitals` config
- Config file: `.eslintrc.json`
- Run command: `npm run lint`
- Extends Next.js recommended rules

**TypeScript:**
- Strict mode enabled (`"strict": true`)
- ES module interop enabled
- Module resolution: `bundler`
- JSX: `preserve` (handled by Next.js)
- No `any` types allowed per project standards
- Path alias: `@/*` maps to project root

## Import Organization

**Order:**
1. External dependencies (React, Next.js, third-party)
2. Internal packages (when monorepo structure exists)
3. App imports using `@/` alias
4. Relative imports

**Path Aliases:**
- `@/*` - Maps to project root (configured in `tsconfig.json`)

**Example:**
```typescript
// External dependencies
import type { Metadata } from 'next'

// App imports
import { db } from '@/lib/db'
import { LeadService } from '@/lib/services/lead-service'
import type { Lead } from '@/types/lead'

// Relative imports
import { LeadCard } from './lead-card'
```

## Error Handling

**Patterns:**
- Server Components: Throw errors, let Next.js error boundary handle
- Client Components: Use try-catch with error state
- Server Actions: Throw errors with descriptive messages
- Route-level error handling: Use `error.tsx` files
- Never expose sensitive error details to users

**Example from project standards:**
```typescript
// Client Component
'use client';
const [error, setError] = useState<string | null>(null);

try {
  await createLead(formData);
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred');
}
```

## Logging

**Framework:** None configured (console methods expected)

**Patterns:**
- Log sensitive operations for audit trail (per project standards)
- No console.log statements in production code
- Future: Sentry integration planned for error tracking

## Comments

**When to Comment:**
- Public APIs: Use JSDoc comments
- Complex business logic: Explain why, not what
- TODO/FIXME: None currently in codebase
- PRD references: Link to specific PRD sections (e.g., `// PRD Section 5.1: Timeline`)

**JSDoc/TSDoc:**
- Required for public APIs per project standards
- Document parameters and return types
- Include examples for complex functions

**Example from project standards:**
```typescript
/**
 * Creates a new lead
 *
 * @param data - Lead data to create
 * @param user - User creating the lead (optional for webhook intake)
 * @returns Created lead
 * @throws {BusinessRuleError} If bron is missing
 */
```

## Function Design

**Size:** Not explicitly defined, prefer focused functions

**Parameters:**
- Use objects for multiple parameters
- Validate with Zod schemas for Server Actions

**Return Values:**
- Explicit return types for public functions
- Server Actions: Return objects with success/error status

## Module Design

**Exports:**
- Named exports preferred
- Default export for Next.js pages and layouts
- Export types that are reused across files

**Barrel Files:**
- Not currently used, but recommended for clean imports
- Use `index.ts` files in directories for grouped exports

## Server vs Client Components

**Server Components (Default):**
- No `'use client'` directive
- Can fetch data directly
- Cannot use hooks or browser APIs
- File: `app/layout.tsx`, `app/page.tsx`

**Client Components:**
- Must include `'use client'` directive at top
- Can use React hooks and browser APIs
- Cannot directly access database
- Use for forms, interactive elements

**Pattern:**
- Default to Server Components
- Only use Client Components when interactivity required
- Keep Client Components small and focused

## CSS and Styling

**Framework:** Tailwind CSS

**Config:** `tailwind.config.ts`
- Content paths: `pages/**`, `components/**`, `app/**`
- Theme: Default extended theme
- No custom plugins

**Global Styles:** `app/globals.css`
- Tailwind directives: `@tailwind base`, `@tailwind components`, `@tailwind utilities`
- CSS custom properties for theming (light/dark mode)
- Minimal global styles, utility-first approach

**Patterns:**
- Utility classes in JSX (e.g., `className="flex min-h-screen flex-col"`)
- No CSS modules or styled-components
- No custom CSS classes beyond Tailwind utilities

## Git Workflow

**Commit Format:**
- Conventional commits required
- Format: `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

**Example:**
```
feat(auth): add Supabase Auth integration
fix(rls): correct lead RLS policy
chore(phase-0): project setup – structure, dependencies, .env.example, README
```

**Branching:**
- Main branch: `main`
- Current branch: `master` (should align to `main`)
- Feature branches: `phase-XX-description` or `feature/description`
- Delete after merge

---

*Convention analysis: 2026-02-09*
