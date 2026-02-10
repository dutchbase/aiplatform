import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OpenClawNav } from '@/components/openclaw/openclaw-nav'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  title: 'OpenClaw Installatie – Stap voor Stap | AI Assistenten Hub',
  description:
    'Installeer OpenClaw in enkele stappen: vereisten, installatie, configuratie en verificatie. Complete Nederlandse handleiding.',
}

export default function OpenClawInstallatiePage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <Breadcrumbs items={[
          { label: 'OpenClaw', href: '/openclaw' },
          { label: 'Installatie' },
        ]} />
        {/* Page header */}
        <div>
          <h1 className="text-4xl font-bold mb-4">OpenClaw Installatie</h1>
          <OpenClawNav currentPath="/openclaw/installatie" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            In deze handleiding installeer en configureer je OpenClaw op je eigen systeem.
            Plan ongeveer 15 minuten voor de volledige setup. Je hebt een werkende
            ontwikkelomgeving nodig met de vereisten die hieronder staan beschreven.
          </p>
        </div>

        {/* Section 1: Vereisten */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Vereisten</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Node.js 18 of hoger</li>
            <li>npm of yarn package manager</li>
            <li>Git voor installatie via repository</li>
          </ul>
          <p className="text-sm text-muted-foreground border border-border rounded-md p-3 bg-accent/30">
            Deze sectie wordt verder uitgebreid in een latere fase.
          </p>
        </section>

        {/* Section 2: Installatie */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Installatie</h2>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground mb-4">
            <li>Download OpenClaw via npm of git clone</li>
            <li>Installeer dependencies</li>
            <li>Configureer je API keys (indien nodig)</li>
          </ol>
          <p className="text-sm text-muted-foreground border border-border rounded-md p-3 bg-accent/30">
            Gedetailleerde commando&apos;s en uitleg volgen in Phase 19.
          </p>
        </section>

        {/* Section 3: Verificatie */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Controleren of het werkt</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Na installatie kun je controleren of OpenClaw correct werkt door de
            volgende stappen te volgen:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Test commando uitvoeren</li>
            <li>Eerste vraag stellen</li>
          </ul>
          <p className="text-sm text-muted-foreground border border-border rounded-md p-3 bg-accent/30">
            Voorbeelden en screenshots volgen later.
          </p>
        </section>

        {/* Next steps CTA */}
        <section>
          <p className="text-muted-foreground mb-4">
            OpenClaw succesvol geïnstalleerd? Ga verder met onze tutorials om te
            leren hoe je de assistent optimaal inzet voor je development workflow.
          </p>
          <Button asChild>
            <Link href="/openclaw/tutorials">Bekijk Tutorials</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
