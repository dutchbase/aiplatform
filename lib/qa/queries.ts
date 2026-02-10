import { createClient } from '@/lib/supabase/server'
import type { Question, Answer, AnswerReply } from '@/lib/qa/types'

export async function getQuestions(limit = 20): Promise<Question[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return data as Question[]
}

export async function getQuestionById(id: string): Promise<Question | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }
  return data as Question
}

export async function getAnswersByQuestionId(questionId: string): Promise<Answer[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('question_id', questionId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data as Answer[]
}

export async function getRepliesByAnswerId(answerId: string): Promise<AnswerReply[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('answer_replies')
    .select('*')
    .eq('answer_id', answerId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data as AnswerReply[]
}
