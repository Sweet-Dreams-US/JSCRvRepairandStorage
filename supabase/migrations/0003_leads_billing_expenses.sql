-- 0003: real inquiries (leads), quotes, invoices, and expenses — replaces mock data.
-- Applied to the JSCRvService project (ref uaksqgpkmxwhqupjcuzh) on 2026-07-11.

create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  email               text not null,
  phone               text not null,
  rv_type             text,
  interest            text not null,
  message             text not null,
  source              text not null default 'website',
  status              text not null default 'new',   -- new|contacted|scheduled|converted|lost
  internal_notes      text,
  last_contacted_at   timestamptz,
  converted_access_id uuid references public.customer_access(id) on delete set null,
  created_at          timestamptz not null default now()
);

create table if not exists public.quotes (
  id            uuid primary key default gen_random_uuid(),
  access_id     uuid references public.customer_access(id) on delete set null,
  customer_name text not null,
  email         text not null,
  title         text not null,
  details       text,
  amount        numeric not null default 0,
  status        text not null default 'draft',        -- draft|sent|approved|declined
  valid_until   date,
  created_by    text,
  sent_at       timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists public.invoices (
  id            uuid primary key default gen_random_uuid(),
  access_id     uuid references public.customer_access(id) on delete set null,
  quote_id      uuid references public.quotes(id) on delete set null,
  customer_name text not null,
  email         text not null,
  title         text not null,
  details       text,
  amount        numeric not null default 0,
  amount_paid   numeric not null default 0,
  status        text not null default 'sent',         -- draft|sent|paid|overdue|void
  due_date      date,
  created_by    text,
  sent_at       timestamptz,
  paid_at       timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  date        date not null default current_date,
  category    text not null default 'other',
  vendor      text,
  description text,
  amount      numeric not null,
  created_by  text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_quotes_access on public.quotes(access_id);
create index if not exists idx_invoices_access on public.invoices(access_id);
create index if not exists idx_expenses_date on public.expenses(date);

alter table public.leads    enable row level security;
alter table public.quotes   enable row level security;
alter table public.invoices enable row level security;
alter table public.expenses enable row level security;
