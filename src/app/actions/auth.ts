"use server";

import { redirect } from "next/navigation";
import {
  OWNER_USER_ID,
  clearSession,
  isDemoMode,
  routeForRole,
  setSession,
  verifyAdminPassword,
} from "@/lib/auth";
import { store } from "@/lib/store";

export async function loginAsDemoUser(formData: FormData): Promise<void> {
  // Demo one-click login is disabled outside demo mode.
  if (!isDemoMode()) redirect("/login");
  const userId = String(formData.get("userId") ?? "");
  const user = store.getUser(userId);
  if (!user) return;
  await setSession(user.id);
  redirect(routeForRole(user.role));
}

export async function loginWithPasswordAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminPassword(password)) {
    // Wrong password, or no ADMIN_PASSWORD configured on this deployment.
    redirect("/login?error=invalid");
  }
  await setSession(OWNER_USER_ID);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
