-- FreeWebsites: gate the `jsc` schema behind a JSC-only admin token instead of
-- the project-wide service-role key (house pattern, see Jeronimo/Whole Heart).
-- The server sends the publishable key plus `x-admin-token`; only a request
-- whose token hash is in private.jsc_admin_token can touch any jsc table.
-- The token hash itself is inserted out of band, never committed.

create table if not exists private.jsc_admin_token (
  token_hash text primary key,
  label      text,
  created_at timestamptz not null default now()
);
alter table private.jsc_admin_token enable row level security;
revoke all on table private.jsc_admin_token from public, anon, authenticated;

create or replace function private.jsc_admin_ok(candidate text)
returns boolean
language sql stable security definer
set search_path to 'private', 'extensions', 'pg_temp'
as $$
  select exists (
    select 1 from private.jsc_admin_token
    where candidate is not null
      and token_hash = encode(extensions.digest(candidate, 'sha256'), 'hex')
  );
$$;

create or replace function private.jsc_request_is_admin()
returns boolean
language sql stable
set search_path to 'private', 'pg_temp'
as $$
  select private.jsc_admin_ok(
    nullif(current_setting('request.headers', true), '')::json ->> 'x-admin-token'
  );
$$;

revoke all on function private.jsc_admin_ok(text), private.jsc_request_is_admin() from public;
grant usage on schema private to anon;
grant execute on function private.jsc_admin_ok(text), private.jsc_request_is_admin() to anon;

grant usage on schema jsc to anon;
grant select, insert, update, delete on all tables in schema jsc to anon;
alter default privileges in schema jsc grant select, insert, update, delete on tables to anon;

do $$
declare t text;
begin
  foreach t in array array['customer_access','access_updates','customer_requests',
    'customer_messages','appointments','leads','quotes','invoices','expenses']
  loop
    execute format(
      'create policy "JSC admin token full access" on jsc.%I for all to anon
         using (private.jsc_request_is_admin()) with check (private.jsc_request_is_admin())', t);
  end loop;
end $$;
