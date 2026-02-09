import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nederlandse AI Assistenten Hub',
  description: 'Jouw centrale platform voor Nederlandse AI-assistenten, beginnend met OpenClaw',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
