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

export async function updateUserRole(formData: FormData): Promise<{ error?: string }> {
  await verifyAdmin()

  const userId = formData.get('userId') as string
  const role = formData.get('role') as string

  if (!UUID_REGEX.test(userId)) {
    return { error: 'Ongeldig gebruikers-ID' }
  }

  const validRoles = ['user', 'moderator', 'admin'] as const
  if (!validRoles.includes(role as (typeof validRoles)[number])) {
    return { error: 'Ongeldige rol' }
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) return { error: 'Kon rol niet bijwerken' }
  return {}
}

export async function deleteUser(formData: FormData): Promise<{ error?: string }> {
  await verifyAdmin()

  const userId = formData.get('userId') as string

  if (!UUID_REGEX.test(userId)) {
    return { error: 'Ongeldig gebruikers-ID' }
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) return { error: 'Kon gebruiker niet verwijderen' }

  redirect('/admin/gebruikers')
}
