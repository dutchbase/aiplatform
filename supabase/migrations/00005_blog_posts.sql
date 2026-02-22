-- 00005_blog_posts.sql
-- Blog posts in Supabase (SEO-friendly publishing model)

create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  intro text not null,
  sections jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  published_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now()),
  seo_title text,
  seo_description text,
  canonical_url text,
  focus_keyword text,
  author_type text not null default 'agent' check (author_type in ('human', 'agent')),
  author_name text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_blog_posts_status_published_at
  on public.blog_posts(status, published_at desc);

create index if not exists idx_blog_posts_created_at
  on public.blog_posts(created_at desc);

create index if not exists idx_blog_posts_sections_gin
  on public.blog_posts using gin(sections);

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_set_blog_posts_updated_at on public.blog_posts;
create trigger trg_set_blog_posts_updated_at
before update on public.blog_posts
for each row
execute function public.set_blog_posts_updated_at();

alter table public.blog_posts enable row level security;

-- Public may only read published rows
drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
  on public.blog_posts
  for select
  to anon, authenticated
  using (
    status = 'published'
    and published_at is not null
    and published_at <= timezone('utc', now())
  );

-- Moderators/admins can manage rows from authenticated app sessions
drop policy if exists "Moderators can manage blog posts" on public.blog_posts;
create policy "Moderators can manage blog posts"
  on public.blog_posts
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('moderator', 'admin')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('moderator', 'admin')
    )
  );
