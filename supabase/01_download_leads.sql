create extension if not exists pgcrypto;

create table if not exists public.download_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (
    char_length(email) between 5 and 254
    and email ~* '^[A-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Z0-9]([A-Z0-9-]{0,61}[A-Z0-9])?(\.[A-Z0-9]([A-Z0-9-]{0,61}[A-Z0-9])?)+$'
  ),
  whatsapp text not null check (whatsapp ~ '^[1-9][0-9]9[0-9]{8}$'),
  consent boolean not null check (consent = true),
  source text not null default 'printly-site',
  referrer text,
  page_url text,
  user_agent text
);

alter table public.download_leads enable row level security;
revoke all on table public.download_leads from anon, authenticated;
grant insert on table public.download_leads to anon, authenticated;

drop policy if exists "site_can_register_download" on public.download_leads;
create policy "site_can_register_download"
on public.download_leads
for insert
to anon, authenticated
with check (
  consent = true
  and source = 'printly-site'
  and email ~* '^[A-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Z0-9]([A-Z0-9-]{0,61}[A-Z0-9])?(\.[A-Z0-9]([A-Z0-9-]{0,61}[A-Z0-9])?)+$'
  and whatsapp ~ '^[1-9][0-9]9[0-9]{8}$'
);

create index if not exists download_leads_created_at_idx
on public.download_leads (created_at desc);
