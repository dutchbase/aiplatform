'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CreateQuestionInput, CreateAnswerInput, CreateReplyInput } from '@/lib/qa/types'

export async function createQuestion(
  formData: FormData
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Niet ingelogd' }

  const title = (formData.get('title') as string | null) ?? ''
  const body = (formData.get('body') as string | null) ?? ''

  const input: CreateQuestionInput = { title, body }

  if (input.title.trim().length < 10) {
    return { error: 'Titel moet minimaal 10 tekens zijn' }
  }
  if (input.body.trim().length < 20) {
    return { error: 'Beschrijving moet minimaal 20 tekens zijn' }
  }

  const { data, error } = await supabase
    .from('questions')
    .insert({ title: input.title.trim(), body: input.body.trim(), user_id: user.id })
    .select('id')
    .single()

  if (error) return { error: 'Er is iets misgegaan. Probeer het opnieuw.' }

  revalidatePath('/qa')
  return { id: (data as { id: string }).id }
}

export async function createAnswer(
  formData: FormData
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Niet ingelogd' }

  const question_id = (formData.get('question_id') as string | null) ?? ''
  const body = (formData.get('body') as string | null) ?? ''

  const input: CreateAnswerInput = { question_id, body }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(input.question_id)) {
    return { error: 'Ongeldig vraag-ID' }
  }
  if (input.body.trim().length < 10) {
    return { error: 'Antwoord moet minimaal 10 tekens zijn' }
  }

  const { data, error } = await supabase
    .from('answers')
    .insert({ question_id: input.question_id, body: input.body.trim(), user_id: user.id })
    .select('id')
    .single()

  if (error) return { error: 'Er is iets misgegaan. Probeer het opnieuw.' }

  revalidatePath('/qa')
  revalidatePath(`/qa/vraag/${input.question_id}`)
  return { id: (data as { id: string }).id }
}

export async function createReply(
  formData: FormData
): Promise<{ error?: string; id?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Niet ingelogd' }

  const answer_id = (formData.get('answer_id') as string | null) ?? ''
  const body = (formData.get('body') as string | null) ?? ''

  const input: CreateReplyInput = { answer_id, body }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(input.answer_id)) {
    return { error: 'Ongeldig antwoord-ID' }
  }
  if (input.body.trim().length < 5) {
    return { error: 'Reactie moet minimaal 5 tekens zijn' }
  }

  const { data, error } = await supabase
    .from('answer_replies')
    .insert({ answer_id: input.answer_id, body: input.body.trim(), user_id: user.id })
    .select('id')
    .single()

  if (error) return { error: 'Er is iets misgegaan. Probeer het opnieuw.' }

  revalidatePath('/qa')
  return { id: (data as { id: string }).id }
}
