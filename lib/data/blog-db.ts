import { supabaseAdmin } from '@/lib/supabase/admin'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  updatedAt?: string
  content: {
    intro: string
    sections: Array<{
      heading: string
      content: string
    }>
  }
}

type BlogRow = {
  id: string
  slug: string
  title: string
  excerpt: string
  intro: string
  sections: Array<{ heading: string; content: string }> | null
  published_at: string
  updated_at: string | null
}

function mapRow(row: BlogRow): BlogPost {
  const normalizedSections = Array.isArray(row.sections)
    ? row.sections.filter((s) => s && typeof s.heading === 'string' && typeof s.content === 'string')
    : []

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    publishedAt: row.published_at,
    updatedAt: row.updated_at ?? undefined,
    content: {
      intro: row.intro ?? '',
      sections: normalizedSections,
    },
  }
}

export async function getPublishedBlogPosts(limit = 100): Promise<BlogPost[]> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, slug, title, excerpt, intro, sections, published_at, updated_at')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return (data as BlogRow[]).map(mapRow)
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, slug, title, excerpt, intro, sections, published_at, updated_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .single()

  if (error || !data) return null
  return mapRow(data as BlogRow)
}

export async function getPublishedBlogSlugs(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())

  if (error || !data) return []
  return data.map((r) => r.slug)
}

export async function getRelatedBlogPosts(currentSlug: string, limit = 3) {
  const posts = await getPublishedBlogPosts(12)
  return posts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, limit)
    .map((post) => ({ title: post.title, href: `/blog/${post.slug}` }))
}
