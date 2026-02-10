# Blog — Databron en Beheer

## Databron

De blog gebruikt een **statisch datamodule** in `lib/data/blog.ts`. Dit is dezelfde aanpak als de tutorials sectie (`lib/data/tutorials.ts`). Artikelen zijn TypeScript-objecten in de repository, geen database-records.

### Keuze motivatie

- Consistent met het bestaande patroon uit Fase 10 (tutorials)
- Geen databasemigratie nodig voor statische redactionele content
- Volledig getypeerd via TypeScript (geen runtime fouten door ontbrekende velden)
- Eenvoudig te versioned via git — artikelwijzigingen zijn traceerbaar
- Makkelijk te migreren naar Supabase in een latere fase als dynamisch beheer nodig is

## Hoe voeg je een artikel toe?

1. Open `lib/data/blog.ts`
2. Voeg een nieuw object toe aan de `blogPosts` array
3. Houd de array gesorteerd: **nieuwste `publishedAt` bovenaan**

### Verplichte velden

```typescript
{
  slug: 'unieke-url-slug',          // kebab-case, wordt URL: /blog/[slug]
  title: 'Artikeltitel',
  excerpt: 'Korte samenvatting...',  // 1-2 zinnen, getoond op overzichtspagina
  publishedAt: '2026-01-01',         // ISO datum (YYYY-MM-DD)
  content: {
    intro: 'Inleidende alinea...',
    sections: [
      {
        heading: 'Sectietitel',
        content: 'Sectietekst...',
      },
    ],
  },
}
```

### Optionele velden

```typescript
updatedAt: '2026-01-15',  // Alleen invullen als inhoud na publicatie gewijzigd is.
                          // Wordt getoond als "Laatst bijgewerkt" op de detailpagina.
```

## Structuur van de detailpagina

- **`generateStaticParams`** — bouwt statische pagina's voor alle bekende slugs
- **`generateMetadata`** — gebruikt `post.title` als paginatitel, `post.excerpt` als description
- **Onbekende slug** — redirect naar `/blog` (geen 404)
- **`updatedAt`** — alleen zichtbaar als het verschilt van `publishedAt`

## Toekomstige uitbreiding

Als dynamisch contentbeheer nodig wordt (bijv. CMS of Supabase-tabel), is de migratiestap:

1. Maak een `blog_posts` tabel in Supabase met dezelfde veldnamen
2. Vervang de `blogPosts` array door een `async` fetchfunctie
3. Pas `generateStaticParams` aan om de tabel te bevragen (of zet op `dynamic = 'force-dynamic'`)
