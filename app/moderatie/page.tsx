import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Moderatiewachtrij',
  description: 'Overzicht van gemelde berichten voor moderators.',
}

type ReportRow = {
  id: string
  question_id: string | null
  answer_id: string | null
  reason: string
  created_at: string
  questions: { id: string; title: string } | null
  answers: { id: string; question_id: string; body: string } | null
}

export default async function ModeratieWachtrij() {
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

  const { data: reports } = await supabase
    .from('reports')
    .select(`
      id,
      question_id,
      answer_id,
      reason,
      created_at,
      questions ( id, title ),
      answers ( id, question_id, body )
    `)
    .order('created_at', { ascending: false })

  const reportList = (reports ?? []) as unknown as ReportRow[]

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">Moderatiewachtrij</h1>
      <p className="text-muted-foreground mb-6">
        Gemelde berichten van gebruikers. Totaal: {reportList.length}
      </p>

      {reportList.length === 0 ? (
        <p className="text-muted-foreground">Geen rapporten gevonden.</p>
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

            return (
              <li
                key={report.id}
                className="border border-border rounded-md p-4 bg-background flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {isQuestion ? 'Vraag' : 'Antwoord'}
                  </span>
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
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
