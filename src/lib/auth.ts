// Session auth for the JSC RV Service platform.
//
// Sessions are stored in an HMAC-signed, httpOnly cookie. The signature
// (keyed on AUTH_SECRET) means a visitor cannot forge a cookie to grant
// themselves an admin role — any tampering fails verification and the
// session is rejected. This is what makes requireRole() trustworthy.
//
// Swap to Supabase / Auth.js for the full production build; the signing
// approach here is a solid, dependency-free gate for the simple deployment.

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { hmacDigest, signPayload, verifyPayload } from "./session-crypto";
import { store } from "./store";
import type { Role, User } from "./types";

const COOKIE_NAME = "jsc_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export type Session = {
  userId: string;
  role: Role;
};

type SignedPayload = Session & { iat: number };

// ─────────────── signing ───────────────
// Signature + secret handling live in session-crypto.ts (single audited place).

function encode(payload: SignedPayload): string {
  return signPayload(payload);
}

function decode(token: string): SignedPayload | null {
  // Verifies the HMAC signature and the iat-based TTL in one step.
  const data = verifyPayload<SignedPayload>(token, SESSION_TTL_MS);
  if (!data || typeof data.userId !== "string" || typeof data.role !== "string") {
    return null;
  }
  return data;
}

// ─────────────── session ───────────────

export async function getSession(): Promise<Session | null> {
  const c = await cookies();
  const raw = c.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const data = decode(raw);
  if (!data) return null;
  return { userId: data.userId, role: data.role };
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  const user = store.getUser(session.userId);
  if (!user) return null;
  // The role is re-read from the store, not trusted from the cookie —
  // defense in depth in case a user's role changed since sign-in.
  return user;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized — no active session");
  return user;
}

export async function requireRole(...roles: Role[]): Promise<User> {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    throw new Error(`Forbidden — requires role ${roles.join(" | ")}`);
  }
  return user;
}

export async function setSession(userId: string) {
  const user = store.getUser(userId);
  if (!user) throw new Error("Unknown user");
  const token = encode({ userId, role: user.role, iat: Date.now() });
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSession() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

// ─────────────── password / demo gating ───────────────

/** Owner/admin account the password login maps to. */
export const OWNER_USER_ID = "staff-joe";

/**
 * Constant-time check of the submitted password against ADMIN_PASSWORD.
 * Compares HMAC digests (fixed length) so neither the timing nor the
 * length of the comparison leaks information. Returns false when no
 * ADMIN_PASSWORD is configured.
 */
export function verifyAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(hmacDigest(input), hmacDigest(expected));
}

/** Whether the one-click demo accounts + role-switcher are enabled. */
export function isDemoMode(): boolean {
  if (process.env.NODE_ENV === "production") {
    // Fail closed: passwordless demo login is only ever on in production when
    // explicitly opted in (e.g. the sales-demo deploy sets DEMO_MODE=true).
    return process.env.DEMO_MODE === "true";
  }
  return process.env.DEMO_MODE !== "false";
}

// Convenience: demo users available for quick login (demo mode only)
export const DEMO_ACCOUNTS = [
  { id: "cust-demo", label: "Jane Whitcomb", subtitle: "Customer — has stored RV, active pickup", role: "customer" as Role },
  { id: "staff-joe", label: "Joe Crawford", subtitle: "Owner / Admin", role: "admin" as Role },
  { id: "staff-tina", label: "Tina Hartwell", subtitle: "Office Manager", role: "manager" as Role },
  { id: "staff-hank", label: "Marcus \"Hank\" Henderson", subtitle: "Lead Tech", role: "tech" as Role },
  { id: "staff-danny", label: "Daniel Klingsmith", subtitle: "Tech", role: "tech" as Role },
  { id: "staff-eddie", label: "Eddie Brooks", subtitle: "Yard & Prep", role: "tech" as Role },
];

export function routeForRole(role: Role) {
  if (role === "customer") return "/portal";
  return "/admin";
}
