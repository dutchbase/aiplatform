import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { ProfileForm } from './profile-form'

export const metadata: Metadata = {
  title: 'Mijn profiel',
  description: 'Bekijk en bewerk je profiel op de AI Assistenten Hub.',
}

export default async function ProfielPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-6">Mijn profiel</h1>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground">E-mailadres</p>
        <p>{user.email}</p>
      </div>

      <ProfileForm displayName={profile?.display_name ?? ''} userId={user.id} />
    </div>
  )
}
