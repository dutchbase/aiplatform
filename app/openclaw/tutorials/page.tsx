import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OpenClaw Tutorials',
  description: 'Leer OpenClaw gebruiken met praktische tutorials',
}

export default function OpenClawTutorialsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">
        OpenClaw Tutorials
      </h1>
      <p className="text-lg text-muted-foreground">
        Ontdek binnenkort praktische tutorials die u helpen om OpenClaw
        effectief in te zetten in uw dagelijkse workflow.
      </p>
    </div>
  )
}
