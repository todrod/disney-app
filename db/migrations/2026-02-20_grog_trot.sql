-- Goofy's Grog Trot MVP schema (saved crawls + check-ins)
-- Run in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.grog_user_crawls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.grog_user_crawl_stops (
  id bigserial primary key,
  crawl_id uuid not null references public.grog_user_crawls(id) on delete cascade,
  venue_id text not null,
  stop_order integer not null,
  visited boolean not null default false,
  visited_at timestamptz,
  note text,
  created_at timestamptz not null default now(),
  unique (crawl_id, stop_order)
);

create index if not exists idx_grog_crawls_user on public.grog_user_crawls(user_id, created_at desc);
create index if not exists idx_grog_crawls_public on public.grog_user_crawls(is_public, created_at desc);
create index if not exists idx_grog_stops_crawl on public.grog_user_crawl_stops(crawl_id, stop_order);

alter table public.grog_user_crawls enable row level security;
alter table public.grog_user_crawl_stops enable row level security;

-- Crawls: owner full access, public readable when marked public.
drop policy if exists grog_crawls_select on public.grog_user_crawls;
create policy grog_crawls_select on public.grog_user_crawls
for select using (
  user_id = auth.uid() or is_public = true
);

drop policy if exists grog_crawls_insert on public.grog_user_crawls;
create policy grog_crawls_insert on public.grog_user_crawls
for insert with check (user_id = auth.uid());

drop policy if exists grog_crawls_update on public.grog_user_crawls;
create policy grog_crawls_update on public.grog_user_crawls
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists grog_crawls_delete on public.grog_user_crawls;
create policy grog_crawls_delete on public.grog_user_crawls
for delete using (user_id = auth.uid());

-- Stops: readable when crawl is public or owned by current user; write only by owner.
drop policy if exists grog_stops_select on public.grog_user_crawl_stops;
create policy grog_stops_select on public.grog_user_crawl_stops
for select using (
  exists (
    select 1
    from public.grog_user_crawls c
    where c.id = grog_user_crawl_stops.crawl_id
      and (c.user_id = auth.uid() or c.is_public = true)
  )
);

drop policy if exists grog_stops_insert on public.grog_user_crawl_stops;
create policy grog_stops_insert on public.grog_user_crawl_stops
for insert with check (
  exists (
    select 1
    from public.grog_user_crawls c
    where c.id = grog_user_crawl_stops.crawl_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists grog_stops_update on public.grog_user_crawl_stops;
create policy grog_stops_update on public.grog_user_crawl_stops
for update using (
  exists (
    select 1
    from public.grog_user_crawls c
    where c.id = grog_user_crawl_stops.crawl_id
      and c.user_id = auth.uid()
  )
) with check (
  exists (
    select 1
    from public.grog_user_crawls c
    where c.id = grog_user_crawl_stops.crawl_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists grog_stops_delete on public.grog_user_crawl_stops;
create policy grog_stops_delete on public.grog_user_crawl_stops
for delete using (
  exists (
    select 1
    from public.grog_user_crawls c
    where c.id = grog_user_crawl_stops.crawl_id
      and c.user_id = auth.uid()
  )
);
