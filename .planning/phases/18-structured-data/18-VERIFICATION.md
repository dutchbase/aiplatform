---
phase: 18-structured-data
verified: 2026-02-10T19:15:04Z
status: human_needed
score: 6/6 must-haves verified
human_verification:
  - test: View page source on a Q&A detail page with at least one answer in Supabase
    expected: JSON-LD contains @type QAPage, mainEntity @type Question with name/text/answerCount/dateCreated, and suggestedAnswer array with at least one @type Answer item
    why_human: Q&A page fetches live Supabase data. Schema structure verified in code but runtime output with real records needs confirmation.
  - test: Paste blog detail page JSON-LD output into https://validator.schema.org/
    expected: No validation errors; Article type recognized with all required fields present
    why_human: Field names verified programmatically. Google rich results eligibility requires their own validator to confirm.
---

# Phase 18: Structured Data (JSON-LD) Verification Report

**Phase Goal:** Add Schema.org JSON-LD structured data to blog detail pages (Article), tutorial detail pages (Article), and Q&A detail pages (QAPage). Makes content eligible for Google rich results. Satisfies PRD section 4.3.
**Verified:** 2026-02-10T19:15:04Z
**Status:** human_needed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| #   | Truth | Status | Evidence |
| --- | ----- | ------ | -------- |
| 1   | blog/[slug] emits script type application/ld+json containing @type Article with headline, datePublished, dateModified, and description | VERIFIED | app/blog/[slug]/page.tsx lines 51-69: articleSchema object with all four required fields + dangerouslySetInnerHTML script tag |
| 2   | openclaw/tutorials/[slug] emits script type application/ld+json containing @type Article with headline, datePublished, dateModified, and description | VERIFIED | app/openclaw/tutorials/[slug]/page.tsx lines 52-70: articleSchema with tutorial.lastUpdated for both date fields |
| 3   | qa/vraag/[id] emits script type application/ld+json containing @type QAPage with mainEntity Question and suggestedAnswer items for each answer | VERIFIED (structural) | app/qa/vraag/[id]/page.tsx lines 44-67: qaSchema with mainEntity @type Question and suggestedAnswer: answersWithReplies.map(...) - runtime requires human check |
| 4   | No duplicate JSON-LD script blocks of the same @type appear on any single page | VERIFIED | application/ld+json appears in exactly 3 files (3 target pages only). app/layout.tsx has none. Each file has exactly one occurrence (blog line 67, tutorial line 68, qa line 65). |
| 5   | JSON-LD is valid - JSON.stringify produces parseable output with correct Schema.org field names | VERIFIED (structural) | Standard object literals; JSON.stringify(schema) called directly via dangerouslySetInnerHTML. Fields @context @type headline description datePublished dateModified mainEntity suggestedAnswer answerCount dateCreated all match Schema.org spec. |
| 6   | docs/seo.md documents the structured data implementation | VERIFIED | docs/seo.md lines 200-262: Structured Data (JSON-LD) section with Article Schema table, QAPage Schema table, No Duplicate Scripts Rule, validation links. Last Updated Phase 18 (line 330). |

