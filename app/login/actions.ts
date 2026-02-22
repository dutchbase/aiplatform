'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logEvent } from '@/lib/logger'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    logEvent('login_failure')
    redirect('/login?error=invalid-credentials')
  }

  logEvent('login_success', data.user?.id)
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const display_name = formData.get('display_name') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name,
      },
    },
  })

  if (error) {
    redirect('/login?error=signup-failed')
  }

  logEvent('signup', data.user?.id ?? undefined)
  revalidatePath('/', 'layout')
  redirect('/login?message=check-email')
}
