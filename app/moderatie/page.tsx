import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { resolveReport, deleteContent } from './actions'

export const metadata: Metadata = {
  title: 'Moderatiewachtrij',
  description: 'Overzicht van gemelde berichten voor moderators.',
}

type ReportRow = {
  id: string
  question_id: string | null
  answer_id: string | null
  reason: string
  status: string
  resolved_at: string | null
  created_at: string
  questions: { id: string; title: string } | null
  answers: { id: string; question_id: string; body: string } | null
}

export default async function ModeratieWachtrij({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const isAfgehandeld = tab === 'afgehandeld'

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['moderator', 'admin'].includes(profile.role as string)) {
    redirect('/')
  }

  // Fetch open count for tab label
  const { count: openCount } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')

  // Fetch reports filtered by tab
  const query = supabase
    .from('reports')
    .select(`
      id,
      question_id,
      answer_id,
      reason,
      status,
      resolved_at,
      created_at,
      questions ( id, title ),
      answers ( id, question_id, body )
    `)
    .order('created_at', { ascending: false })

  if (isAfgehandeld) {
    query.in('status', ['resolved', 'dismissed'])
  } else {
    query.eq('status', 'open')
  }

  const { data: reports } = await query
  const reportList = (reports ?? []) as unknown as ReportRow[]

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">Moderatiewachtrij</h1>
      <p className="text-muted-foreground mb-6">
        Gemelde berichten van gebruikers.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        <Link
          href="/moderatie"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            !isAfgehandeld
              ? 'border-b-2 border-primary text-primary -mb-px'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Open ({openCount ?? 0})
        </Link>
        <Link
          href="/moderatie?tab=afgehandeld"
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            isAfgehandeld
              ? 'border-b-2 border-primary text-primary -mb-px'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Afgehandeld
        </Link>
      </div>

      {reportList.length === 0 ? (
        <p className="text-muted-foreground">
          {isAfgehandeld ? 'Geen afgehandelde rapporten.' : 'Geen open rapporten. 🎉'}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {reportList.map((report) => {
            const isQuestion = report.question_id !== null
            const postLink = isQuestion
              ? `/qa/vraag/${report.question_id}`
              : `/qa/vraag/${report.answers?.question_id}`
            const label = isQuestion
              ? `Vraag: ${report.questions?.title ?? report.question_id}`
              : `Antwoord: ${(report.answers?.body ?? '').slice(0, 80)}…`

            const contentType = isQuestion ? 'question' : 'answer'
            const contentId = isQuestion ? report.question_id! : report.answer_id!

            const dismissAction = resolveReport.bind(null, report.id, 'dismissed')
            const deleteAction = deleteContent.bind(null, report.id, contentType, contentId)

            return (
              <li
                key={report.id}
                className="border border-border rounded-md p-4 bg-background flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {isQuestion ? 'Vraag' : 'Antwoord'}
                    </span>
                    {report.status !== 'open' && (
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        report.status === 'resolved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {report.status === 'resolved' ? 'Opgelost' : 'Gesloten'}
                      </span>
                    )}
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {new Date(report.created_at).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                <p className="text-sm text-foreground line-clamp-2">{label}</p>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-foreground">
                    Reden: <span className="font-medium">{report.reason}</span>
                  </span>
                  <Link
                    href={postLink}
                    className="text-sm text-primary hover:underline"
                  >
                    Bekijk bericht →
                  </Link>
                </div>

                {/* Resolution info for handled reports */}
                {report.status !== 'open' && report.resolved_at && (
                  <p className="text-xs text-muted-foreground">
                    Afgehandeld op{' '}
                    {new Date(report.resolved_at).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}

                {/* Action buttons for open reports */}
                {report.status === 'open' && (
                  <div className="flex items-center gap-3 pt-1 border-t border-border">
                    <form action={dismissAction}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded border border-border text-foreground hover:bg-muted transition-colors"
                      >
                        Sluit rapport
                      </button>
                    </form>
                    <form action={deleteAction}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      >
                        Verwijder content
                      </button>
                    </form>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
