import { blogPosts } from '@/lib/data/blog'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(): Promise<Response> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://aiassistentenhub.nl'

  const sortedPosts = [...blogPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 20)

  const items = sortedPosts
    .map(
      (post) => `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${baseUrl}/blog/${post.slug}</link>
    <description>${escapeXml(post.excerpt)}</description>
    <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
  </item>`
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Assistenten Hub</title>
    <link>${baseUrl}</link>
    <description>Nieuws, tutorials en updates over AI-assistenten in het Nederlands.</description>
    <language>nl</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
