// Lightweight signed session for the code-based customer panel.
// Separate cookie from the staff session; same HMAC signing (session-crypto).

import { cookies } from "next/headers";
import { signPayload, verifyPayload } from "./session-crypto";

const COOKIE_NAME = "jsc_access";
const TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

type AccessSession = { accessId: string; iat: number };

export async function setAccessSession(accessId: string) {
  const c = await cookies();
  c.set(COOKIE_NAME, signPayload({ accessId, iat: Date.now() }), {
    path: "/",
    maxAge: TTL_MS / 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

/** Returns the signed-in access id, or null. Verifies signature + TTL. */
export async function getAccessSession(): Promise<string | null> {
  const c = await cookies();
  const raw = c.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const data = verifyPayload<AccessSession>(raw, TTL_MS);
  if (!data || typeof data.accessId !== "string") return null;
  return data.accessId;
}

export async function clearAccessSession() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
