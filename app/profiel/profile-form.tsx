'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { updateProfile, type ProfileFormState } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
    >
      {pending ? 'Opslaan...' : 'Opslaan'}
    </button>
  )
}

export function ProfileForm({ displayName, userId }: { displayName: string; userId: string }) {
  const initialState: ProfileFormState = { message: null, error: null }
  const [state, formAction] = useFormState(updateProfile, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="display_name" className="block text-sm font-medium mb-1">
          Weergavenaam
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          defaultValue={displayName}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {state.error}
        </p>
      )}

      {state.message && (
        <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md dark:bg-green-950 dark:text-green-400">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
