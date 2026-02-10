import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { OpenClawNav } from '@/components/openclaw/openclaw-nav'
import { tutorials } from '@/lib/data/tutorials'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { RelatedContent } from '@/components/shared/related-content'
import { getRelatedTutorials } from '@/lib/data/related'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return tutorials.map((tutorial) => ({
    slug: tutorial.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tutorial = tutorials.find((t) => t.slug === slug)

  if (!tutorial) {
    return {
      title: 'Tutorial niet gevonden',
    }
  }

  return {
    title: `${tutorial.title} | AI Assistenten Hub`,
    description: tutorial.description,
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function TutorialPage({ params }: Props) {
  const { slug } = await params
  const tutorial = tutorials.find((t) => t.slug === slug)

  if (!tutorial) {
    redirect('/openclaw/tutorials')
  }

  const relatedItems = getRelatedTutorials(slug)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: tutorial.title,
    description: tutorial.description,
    datePublished: tutorial.lastUpdated,
    dateModified: tutorial.lastUpdated,
    author: {
      '@type': 'Organization',
      name: 'AI Assistenten Hub',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-12">
        <Breadcrumbs items={[
          { label: 'OpenClaw', href: '/openclaw' },
          { label: 'Tutorials', href: '/openclaw/tutorials' },
          { label: tutorial.title },
        ]} />

        {/* Tutorial header */}
        <div>
          <h1 className="text-4xl font-bold mb-3">{tutorial.title}</h1>
          <OpenClawNav currentPath="/openclaw/tutorials" />
          <p className="text-sm text-muted-foreground mb-4">
            Laatst bijgewerkt: {formatDate(tutorial.lastUpdated)}
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {tutorial.content.intro}
          </p>
        </div>

        {/* Tutorial steps */}
        <div className="space-y-8">
          {tutorial.content.steps.map((step, index) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold mb-3">{step.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{step.content}</p>
            </section>
          ))}
        </div>

        <RelatedContent heading="Andere tutorials" items={relatedItems} />

        {/* Footer CTA */}
        <section className="border-t border-border pt-8">
          <p className="text-muted-foreground mb-4">
            Meer leren? Bekijk onze andere tutorials.
          </p>
          <Button asChild variant="secondary">
            <Link href="/openclaw/tutorials">Terug naar overzicht</Link>
          </Button>
        </section>
      </div>
    </div>
    </>
  )
}
