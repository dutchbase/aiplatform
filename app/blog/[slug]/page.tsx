import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getBlogPost, blogPosts } from '@/lib/data/blog'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

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
  const post = getBlogPost(slug)

  if (!post) {
    redirect('/blog')
  }

  return (
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
  )
}
