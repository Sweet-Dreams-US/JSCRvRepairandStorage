// Demo cookie-based auth. Replace with Supabase / Auth.js for production.

import { cookies } from "next/headers";
import { store } from "./store";
import type { Role, User } from "./types";

const COOKIE_NAME = "jsc_session";

export type Session = {
  userId: string;
  role: Role;
};

export async function getSession(): Promise<Session | null> {
  const c = await cookies();
  const raw = c.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  return store.getUser(session.userId) ?? null;
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
  const session: Session = { userId, role: user.role };
  const c = await cookies();
  c.set(COOKIE_NAME, JSON.stringify(session), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });
}

export async function clearSession() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

// Convenience: demo users available for quick login
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
