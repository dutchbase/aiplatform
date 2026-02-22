---
phase: 23-monitoring
plan: 01
status: complete
date: 2026-02-11
---

# Summary: Plan 23-01 — Sentry Setup, Health Endpoint, Monitoring Docs

## Files Created/Modified

| File | Action | Purpose |
|---|---|---|
| `sentry.client.config.ts` | Created | Sentry initialisation for browser runtime |
| `sentry.server.config.ts` | Created | Sentry initialisation for Node.js runtime |
| `sentry.edge.config.ts` | Created | Sentry initialisation for Edge runtime |
| `next.config.mjs` | Modified | Wrapped with `withSentryConfig` for build-time integration |
| `.env.example` | Modified | Added 5 Sentry env vars with documentation |
| `app/api/health/route.ts` | Created | Edge runtime health check endpoint |
| `docs/monitoring.md` | Created | Operator documentation for Sentry, uptime, and structured logging |

## Sentry Package Installed

- `@sentry/nextjs` version `^10.38.0` (189 packages added)
- Installed with `--ignore-scripts` flag due to WSL/Windows npm interop issue where `@sentry/cli` post-install script fails on UNC paths

## Health Endpoint

- URL: `GET /api/health`
- Runtime: Edge (lightweight, fast startup)
- Response: `200 { "status": "ok", "timestamp": "<ISO 8601>" }`
- No auth required — publicly accessible for uptime monitors

## Key Decisions

| Decision | Rationale |
|---|---|
| Edge runtime for health route | Fastest possible response, no cold start concern |
| `NEXT_PUBLIC_SENTRY_DSN` used in all three config files | Same env var works across client, server, and edge runtimes |
| `--ignore-scripts` for npm install | Bypasses `@sentry/cli` UNC path failure on WSL2 + Windows npm. Source map upload requires CLI binary; if needed, run install from Windows PowerShell directly |
| `withSentryConfig` in next.config.mjs as ESM import | `.mjs` requires named ESM import; no default export conflict |

## Issues Encountered

- **WSL/Windows npm UNC path issue**: `npm install @sentry/nextjs` fails because `@sentry/cli`'s post-install script runs via CMD.EXE which doesn't support UNC paths (`\\wsl.localhost\...`). Resolved with `--ignore-scripts`. Side effect: `@sentry/cli` binary is not downloaded, so source map upload during `npm run build` won't work until the user reinstalls from Windows PowerShell/CMD (or a native Linux Node.js installation).
- **`npm run build` fails in WSL** for the same UNC path reason (Next.js tries to create `.next` in `C:\Windows`). TypeScript type check (`tsc --noEmit`) was used instead to verify correctness.

## TypeScript Status

✅ `tsc --noEmit` exits 0 — no errors

## Human Checkpoint Required

The Sentry DSN env var must be configured before error tracking is active. See checkpoint in the plan for step-by-step setup instructions.
