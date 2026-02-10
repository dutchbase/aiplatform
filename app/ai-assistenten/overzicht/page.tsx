import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Assistenten Vergelijking',
  description:
    'Vergelijk verschillende AI-assistenten op features, prijs, en gebruik om de beste keuze te maken.',
}

export default function AIAssistentenOverzichtPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">
        AI Assistenten Vergelijking
      </h1>
      <p className="text-lg text-muted-foreground">
        Binnenkort vindt u hier een uitgebreide vergelijking van verschillende
        AI-assistenten, zodat u de juiste tool kunt kiezen voor uw situatie.
      </p>
    </div>
  )
}
