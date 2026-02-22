'use client'

import { useFormState } from 'react-dom'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createQuestion } from '@/app/qa/actions'
import { Button } from '@/components/ui/button'

type FormState = { error?: string; id?: string } | null

type ActionFn = (state: FormState, payload: FormData) => Promise<FormState>

export function AskQuestionForm() {
  const router = useRouter()
  const [state, formAction] = useFormState<FormState, FormData>(
    createQuestion as unknown as ActionFn,
    null
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.id) {
      router.push(`/qa/vraag/${state.id}`)
    }
  }, [state, router])

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <div className="text-red-600 bg-red-50 rounded-md px-4 py-3 text-sm" role="alert">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-medium text-foreground">
          Titel
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={10}
          placeholder="Minimaal 10 tekens"
          className="border border-input rounded-md px-3 py-2 w-full bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="body" className="font-medium text-foreground">
          Beschrijving
        </label>
        <textarea
          id="body"
          name="body"
          required
          minLength={20}
          rows={6}
          placeholder="Minimaal 20 tekens. Beschrijf je vraag zo duidelijk mogelijk."
          className="border border-input rounded-md px-3 py-2 w-full bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit">Vraag stellen</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuleren
        </Button>
      </div>
    </form>
  )
}
