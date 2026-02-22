# OpenClaw Newsbot Automation

## Purpose
Automate discovery of newsworthy OpenClaw updates and convert them into SEO-ready Dutch blog posts in `blog_posts`.

## Runtime assets
- Findings: `content/openclaw-news/findings.jsonl`
- State: `content/openclaw-news/state.json`
- Published log: `content/openclaw-news/published.jsonl`
- Fallback SQL: `content/openclaw-news/pending-insert.sql`

## Cron jobs
1. **OpenClaw Newsbot Research (4x daily)**
   - Schedule: `0 */6 * * *` (UTC)
   - Action: web research + append findings + increment state counter

2. **OpenClaw Newsbot Publish (every 2 runs)**
   - Schedule: `30 */12 * * *` (UTC)
   - Action: evaluate findings, draft/publish one article, write to Supabase

## DB schema target
Table: `public.blog_posts`
Required payload:
- `slug`, `title`, `excerpt`, `intro`, `sections`
- `status='published'`, `published_at`
- `seo_title`, `seo_description`, `focus_keyword`
- `author_type='agent'`, `author_name='Nova Newsbot'`

## Editorial rules
- Primary sources first (docs/releases/changelogs)
- No unverifiable claims
- Only publish if truly newsworthy
- Avoid near-duplicates of recent posts

## Image strategy
- Prefer rights-safe official image URLs
- Fallback: generate image with Nano Banana Pro when available
- If no image, still publish text and log reason
