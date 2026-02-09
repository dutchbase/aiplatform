import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ')}`,
    description: `Blog artikel over ${slug.replace(/-/g, ' ')}`,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground capitalize">
        {title}
      </h1>
      <p className="text-lg text-muted-foreground">
        Blog artikel: {title} komt binnenkort. Blijf op de hoogte voor
        interessante inzichten.
      </p>
    </div>
  )
}
