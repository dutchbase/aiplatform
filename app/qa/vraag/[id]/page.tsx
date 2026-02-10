import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getQuestionById, getAnswersByQuestionId, getRepliesByAnswerId } from '@/lib/qa/queries'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const question = await getQuestionById(id)
  if (!question) {
    return { title: 'Vraag niet gevonden' }
  }
  return {
    title: question.title,
    description: `Bekijk de vraag "${question.title}" en antwoorden van de AI Assistenten community.`,
  }
}

export default async function QAVraagPage({ params }: Props) {
  const { id } = await params
  const question = await getQuestionById(id)
  if (!question) notFound()

  const answers = await getAnswersByQuestionId(id)

  const answersWithReplies = await Promise.all(
    answers.map(async (answer) => ({
      ...answer,
      replies: await getRepliesByAnswerId(answer.id),
    }))
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Question */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-foreground">{question.title}</h1>
        <p className="text-lg text-foreground mb-4">{question.body}</p>
        <p className="text-sm text-muted-foreground">
          Door {question.profiles?.display_name ?? 'Gebruiker'} &middot;{' '}
          {new Date(question.created_at).toLocaleDateString('nl-NL')}
        </p>
      </div>

      {/* Answers */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">
          Antwoorden ({answersWithReplies.length})
        </h2>
        {answersWithReplies.length === 0 ? (
          <p className="text-muted-foreground">Nog geen antwoorden. Wees de eerste!</p>
        ) : (
          <ul className="space-y-6">
            {answersWithReplies.map((answer) => (
              <li key={answer.id} className="bg-muted rounded-lg p-4">
                <p className="text-foreground mb-2">{answer.body}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Door {answer.profiles?.display_name ?? 'Gebruiker'} &middot;{' '}
                  {new Date(answer.created_at).toLocaleDateString('nl-NL')}
                </p>

                {/* Replies */}
                {answer.replies.length > 0 && (
                  <ul className="space-y-2 border-l-2 border-border pl-4 mt-2">
                    {answer.replies.map((reply) => (
                      <li key={reply.id} className="text-sm">
                        <p className="text-foreground">{reply.body}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Door {reply.profiles?.display_name ?? 'Gebruiker'} &middot;{' '}
                          {new Date(reply.created_at).toLocaleDateString('nl-NL')}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
