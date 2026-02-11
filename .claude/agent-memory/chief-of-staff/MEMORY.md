# Chief of Staff - Agent Memory

## Governance Patterns

### CEO Decision-Making Preferences
- Prefers clear authorization signals ("PROCEED", "APPROVED")
- Values structured check-ins with clear options
- Expects full accountability on phase completion requirements
- Wants technical decisions within approved stack to be autonomous

### Effective Check-In Format
- Context-first approach works well
- Present options with clear trade-offs
- Don't ask for permission on trivial technical choices within scope
- Escalate architectural/strategic decisions only

## Project Execution Learnings

### Nederlandse AI Assistenten Hub (Phase 0)
**Date:** 2026-02-09

**Key Decisions Recorded:**
- Tech stack: Next.js 14+ (App Router), Supabase, TypeScript strict mode, Tailwind CSS
- 25-phase development approach approved
- Dutch-only focus (no English version in MVP)

**Technical Issues Resolved:**
1. **Next.js config format:** Next.js 14.2.16 doesn't support `.ts` config files - use `.mjs` format
2. **Supabase dependency conflict:** @supabase/ssr 0.5.2 requires supabase-js 2.43.4+, used 2.46.1 for compatibility
3. **create-next-app limitation:** Cannot run in existing directory with files - manual setup required

**Process Patterns:**
- Always test `npm install` and `npm run dev` before committing
- Lock all production dependency versions (no wildcards)
- Document architecture in both CHANGELOG.md and project-structure.md
- Governance files (.cos/) should be established before major work begins

**Commit Format That Worked:**
```
chore(phase-N): brief title

Fase N: Full phase name

- Bullet points of major changes
- Test verification notes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Common Assumption Categories

### Strategic (Always Escalate)
- Major architectural choices not in PRD
- Scope changes or feature additions
- Deviation from approved tech stack
- Timeline or resource allocation changes

### Tactical (Can Decide Within Scope)
- Dependency version selection (within approved packages)
- File naming and structure (following conventions)
- Configuration details (ESLint, TypeScript, etc.)
- Documentation format and structure

## Links to Detailed Notes

*No additional topic files yet - expand as patterns emerge*

## Next Phase Considerations

**Phase 1 Preview:** Next.js App Basis
- Will involve layout components, navigation, footer
- May need design decisions on styling approach
- Should check if Tailwind component library is needed (shadcn/ui?)
- Consider if this is strategic (CEO approval) or tactical (within approved stack)

