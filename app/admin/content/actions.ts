'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function verifyAdmin() {
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

  if (profile?.role !== 'admin') redirect('/')
  return user
}

export async function adminDeleteQuestion(questionId: string): Promise<{ error?: string }> {
  await verifyAdmin()

  if (!UUID_REGEX.test(questionId)) {
    return { error: 'Ongeldig vraag-ID' }
  }

  const { error } = await supabaseAdmin.from('questions').delete().eq('id', questionId)
  if (error) return { error: 'Kon vraag niet verwijderen' }
  return {}
}

export async function adminDeleteAnswer(answerId: string): Promise<{ error?: string }> {
  await verifyAdmin()

  if (!UUID_REGEX.test(answerId)) {
    return { error: 'Ongeldig antwoord-ID' }
  }

  const { error } = await supabaseAdmin.from('answers').delete().eq('id', answerId)
  if (error) return { error: 'Kon antwoord niet verwijderen' }
  return {}
}
