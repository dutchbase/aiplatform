import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Q&A',
  description:
    'Stel vragen en deel kennis over AI-assistenten. Community-gedreven hulp voor ontwikkelaars.',
}

export default function QAPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">Q&A</h1>
      <p className="text-lg text-muted-foreground">
        Welkom bij onze Q&A community. Stel vragen, deel kennis en help elkaar
        met AI-assistenten.
      </p>
    </div>
  )
}
