import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Nederlandse AI Assistenten Hub
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          Jouw centrale platform voor Nederlandse AI-assistenten, beginnend met
          OpenClaw
        </p>
        <p className="text-base text-muted-foreground mb-8">
          Ontdek tutorials, stel vragen, en leer hoe je AI-assistenten effectief
          inzet.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg">
            <Link href="/openclaw">Ontdek OpenClaw</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/openclaw/tutorials">Bekijk tutorials</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Fase 2: Design & componenten voltooid
        </p>
      </div>
    </div>
  )
}
