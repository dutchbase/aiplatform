import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getTotalUsers,
  getTotalQuestions,
  getTotalAnswers,
  getOpenReports,
  getNewQuestionsLastDays,
  getMostActiveUsers,
} from '@/lib/admin/stats'

export const metadata: Metadata = {
  title: 'Statistieken | Admin | AI Assistenten Hub',
  description: 'Platform KPI\'s en groeidata voor de AI Assistenten Hub.',
}

export default async function AdminStatistiekenPage() {
  const [
    totalUsers,
    totalQuestions,
    totalAnswers,
    openReports,
    newQuestions7d,
    newQuestions30d,
    activeUsers,
  ] = await Promise.all([
    getTotalUsers(),
    getTotalQuestions(),
    getTotalAnswers(),
    getOpenReports(),
    getNewQuestionsLastDays(7),
    getNewQuestionsLastDays(30),
    getMostActiveUsers(10),
  ])

  return (
    <main className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Statistieken</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Platform KPI&apos;s en groeidata
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Terug naar dashboard
          </Link>
        </div>

        {/* Row 1 – KPI kaarten */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="border border-border rounded-lg p-5 bg-background">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
              Gebruikers
            </p>
            <p className="text-3xl font-bold text-foreground">{totalUsers}</p>
          </div>

          <div className="border border-border rounded-lg p-5 bg-background">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
              Vragen
            </p>
            <p className="text-3xl font-bold text-foreground">{totalQuestions}</p>
          </div>

          <div className="border border-border rounded-lg p-5 bg-background">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
              Antwoorden
            </p>
            <p className="text-3xl font-bold text-foreground">{totalAnswers}</p>
          </div>

          <div className="border border-border rounded-lg p-5 bg-background">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
              Open rapporten
            </p>
            <p className="text-3xl font-bold text-foreground">{openReports}</p>
            {openReports > 0 && (
              <Link
                href="/moderatie"
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                Bekijk →
              </Link>
            )}
          </div>
        </div>

        {/* Row 2 – Groei kaarten */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-border rounded-lg p-5 bg-background">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
              Nieuwe vragen (7 dagen)
            </p>
            <p className="text-3xl font-bold text-foreground">{newQuestions7d}</p>
          </div>

          <div className="border border-border rounded-lg p-5 bg-background">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
              Nieuwe vragen (30 dagen)
            </p>
            <p className="text-3xl font-bold text-foreground">{newQuestions30d}</p>
            <p className="text-xs text-muted-foreground mt-1">
              PRD doel: 50 Q&amp;A interacties in 90 dagen
            </p>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.round(((totalQuestions + totalAnswers) / 50) * 100))}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalQuestions + totalAnswers} / 50 totale Q&amp;A bijdragen
            </p>
          </div>
        </div>

        {/* Row 3 – Meest actieve gebruikers */}
        {activeUsers.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden mb-6">
            <div className="px-4 py-3 bg-muted/50 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Meest actieve gebruikers</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">#</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Naam</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Vragen</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Antwoorden</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Totaal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeUsers.map((user, i) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-2.5 text-foreground">
                      {user.display_name ?? <span className="italic text-muted-foreground">Geen naam</span>}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{user.question_count}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{user.answer_count}</td>
                    <td className="px-4 py-2.5 font-medium text-foreground">{user.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Row 4 – Externe meetpunten */}
        <div className="border border-border rounded-lg p-5 bg-background">
          <h2 className="text-sm font-semibold text-foreground mb-3">Externe meetpunten</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Unieke bezoekers en paginaweergaven zijn beschikbaar in Vercel Analytics.
            Indexatiestatus en zoekopdrachten via Google Search Console.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://vercel.com/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Vercel Analytics →
            </a>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Google Search Console →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
