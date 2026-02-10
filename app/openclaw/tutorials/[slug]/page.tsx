import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  return {
    title: `OpenClaw Tutorial: ${slug}`,
    description: `Leer hoe je ${slug} gebruikt met OpenClaw in deze praktische tutorial.`,
  }
}

export default async function OpenClawTutorialPage({ params }: Props) {
  const { slug } = await params

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">
        OpenClaw Tutorial: {slug}
      </h1>
      <p className="text-lg text-muted-foreground">
        Tutorial: {slug} komt binnenkort. Hier leert u alles over dit onderwerp
        met praktische voorbeelden.
      </p>
    </div>
  )
}
