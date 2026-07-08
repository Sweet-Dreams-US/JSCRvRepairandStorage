"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { accessStore } from "@/lib/access-store";
import { requireRole } from "@/lib/auth";
import { sendAccessCodeEmail, sendCustomerUpdateEmail } from "@/lib/email";
import type { AccessItemType, CustomerRequestStatus } from "@/lib/types";

export async function createAccessAction(formData: FormData): Promise<void> {
  const user = await requireRole("admin", "manager");
  const customerName = String(formData.get("customerName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const itemLabel = String(formData.get("itemLabel") ?? "").trim();
  const itemType = String(formData.get("itemType") ?? "rv") as AccessItemType;
  const currentStatus = String(formData.get("currentStatus") ?? "").trim() || "Active";
  const notify = formData.get("notify") === "on";

  if (!customerName || !email || !itemLabel) {
    throw new Error("Customer name, email, and item are all required.");
  }

  const access = await accessStore.createAccess({
    customerName,
    email,
    itemLabel,
    itemType,
    currentStatus,
    createdBy: user.name,
  });

  if (notify) await sendAccessCodeEmail(access);

  revalidatePath("/admin/access");
  redirect(`/admin/access/${access.id}?created=1`);
}

export async function addUpdateAction(formData: FormData): Promise<void> {
  const user = await requireRole("admin", "manager", "tech");
  const accessId = String(formData.get("accessId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim() || undefined;
  // Notify is a checkbox defaulting to checked; only "off" when explicitly unchecked.
  const notify = formData.get("notify") !== null;

  if (!accessId || !title) throw new Error("An update needs a title.");

  const update = await accessStore.addUpdate(accessId, { title, body, createdBy: user.name });

  if (notify) {
    const access = await accessStore.getAccess(accessId);
    if (access) await sendCustomerUpdateEmail(access, update);
  }

  revalidatePath(`/admin/access/${accessId}`);
  revalidatePath("/track");
}

export async function setCurrentStatusAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager", "tech");
  const accessId = String(formData.get("accessId") ?? "");
  const currentStatus = String(formData.get("currentStatus") ?? "").trim();
  if (accessId && currentStatus) {
    await accessStore.updateAccess(accessId, { currentStatus });
  }
  revalidatePath(`/admin/access/${accessId}`);
  revalidatePath("/track");
}

export async function updateRequestStatusAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager", "tech");
  const requestId = String(formData.get("requestId") ?? "");
  const accessId = String(formData.get("accessId") ?? "");
  const status = String(formData.get("status") ?? "new") as CustomerRequestStatus;
  if (requestId) await accessStore.updateRequestStatus(requestId, status);
  revalidatePath(`/admin/access/${accessId}`);
  revalidatePath("/admin/access");
}

export async function toggleRevokeAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const accessId = String(formData.get("accessId") ?? "");
  const revoke = formData.get("revoke") !== "false";
  if (accessId) await accessStore.updateAccess(accessId, { revoked: revoke });
  revalidatePath(`/admin/access/${accessId}`);
  revalidatePath("/admin/access");
}
