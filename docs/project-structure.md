# Projectstructuur

**Versie:** 1.0
**Laatst bijgewerkt:** 2026-02-09 (Fase 0)

---

## Overzicht

Dit document beschrijft de mappenstructuur en architectuur van de Nederlandse AI Assistenten Hub.

---

## Directorystructuur

```
aiassistentplatform/
├── .claude/                    # Claude Code agent configuratie
│   └── agent-memory/          # Persistent agent memory
├── .cos/                       # Chief of Staff governance
│   ├── ceo-decisions.md       # Strategische beslissingen log
│   └── cos-assumptions.md     # Assumptions tracking
├── .cursor/                    # Cursor IDE configuratie
│   ├── agents/                # Agent definities
│   ├── commands/              # Custom commands
│   ├── rules/                 # Architectuur regels
│   └── skills/                # Herbruikbare skills
├── app/                        # Next.js App Router (Fase 0)
│   ├── layout.tsx             # Root layout (NL locale)
│   ├── page.tsx               # Homepage
│   └── globals.css            # Globale styles (Tailwind)
├── components/                 # React componenten (Fase 2)
├── lib/                        # Utilities en helpers
├── public/                     # Statische assets
├── docs/                       # Projectdocumentatie
│   ├── CHANGELOG.md           # Release notes per fase
│   └── project-structure.md   # Dit document
├── roadmap/                    # Fase-specifieke roadmaps
│   ├── ROADMAP.md             # Volledige 25-fase roadmap
│   └── phase-*.md             # Individuele fase documenten
├── .env.example               # Environment variabelen template
├── .gitignore                 # Git ignore configuratie
├── package.json               # Dependencies en scripts
├── tsconfig.json              # TypeScript configuratie (strict mode)
├── next.config.mjs            # Next.js configuratie
├── tailwind.config.ts         # Tailwind CSS configuratie
├── postcss.config.mjs         # PostCSS configuratie
├── CLAUDE.md                  # Claude development guidance
├── prd.md                     # Product Requirements Document
└── README.md                  # Projectoverzicht en setup
```

---

## Kernmappen

### `/app` - Next.js App Router

De main applicatie directory. Volgt Next.js 14+ App Router conventies:

- **`layout.tsx`** - Root layout met HTML lang="nl" voor Nederlandse content
- **`page.tsx`** - Homepage route
- **`globals.css`** - Tailwind directives en globale styles

Toekomstige structuur (vanaf Fase 6):
```
app/
├── (marketing)/           # Marketing routes (home, about)
├── openclaw/             # OpenClaw sectie
│   ├── page.tsx
│   ├── installatie/
│   └── tutorials/
├── qa/                   # Q&A sectie
└── api/                  # API routes
```

### `/components` - React Componenten

Herbruikbare UI componenten (vanaf Fase 2). Geplande structuur:

```
components/
├── ui/                   # Basis UI componenten (buttons, cards, etc.)
├── layout/              # Layout componenten (header, footer, nav)
├── openclaw/            # OpenClaw-specifieke componenten
└── qa/                  # Q&A-specifieke componenten
```

### `/lib` - Utilities en Helpers

Herbruikbare business logic en utilities:

```
lib/
├── supabase/            # Supabase client configuratie (Fase 4)
├── utils/               # General utilities
└── types/               # TypeScript type definitions
```

### `/docs` - Documentatie

Technische en projectdocumentatie:

- **`CHANGELOG.md`** - Wijzigingslogboek per fase
- **`project-structure.md`** - Dit document
- Toekomstige docs: API specs, deployment guides, etc.

### `/roadmap` - Ontwikkelingsfases

Bevat de volledige roadmap en alle fase-specifieke documenten (phase-00 t/m phase-25).

---

## Technische Architectuur

### Tech Stack

| Laag | Technologie | Versie |
| ---- | ----------- | ------ |
| **Framework** | Next.js | 14.2.16 |
| **Runtime** | React | 18.3.1 |
| **Language** | TypeScript | 5.7.2 (strict mode) |
| **Styling** | Tailwind CSS | 3.4.17 |
| **Backend** | Supabase | 2.46.1 |
| **Auth/SSR** | @supabase/ssr | 0.5.2 |

### TypeScript Configuratie

- **Strict mode** enabled voor maximale type safety
- **Path mapping:** `@/*` wijst naar project root
- **JSX:** preserve (Next.js handled)

### Styling Aanpak

- **Tailwind CSS** voor utility-first styling
- **PostCSS** met autoprefixer
- **Dark mode** support via CSS variables

---

## Dependency Management

### Productie Dependencies

Alle productie dependencies hebben **locked versions** (geen wildcards):

```json
{
  "next": "14.2.16",
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "@supabase/supabase-js": "2.46.1",
  "@supabase/ssr": "0.5.2"
}
```

### Development Dependencies

Type definitions, build tools, en linters zijn ook locked voor consistentie.

---

## Environment Configuratie

### `.env.example`

Template met alle benodigde environment variabelen:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Lokale Development

1. Kopieer `.env.example` naar `.env.local`
2. Vul de variabelen in (Supabase setup in Fase 3)
3. Next.js laadt automatisch `.env.local` (niet in git)

---

## Conventies

### Naming Conventions

- **Files:** kebab-case voor directories en bestanden
- **Components:** PascalCase voor React componenten
- **Functions:** camelCase voor functies en variabelen
- **URLs:** kebab-case, Nederlandstalig waar logisch

### Code Style

- **ESLint:** next/core-web-vitals preset
- **TypeScript:** strict mode, explicit types waar mogelijk
- **Imports:** absolute paths via `@/*` alias

### Git Workflow

- **Commit messages:** Conventional Commits format
  - `chore(phase-N): beschrijving`
  - `feat(scope): nieuwe feature`
  - `fix(scope): bug fix`
- **Branches:** main/master voor stable releases
- **Fase completion:** commit + push na elke fase

---

## Toekomstige Uitbreidingen

### Fase 3-4: Supabase Integratie

```
lib/
└── supabase/
    ├── client.ts         # Browser client
    ├── server.ts         # Server client
    └── middleware.ts     # Auth middleware
```

### Fase 5-9: Features

- User sessions en profielen
- URL routing uitbreiding
- SEO meta tags
- OpenClaw content sectie

### Fase 10+: Content & Community

- Blog systeem
- Q&A platform
- RSS feeds
- Moderatie tools

---

## Referenties

- **PRD:** [prd.md](../prd.md)
- **Roadmap:** [roadmap/ROADMAP.md](../roadmap/ROADMAP.md)
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Tailwind Docs:** https://tailwindcss.com/docs

---

**Status:** Fase 0 voltooid
**Volgende fase:** Fase 1 - Next.js App Basis
