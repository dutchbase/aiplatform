import Link from 'next/link'

const links = [
  { href: '/openclaw', label: 'Overzicht' },
  { href: '/openclaw/installatie', label: 'Installatie' },
  { href: '/openclaw/tutorials', label: 'Tutorials' },
  { href: '/openclaw/use-cases', label: 'Use Cases' },
  { href: '/openclaw/nieuws', label: 'Nieuws' },
] as const

interface OpenClawNavProps {
  currentPath: string
}

export function OpenClawNav({ currentPath }: OpenClawNavProps) {
  return (
    <nav className="flex space-x-6 border-b border-border mb-8">
      {links.map(({ href, label }) => {
        const isActive = currentPath === href
        return (
          <Link
            key={href}
            href={href}
            className={
              isActive
                ? 'py-2 border-b-2 border-primary text-foreground font-semibold -mb-px'
                : 'py-2 text-muted-foreground hover:text-foreground transition-colors'
            }
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
