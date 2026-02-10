import { blogPosts } from '@/lib/data/blog'
import { tutorials } from '@/lib/data/tutorials'

export interface RelatedItem {
  title: string
  href: string
}

export function getRelatedPosts(currentSlug: string, limit = 3): RelatedItem[] {
  return blogPosts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, limit)
    .map((post) => ({ title: post.title, href: `/blog/${post.slug}` }))
}

export function getRelatedTutorials(currentSlug: string, limit = 3): RelatedItem[] {
  return tutorials
    .filter((t) => t.slug !== currentSlug)
    .slice(0, limit)
    .map((t) => ({ title: t.title, href: `/openclaw/tutorials/${t.slug}` }))
}
