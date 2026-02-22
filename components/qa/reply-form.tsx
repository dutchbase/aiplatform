'use client'

import { useFormState } from 'react-dom'
import { useState, useRef } from 'react'
import { createReply } from '@/app/qa/actions'
import { Button } from '@/components/ui/button'

type FormState = { error?: string; id?: string } | null

type ActionFn = (state: FormState, payload: FormData) => Promise<FormState>

interface ReplyFormProps {
  answerId: string
}

export function ReplyForm({ answerId }: ReplyFormProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useFormState<FormState, FormData>(
    createReply as unknown as ActionFn,
    null
  )
  const formRef = useRef<HTMLFormElement>(null)

  // Reset and close after successful submit
  if (state?.id && open) {
    setOpen(false)
    formRef.current?.reset()
  }

  return (
    <div className="mt-2">
      {!open && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
        >
          Reageer
        </Button>
      )}

      {open && (
        <form ref={formRef} action={formAction} className="flex flex-col gap-3 mt-2">
          {state?.error && (
            <div className="text-red-600 bg-red-50 rounded-md px-3 py-2 text-xs" role="alert">
              {state.error}
            </div>
          )}

          <input type="hidden" name="answer_id" value={answerId} />

          <div className="flex flex-col gap-1">
            <label htmlFor={`reply-body-${answerId}`} className="text-sm font-medium text-foreground">
              Reactie
            </label>
            <textarea
              id={`reply-body-${answerId}`}
              name="body"
              required
              minLength={5}
              rows={3}
              placeholder="Minimaal 5 tekens"
              className="border border-input rounded-md px-3 py-2 w-full bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" size="sm">Reactie plaatsen</Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { setOpen(false) }}
            >
              Annuleren
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
