import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kennisbank',
  description: 'Uitgebreide kennisbank over AI-assistenten',
}

export default function KennisbankPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">Kennisbank</h1>
      <p className="text-lg text-muted-foreground">
        Welkom bij onze kennisbank. Hier vindt u binnenkort uitgebreide
        documentatie, handleidingen en naslagwerken over AI-assistenten.
      </p>
    </div>
  )
}
