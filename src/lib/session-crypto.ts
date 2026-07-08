// Shared HMAC signing for signed cookies (staff sessions + customer access).
// One audited place for the secret so the fail-closed rule can't drift.

import { createHmac, timingSafeEqual } from "node:crypto";

const DEV_FALLBACK_SECRET = "jsc-dev-insecure-secret-do-not-use-in-prod";

export function getSessionSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === "production") {
    // Fail closed: never sign/verify with a source-visible secret in production.
    throw new Error(
      "[auth] AUTH_SECRET is missing or too short in production. Refusing to sign " +
        "sessions with an insecure fallback. Set AUTH_SECRET (openssl rand -base64 32).",
    );
  }
  return s || DEV_FALLBACK_SECRET; // dev/test only
}

/** Keyed HMAC-SHA256 digest of `input`. Used for signing and password checks. */
export function hmacDigest(input: string): Buffer {
  return createHmac("sha256", getSessionSecret()).update(input).digest();
}

/** Sign an arbitrary JSON payload into a `body.sig` token. */
export function signPayload(obj: unknown): string {
  const body = Buffer.from(JSON.stringify(obj), "utf8").toString("base64url");
  const sig = hmacDigest(body).toString("base64url");
  return `${body}.${sig}`;
}

/**
 * Verify + parse a `body.sig` token. Returns null on any tampering, bad format,
 * or (when maxAgeMs is given) when the payload's numeric `iat` is missing/expired.
 */
export function verifyPayload<T>(token: string, maxAgeMs?: number): T | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);

  const expected = hmacDigest(body);
  let provided: Buffer;
  try {
    provided = Buffer.from(providedSig, "base64url");
  } catch {
    return null;
  }
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T & {
      iat?: unknown;
    };
    if (maxAgeMs != null) {
      const iat = typeof data.iat === "number" ? data.iat : null;
      if (iat == null || Date.now() - iat > maxAgeMs) return null;
    }
    return data as T;
  } catch {
    return null;
  }
}
