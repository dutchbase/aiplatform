import type { Metadata } from 'next'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { adminDeleteQuestion } from './actions'

export const metadata: Metadata = {
  title: 'Inhoudsbeheer | Admin | AI Assistenten Hub',
  description: 'Beheer Q&A-vragen en antwoorden.',
}

type QuestionRow = {
  id: string
  title: string
  created_at: string
  profiles: { display_name: string | null } | null
}

type AnswerCountRow = {
  question_id: string
}

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const { page: pageParam, q } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const perPage = 20
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabaseAdmin
    .from('questions')
    .select('id, title, created_at, profiles ( display_name )', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: questions, count } = await query
  const questionList = (questions ?? []) as unknown as QuestionRow[]

  // Fetch answer counts for displayed questions
  const questionIds = questionList.map((q) => q.id)
  const { data: answerCounts } = questionIds.length
    ? await supabaseAdmin
        .from('answers')
        .select('question_id')
        .in('question_id', questionIds)
    : { data: [] }

  const answerMap = ((answerCounts ?? []) as AnswerCountRow[]).reduce<Record<string, number>>(
    (acc, row) => {
      acc[row.question_id] = (acc[row.question_id] ?? 0) + 1
      return acc
    },
    {}
  )

  const totalPages = Math.ceil((count ?? 0) / perPage)
  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <main className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inhoudsbeheer</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {count ?? 0} vragen totaal
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Terug naar dashboard
          </Link>
        </div>

        {/* Search */}
        <form method="GET" action="/admin/content" className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Zoek op titel…"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Zoeken
            </button>
            {q && (
              <Link
                href="/admin/content"
                className="px-4 py-2 rounded-md border border-border text-sm text-foreground hover:bg-muted transition-colors"
              >
                Wis filter
              </Link>
            )}
          </div>
        </form>

        {questionList.length === 0 ? (
          <p className="text-muted-foreground">
            {q ? `Geen vragen gevonden voor "${q}".` : 'Geen vragen gevonden.'}
          </p>
        ) : (
          <>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Titel</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Auteur</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Antwoorden</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Aangemeld op</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {questionList.map((question) => {
                    const deleteAction = adminDeleteQuestion.bind(null, question.id)
                    return (
                      <tr key={question.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            href={`/qa/vraag/${question.id}`}
                            className="text-foreground hover:text-primary hover:underline line-clamp-1"
                          >
                            {question.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {question.profiles?.display_name ?? (
                            <span className="italic">Anoniem</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {answerMap[question.id] ?? 0}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(question.created_at).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <form action={deleteAction}>
                            <button
                              type="submit"
                              className="text-xs px-2 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                            >
                              Verwijder
                            </button>
                          </form>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              {hasPrev ? (
                <Link
                  href={`/admin/content?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                  className="text-sm text-primary hover:underline"
                >
                  ← Vorige
                </Link>
              ) : (
                <span />
              )}
              <span className="text-sm text-muted-foreground">
                Pagina {page} van {totalPages}
              </span>
              {hasNext ? (
                <Link
                  href={`/admin/content?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
                  className="text-sm text-primary hover:underline"
                >
                  Volgende →
                </Link>
              ) : (
                <span />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
