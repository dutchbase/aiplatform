import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { OpenClawNav } from '@/components/openclaw/openclaw-nav'

export const metadata: Metadata = {
  title: 'OpenClaw – AI Assistent voor Developers | AI Assistenten Hub',
  description:
    'Ontdek OpenClaw: de krachtige AI-assistent die je helpt met coderen, debugging en ontwikkeling. Installatie, tutorials en use cases.',
}

export default function OpenClawPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            OpenClaw – Je AI-Assistent voor Development
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            OpenClaw is een krachtige AI-assistent die speciaal is ontworpen voor
            developers. Of je nu bezig bent met coderen, debugging of het verbeteren van
            je productiviteit – OpenClaw helpt je sneller en efficiënter te werken.
            De assistent begrijpt je code, stelt relevante vragen en geeft concrete
            oplossingen die je direct kunt toepassen in je projecten.
          </p>
        </div>

        <OpenClawNav currentPath="/openclaw" />

        {/* Navigation grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Installatie */}
          <div className="border border-border rounded-lg p-6 hover:bg-accent/50 transition-colors">
            <div className="mb-4">
              <span className="text-3xl" role="img" aria-label="Pakket">📦</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Installatie</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Stap-voor-stap installatie en configuratie
            </p>
            <Button asChild>
              <Link href="/openclaw/installatie">Ga naar Installatie</Link>
            </Button>
          </div>

          {/* Tutorials */}
          <div className="border border-border rounded-lg p-6 hover:bg-accent/50 transition-colors">
            <div className="mb-4">
              <span className="text-3xl" role="img" aria-label="Boeken">📚</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Tutorials</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Leer OpenClaw gebruiken met praktische voorbeelden
            </p>
            <Button asChild>
              <Link href="/openclaw/tutorials">Bekijk Tutorials</Link>
            </Button>
          </div>

          {/* Use Cases */}
          <div className="border border-border rounded-lg p-6 hover:bg-accent/50 transition-colors">
            <div className="mb-4">
              <span className="text-3xl" role="img" aria-label="Lamp">💡</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Use Cases</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Ontdek wat je allemaal kunt doen met OpenClaw
            </p>
            <Button asChild variant="secondary">
              <Link href="/openclaw/use-cases">Bekijk Use Cases</Link>
            </Button>
          </div>

          {/* Nieuws */}
          <div className="border border-border rounded-lg p-6 hover:bg-accent/50 transition-colors">
            <div className="mb-4">
              <span className="text-3xl" role="img" aria-label="Krant">📰</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Nieuws</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Updates en nieuwe features
            </p>
            <Button asChild variant="secondary">
              <Link href="/openclaw/nieuws">Lees het Nieuws</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
