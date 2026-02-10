import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenClaw',
  description:
    'Alles over OpenClaw - de Nederlandse AI-assistent voor developers. Tutorials, handleidingen en praktische voorbeelden.',
}

export default function OpenClawPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">OpenClaw</h1>
      <p className="text-lg text-muted-foreground">
        Welkom op de OpenClaw pagina. Hier vindt u binnenkort uitgebreide
        informatie over OpenClaw - de Nederlandse AI-assistent speciaal
        ontwikkeld voor developers.
      </p>
    </div>
  )
}
