# Phase 2: Design & Componenten - Research

**Researched:** 2026-02-09
**Domain:** Tailwind CSS 3.4 design tokens, shadcn/ui component library, next/font typography, Next.js App Router layout patterns
**Confidence:** HIGH

## Summary

This research covers the technical foundation for establishing a design system in the existing Next.js 14.2 + Tailwind CSS 3.4 project. The phase requires design tokens (colors, typography, spacing), a site-wide Header and Footer integrated into the root layout, and reusable base UI components (Button, Link).

The project currently has a bare `globals.css` with default Next.js CSS variables (RGB-based), a default `tailwind.config.ts` with no custom theme extensions, and a root layout (`app/layout.tsx`) that only renders `{children}` in a `<body>`. No font is loaded via `next/font`, and no components exist in `components/`.

**Key findings:**
- shadcn/ui (v2.3.0 CLI for Tailwind v3) is the standard approach for reusable UI components in this stack. It copies components into `components/ui/`, uses CSS variables for theming, and aligns with the project's cursor rules which already reference `@/components/ui/button`.
- Design tokens should be HSL-based CSS custom properties in `globals.css` (shadcn/ui convention for Tailwind v3), referenced in `tailwind.config.ts` via `hsl(var(--variable))` pattern.
- `next/font/google` with the Inter font (variable font, no weight specification needed) provides zero-layout-shift typography, self-hosted from the project's domain.
- Header and Footer are Server Components (no interactivity needed yet) placed in `components/layout/` and integrated into `app/layout.tsx`.

**Primary recommendation:** Use shadcn/ui (v2.3.0 for Tailwind v3) to initialize the project's design token system and component library. This provides battle-tested CSS variables, accessible Button component, and the `cn()` utility -- all matching the patterns already referenced in the project's cursor rules.

---

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 3.4.17 | Utility-first CSS framework | Already installed; drives all styling |
| next | 14.2.16 | Framework with App Router | Already installed; provides layout system, `next/font` |
| react | 18.3.1 | UI library | Already installed |
| typescript | 5.7.2 | Type safety | Already installed; strict mode |

### New Dependencies for This Phase
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|-------------|
| class-variance-authority | latest | Type-safe component variants (cva) | shadcn/ui dependency; enables Button variants like `variant="destructive"` |
| clsx | latest | Conditional class name joining | shadcn/ui dependency; used in `cn()` utility |
| tailwind-merge | latest | Merge Tailwind classes without conflicts | shadcn/ui dependency; prevents `bg-red-500 bg-blue-500` conflicts |
| tailwindcss-animate | latest | Animation utilities for Tailwind v3 | shadcn/ui dependency for Tailwind v3 (note: tw-animate-css is for v4) |
| lucide-react | latest | Icon library | shadcn/ui default icon set; used in components |
| next/font/google (built-in) | N/A | Self-hosted Google Fonts | Built into Next.js; zero-layout-shift, no external requests |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| shadcn/ui | Hand-rolled components | shadcn/ui gives accessible, tested components with consistent API; hand-rolling duplicates effort |
| shadcn/ui | Radix UI directly | shadcn/ui wraps Radix with Tailwind styling; using Radix directly means more manual styling work |
| shadcn/ui | Material UI / Chakra UI | Heavy runtime dependencies; don't align with Server Components or Tailwind-first approach |
| Inter font | System fonts only | Inter provides consistent cross-platform look; system fonts vary by OS |
| HSL CSS variables | RGB CSS variables | HSL is shadcn/ui convention for Tailwind v3; current RGB variables are Next.js defaults that should be replaced |

### Installation

```bash
# Initialize shadcn/ui for Tailwind v3 (use v2.3.0 CLI)
npx shadcn@2.3.0 init

# When prompted:
# - Style: New York
# - Base color: Slate (neutral, professional)
# - CSS variables: Yes
# - React Server Components: Yes
# - Path alias: @/*

# Add Button component
npx shadcn@2.3.0 add button

# If manual installation preferred:
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate lucide-react
```

