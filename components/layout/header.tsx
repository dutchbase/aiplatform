import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/openclaw', label: 'OpenClaw' },
  { href: '/blog', label: 'Blog' },
  { href: '/qa', label: 'Q&A' },
] as const

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href="/profiel"
                className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors"
              >
                Mijn profiel
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors"
                >
                  Uitloggen
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors"
              >
                Inloggen
              </Link>
              <Link
                href="/login"
                className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors"
              >
                Registreren
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
