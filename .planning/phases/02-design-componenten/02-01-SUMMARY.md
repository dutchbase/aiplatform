---
phase: 02-design-componenten
plan: 01
subsystem: ui
tags: [shadcn, tailwind, design-tokens, next-font, inter, layout]

# Dependency graph
requires:
  - phase: 01-nextjs-app-basis
    provides: Next.js app with metadata structure
provides:
  - HSL-based design token system (light + dark mode CSS variables)
  - Tailwind config with semantic color tokens
  - cn() utility function for class merging
  - Inter font loaded via next/font/google
  - Site-wide Header and Footer components
  - Flex-column layout structure for sticky footer
affects: [all future UI components, Phase 3+ feature development]

# Tech tracking
tech-stack:
  added: [class-variance-authority, clsx, tailwind-merge, tailwindcss-animate, lucide-react, @radix-ui/react-slot, Inter font]
  patterns: [HSL design tokens, semantic Tailwind classes, Server Components for layout, flex-column sticky footer]

key-files:
  created: [lib/utils.ts, components/layout/header.tsx, components/layout/footer.tsx]
  modified: [app/globals.css, tailwind.config.ts, app/layout.tsx, package.json]

key-decisions:
  - "Use darkMode: 'media' (system preference) instead of ['class'] - no script needed, auto responds to OS setting"
  - "HSL color format for design tokens - easier to adjust lightness/saturation than RGB"
  - "Inter font family for better Dutch character support and modern appearance"
  - "Server Components for Header/Footer - no interactivity needed, better performance"

patterns-established:
  - "Design tokens: All colors use semantic tokens (bg-background, text-foreground) never raw Tailwind classes (bg-blue-600)"
  - "Layout structure: Root layout wraps children in flex-column with Header/main/Footer for sticky footer behavior"
  - "Component organization: Layout components in components/layout/, utilities in lib/"
  - "Navigation: next/link for all internal links, future routes defined upfront (/openclaw, /blog, /qa)"

# Metrics
duration: 4min
completed: 2026-02-09
---

# Phase 2 Plan 1: Design Foundation Summary

**HSL design token system with Inter font, semantic Tailwind colors, and site-wide Header/Footer Server Components using sticky layout structure**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-09T16:28:32Z
- **Completed:** 2026-02-09T16:32:37Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Complete design token system with HSL CSS variables for light and dark modes
- Tailwind config extended with semantic color tokens and container setup
- Inter font loaded via next/font/google with CSS variable integration
- Site-wide Header with sticky positioning, brand name, and 4 navigation links
- Site-wide Footer with dynamic copyright year and legal placeholder links
- Flex-column layout structure ensuring footer stays at viewport bottom

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies, design tokens, Tailwind config, cn() utility, and Inter font** - `74cf943` (feat)
2. **Task 2: Create Header, Footer, and integrate into root layout** - `b5248ed` (feat)

## Files Created/Modified
- `app/globals.css` - Replaced RGB variables with HSL design tokens, light + dark mode support
- `tailwind.config.ts` - Extended with semantic colors, container config, Inter font family
- `lib/utils.ts` - Created cn() utility for Tailwind class merging
- `app/layout.tsx` - Added Inter font setup, imported Header/Footer, flex-column wrapper structure
- `components/layout/header.tsx` - Sticky header with site name and 4 navigation links
- `components/layout/footer.tsx` - Footer with copyright (dynamic year) and legal links
- `package.json` - Added shadcn/ui dependencies (class-variance-authority, clsx, tailwind-merge, tailwindcss-animate, lucide-react, @radix-ui/react-slot)

## Decisions Made

**1. Dark mode strategy: darkMode: 'media' instead of ['class']**
- Rationale: System preference approach requires no script, no next-themes library, and automatically responds to OS setting. Simpler for MVP. Class-based toggle can be added later if users request manual control.

**2. HSL color format for design tokens**
- Rationale: HSL (Hue, Saturation, Lightness) format makes it easier to create color variants by adjusting lightness/saturation values. More maintainable than RGB for theming.

**3. Inter font family**
- Rationale: Better support for Dutch characters, modern appearance, excellent readability. next/font/google provides automatic optimization with font-display: swap.

**4. Server Components for Header/Footer**
- Rationale: No interactivity needed for layout components. Server Components provide better performance (no client-side JS), simpler code, and align with Next.js App Router best practices.

**5. Navigation links defined upfront**
- Rationale: Even though /openclaw, /blog, /qa routes don't exist yet, defining them now in NAV_ITEMS array establishes the information architecture. Links will 404 for now but correct URLs from PRD section 3.1.

## Deviations from Plan

None - plan executed exactly as written. All dependencies installed manually (not via `npx shadcn init`) as instructed to avoid Tailwind v4 artifacts.

## Issues Encountered

None - build passed clean on first attempt for both tasks.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Design foundation complete and ready for component library
- Phase 2 Plan 2 can now add shadcn/ui components (Button, Card, etc.) on top of this token system
- All future UI components will use semantic token classes (bg-background, text-foreground) ensuring consistent theming
- Header/Footer visible on every page, establishing site structure for all future routes

**Blockers:** None

**Concerns:** None - system working as expected with automatic dark mode support

---
*Phase: 02-design-componenten*
*Completed: 2026-02-09*
