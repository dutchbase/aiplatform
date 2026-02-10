export type Question = {
  id: string
  user_id: string
  title: string
  body: string
  created_at: string
  updated_at: string
}

export type Answer = {
  id: string
  question_id: string
  user_id: string
  body: string
  created_at: string
  updated_at: string
}

export type AnswerReply = {
  id: string
  answer_id: string
  user_id: string
  body: string
  created_at: string
  updated_at: string
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
