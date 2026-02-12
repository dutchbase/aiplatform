import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { updateUserRole, deleteUser } from '../actions'

export const metadata: Metadata = {
  title: 'Gebruiker bewerken | Admin | AI Assistenten Hub',
  description: 'Bewerk gebruikersrol en beheer account.',
}

export default async function AdminGebruikerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_REGEX.test(id)) notFound()

  const [authResult, profileResult, questionCountResult, answerCountResult] = await Promise.all([
    supabaseAdmin.auth.admin.getUserById(id),
    supabaseAdmin.from('profiles').select('id, display_name, role, updated_at').eq('id', id).single(),
    supabaseAdmin.from('questions').select('*', { count: 'exact', head: true }).eq('user_id', id),
    supabaseAdmin.from('answers').select('*', { count: 'exact', head: true }).eq('user_id', id),
  ])

  if (authResult.error || !authResult.data.user) notFound()

  const user = authResult.data.user
  const profile = profileResult.data
  const questionCount = questionCountResult.count ?? 0
  const answerCount = answerCountResult.count ?? 0

  return (
    <main className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Gebruiker bewerken</h1>
          <Link
            href="/admin/gebruikers"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Terug naar lijst
          </Link>
        </div>

        {/* User info card */}
        <div className="border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Gebruikersinfo</h2>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted-foreground">Naam</dt>
            <dd className="text-foreground">{profile?.display_name ?? <span className="italic text-muted-foreground">Geen naam</span>}</dd>

            <dt className="text-muted-foreground">E-mail</dt>
            <dd className="text-foreground">{user.email ?? '—'}</dd>

            <dt className="text-muted-foreground">Huidige rol</dt>
            <dd className="text-foreground font-medium">{profile?.role ?? 'user'}</dd>

            <dt className="text-muted-foreground">Aangemeld op</dt>
            <dd className="text-foreground">
              {new Date(user.created_at).toLocaleDateString('nl-NL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </dd>

            <dt className="text-muted-foreground">Vragen gesteld</dt>
            <dd className="text-foreground">{questionCount}</dd>

            <dt className="text-muted-foreground">Antwoorden gegeven</dt>
            <dd className="text-foreground">{answerCount}</dd>
          </dl>
        </div>

        {/* Role change form */}
        <div className="border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Rol wijzigen</h2>
          <form action={updateUserRole} className="flex items-end gap-4">
            <input type="hidden" name="userId" value={id} />
            <div className="flex-1">
              <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">
                Nieuwe rol
              </label>
              <select
                id="role"
                name="role"
                defaultValue={profile?.role ?? 'user'}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="user">Gebruiker</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Sla op
            </button>
          </form>
        </div>

        {/* Delete user form */}
        <div className="border border-destructive/50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2 text-destructive">Gebruiker verwijderen</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Dit verwijdert het account permanent. Alle content van deze gebruiker blijft behouden
            maar wordt anoniem.
          </p>
          <form action={deleteUser}>
            <input type="hidden" name="userId" value={id} />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
            >
              Verwijder gebruiker
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
