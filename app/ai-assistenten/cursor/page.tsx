import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cursor',
  description: 'Alles over Cursor - de AI-powered code editor',
}

export default function CursorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">Cursor</h1>
      <p className="text-lg text-muted-foreground">
        Binnenkort vindt u hier uitgebreide informatie over Cursor, de
        AI-powered code editor die uw development workflow transformeert.
      </p>
    </div>
  )
}
