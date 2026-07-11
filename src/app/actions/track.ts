"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { accessStore } from "@/lib/access-store";
import {
  clearAccessSession,
  getAccessSession,
  setAccessSession,
} from "@/lib/access-auth";
import { sendCustomerRequestEmail, sendOwnerMessageEmail } from "@/lib/email";
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
  revalidatePath("/admin/requests");
  redirect("/track?sent=1");
}

export async function sendCustomerMessageAction(formData: FormData): Promise<void> {
  const accessId = await getAccessSession();
  if (!accessId) redirect("/track?error=session");

  const body = String(formData.get("body") ?? "").trim();
  if (!body) redirect("/track#messages");

  await accessStore.addMessage(accessId, "customer", body);

  const access = await accessStore.getAccess(accessId);
  if (access) await sendOwnerMessageEmail(access, body);

  revalidatePath("/track");
  revalidatePath("/admin/access");
  redirect("/track?msg=1#messages");
}

export async function markCustomerReadAction(accessId: string): Promise<void> {
  const session = await getAccessSession();
  // Only the signed-in customer may mark their own thread read.
  if (!session || session !== accessId) return;
  await accessStore.markThreadRead(accessId, "customer");
  revalidatePath("/track");
}
