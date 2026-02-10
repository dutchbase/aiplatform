import Link from 'next/link'
import type { RelatedItem } from '@/lib/data/related'

interface RelatedContentProps {
  heading: string
  items: RelatedItem[]
}

export function RelatedContent({ heading, items }: RelatedContentProps) {
  if (items.length === 0) return null

  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-xl font-semibold mb-4">{heading}</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-primary hover:underline transition-colors"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
