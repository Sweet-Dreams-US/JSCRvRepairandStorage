"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { accessStore } from "@/lib/access-store";
import {
  clearAccessSession,
  getAccessSession,
  setAccessSession,
} from "@/lib/access-auth";
import { sendCustomerRequestEmail } from "@/lib/email";
import type { CustomerRequestType } from "@/lib/types";

export async function trackLoginAction(formData: FormData): Promise<void> {
  const code = String(formData.get("code") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!code || !email) redirect("/track?error=missing");

  const access = await accessStore.verifyAccess(code, email);
  if (!access) redirect("/track?error=invalid");

  await setAccessSession(access.id);
  redirect("/track");
}

export async function trackLogoutAction(): Promise<void> {
  await clearAccessSession();
  redirect("/track");
}

export async function submitRequestAction(formData: FormData): Promise<void> {
  const accessId = await getAccessSession();
  if (!accessId) redirect("/track?error=session");

  const type = String(formData.get("type") ?? "other") as CustomerRequestType;
  const requestedDate = String(formData.get("requestedDate") ?? "").trim() || undefined;
  const details = String(formData.get("details") ?? "").trim() || undefined;

  const request = await accessStore.createRequest(accessId, { type, requestedDate, details });

  // Notify the shop (never throws).
  const access = await accessStore.getAccess(accessId);
  if (access) await sendCustomerRequestEmail(access, request);

  revalidatePath("/track");
  revalidatePath("/admin/access");
  redirect("/track?sent=1");
}