---

## Architecture Patterns

### Recommended Project Structure
```
app/
  globals.css              # Design tokens (CSS variables) + Tailwind directives
  layout.tsx               # Root layout with Header, Footer, font
  page.tsx                 # Homepage (updated to use new components)
components/
  layout/
    header.tsx             # Site header (Server Component)
    footer.tsx             # Site footer (Server Component)
    nav-link.tsx           # Navigation link component (can be Server Component)
  ui/
    button.tsx             # Button component (from shadcn/ui)
lib/
  utils.ts                # cn() utility function
```

### Pattern 1: Design Tokens via CSS Custom Properties (Tailwind v3 + shadcn/ui)
**What:** Define all design tokens as HSL CSS custom properties in `globals.css`, reference them in `tailwind.config.ts`
**When to use:** Always -- this is the single source of truth for the entire design system
**Example:**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

```typescript
// tailwind.config.ts - Extended with CSS variable references
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### Pattern 2: Font Setup with next/font and Tailwind Integration
**What:** Self-host Inter font via `next/font/google`, expose as CSS variable, integrate with Tailwind
**When to use:** Root layout -- applied globally once
**Example:**

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

```typescript
// In tailwind.config.ts, add to theme.extend:
fontFamily: {
  sans: ['var(--font-inter)', ...require('tailwindcss/defaultTheme').fontFamily.sans],
},
```

### Pattern 3: Header as Server Component
**What:** Static header with site name and navigation links as a Server Component
**When to use:** Site-wide layout; no interactivity needed (mobile menu deferred)
**Example:**

```typescript
// components/layout/header.tsx
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/openclaw', label: 'OpenClaw' },
  { href: '/blog', label: 'Blog' },
  { href: '/qa', label: 'Q&A' },
] as const

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">AI Assistenten Hub</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
```

### Pattern 4: Footer as Server Component
**What:** Static footer with copyright and placeholder links
**When to use:** Site-wide layout
**Example:**

```typescript
// components/layout/footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} AI Assistenten Hub. Alle rechten voorbehouden.
          </p>
        </div>
        <nav className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/voorwaarden" className="hover:text-foreground transition-colors">
            Gebruiksvoorwaarden
          </Link>
        </nav>
      </div>
    </footer>
  )
}
```

### Pattern 5: Root Layout Integration
**What:** Compose Header, main content area, and Footer in root layout
**When to use:** Root layout wraps all pages
**Example:**

```typescript
// app/layout.tsx
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

### Pattern 6: cn() Utility Function
**What:** Merge Tailwind CSS classes with conflict resolution
**When to use:** Every component that accepts custom className props
**Example:**

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Anti-Patterns to Avoid
- **Don't use RGB CSS variables for design tokens** -- The current `globals.css` uses `--foreground-rgb: 0, 0, 0` (RGB). Replace entirely with HSL-based variables (shadcn/ui convention). RGB doesn't work with Tailwind's opacity modifier syntax as cleanly.
- **Don't put `'use client'` on Header/Footer** -- They have no interactivity; keep them as Server Components. Mobile hamburger menu (future) should be a separate Client Component composed inside the Header.
- **Don't define colors as Tailwind utility classes inline** -- Use semantic tokens (`bg-primary`, `text-muted-foreground`) not raw colors (`bg-blue-600`). This enables theme changes in one place.
- **Don't skip the `container` class** -- Wrap content sections in Tailwind's `container` for consistent max-width and centering.
- **Don't create a custom Button from scratch** -- shadcn/ui Button provides accessible, variant-based, type-safe styling out of the box.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Button with variants | Custom button with manual variant classes | shadcn/ui Button (class-variance-authority) | Type-safe variants, accessible focus states, forwardRef, asChild pattern for composition |
| Class name merging | Manual string concatenation | `cn()` utility (clsx + tailwind-merge) | Handles conditional classes and Tailwind conflict resolution automatically |
| Design token system | Custom CSS variables without Tailwind integration | shadcn/ui CSS variable pattern with `hsl(var(--name))` | Proven pattern, works with Tailwind opacity modifiers, dark mode out of the box |
| Icon system | Custom SVG components | lucide-react | 1000+ consistent icons, tree-shakeable, works with shadcn/ui components |
| Font loading | Manual `@font-face` or `<link>` tags | next/font/google | Zero layout shift, self-hosted, build-time optimization |
| Dark mode toggle mechanism | Manual localStorage + class toggling | `prefers-color-scheme` media query (for now) | System preference is simplest; manual toggle deferred (decision 01-01-D2) |

