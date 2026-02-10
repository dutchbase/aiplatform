import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { blogPosts } from '@/lib/data/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Artikelen, inzichten en updates over AI-assistenten, development trends en praktische tips.',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPage() {
  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Artikelen, inzichten en updates over AI-assistenten, development
            trends en praktische tips voor moderne developers.
          </p>
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors"
            >
              <div className="flex-1 mb-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {post.excerpt}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDate(post.publishedAt)}
                </span>
              </div>
              <Button asChild>
                <Link href={`/blog/${post.slug}`}>Lees artikel</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
