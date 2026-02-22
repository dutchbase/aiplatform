# Testing Patterns

**Analysis Date:** 2026-02-09

## Test Framework

**Runner:**
- Not configured
- No test framework detected in dependencies

**Assertion Library:**
- Not configured

**Run Commands:**
```bash
# Not configured
# Planned commands per project standards:
npm test              # Run all tests (future)
npm test:watch        # Watch mode (future)
npm test:coverage     # Coverage (future)
```

## Test File Organization

**Location:**
- Not applicable (no tests exist)
- Project standards recommend: Co-located with source files or in separate `__tests__` directories

**Naming:**
- Project standards recommend: `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`

**Structure:**
```
# Planned structure (per project standards):
/app/
  /actions/
    lead-actions.ts
    lead-actions.test.ts

/components/
  /leads/
    lead-list.tsx
    lead-list.test.tsx

/lib/
  /services/
    lead-service.ts
    lead-service.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
// Example from project standards (.cursor/rules/code-quality-standards.md)
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

**Patterns:**
- Descriptive test names (per project standards)
- Group related tests with nested `describe` blocks
- Test error cases and edge cases
- Keep tests simple and focused

## Mocking

**Framework:** Not configured

**Patterns:**
- Not yet implemented
- Project standards recommend mocking external services
- Use test doubles for database queries
- Mock Supabase client for auth/data operations

**What to Mock:**
- External API calls
- Database queries
- Supabase client
- File system operations

**What NOT to Mock:**
- Business logic (test actual implementation)
- Pure functions
- Simple utility functions

## Fixtures and Factories

**Test Data:**
- Not configured
- No fixtures directory exists

**Location:**
- To be determined (likely `__fixtures__` or `test/fixtures`)

**Pattern (planned):**
```typescript
// Example factory pattern
export function createTestLead(overrides?: Partial<Lead>): Lead {
  return {
    id: 'test-lead-id',
    branche: 'hypotheken',
    bron: 'website_formulier',
    status: 'nieuw',
    contactEmail: 'test@example.com',
    createdAt: new Date(),
    ...overrides,
  };
}
```

## Coverage

**Requirements:** Not enforced yet

**Target:** Not specified

**View Coverage:**
```bash
# Not configured
# Future: npm run test:coverage
```

## Test Types

**Unit Tests:**
- Planned for business logic layer
- Test services, utilities, and pure functions
- Isolate dependencies with mocks

**Integration Tests:**
- Planned for API routes and Server Actions
- Test authentication and authorization flow
- Test database operations with test database

**E2E Tests:**
- Not planned for MVP
- Future consideration for critical user flows

## Common Patterns

**Async Testing:**
```typescript
// Example pattern from project standards
it('should create lead with valid data', async () => {
  const leadService = new LeadService();
  const result = await leadService.create(testData, testUser);
  expect(result).toBeDefined();
  expect(result.id).toBeTruthy();
});
```

**Error Testing:**
```typescript
// Example pattern from project standards
it('should throw error if bron is missing', async () => {
  const leadService = new LeadService();
  await expect(
    leadService.create({ ...testData, bron: undefined }, testUser)
  ).rejects.toThrow('bron is required');
});
```

**Server Action Testing:**
- Not yet implemented
- Will require mocking authentication context
- Will require mocking permission checks
- Will test input validation with Zod schemas

**Component Testing:**
- Not yet implemented
- Planned for interactive Client Components
- Test user interactions and state changes
- Test form submissions and error handling

## Testing Strategy (Future)

**Priority 1 (Critical):**
- Business logic in service layer
- Authentication and authorization
- Input validation (Zod schemas)
- Status workflow transitions

**Priority 2 (Important):**
- Server Actions
- API route handlers
- Database queries and RLS policies

**Priority 3 (Nice to Have):**
- Component rendering
- UI interactions
- Error boundaries

## Test Environment

**Setup:**
- Not configured
- Future: Test database connection required
- Future: Mock Supabase client for auth tests

**Configuration:**
- No test configuration files exist
- Future: `jest.config.js` or `vitest.config.ts` required

## Current Status

**Testing Infrastructure:**
- ❌ No test framework installed
- ❌ No test files exist
- ❌ No test configuration
- ❌ No test commands configured

**Next Steps:**
1. Install test framework (Jest or Vitest recommended for Next.js)
2. Configure test environment
3. Create test utilities and factories
4. Write tests for business logic (service layer)
5. Add integration tests for Server Actions
6. Set up CI/CD test pipeline

**Project Standards Reference:**
- Project has comprehensive testing guidelines in `.cursor/rules/code-quality-standards.md`
- Testing strategy documented but not yet implemented
- MVP focus is on functionality; testing infrastructure planned for later phases

---

*Testing analysis: 2026-02-09*
