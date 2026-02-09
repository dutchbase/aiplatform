import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenClaw Nieuws',
  description: 'Laatste nieuws en updates over OpenClaw',
}

export default function OpenClawNieuwsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">
        OpenClaw Nieuws
      </h1>
      <p className="text-lg text-muted-foreground">
        Blijf op de hoogte van het laatste nieuws, updates en ontwikkelingen
        rond OpenClaw.
      </p>
    </div>
  )
}