**Score:** 6/6 truths verified (2 with human verification items for runtime/validator confirmation)

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| app/blog/[slug]/page.tsx | Article JSON-LD for blog detail pages | VERIFIED | 119 lines; articleSchema built lines 51-62; script tag at lines 65-69; Fragment wrapper at lines 64/116; Server Component (no use client) |
| app/openclaw/tutorials/[slug]/page.tsx | Article JSON-LD for tutorial detail pages | VERIFIED | 115 lines; articleSchema built lines 52-63; script tag at lines 66-70; Fragment wrapper; Server Component |
| app/qa/vraag/[id]/page.tsx | QAPage JSON-LD for Q&A detail pages | VERIFIED | 156 lines; qaSchema built lines 44-60; script tag at lines 63-67; Fragment wrapper; Server Component |
| docs/seo.md | Structured data documentation | VERIFIED | Structured Data (JSON-LD) section; Article Schema table; QAPage Schema table; No Duplicate Scripts Rule; Validation links; Last Updated: Phase 18 |
| docs/CHANGELOG.md | Phase 18 as latest changelog entry | VERIFIED | Phase 18 - 2026-02-10 - Gestructureerde Data (JSON-LD) is the first entry with Added/Changed/Technical Details |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| app/blog/[slug]/page.tsx | lib/data/blog.ts BlogPost type | post.title, post.excerpt, post.publishedAt, post.updatedAt | WIRED | All four fields used correctly. BlogPost.updatedAt is optional string; updatedAt ?? publishedAt is correct. Spot-check: prompt-engineering post (publishedAt 2026-02-05, updatedAt 2026-02-09) will emit dateModified 2026-02-09. |
| app/openclaw/tutorials/[slug]/page.tsx | lib/data/tutorials.ts Tutorial type | tutorial.title, tutorial.description, tutorial.lastUpdated | WIRED | tutorial.lastUpdated used for both datePublished and dateModified. Tutorial type has only lastUpdated (no publishedAt/updatedAt). Correct. |
| app/qa/vraag/[id]/page.tsx | Supabase via lib/qa/queries | question.title, question.body, question.created_at, answersWithReplies | WIRED | qaSchema built after Promise.all resolves answersWithReplies. question.id used in suggestedAnswer[].url. Schema positioned after all data fetching. |
| All three pages | React Fragment with script as first child | dangerouslySetInnerHTML | WIRED | All three pages use Fragment pattern: script tag first child, then div.container second child. Confirmed in file reads. |

### Requirements Coverage

| Requirement | Status | Notes |
| ----------- | ------ | ----- |
| PRD 4.3: Structured data (Schema.org) for blog, tutorials, Q&A | SATISFIED | Article JSON-LD on blog + tutorial detail pages; QAPage JSON-LD on Q&A detail pages |
| No duplicate JSON-LD blocks per page | SATISFIED | Only 3 files in codebase contain application/ld+json; app/layout.tsx has none; each target file has exactly one occurrence |
| Server Components remain Server Components | SATISFIED | No use client directive in any of the 3 modified page files |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| None | - | - | - | No TODO/FIXME, no placeholder content, no empty returns, no console.log-only implementations found in modified files |

### Human Verification Required

#### 1. Q&A Detail Page - Runtime JSON-LD Output

**Test:** With the dev server running and at least one Q&A question with answers in Supabase, visit a Q&A detail page (e.g. http://localhost:3000/qa/vraag/[some-uuid]). View page source.
**Expected:** One script block type application/ld+json containing @type QAPage, mainEntity @type Question with name/text/answerCount/dateCreated, and suggestedAnswer array with @type Answer items for each answer.
**Why human:** Q&A page depends on live Supabase data. Schema object structure is verified correct in code but runtime serialization with real answer records needs confirmation.

#### 2. Schema.org Validator

**Test:** Paste the JSON-LD output from any blog or tutorial detail page source into https://validator.schema.org/ or https://search.google.com/test/rich-results.
**Expected:** No validation errors; Article type recognized; rich results eligibility confirmed.
**Why human:** Programmatic field-name checks confirm structural correctness. Google rich results eligibility requires their own validator to confirm.

### Gaps Summary

No gaps found. All 6 must-haves are structurally verified in the codebase:

- app/blog/[slug]/page.tsx: Article schema with all required fields (headline, description, datePublished, dateModified, author). dateModified uses updatedAt ?? publishedAt (verified: prompt-engineering post has updatedAt 2026-02-09 overriding publishedAt 2026-02-05).
- app/openclaw/tutorials/[slug]/page.tsx: Article schema with tutorial.lastUpdated for both date fields (correct per Tutorial type which has no publishedAt).
- app/qa/vraag/[id]/page.tsx: QAPage schema with Question mainEntity and suggestedAnswer array mapped from answersWithReplies.
- No JSON-LD in shared layouts (app/layout.tsx); exactly one script block per target page.
- docs/seo.md: dedicated Structured Data (JSON-LD) section with field-source tables for Article and QAPage schemas.
- docs/CHANGELOG.md: Phase 18 is the first (latest) entry.

Two human verification items remain for runtime confirmation (Q&A with live Supabase data) and schema validator confirmation. These do not indicate code defects.

---

_Verified: 2026-02-10T19:15:04Z_
_Verifier: Claude (gsd-verifier)_
