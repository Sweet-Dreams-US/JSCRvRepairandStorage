"use server";

import { redirect } from "next/navigation";
import { clearSession, routeForRole, setSession } from "@/lib/auth";
import { store } from "@/lib/store";

export async function loginAsDemoUser(formData: FormData): Promise<void> {
  const userId = String(formData.get("userId") ?? "");
  const user = store.getUser(userId);
  if (!user) return;
  await setSession(user.id);
  redirect(routeForRole(user.role));
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  const user = store.getUserByEmail(email);
  if (!user) return;
  await setSession(user.id);
  redirect(routeForRole(user.role));
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
