import type { Metadata } from 'next'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const metadata: Metadata = {
  title: 'Gebruikersbeheer | Admin | AI Assistenten Hub',
  description: 'Beheer alle gebruikersaccounts en rollen.',
}

type ProfileRow = {
  id: string
  display_name: string | null
  role: string
  updated_at: string
}

export default async function AdminGebruikersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
    page,
    perPage: 50,
  })

  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, display_name, role, updated_at')

  const profileMap = ((profiles ?? []) as ProfileRow[]).reduce<Record<string, ProfileRow>>(
    (acc, p) => {
      acc[p.id] = p
      return acc
    },
    {}
  )

  const users = authError ? [] : authData.users
  const hasNextPage = !authError && authData.nextPage != null
  const hasPrevPage = page > 1

  return (
    <main className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gebruikersbeheer</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {authError ? 'Kon gebruikers niet laden' : `${authData.total ?? users.length} gebruikers totaal`}
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Terug naar dashboard
          </Link>
        </div>

        {authError ? (
          <p className="text-destructive">Fout bij laden van gebruikers.</p>
        ) : (
          <>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Naam</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">E-mail</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rol</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Aangemeld op</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => {
                    const profile = profileMap[u.id]
                    return (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-foreground">
                          {profile?.display_name ?? <span className="text-muted-foreground italic">Geen naam</span>}
                        </td>
                        <td className="px-4 py-3 text-foreground">{u.email ?? '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            profile?.role === 'admin'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : profile?.role === 'moderator'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {profile?.role ?? 'user'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(u.created_at).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/gebruikers/${u.id}`}
                            className="text-primary hover:underline"
                          >
                            Bewerken →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              {hasPrevPage ? (
                <Link
                  href={`/admin/gebruikers?page=${page - 1}`}
                  className="text-sm text-primary hover:underline"
                >
                  ← Vorige
                </Link>
              ) : (
                <span />
              )}
              <span className="text-sm text-muted-foreground">Pagina {page}</span>
              {hasNextPage ? (
                <Link
                  href={`/admin/gebruikers?page=${page + 1}`}
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
