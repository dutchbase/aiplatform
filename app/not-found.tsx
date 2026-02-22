import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pagina niet gevonden | AI Assistenten Hub',
  description: 'De pagina die u zocht bestaat niet. Ga terug naar de homepage of verken onze secties.',
}

export default function NotFound() {
  return (
    <div className="container py-24">
      <div className="max-w-lg mx-auto text-center space-y-8">
        {/* Status code */}
        <p className="text-8xl font-bold text-muted-foreground/30 select-none">404</p>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Pagina niet gevonden</h1>
          <p className="text-muted-foreground leading-relaxed">
            De pagina die u probeert te bezoeken bestaat niet of is verplaatst.
            Gebruik de links hieronder om verder te gaan.
          </p>
        </div>

        {/* Primary CTA */}
        <Button asChild size="lg">
          <Link href="/">Terug naar home</Link>
        </Button>

        {/* Section links */}
        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground mb-4">Of bekijk een van onze secties:</p>
          <nav aria-label="Secties" className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/openclaw">OpenClaw</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">Blog</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/qa">Q&amp;A</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/ai-assistenten">AI Assistenten</Link>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}
