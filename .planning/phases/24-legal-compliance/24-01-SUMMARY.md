---
phase: 24-legal-compliance
plan: 01
status: complete
completed: 2026-02-12
---

# Summary: Plan 24-01 — Privacy, Gebruiksvoorwaarden, Footer, Docs

## What Was Built

- `app/privacy/page.tsx` — Dutch privacy policy page at `/privacy` with 10 sections covering GDPR requirements (verantwoordelijke, gegevensverzameling, doeleinden, bewaartermijnen, rechten, beveiliging, cookies, wijzigingen). Exports `metadata` and default `PrivacyPage`. Uses `Breadcrumbs` component.
- `app/voorwaarden/page.tsx` — Dutch terms of use page at `/voorwaarden` with 10 sections (registratie, gedragsregels, gebruikerscontent, moderatie, aansprakelijkheid, toepasselijk recht). Exports `metadata` and default `VoorwaardenPage`. Uses `Breadcrumbs` component.
- `docs/legal.md` — Documents location of legal pages and launch checklist (`[NAAM]` and `[EMAIL]` placeholders to fill, recommend legal review).
- `docs/CHANGELOG.md` — Phase 24 entry prepended.

## Footer Verification

`components/layout/footer.tsx` already had correct links:
- `href="/privacy"` (label "Privacy") ✓
- `href="/voorwaarden"` (label "Gebruiksvoorwaarden") ✓

No footer changes needed.

## Decisions

- `max-w-3xl mx-auto` for legal pages (narrower than blog's `max-w-5xl` — more readable for legal text)
- `[NAAM]` and `[EMAIL]` placeholders left in place — must be filled before launch
- Cookie section has `id="cookies"` anchor for direct linking from cookie banner
- Used `<a href="/voorwaarden">` (not Next.js Link) inside the privacy page to avoid adding an import — consistent with Tailwind styling pattern

## Must-Haves Verified

- [x] Visitor can navigate to /privacy and read the Dutch privacy policy
- [x] Visitor can navigate to /voorwaarden and read the Dutch terms of use
- [x] Footer on every page contains working links to /privacy and /voorwaarden (confirmed pre-existing)
- [x] Both pages have SEO metadata (title + description)
- [x] Both pages show breadcrumbs
- [x] docs/legal.md documents where legal pages live
- [x] CHANGELOG.md updated with legal phase entry
