import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Assistenten',
  description: 'Ontdek verschillende AI-assistenten voor developers',
}

export default function AIAssistentenPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">
        AI Assistenten
      </h1>
      <p className="text-lg text-muted-foreground">
        Welkom bij het overzicht van AI-assistenten voor developers. Ontdek de
        verschillende tools en hun mogelijkheden.
      </p>
    </div>
  )
}
