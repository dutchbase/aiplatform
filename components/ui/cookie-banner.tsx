'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'cookie-notice-dismissed'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      setVisible(true)
    }
  }, [])

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookiemelding"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm"
    >
      <div className="container flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Dit platform gebruikt alleen functionele cookies die noodzakelijk zijn
          voor het inloggen.{' '}
          <Link
            href="/privacy#cookies"
            className="underline hover:text-foreground transition-colors"
          >
            Meer informatie
          </Link>
        </p>
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
          aria-label="Cookiemelding sluiten"
        >
          OK
        </button>
      </div>
    </div>
  )
}
