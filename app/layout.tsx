import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CookieBanner } from '@/components/ui/cookie-banner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Nederlandse AI Assistenten Hub',
    template: '%s | AI Assistenten Hub',
  },
  description:
    'Jouw centrale platform voor Nederlandse AI-assistenten, beginnend met OpenClaw. Tutorials, Q&A community, en praktische handleidingen.',
  keywords: [
    'AI assistenten',
    'OpenClaw',
    'Nederlands',
    'tutorials',
    'Q&A',
    'handleidingen',
  ],
  authors: [{ name: 'Nederlandse AI Assistenten Hub' }],
  creator: 'Nederlandse AI Assistenten Hub',
  publisher: 'Nederlandse AI Assistenten Hub',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
    languages: {
      'nl-NL': '/',
    },
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://aiassistentenhub.nl'}/feed.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: '/',
    siteName: 'Nederlandse AI Assistenten Hub',
    title: 'Nederlandse AI Assistenten Hub',
    description:
      'Jouw centrale platform voor Nederlandse AI-assistenten, beginnend met OpenClaw',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nederlandse AI Assistenten Hub',
    description:
      'Jouw centrale platform voor Nederlandse AI-assistenten, beginnend met OpenClaw',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </div>
      </body>
    </html>
  )
}
