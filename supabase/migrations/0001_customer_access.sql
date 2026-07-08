-- 0001_customer_access
-- Code-based customer access: Joe generates a code + email; the customer uses it
-- to track their item, see updates, and submit requests. All reads/writes happen
-- server-side via the service role (which bypasses RLS); RLS is enabled with no
-- anon policies so the public/anon key can neither read nor write these tables.
--
-- Applied to the JSCRvService project (ref uaksqgpkmxwhqupjcuzh) on 2026-07-08.

create extension if not exists pgcrypto;

create table if not exists public.customer_access (
  id             uuid primary key default gen_random_uuid(),
  code           text unique not null,
  customer_name  text not null,
  email          text not null,
  item_label     text not null,
  item_type      text not null default 'rv',
  current_status text not null default 'Active',
  status         text not null default 'active',
  created_by     text,
  revoked        boolean not null default false,
  created_at     timestamptz not null default now()
);

create table if not exists public.access_updates (
  id         uuid primary key default gen_random_uuid(),
  access_id  uuid not null references public.customer_access(id) on delete cascade,
  title      text not null,
  body       text,
  created_by text,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_requests (
  id             uuid primary key default gen_random_uuid(),
  access_id      uuid not null references public.customer_access(id) on delete cascade,
  type           text not null,          -- pickup | service | other
  requested_date date,
  details        text,
  status         text not null default 'new', -- new | acknowledged | scheduled | done | declined
  created_at     timestamptz not null default now()
);

create index if not exists idx_access_updates_access on public.access_updates(access_id);
create index if not exists idx_customer_requests_access on public.customer_requests(access_id);
create index if not exists idx_customer_requests_status on public.customer_requests(status);
create index if not exists idx_customer_access_code on public.customer_access(lower(code));

-- Server-side (service-role) access only. Deny everything to anon/authenticated.
alter table public.customer_access   enable row level security;
alter table public.access_updates    enable row level security;
alter table public.customer_requests enable row level security;
