import type { Metadata } from 'next'
import { login, signup } from './actions'

export const metadata: Metadata = {
  title: 'Inloggen',
  description: 'Log in of maak een account aan voor de AI Assistenten Hub.',
  alternates: {
    canonical: '/login',
  },
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Inloggen</h1>

      {searchParams.error === 'invalid-credentials' && (
        <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">
          Ongeldige inloggegevens. Probeer opnieuw.
        </div>
      )}

      {searchParams.error === 'signup-failed' && (
        <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">
          Registratie mislukt. Probeer opnieuw.
        </div>
      )}

      {searchParams.error &&
        searchParams.error !== 'invalid-credentials' &&
        searchParams.error !== 'signup-failed' && (
          <div className="text-red-600 bg-red-50 p-3 rounded-md mb-4">
            Er is een fout opgetreden.
          </div>
        )}

      {searchParams.message === 'check-email' && (
        <div className="text-green-600 bg-green-50 p-3 rounded-md mb-4">
          Controleer je e-mail om je account te bevestigen.
        </div>
      )}

      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="display_name" className="font-medium">
            Weergavenaam
          </label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium">
            E-mailadres
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-medium">
            Wachtwoord
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button
            formAction={login}
            className="bg-blue-600 text-white rounded-md px-4 py-2 font-medium hover:bg-blue-700"
          >
            Inloggen
          </button>
          <button
            formAction={signup}
            className="bg-gray-200 text-gray-800 rounded-md px-4 py-2 font-medium hover:bg-gray-300"
          >
            Registreren
          </button>
        </div>
      </form>
    </div>
  )
}
