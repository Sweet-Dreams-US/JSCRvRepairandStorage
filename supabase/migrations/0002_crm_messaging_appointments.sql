-- 0002: turn the customer-access spine into a real CRM + comms + scheduling backbone.
-- Applied to the JSCRvService project (ref uaksqgpkmxwhqupjcuzh) on 2026-07-11.

-- CRM fields on the customer record
alter table public.customer_access add column if not exists phone text;
alter table public.customer_access add column if not exists plan_type text;
alter table public.customer_access add column if not exists monthly_rate numeric;
alter table public.customer_access add column if not exists storage_location text;
alter table public.customer_access add column if not exists next_service_date date;
alter table public.customer_access add column if not exists tags text[] not null default '{}';
alter table public.customer_access add column if not exists internal_notes text;

-- Two-way messages between the shop (owner) and the customer
create table if not exists public.customer_messages (
  id               uuid primary key default gen_random_uuid(),
  access_id        uuid not null references public.customer_access(id) on delete cascade,
  sender           text not null,            -- 'owner' | 'customer'
  body             text not null,
  read_by_owner    boolean not null default false,
  read_by_customer boolean not null default false,
  created_at       timestamptz not null default now()
);
create index if not exists idx_customer_messages_access on public.customer_messages(access_id);

-- Scheduled appointments (pickup / service / dropoff / other)
create table if not exists public.appointments (
  id            uuid primary key default gen_random_uuid(),
  access_id     uuid not null references public.customer_access(id) on delete cascade,
  request_id    uuid references public.customer_requests(id) on delete set null,
  kind          text not null default 'pickup',   -- pickup | service | dropoff | other
  title         text,
  scheduled_for timestamptz not null,
  status        text not null default 'scheduled',-- scheduled | confirmed | completed | cancelled
  notes         text,
  created_by    text,
  created_at    timestamptz not null default now()
);
create index if not exists idx_appointments_access on public.appointments(access_id);
create index if not exists idx_appointments_scheduled on public.appointments(scheduled_for);

-- Server-side (service-role) access only.
alter table public.customer_messages enable row level security;
alter table public.appointments      enable row level security;
