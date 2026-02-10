import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artikelen, inzichten en updates over AI-assistenten, development trends en praktische tips.',
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">Blog</h1>
      <p className="text-lg text-muted-foreground">
        Ontdek artikelen, inzichten en best practices over het gebruik van
        AI-assistenten in uw development workflow.
      </p>
    </div>
  )
}
