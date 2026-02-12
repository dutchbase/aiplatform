import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function getTotalUsers(): Promise<number> {
  // Use admin client — auth.users count requires service role
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1 })
  if (error) throw new Error('Kon gebruikersaantal niet ophalen')
  return data.total ?? 0
}

export async function getTotalQuestions(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
  if (error) throw new Error('Kon vraagaantal niet ophalen')
  return count ?? 0
}

export async function getTotalAnswers(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('answers')
    .select('*', { count: 'exact', head: true })
  if (error) throw new Error('Kon antwoordaantal niet ophalen')
  return count ?? 0
}

export async function getOpenReports(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')
  if (error) throw new Error('Kon open rapporten niet ophalen')
  return count ?? 0
}

export async function getNewQuestionsLastDays(days: number): Promise<number> {
  const supabase = await createClient()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', since)
  if (error) throw new Error('Kon nieuwe vragen niet ophalen')
  return count ?? 0
}

export interface ActiveUser {
  id: string
  display_name: string | null
  question_count: number
  answer_count: number
  total: number
}

// NOTE: For MVP (< 10,000 users/posts), fetching all rows and counting in JS is acceptable.
// At scale, replace with a Supabase RPC function (PostgreSQL GROUP BY query).
export async function getMostActiveUsers(limit: number): Promise<ActiveUser[]> {
  const supabase = await createClient()

  const [qCountsResult, aCountsResult, profilesResult] = await Promise.all([
    supabase.from('questions').select('user_id'),
    supabase.from('answers').select('user_id'),
    supabase.from('profiles').select('id, display_name'),
  ])

  const qCounts = qCountsResult.data ?? []
  const aCounts = aCountsResult.data ?? []
  const profiles = profilesResult.data ?? []

  const qMap = qCounts.reduce<Record<string, number>>((acc, { user_id }) => {
    acc[user_id] = (acc[user_id] ?? 0) + 1
    return acc
  }, {})

  const aMap = aCounts.reduce<Record<string, number>>((acc, { user_id }) => {
    acc[user_id] = (acc[user_id] ?? 0) + 1
    return acc
  }, {})

  return profiles
    .map((p) => ({
      id: p.id,
      display_name: p.display_name as string | null,
      question_count: qMap[p.id] ?? 0,
      answer_count: aMap[p.id] ?? 0,
      total: (qMap[p.id] ?? 0) + (aMap[p.id] ?? 0),
    }))
    .filter((u) => u.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
}
