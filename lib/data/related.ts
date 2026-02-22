import { getRelatedBlogPosts } from '@/lib/data/blog-db'
import { tutorials } from '@/lib/data/tutorials'

export interface RelatedItem {
  title: string
  href: string
}

export async function getRelatedPosts(currentSlug: string, limit = 3): Promise<RelatedItem[]> {
  return getRelatedBlogPosts(currentSlug, limit)
}

export function getRelatedTutorials(currentSlug: string, limit = 3): RelatedItem[] {
  return tutorials
    .filter((t) => t.slug !== currentSlug)
    .slice(0, limit)
    .map((t) => ({ title: t.title, href: `/openclaw/tutorials/${t.slug}` }))
}
