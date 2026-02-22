import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AskQuestionForm } from '@/components/qa/ask-question-form'

export const metadata: Metadata = {
  title: 'Vraag stellen',
  description: 'Stel een vraag aan de AI Assistenten Hub community.',
}

export default async function NieuweVraagPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-foreground">Vraag stellen</h1>
        <div className="bg-muted rounded-lg p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Je moet ingelogd zijn om een vraag te stellen.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Inloggen
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 text-foreground">Vraag stellen</h1>
      <AskQuestionForm />
    </div>
  )
}
