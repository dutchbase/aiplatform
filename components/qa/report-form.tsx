'use client'

import { useFormState } from 'react-dom'
import { useState } from 'react'
import { createReport } from '@/app/qa/actions'
import { Button } from '@/components/ui/button'

type FormState = { error?: string } | null

type ActionFn = (state: FormState, payload: FormData) => Promise<FormState>

interface ReportFormProps {
  questionId?: string
  answerId?: string
}

export function ReportForm({ questionId, answerId }: ReportFormProps) {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useFormState<FormState, FormData>(
    createReport as unknown as ActionFn,
    null
  )

  // After success, show confirmation and keep collapsed
  const submitted = state !== null && !state?.error

  if (submitted) {
    return (
      <p className="text-sm text-muted-foreground mt-2">
        Rapport verzonden. Bedankt voor je melding.
      </p>
    )
  }

  return (
    <div className="mt-2">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Rapporteer
        </button>
      ) : (
        <form action={formAction} className="flex flex-col gap-2 mt-1 p-3 border border-input rounded-md bg-background">
          <p className="text-sm font-medium text-foreground">Waarom wil je dit rapporteren?</p>

          {state?.error && (
            <div className="text-red-600 bg-red-50 rounded-md px-3 py-2 text-xs" role="alert">
              {state.error}
            </div>
          )}

          {questionId && <input type="hidden" name="question_id" value={questionId} />}
          {answerId && <input type="hidden" name="answer_id" value={answerId} />}

          <div className="flex flex-col gap-1">
            <label htmlFor={`reason-${questionId ?? answerId}`} className="sr-only">
              Reden
            </label>
            <select
              id={`reason-${questionId ?? answerId}`}
              name="reason"
              required
              defaultValue=""
              className="border border-input rounded-md px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>Kies een reden...</option>
              <option value="spam">Spam</option>
              <option value="ongewenste inhoud">Ongewenste inhoud</option>
              <option value="onjuiste informatie">Onjuiste informatie</option>
              <option value="anders">Anders</option>
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <Button type="submit" size="sm">Verzenden</Button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Annuleren
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
