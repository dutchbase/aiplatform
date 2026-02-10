import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getQuestionById, getAnswersByQuestionId, getRepliesByAnswerId } from '@/lib/qa/queries'
import { AnswerForm } from '@/components/qa/answer-form'
import { ReplyForm } from '@/components/qa/reply-form'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

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

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const question = await getQuestionById(id)
  if (!question) notFound()

  const answers = await getAnswersByQuestionId(id)

  const answersWithReplies = await Promise.all(
    answers.map(async (answer) => ({
      ...answer,
      replies: await getRepliesByAnswerId(answer.id),
    }))
  )

  const qaSchema = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.title,
      text: question.body,
      answerCount: answersWithReplies.length,
      dateCreated: question.created_at,
      suggestedAnswer: answersWithReplies.map((answer) => ({
        '@type': 'Answer',
        text: answer.body,
        dateCreated: answer.created_at,
        url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/qa/vraag/${question.id}`,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaSchema) }}
      />
      <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[
        { label: 'Q&A', href: '/qa' },
        { label: question.title },
      ]} />
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

                {/* Reply form or login CTA */}
                {user ? (
                  <ReplyForm answerId={answer.id} />
                ) : (
                  <div className="mt-3">
                    <Link
                      href="/login"
                      className="text-sm text-primary hover:underline"
                    >
                      Inloggen om te reageren
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Answer form or login CTA */}
      <div className="mt-8 border-t border-border pt-8">
        {user ? (
          <AnswerForm questionId={id} />
        ) : (
          <div className="bg-muted rounded-lg p-6 text-center">
            <p className="text-muted-foreground mb-3">
              Je moet ingelogd zijn om een antwoord te plaatsen.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Inloggen
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
