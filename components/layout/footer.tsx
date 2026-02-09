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