**Key insight:** shadcn/ui is not a traditional component library -- it copies component source code into your project. You own and can customize every line. This gives the benefits of a library (tested, accessible, consistent) without lock-in.

---

## Common Pitfalls

### Pitfall 1: Using shadcn/ui Latest CLI with Tailwind v3
**What goes wrong:** Running `npx shadcn@latest init` on a Tailwind v3 project generates Tailwind v4 configuration (using `@theme inline` directive, OKLCH colors, `tw-animate-css` instead of `tailwindcss-animate`), causing build failures.
**Why it happens:** shadcn/ui CLI defaults to Tailwind v4 as of early 2025.
**How to avoid:** Use `npx shadcn@2.3.0 init` for Tailwind v3 projects. This generates HSL-based CSS variables and the correct `tailwind.config.ts` format.
**Warning signs:** Build errors mentioning `@theme`, unknown CSS function `oklch()`, or missing `tw-animate-css` package.

### Pitfall 2: Forgetting darkMode Configuration in Tailwind
**What goes wrong:** Dark mode CSS variables defined in `.dark` class don't take effect. The `dark:` Tailwind variants don't work.
**Why it happens:** Tailwind v3 defaults to `media` strategy for dark mode. shadcn/ui requires `class` strategy because it uses `.dark` class on the HTML element.
**How to avoid:** Set `darkMode: ['class']` in `tailwind.config.ts`. For system-preference-only (our case), the `.dark` class still needs to be applied by either a script or future `next-themes` integration.
**Warning signs:** Light mode looks correct but dark mode styling is wrong or missing entirely.

### Pitfall 3: CSS Variable Opacity Modifier Incompatibility
**What goes wrong:** Using `bg-primary/50` (50% opacity) doesn't work -- the color disappears or renders incorrectly.
**Why it happens:** HSL values must be stored WITHOUT the `hsl()` wrapper (e.g., `--primary: 222.2 47.4% 11.2%` not `--primary: hsl(222.2, 47.4%, 11.2%)`). The Tailwind config wraps them: `hsl(var(--primary))`. This enables Tailwind to inject opacity.
**How to avoid:** Follow the exact shadcn/ui convention: bare HSL values in CSS, `hsl(var(--name))` in Tailwind config.
**Warning signs:** Colors work but opacity modifiers (`/50`, `/80`) produce broken colors.

### Pitfall 4: Header/Footer Breaking Page Content Height
**What goes wrong:** Content doesn't fill viewport; footer floats in the middle of the page on short content.
**Why it happens:** Missing flex layout structure in root layout.
**How to avoid:** Use the flex-column pattern: outer container with `min-h-screen flex flex-col`, main content with `flex-1`. This pushes the footer to the bottom.
**Warning signs:** Footer not at bottom on pages with little content.

### Pitfall 5: next/font Not Applied Globally
**What goes wrong:** Font loads but doesn't appear -- text uses browser defaults.
**Why it happens:** Font CSS variable defined but not connected to Tailwind's `fontFamily.sans`, or `className` not applied to the right element.
**How to avoid:** Use the CSS variable approach (`variable: '--font-inter'`), apply the variable class to `<html>`, and configure Tailwind's `fontFamily.sans` to reference it. Also add `font-sans` to body's className.
**Warning signs:** Network tab shows font loading, but text visually unchanged.

