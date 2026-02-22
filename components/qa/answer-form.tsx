'use client'

import { useFormState } from 'react-dom'
import { useRef } from 'react'
import { createAnswer } from '@/app/qa/actions'
import { Button } from '@/components/ui/button'

type FormState = { error?: string; id?: string } | null

type ActionFn = (state: FormState, payload: FormData) => Promise<FormState>

interface AnswerFormProps {
  questionId: string
}

export function AnswerForm({ questionId }: AnswerFormProps) {
  const [state, formAction] = useFormState<FormState, FormData>(
    createAnswer as unknown as ActionFn,
    null
  )
  const formRef = useRef<HTMLFormElement>(null)

  // Reset textarea after successful submit
  if (state?.id && formRef.current) {
    formRef.current.reset()
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4 mt-6">
      <h2 className="text-xl font-semibold text-foreground">Plaats een antwoord</h2>

      {state?.error && (
        <div className="text-red-600 bg-red-50 rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      )}

      {state?.id && (
        <div className="text-green-700 bg-green-50 rounded-md px-4 py-3 text-sm" role="status">
          Antwoord geplaatst!
        </div>
      )}

      <input type="hidden" name="question_id" value={questionId} />

      <div className="flex flex-col gap-2">
        <label htmlFor="answer-body" className="font-medium text-foreground">
          Antwoord
        </label>
        <textarea
          id="answer-body"
          name="body"
          required
          minLength={10}
          rows={5}
          placeholder="Minimaal 10 tekens"
          className="border border-input rounded-md px-3 py-2 w-full bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />
      </div>

      <div>
        <Button type="submit">Antwoord plaatsen</Button>
      </div>
    </form>
  )
}
