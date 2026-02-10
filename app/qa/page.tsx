import type { Metadata } from 'next'
import Link from 'next/link'
import { getQuestions } from '@/lib/qa/queries'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export const metadata: Metadata = {
  title: 'Q&A',
  description:
    'Stel vragen en deel kennis over AI-assistenten. Community-gedreven hulp voor ontwikkelaars.',
}

export default async function QAPage() {
  const questions = await getQuestions()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'Q&A' }]} />
      <h1 className="text-4xl font-bold mb-6 text-foreground">Q&A</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Welkom bij onze Q&A community. Stel vragen, deel kennis en help elkaar met AI-assistenten.
      </p>
      <div className="mb-6">
        <Link
          href="/qa/nieuwe-vraag"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Vraag stellen
        </Link>
      </div>
      {questions.length === 0 ? (
        <p className="text-lg text-muted-foreground">
          Nog geen vragen gesteld. Kom binnenkort terug!
        </p>
      ) : (
        <ul className="space-y-4">
          {questions.map((question) => (
            <li key={question.id} className="bg-muted rounded-lg p-4">
              <Link
                href={`/qa/vraag/${question.id}`}
                className="text-xl font-semibold text-foreground hover:underline"
              >
                {question.title}
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Door {question.profiles?.display_name ?? 'Gebruiker'} &middot;{' '}
                {new Date(question.created_at).toLocaleDateString('nl-NL')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
