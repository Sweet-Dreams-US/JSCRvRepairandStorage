import "server-only";

import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client. RLS is enabled on every JSC table, and the
// browser never talks to Supabase — all access goes through this module,
// guarded by `import "server-only"`. Two configurations are supported:
//
// - Shared FreeWebsites project (current): publishable key + SUPABASE_ADMIN_TOKEN,
//   sent as `x-admin-token`. RLS only lets requests carrying a token whose hash
//   is in private.jsc_admin_token touch the `jsc` schema, so this credential
//   can't reach any other client's data.
// - Original standalone project: SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const adminToken = process.env.SUPABASE_ADMIN_TOKEN;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const useAdminToken = Boolean(publishableKey && adminToken);

function createAdminClient() {
  return createClient(url!, useAdminToken ? publishableKey! : serviceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
    // JSC tables live in the `jsc` schema on the shared FreeWebsites project;
    // unset means `public` (the original standalone JSCRvService project).
    db: { schema: process.env.SUPABASE_DB_SCHEMA || "public" },
    global: useAdminToken ? { headers: { "x-admin-token": adminToken! } } : undefined,
  });
}

type AdminClient = ReturnType<typeof createAdminClient>;

let cached: AdminClient | null = null;

/** True when the app has enough config to talk to Supabase server-side. */
export function supabaseConfigured(): boolean {
  return Boolean(url && (useAdminToken || serviceRoleKey));
}

/** Returns the server-side client, or null when Supabase isn't configured. */
export function getSupabaseAdmin(): AdminClient | null {
  if (!supabaseConfigured()) return null;
  if (!cached) cached = createAdminClient();
  return cached;
}
