# RSS Feed

## Feed URL

`/feed.xml` — volledig pad: `https://aiassistentenhub.nl/feed.xml`

## Inhoud

De feed bevat de 20 meest recente blogberichten van het platform, gesorteerd op publicatiedatum (nieuwste eerst).

### Feed-kanaal

| Veld | Waarde |
|------|--------|
| title | AI Assistenten Hub |
| link | https://aiassistentenhub.nl |
| description | Nieuws, tutorials en updates over AI-assistenten in het Nederlands. |
| language | nl |

### Feed-items (per blogbericht)

| Veld | Bron |
|------|------|
| title | BlogPost.title (XML-escaped) |
| link | {baseUrl}/blog/{BlogPost.slug} |
| description | BlogPost.excerpt (XML-escaped) |
| pubDate | BlogPost.publishedAt als RFC 822 string |
| guid | Zelfde als link (isPermaLink="true") |

## Vindbaarheid

De feed is gedeclareerd in de root layout metadata via `alternates.types`:

```typescript
alternates: {
  types: {
    'application/rss+xml': `${baseUrl}/feed.xml`,
  },
}
```

Next.js rendert dit als `<link rel="alternate" type="application/rss+xml">` in elke pagina's `<head>`.

## Technische implementatie

- Bestand: `app/feed.xml/route.ts`
- Route Handler (GET), geen Server Component
- Data-bron: `lib/data/blog.ts` (statische array)
- Maximaal 20 items, gesorteerd op `publishedAt` aflopend
- XML special characters worden escaped: `&`, `<`, `>`, `"`, `'`
- `atom:link` self-referentie voor feed-validators
