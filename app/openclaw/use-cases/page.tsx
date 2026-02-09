import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenClaw Use Cases',
  description: 'Praktische toepassingen en voorbeelden van OpenClaw',
}

export default function OpenClawUseCasesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">
        OpenClaw Use Cases
      </h1>
      <p className="text-lg text-muted-foreground">
        Ontdek binnenkort praktische toepassingen en real-world voorbeelden van
        OpenClaw in verschillende development scenario&apos;s.
      </p>
    </div>
  )
}
