-- FreeWebsites (ref nxhwqtqroyerbbklywyn): JSC RV Repair moves into its own `jsc` schema.
-- Same tables, columns, defaults, FKs and indexes as migrations 0001-0003 on the
-- old JSCRvService project (verified against the live DB on 2026-10-17).
--
-- Access model is unchanged: the app only talks to Supabase server-side with a
-- secret (service-role) key. RLS is on with no policies, and anon/authenticated
-- get no grants at all on this schema, so the shared publishable key can never
-- read or write JSC data.

create schema if not exists jsc;
revoke all on schema jsc from public, anon, authenticated;
grant usage on schema jsc to service_role;

create table jsc.customer_access (
  id                uuid primary key default gen_random_uuid(),
  code              text unique not null,
  customer_name     text not null,
  email             text not null,
  item_label        text not null,
  item_type         text not null default 'rv',
  current_status    text not null default 'Active',
  status            text not null default 'active',
  created_by        text,
  revoked           boolean not null default false,
  created_at        timestamptz not null default now(),
  phone             text,
  plan_type         text,
  monthly_rate      numeric,
  storage_location  text,
  next_service_date date,
  tags              text[] not null default '{}',
  internal_notes    text
);

create table jsc.access_updates (
  id         uuid primary key default gen_random_uuid(),
  access_id  uuid not null references jsc.customer_access(id) on delete cascade,
  title      text not null,
  body       text,
  created_by text,
  created_at timestamptz not null default now()
);

create table jsc.customer_requests (
  id             uuid primary key default gen_random_uuid(),
  access_id      uuid not null references jsc.customer_access(id) on delete cascade,
  type           text not null,
  requested_date date,
  details        text,
  status         text not null default 'new',
  created_at     timestamptz not null default now()
);

create table jsc.customer_messages (
  id               uuid primary key default gen_random_uuid(),
  access_id        uuid not null references jsc.customer_access(id) on delete cascade,
  sender           text not null,
  body             text not null,
  read_by_owner    boolean not null default false,
  read_by_customer boolean not null default false,
  created_at       timestamptz not null default now()
);

create table jsc.appointments (
  id            uuid primary key default gen_random_uuid(),
  access_id     uuid not null references jsc.customer_access(id) on delete cascade,
  request_id    uuid references jsc.customer_requests(id) on delete set null,
  kind          text not null default 'pickup',
  title         text,
  scheduled_for timestamptz not null,
  status        text not null default 'scheduled',
  notes         text,
  created_by    text,
  created_at    timestamptz not null default now()
);

create table jsc.leads (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  email               text not null,
  phone               text not null,
  rv_type             text,
  interest            text not null,
  message             text not null,
  source              text not null default 'website',
  status              text not null default 'new',
  internal_notes      text,
  last_contacted_at   timestamptz,
  converted_access_id uuid references jsc.customer_access(id) on delete set null,
  created_at          timestamptz not null default now()
);

create table jsc.quotes (
  id            uuid primary key default gen_random_uuid(),
  access_id     uuid references jsc.customer_access(id) on delete set null,
  customer_name text not null,
  email         text not null,
  title         text not null,
  details       text,
  amount        numeric not null default 0,
  status        text not null default 'draft',
  valid_until   date,
  created_by    text,
  sent_at       timestamptz,
  created_at    timestamptz not null default now()
);

create table jsc.invoices (
  id            uuid primary key default gen_random_uuid(),
  access_id     uuid references jsc.customer_access(id) on delete set null,
  quote_id      uuid references jsc.quotes(id) on delete set null,
  customer_name text not null,
  email         text not null,
  title         text not null,
  details       text,
  amount        numeric not null default 0,
  amount_paid   numeric not null default 0,
  status        text not null default 'sent',
  due_date      date,
  created_by    text,
  sent_at       timestamptz,
  paid_at       timestamptz,
  created_at    timestamptz not null default now()
);

create table jsc.expenses (
  id          uuid primary key default gen_random_uuid(),
  date        date not null default current_date,
  category    text not null default 'other',
  vendor      text,
  description text,
  amount      numeric not null,
  created_by  text,
  created_at  timestamptz not null default now()
);

create index idx_access_updates_access    on jsc.access_updates(access_id);
create index idx_customer_requests_access on jsc.customer_requests(access_id);
create index idx_customer_requests_status on jsc.customer_requests(status);
create index idx_customer_access_code     on jsc.customer_access(lower(code));
create index idx_customer_messages_access on jsc.customer_messages(access_id);
create index idx_appointments_access      on jsc.appointments(access_id);
create index idx_appointments_scheduled   on jsc.appointments(scheduled_for);
create index idx_leads_status             on jsc.leads(status);
create index idx_quotes_access            on jsc.quotes(access_id);
create index idx_invoices_access          on jsc.invoices(access_id);
create index idx_expenses_date            on jsc.expenses(date);

alter table jsc.customer_access   enable row level security;
alter table jsc.access_updates    enable row level security;
alter table jsc.customer_requests enable row level security;
alter table jsc.customer_messages enable row level security;
alter table jsc.appointments      enable row level security;
alter table jsc.leads             enable row level security;
alter table jsc.quotes            enable row level security;
alter table jsc.invoices          enable row level security;
alter table jsc.expenses          enable row level security;

grant select, insert, update, delete on all tables in schema jsc to service_role;
alter default privileges in schema jsc grant select, insert, update, delete on tables to service_role;
