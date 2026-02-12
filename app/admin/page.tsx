import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Admin Dashboard | AI Assistenten Hub',
  description: 'Beheerpaneel voor administrators.',
}

export default function AdminPage() {
  return (
    <main className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Beheer gebruikers, modereer content en bekijk statistieken.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gebruikers */}
          <div className="border border-border rounded-lg p-6 hover:bg-accent/50 transition-colors">
            <div className="mb-4">
              <span className="text-3xl" role="img" aria-label="Gebruikers">👥</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Gebruikers</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Beheer gebruikersrollen en accounts
            </p>
            <Button asChild>
              <Link href="/admin/gebruikers">Beheer gebruikers</Link>
            </Button>
          </div>

          {/* Moderatie */}
          <div className="border border-border rounded-lg p-6 hover:bg-accent/50 transition-colors">
            <div className="mb-4">
              <span className="text-3xl" role="img" aria-label="Moderatie">🛡️</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Moderatie</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Bekijk en behandel gemelde content
            </p>
            <Button asChild variant="secondary">
              <Link href="/moderatie">Naar moderatiewachtrij</Link>
            </Button>
          </div>

          {/* Inhoudsbeheer (Phase 27) */}
          <div className="border border-border rounded-lg p-6 hover:bg-accent/50 transition-colors">
            <div className="mb-4">
              <span className="text-3xl" role="img" aria-label="Inhoud">📝</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Inhoudsbeheer</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Bekijk en verwijder Q&A-vragen en antwoorden
            </p>
            <Button asChild variant="secondary">
              <Link href="/admin/content">Beheer inhoud</Link>
            </Button>
          </div>

          {/* Statistieken */}
          <div className="border border-border rounded-lg p-6 hover:bg-accent/50 transition-colors">
            <div className="mb-4">
              <span className="text-3xl" role="img" aria-label="Statistieken">📊</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Statistieken</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Platform KPI&apos;s en groeidata
            </p>
            <Button asChild variant="secondary">
              <Link href="/admin/statistieken">Bekijk statistieken</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
