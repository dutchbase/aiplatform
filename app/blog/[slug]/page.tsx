import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getPublishedBlogPostBySlug, getPublishedBlogSlugs } from '@/lib/data/blog-db'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { RelatedContent } from '@/components/shared/related-content'
import { getRelatedPosts } from '@/lib/data/related'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Artikel niet gevonden',
    }
  }

  return {
    title: `${post.title} | AI Assistenten Hub`,
    description: post.excerpt,
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPublishedBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedItems = await getRelatedPosts(slug)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
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
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]} />

        {/* Article header */}
        <div>
          <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
          <div className="flex flex-col gap-1 mb-4">
            <p className="text-sm text-muted-foreground">
              Gepubliceerd: {formatDate(post.publishedAt)}
            </p>
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <p className="text-sm text-muted-foreground">
                Laatst bijgewerkt: {formatDate(post.updatedAt)}
              </p>
            )}
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.content.intro}
          </p>
        </div>

        {/* Article sections */}
        <div className="space-y-8">
          {post.content.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-2xl font-semibold mb-3">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>

        <RelatedContent heading="Zie ook" items={relatedItems} />

        {/* Footer CTA */}
        <section className="border-t border-border pt-8">
          <p className="text-muted-foreground mb-4">
            Meer lezen? Bekijk alle blogartikelen.
          </p>
          <Button asChild variant="secondary">
            <Link href="/blog">Terug naar blog</Link>
          </Button>
        </section>
      </div>
    </div>
    </>
  )
}
