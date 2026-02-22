# Blog → Supabase + Daily AI Writer — Implementation Backlog

## Goal
Move `/blog` from hardcoded TypeScript data to Supabase-backed published content, while preserving SEO quality and enabling a daily OpenClaw-generated article flow.

## Delivery model
- Coordinator: Sanne
- Daan: app/data integration
- Joris: database/RLS/migrations
- Mila: safety/policy gate for AI text
- Koen: QA + SEO validation
- Bram: cron/deploy/monitoring

---

## Epic A — Database foundation (Joris)

### A1. Create `blog_posts` schema
**Status:** DONE
- [x] Add migration `00005_blog_posts.sql`
- [x] Fields: slug/title/excerpt/intro/sections/status/published_at/updated_at/seo metadata/author metadata
- [x] Indexes for publishing query path
- [x] Trigger for updated_at

### A2. Access control (RLS)
**Status:** DONE
- [x] Public read policy for published posts only
- [x] Authenticated moderator/admin write policy

### A3. Migration deploy
**Status:** TODO
- [ ] Apply migration to Supabase project
- [ ] Verify table + policies live

**Acceptance criteria**
- Table exists in Supabase
- `slug` unique constraint enforced
- Public anon query only returns `status='published'`

---

## Epic B — Runtime blog integration (Daan)

### B1. Replace hardcoded source for blog pages
**Status:** DONE
- [x] Add `lib/data/blog-db.ts`
- [x] `/blog` reads from DB
- [x] `/blog/[slug]` reads from DB
- [x] Metadata reads from DB
- [x] Dynamic static params from DB

### B2. Related content migration
**Status:** DONE
- [x] `getRelatedPosts` now DB-backed

### B3. Sitemap SEO integration
**Status:** DONE
- [x] `app/sitemap.ts` includes dynamic blog post URLs + lastModified

**Acceptance criteria**
- `/blog` renders posts from Supabase
- `/blog/[slug]` uses `notFound()` for missing slug
- sitemap includes `/blog/[slug]` rows from DB

---

## Epic C — AI daily writer pipeline (Sanne + Mila + Bram)

### C1. Content generation job
**Status:** TODO
- [ ] Add daily cron job (isolated session)
- [ ] Prompt template output includes: title, slug, excerpt, intro, sections, seo_title, seo_description, focus_keyword
- [ ] Insert as `draft` or `review`

### C2. Quality/safety gate
**Status:** TODO
- [ ] Validate length + duplicate checks
- [ ] Validate prohibited claims/hallucination patterns
- [ ] Validate metadata lengths + keyword presence
- [ ] Promote to `published` only on pass

### C3. Optional human approval step
**Status:** TODO
- [ ] If confidence low, keep as `review`
- [ ] Add admin flow for approve/publish

**Acceptance criteria**
- Daily job writes valid rows to `blog_posts`
- No direct publish without passing gate

---

## Epic D — QA + SEO hardening (Koen)

### D1. Functional tests
**Status:** TODO
- [ ] Blog list + detail pages work with DB data
- [ ] Missing slug returns 404
- [ ] Related posts render without static fallback

### D2. SEO checks
**Status:** TODO
- [ ] Unique title/description per post
- [ ] JSON-LD Article fields valid
- [ ] Sitemap includes all published posts with lastmod

### D3. Deployment verification
**Status:** TODO
- [ ] Build passes on Vercel
- [ ] Crawl test for `/blog` and 3 sample posts

---

## Epic E — Rollout ops (Bram)

### E1. Monitoring
**Status:** TODO
- [ ] Alert on daily job failure
- [ ] Alert on insert/publish failure

### E2. Recovery playbook
**Status:** TODO
- [ ] Manual backfill command
- [ ] Rollback plan if malformed content is published

---

## Immediate next actions
1. Apply migration `00005_blog_posts.sql` to Supabase.
2. Seed at least 3 current hardcoded posts into `blog_posts` as `published`.
3. Redeploy and verify `/blog` + `/blog/[slug]` + `/sitemap.xml`.
4. Configure daily writer cron with review gate.
