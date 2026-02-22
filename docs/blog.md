# Blog — Databron en Beheer

## Databron

De blog gebruikt nu **Supabase** als bron via tabel `public.blog_posts`.

- Lijstpagina: `/blog` leest `status='published'` records
- Detailpagina: `/blog/[slug]` leest op `slug`
- Sitemap: bevat dynamische blog-URL's uit dezelfde tabel

## Datamodel (`blog_posts`)

Belangrijkste velden:
- `slug` (unique)
- `title`
- `excerpt`
- `intro`
- `sections` (jsonb array met `{ heading, content }`)
- `status` (`draft|review|published|archived`)
- `published_at`, `updated_at`
- `seo_title`, `seo_description`, `focus_keyword`
- `author_type`, `author_name`

## Publicatieflow

Aanbevolen flow:
1. `draft` — AI of mens schrijft concept
2. `review` — kwaliteits- en SEO-check
3. `published` — zichtbaar op site en in sitemap

## SEO-gedrag

- `generateMetadata` gebruikt titel + excerpt uit database
- JSON-LD `Article` blijft actief op detailpagina
- `/sitemap.xml` bevat dynamische `/blog/[slug]` met `lastModified`
- Ontbrekende slug geeft `404` (`notFound()`)

## Dagelijkse AI-publicatie

Dagelijkse OpenClaw-job schrijft een nieuw artikel naar `blog_posts`.

Minimale output van de job:
- `title`, `slug`, `excerpt`
- `intro`, `sections`
- `seo_title`, `seo_description`, `focus_keyword`
- `status` (bij voorkeur eerst `review`)

## Migrations

Zie: `supabase/migrations/00005_blog_posts.sql`
