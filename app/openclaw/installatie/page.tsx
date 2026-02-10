import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenClaw Installatie',
  description:
    'Stap-voor-stap handleiding voor het installeren en configureren van OpenClaw op jouw systeem.',
}

export default function OpenClawInstallatiePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">
        OpenClaw Installatie
      </h1>
      <p className="text-lg text-muted-foreground">
        Binnenkort vindt u hier een complete installatiehandleiding voor
        OpenClaw, met duidelijke stappen en troubleshooting tips.
      </p>
    </div>
  )
}
