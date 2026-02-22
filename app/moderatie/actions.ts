'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function verifyModerator() {
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
  return { user, supabase }
}

export async function resolveReport(
  reportId: string,
  status: 'resolved' | 'dismissed'
): Promise<void> {
  const { user, supabase } = await verifyModerator()

  if (!UUID_REGEX.test(reportId)) throw new Error('Ongeldig rapport-ID')

  const { error } = await supabase
    .from('reports')
    .update({
      status,
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', reportId)
    .eq('status', 'open')

  if (error) throw new Error('Kon rapport niet bijwerken')

  revalidatePath('/moderatie')
}

export async function deleteContent(
  reportId: string,
  contentType: 'question' | 'answer' | 'reply',
  contentId: string
): Promise<void> {
  const { user } = await verifyModerator()

  if (!UUID_REGEX.test(reportId) || !UUID_REGEX.test(contentId)) {
    throw new Error('Ongeldig ID')
  }

  const tableMap = {
    question: 'questions',
    answer: 'answers',
    reply: 'answer_replies',
  } as const

  // Delete content via admin client (bypasses RLS — content may not belong to caller)
  const { error: deleteError } = await supabaseAdmin
    .from(tableMap[contentType])
    .delete()
    .eq('id', contentId)

  if (deleteError) throw new Error('Kon content niet verwijderen')

  // Mark report as resolved
  const { error: reportError } = await supabaseAdmin
    .from('reports')
    .update({
      status: 'resolved',
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', reportId)

  if (reportError) throw new Error('Kon rapport niet afronden')

  revalidatePath('/moderatie')
}
