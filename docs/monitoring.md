# Monitoring

This document describes the monitoring setup for Nederlandse AI Assistenten Hub.

## Error Tracking (Sentry)

We use [Sentry](https://sentry.io) for error tracking. Unhandled exceptions in the browser and on the server are automatically captured and reported.

### Where to look
- **Sentry Dashboard**: sentry.io → [your organisation] → [your project] → Issues
- Alerts are configured per project; add email/Slack alerts under Project Settings → Alerts.

### What is captured
- Unhandled JavaScript exceptions (client)
- Unhandled errors in Server Components, Server Actions, and API routes (server)
- Edge runtime errors (middleware, edge routes)

### Environment variables required
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Client-side DSN (also used server-side) |
| `SENTRY_DSN` | Server-only DSN (same value, no NEXT_PUBLIC_ prefix) |
| `SENTRY_AUTH_TOKEN` | Source map upload during build |
| `SENTRY_ORG` | Sentry organisation slug |
| `SENTRY_PROJECT` | Sentry project slug |

### Setup instructions
1. Create a free account at sentry.io
2. Create a new project → select Next.js
3. Copy the DSN from Project Settings → Client Keys (DSN)
4. Add all variables to `.env.local` (local) and Vercel Environment Variables (production)
5. Run `npm run build` — Sentry will upload source maps automatically

---

## Uptime Monitoring

The app exposes a health check endpoint:

```
GET /api/health
→ 200 { "status": "ok", "timestamp": "2026-02-11T12:00:00.000Z" }
```

### Recommended uptime service
Use [Better Uptime](https://betterstack.com/uptime) (free tier: 10 monitors, 3-minute interval) or [UptimeRobot](https://uptimerobot.com) (free tier: 50 monitors, 5-minute interval).

### Configuration
- Monitor URL: `https://[your-domain]/api/health`
- Method: GET
- Expected HTTP status: 200
- Check interval: every 3–5 minutes
- Alert channel: email (configure in the uptime service dashboard)

### What to check during an outage
1. Vercel Dashboard → Deployments — check for failed deploys
2. Vercel Dashboard → Functions — check for runtime errors
3. Supabase Dashboard → Database → Health — check connection pool
4. Sentry Issues — check for a spike in errors just before the outage

---

## Structured Logging

Critical user actions are logged to `stdout` as structured JSON (visible in Vercel Functions logs).

Log format:

```json
{ "type": "login_success", "timestamp": "2026-02-11T12:00:00.000Z", "userId": "dXNlci1p" }
```

### What is logged
| Event | Type field |
|---|---|
| Successful login | `login_success` |
| Failed login | `login_failure` |
| New registration | `signup` |
| New Q&A question posted | `qa_question_created` |
| New Q&A answer posted | `qa_answer_created` |

### What is NOT logged
- Passwords (never)
- Email addresses
- Full request bodies
- Content of questions/answers

### Where to read logs
- **Local**: terminal output from `npm run dev`
- **Production**: Vercel Dashboard → Project → Functions → [function name] → Logs
