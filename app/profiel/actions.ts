'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ProfileFormState = {
  message: string | null
  error: string | null
}

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { message: null, error: 'Je bent niet ingelogd.' }
  }

  const displayName = formData.get('display_name') as string

  if (!displayName || displayName.trim().length === 0) {
    return { message: null, error: 'Weergavenaam mag niet leeg zijn.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName.trim() })
    .eq('id', user.id)

  if (error) {
    return { message: null, error: 'Er is een fout opgetreden bij het opslaan.' }
  }

  revalidatePath('/profiel')
  return { message: 'Profiel succesvol bijgewerkt.', error: null }
}
