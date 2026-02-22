'use server'

import { revalidatePath } from 'next/cache'
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

export async function updateUserRole(formData: FormData): Promise<void> {
  await verifyAdmin()

  const userId = formData.get('userId') as string
  const role = formData.get('role') as string

  if (!UUID_REGEX.test(userId)) {
    throw new Error('Ongeldig gebruikers-ID')
  }

  const validRoles = ['user', 'moderator', 'admin'] as const
  if (!validRoles.includes(role as (typeof validRoles)[number])) {
    throw new Error('Ongeldige rol')
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw new Error('Kon rol niet bijwerken')

  revalidatePath('/admin/gebruikers')
  revalidatePath(`/admin/gebruikers/${userId}`)
}

export async function deleteUser(formData: FormData): Promise<void> {
  await verifyAdmin()

  const userId = formData.get('userId') as string

  if (!UUID_REGEX.test(userId)) {
    throw new Error('Ongeldig gebruikers-ID')
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (error) throw new Error('Kon gebruiker niet verwijderen')

  revalidatePath('/admin/gebruikers')
  redirect('/admin/gebruikers')
}
