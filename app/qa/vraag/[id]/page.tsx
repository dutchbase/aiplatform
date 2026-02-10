import type { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  return {
    title: `Vraag #${id}`,
    description: `Bekijk vraag #${id} en antwoorden uit de AI Assistenten community.`,
  }
}

export default async function QAVraagPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-foreground">
        Vraag #{id}
      </h1>
      <p className="text-lg text-muted-foreground">
        Vraag #{id} komt binnenkort. Hier vindt u straks de vraag, antwoorden
        en discussie.
      </p>
    </div>
  )
}