### Pitfall 6: Container Class Missing or Misconfigured
**What goes wrong:** Content stretches to full viewport width, looking especially bad on large monitors.
**Why it happens:** Tailwind's `container` class is not centered by default in v3 and has no padding.
**How to avoid:** Configure container in `tailwind.config.ts`:
```typescript
theme: {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px',
    },
  },
}
```
**Warning signs:** Content hugs left edge or stretches beyond readable width.

---

## Code Examples

### Complete globals.css with Design Tokens
```css
/* Source: shadcn/ui v3 theming convention */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Complete tailwind.config.ts
```typescript
/* Source: shadcn/ui v3 Tailwind configuration */
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### cn() Utility
```typescript
// Source: shadcn/ui manual installation guide
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Button Component (shadcn/ui pattern)
```typescript
// Source: shadcn/ui Button component for Tailwind v3
// components/ui/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

**Note:** The shadcn/ui Button requires `@radix-ui/react-slot` as a peer dependency. This is installed automatically when using `npx shadcn@2.3.0 add button`.

### Root Layout with All Integrations
```typescript
// app/layout.tsx - Complete pattern
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  // ... existing metadata from Phase 1
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| RGB CSS variables (`--color-rgb: 0, 0, 0`) | HSL CSS variables (`--color: 0 0% 0%`) | shadcn/ui convention, Tailwind v3+ | HSL works with Tailwind opacity modifiers; more intuitive to read |
| Hardcoded Tailwind color classes (`bg-blue-600`) | Semantic CSS variable tokens (`bg-primary`) | shadcn/ui pattern | Theme changes in one place; dark mode automatic |
| Google Fonts via `<link>` tag | `next/font/google` self-hosted | Next.js 13+ | Zero layout shift, no external requests, better performance |
| Custom component libraries | shadcn/ui (copy-paste components) | 2023+ | Full ownership, no version lock-in, accessible by default |
| Manual `@font-face` declarations | `next/font` with CSS variable | Next.js 13+ | Build-time optimization, automatic subsetting |
| `tailwindcss-animate` | `tw-animate-css` | shadcn/ui + Tailwind v4 | Only for Tailwind v4; v3 projects still use `tailwindcss-animate` |

**Deprecated/outdated:**
- `@next/font` package -- use `next/font` directly (removed in Next.js 14)
- The `default` style in shadcn/ui -- deprecated in favor of `new-york` style
- RGB-based CSS variables in globals.css -- replace with HSL-based design tokens

---

## Dark Mode Strategy

The project uses system-preference-only dark mode (decision 01-01-D2). Implementation approach:

1. **CSS variables:** Define `.dark` class overrides in `globals.css` (ready for future toggle)
2. **Tailwind config:** Set `darkMode: ['class']` (required by shadcn/ui pattern)
3. **System preference detection:** Add a small inline script in the `<head>` or use `@media (prefers-color-scheme: dark)` to add `.dark` class to `<html>` based on system preference
4. **Future toggle:** When Phase 5+ adds manual dark mode toggle, install `next-themes` and wrap layout in `<ThemeProvider>`. The CSS variables and `.dark` class infrastructure will already be in place.

**Critical detail for system preference without next-themes:** Since `darkMode: ['class']` requires the `.dark` class on `<html>`, and we're not using `next-themes` yet, we need a small script to apply `.dark` based on `prefers-color-scheme`. This can be done with a `<script>` in the `<head>` to avoid flash of unstyled content (FOUC), or we can temporarily use `darkMode: 'media'` in Tailwind config which uses `@media (prefers-color-scheme: dark)` directly without needing the `.dark` class.

**Recommendation:** Use `darkMode: 'media'` for now (simpler, no script needed, matches system preference automatically). Switch to `darkMode: ['class']` when `next-themes` is added in a future phase. This means `.dark` CSS class overrides in globals.css won't be active yet, but they're ready for future use.

---

## Open Questions

1. **shadcn/ui CLI version for Tailwind v3**
   - What we know: Documentation says "use `shadcn@2.3.0`" for Tailwind v3 projects
   - What's unclear: Whether the CLI auto-detects Tailwind v3 and generates correct config, or if manual adjustments are needed
   - Recommendation: Run the CLI with `@2.3.0` version pin. If it generates v4 artifacts, fall back to manual installation (all code patterns documented above)

2. **Container configuration**
   - What we know: shadcn/ui conventionally uses `container` with `center: true`, `padding: '2rem'`, `screens: { '2xl': '1400px' }`
   - What's unclear: Whether `1400px` max-width is appropriate for this content-focused site (SEO content benefits from readable line lengths)
   - Recommendation: Use `1400px` as max container width (standard for content sites; narrower `max-w-prose` can be used within for long-form text)

3. **Dark mode approach (media vs class)**
   - What we know: shadcn/ui defaults to `darkMode: ['class']` which requires `.dark` class on HTML element. System preference requires either a script or `darkMode: 'media'`.
   - What's unclear: Whether to use `media` strategy now and switch later, or set up the class-based approach with an inline script from the start
   - Recommendation: Use `darkMode: 'media'` for simplicity now. The `.dark` CSS variables in globals.css are still useful documentation of the dark palette; they become active when `next-themes` is added later.

---

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v3 - Customizing Colors](https://v3.tailwindcss.com/docs/customizing-colors) -- CSS variable pattern with HSL
- [Tailwind CSS v3 - Font Family](https://v3.tailwindcss.com/docs/font-family) -- Custom font configuration
- [Next.js 14 - Font Optimization](https://nextjs.org/docs/14/app/building-your-application/optimizing/fonts) -- next/font setup patterns
- [Next.js - Getting Started: Fonts](https://nextjs.org/docs/app/getting-started/fonts) -- CSS variable font approach
- [shadcn/ui Legacy Docs (v3)](https://v3.shadcn.com/) -- Tailwind v3 compatible installation
- [shadcn/ui - Manual Installation](https://ui.shadcn.com/docs/installation/manual) -- Dependencies and cn() utility
- [shadcn/ui - Theming](https://ui.shadcn.com/docs/theming) -- CSS variable convention and color tokens
- [shadcn/ui - components.json](https://ui.shadcn.com/docs/components-json) -- Configuration structure

### Secondary (MEDIUM confidence)
- [shadcnblocks.com - Tailwind v3 to v4 Migration](https://www.shadcnblocks.com/blog/tailwind4-shadcn-themeing/) -- HSL values for v3 dark/light themes verified
- [shadcn/ui - Tailwind v4 Migration Guide](https://ui.shadcn.com/docs/tailwind-v4) -- Confirmed v3 backward compatibility
- [class-variance-authority docs](https://cva.style/docs) -- CVA pattern for component variants

### Tertiary (LOW confidence)
- WebSearch results for best practices and ecosystem patterns (cross-referenced with official sources above)

---

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** -- shadcn/ui is the established standard for Next.js + Tailwind projects; verified via official docs
- Architecture (design tokens): **HIGH** -- HSL CSS variable pattern documented in official shadcn/ui and Tailwind v3 docs
- Architecture (layout): **HIGH** -- Header/Footer in root layout is standard Next.js App Router pattern
- Typography (next/font): **HIGH** -- Verified via official Next.js documentation
- Pitfalls: **HIGH** -- Tailwind v3/v4 CLI incompatibility verified via official shadcn/ui migration docs
- Dark mode strategy: **MEDIUM** -- `media` vs `class` tradeoff is a judgment call; both approaches are well-documented

**Research date:** 2026-02-09
**Valid until:** 60 days (Tailwind v3 is stable; shadcn/ui v3 compatibility is maintained as legacy)
