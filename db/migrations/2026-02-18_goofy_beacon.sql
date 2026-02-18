-- Goofy Beacon schema + RLS
-- Run this in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  invite_code text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.group_invites (
  invite_code text primary key,
  group_id uuid not null references public.groups(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  opted_in boolean not null default false,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists public.member_last_ping (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  accuracy_m integer,
  zone_label text not null,
  pinged_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists public.telegram_group_links (
  group_id uuid primary key references public.groups(id) on delete cascade,
  telegram_chat_id text not null,
  linked_at timestamptz not null default now(),
  linked_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_groups_expires_at on public.groups(expires_at);
create index if not exists idx_group_members_user on public.group_members(user_id);
create index if not exists idx_member_last_ping_group on public.member_last_ping(group_id, pinged_at desc);

alter table public.groups enable row level security;
alter table public.group_invites enable row level security;
alter table public.group_members enable row level security;
alter table public.member_last_ping enable row level security;
alter table public.telegram_group_links enable row level security;

-- groups policies
 drop policy if exists groups_select_member on public.groups;
create policy groups_select_member on public.groups
for select using (
  exists (
    select 1 from public.group_members gm
    where gm.group_id = groups.id and gm.user_id = auth.uid()
  )
);

drop policy if exists groups_insert_owner on public.groups;
create policy groups_insert_owner on public.groups
for insert with check (owner_user_id = auth.uid());

drop policy if exists groups_update_owner on public.groups;
create policy groups_update_owner on public.groups
for update using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());

drop policy if exists groups_delete_owner on public.groups;
create policy groups_delete_owner on public.groups
for delete using (owner_user_id = auth.uid());

-- group_invites policies
 drop policy if exists invites_select_member on public.group_invites;
create policy invites_select_member on public.group_invites
for select using (
  exists (
    select 1 from public.group_members gm
    where gm.group_id = group_invites.group_id and gm.user_id = auth.uid()
  )
);

drop policy if exists invites_insert_owner on public.group_invites;
create policy invites_insert_owner on public.group_invites
for insert with check (
  exists (
    select 1 from public.groups g
    where g.id = group_invites.group_id and g.owner_user_id = auth.uid()
  )
);

drop policy if exists invites_update_owner on public.group_invites;
create policy invites_update_owner on public.group_invites
for update using (
  exists (
    select 1 from public.groups g
    where g.id = group_invites.group_id and g.owner_user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.groups g
    where g.id = group_invites.group_id and g.owner_user_id = auth.uid()
  )
);

drop policy if exists invites_delete_owner on public.group_invites;
create policy invites_delete_owner on public.group_invites
for delete using (
  exists (
    select 1 from public.groups g
    where g.id = group_invites.group_id and g.owner_user_id = auth.uid()
  )
);

-- group_members policies
 drop policy if exists members_select_member on public.group_members;
create policy members_select_member on public.group_members
for select using (
  exists (
    select 1 from public.group_members gm
    where gm.group_id = group_members.group_id and gm.user_id = auth.uid()
  )
);

drop policy if exists members_insert_self on public.group_members;
create policy members_insert_self on public.group_members
for insert with check (user_id = auth.uid());

drop policy if exists members_update_self_or_owner on public.group_members;
create policy members_update_self_or_owner on public.group_members
for update using (
  user_id = auth.uid()
  or exists (
    select 1 from public.groups g
    where g.id = group_members.group_id and g.owner_user_id = auth.uid()
  )
) with check (
  user_id = auth.uid()
  or exists (
    select 1 from public.groups g
    where g.id = group_members.group_id and g.owner_user_id = auth.uid()
  )
);

drop policy if exists members_delete_self_or_owner on public.group_members;
create policy members_delete_self_or_owner on public.group_members
for delete using (
  user_id = auth.uid()
  or exists (
    select 1 from public.groups g
    where g.id = group_members.group_id and g.owner_user_id = auth.uid()
  )
);

-- member_last_ping policies
 drop policy if exists ping_select_member on public.member_last_ping;
create policy ping_select_member on public.member_last_ping
for select using (
  exists (
    select 1 from public.group_members gm
    where gm.group_id = member_last_ping.group_id and gm.user_id = auth.uid()
  )
);

drop policy if exists ping_insert_self on public.member_last_ping;
create policy ping_insert_self on public.member_last_ping
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.group_members gm
    where gm.group_id = member_last_ping.group_id
      and gm.user_id = auth.uid()
      and gm.opted_in = true
  )
);

drop policy if exists ping_update_self on public.member_last_ping;
create policy ping_update_self on public.member_last_ping
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists ping_delete_self on public.member_last_ping;
create policy ping_delete_self on public.member_last_ping
for delete using (user_id = auth.uid());

-- telegram links policies
 drop policy if exists telegram_select_member on public.telegram_group_links;
create policy telegram_select_member on public.telegram_group_links
for select using (
  exists (
    select 1 from public.group_members gm
    where gm.group_id = telegram_group_links.group_id and gm.user_id = auth.uid()
  )
);

drop policy if exists telegram_insert_owner on public.telegram_group_links;
create policy telegram_insert_owner on public.telegram_group_links
for insert with check (
  exists (
    select 1 from public.groups g
    where g.id = telegram_group_links.group_id and g.owner_user_id = auth.uid()
  )
);

drop policy if exists telegram_update_owner on public.telegram_group_links;
create policy telegram_update_owner on public.telegram_group_links
for update using (
  exists (
    select 1 from public.groups g
    where g.id = telegram_group_links.group_id and g.owner_user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.groups g
    where g.id = telegram_group_links.group_id and g.owner_user_id = auth.uid()
  )
);

drop policy if exists telegram_delete_owner on public.telegram_group_links;
create policy telegram_delete_owner on public.telegram_group_links
for delete using (
  exists (
    select 1 from public.groups g
    where g.id = telegram_group_links.group_id and g.owner_user_id = auth.uid()
  )
);
