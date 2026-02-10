import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OpenClawNav } from '@/components/openclaw/openclaw-nav'
import { tutorials } from '@/lib/data/tutorials'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  title: 'OpenClaw Tutorials – Leer OpenClaw Gebruiken | AI Assistenten Hub',
  description:
    'Ontdek onze OpenClaw tutorials: van eerste stappen tot geavanceerde tips. Leer efficiënt werken met je AI-assistent.',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function OpenClawTutorialsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs items={[
          { label: 'OpenClaw', href: '/openclaw' },
          { label: 'Tutorials' },
        ]} />
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">OpenClaw Tutorials</h1>
          <OpenClawNav currentPath="/openclaw/tutorials" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            Leer OpenClaw gebruiken met onze praktische tutorials. Van installatie tot
            geavanceerde technieken, alles wat je nodig hebt om productief te worden
            met je AI-assistent.
          </p>
        </div>

        {/* Tutorials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <article
              key={tutorial.slug}
              className="flex flex-col border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors"
            >
              <div className="flex-1 mb-4">
                <h2 className="text-xl font-semibold mb-2">{tutorial.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {tutorial.description}
                </p>
                <span className="text-xs text-muted-foreground">
                  Laatst bijgewerkt: {formatDate(tutorial.lastUpdated)}
                </span>
              </div>
              <Button asChild>
                <Link href={`/openclaw/tutorials/${tutorial.slug}`}>
                  Lees tutorial
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
