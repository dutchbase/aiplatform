export type Question = {
  id: string
  user_id: string
  title: string
  body: string
  created_at: string
  updated_at: string
  profiles: { display_name: string | null } | null
}

export type Answer = {
  id: string
  question_id: string
  user_id: string
  body: string
  created_at: string
  updated_at: string
  profiles: { display_name: string | null } | null
}

export type AnswerReply = {
  id: string
  answer_id: string
  user_id: string
  body: string
  created_at: string
  updated_at: string
  profiles: { display_name: string | null } | null
}

export type CreateQuestionInput = {
  title: string
  body: string
}

export type CreateAnswerInput = {
  question_id: string
  body: string
}

export type CreateReplyInput = {
  answer_id: string
  body: string
}

export type Report = {
  id: string
  question_id: string | null
  answer_id: string | null
  user_id: string
  reason: string
  created_at: string
}

export type CreateReportInput = {
  question_id?: string
  answer_id?: string
  reason: string
}
