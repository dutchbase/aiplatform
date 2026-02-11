---
phase: 22-deploy-cicd
plan: 01
status: complete
completed: 2026-02-11
---

# Summary: Phase 22 Plan 01 — CI Pipeline & Deployment Docs

## What was built

### Task 1: GitHub Actions CI workflow
- Created `.github/workflows/ci.yml`
- Triggers on push to `main` and pull_request targeting `main`
- Job: `lint-and-build` on `ubuntu-latest`
- Steps: `actions/checkout@v4`, `actions/setup-node@v4` (Node 20, npm cache), `npm ci`, `npm run lint`, `npm run build`
- Build step has placeholder env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_BASE_URL`) so TypeScript build passes without real credentials

### Task 2: Deployment docs + .env.example
- Created `docs/deployment.md` covering:
  - All 4 required env vars with source locations (table)
  - Vercel deployment steps (7 numbered steps)
  - Automatic deployments explanation
  - CI pipeline description
  - Local development instructions
  - Security notes for `SUPABASE_SERVICE_ROLE_KEY`
- Updated `.env.example`:
  - Added docs cross-reference comment at top: "Zie docs/deployment.md voor instructies..."
  - Updated `NEXT_PUBLIC_BASE_URL` comment to explain production vs local usage

### Task 3: CHANGELOG
- Added Phase 22 entry at top of `docs/CHANGELOG.md` (above Phase 21)
- Documents CI workflow, deployment.md creation, and .env.example update

## Decisions
- Placeholder env vars in CI avoid needing GitHub Actions secrets for build validation
- `SUPABASE_SERVICE_ROLE_KEY` intentionally excluded from CI workflow
- `docs/deployment.md` uses Dutch headings, mixed Dutch/English content (developer doc)

## Artifacts
- `.github/workflows/ci.yml` — CI pipeline
- `docs/deployment.md` — Deployment reference
- `.env.example` — Updated with improved comments
- `docs/CHANGELOG.md` — Phase 22 entry added

## Next
Plan 02 requires human action: connect repo to Vercel, set production env vars, trigger first deploy, then verify the live site.
