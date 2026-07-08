import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase admin client (service role). RLS is enabled on the
// customer-access tables with no anon policies, so all access goes through
// this service-role client, which bypasses RLS. The service key must NEVER be
// exposed to the browser — this module is guarded by `import "server-only"`.

let cached: SupabaseClient | null = null;

/** True when the app has enough config to talk to Supabase server-side. */
export function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/** Returns the service-role client, or null when Supabase isn't configured. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseConfigured()) return null;
  if (!cached) {
    cached = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return cached;
}
