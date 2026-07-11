"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { accessStore, type AccessPatch } from "@/lib/access-store";
import { requireRole } from "@/lib/auth";
import {
  sendAccessCodeEmail,
  sendAppointmentEmail,
  sendCustomerMessageEmail,
  sendCustomerUpdateEmail,
} from "@/lib/email";
import { apptInputToIso } from "@/lib/utils";
import type {
  AccessItemType,
  AppointmentKind,
  AppointmentStatus,
  CustomerRequestStatus,
} from "@/lib/types";

function numOrNull(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export async function createAccessAction(formData: FormData): Promise<void> {
  const user = await requireRole("admin", "manager");
  const customerName = String(formData.get("customerName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const itemLabel = String(formData.get("itemLabel") ?? "").trim();
  const itemType = String(formData.get("itemType") ?? "rv") as AccessItemType;
  const currentStatus = String(formData.get("currentStatus") ?? "").trim() || "Active";
  const phone = String(formData.get("phone") ?? "").trim() || undefined;
  const planType = String(formData.get("planType") ?? "").trim() || undefined;
  const monthlyRate = numOrNull(formData.get("monthlyRate")) ?? undefined;
  const storageLocation = String(formData.get("storageLocation") ?? "").trim() || undefined;
  const nextServiceDate = String(formData.get("nextServiceDate") ?? "").trim() || undefined;
  const notify = formData.get("notify") === "on";

  if (!customerName || !email || !itemLabel) {
    throw new Error("Customer name, email, and item are all required.");
  }

  const access = await accessStore.createAccess({
    customerName,
    email,
    phone,
    itemLabel,
    itemType,
    currentStatus,
    planType,
    monthlyRate,
    storageLocation,
    nextServiceDate,
    createdBy: user.name,
  });

  if (notify) await sendAccessCodeEmail(access);

  revalidatePath("/admin/access");
  redirect(`/admin/access/${access.id}?created=1`);
}

export async function saveCustomerDetailsAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const accessId = String(formData.get("accessId") ?? "");
  if (!accessId) throw new Error("Missing customer.");

  const tagsRaw = String(formData.get("tags") ?? "");
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t, i, arr) => arr.indexOf(t) === i);

  const patch: AccessPatch = {
    customerName: String(formData.get("customerName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    itemLabel: String(formData.get("itemLabel") ?? "").trim(),
    itemType: String(formData.get("itemType") ?? "rv") as AccessItemType,
    planType: String(formData.get("planType") ?? "").trim(),
    monthlyRate: numOrNull(formData.get("monthlyRate")),
    storageLocation: String(formData.get("storageLocation") ?? "").trim(),
    nextServiceDate: String(formData.get("nextServiceDate") ?? "").trim() || null,
    tags,
  };

  await accessStore.updateAccess(accessId, patch);
  revalidatePath(`/admin/access/${accessId}`);
  revalidatePath("/admin/access");
  revalidatePath("/track");
}

export async function saveInternalNotesAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager", "tech");
  const accessId = String(formData.get("accessId") ?? "");
  const internalNotes = String(formData.get("internalNotes") ?? "");
  if (accessId) await accessStore.updateAccess(accessId, { internalNotes });
  revalidatePath(`/admin/access/${accessId}`);
}

export async function addUpdateAction(formData: FormData): Promise<void> {
  const user = await requireRole("admin", "manager", "tech");
  const accessId = String(formData.get("accessId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim() || undefined;
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
  revalidatePath("/admin/requests");
  revalidatePath("/track");
}

export async function toggleRevokeAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const accessId = String(formData.get("accessId") ?? "");
  const revoke = formData.get("revoke") !== "false";
  if (accessId) await accessStore.updateAccess(accessId, { revoked: revoke });
  revalidatePath(`/admin/access/${accessId}`);
  revalidatePath("/admin/access");
}

// ── messaging ──

export async function sendOwnerMessageAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager", "tech");
  const accessId = String(formData.get("accessId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const notify = formData.get("notify") !== null;
  if (!accessId || !body) return;

  await accessStore.addMessage(accessId, "owner", body);
  await accessStore.markThreadRead(accessId, "owner");

  if (notify) {
    const access = await accessStore.getAccess(accessId);
    if (access) await sendCustomerMessageEmail(access, body);
  }

  revalidatePath(`/admin/access/${accessId}`);
  revalidatePath("/track");
}

export async function markMessagesReadAction(accessId: string): Promise<void> {
  await requireRole("admin", "manager", "tech");
  if (!accessId) return;
  await accessStore.markThreadRead(accessId, "owner");
  revalidatePath(`/admin/access/${accessId}`);
  revalidatePath("/admin/access");
}

// ── appointments ──

export async function scheduleAppointmentAction(formData: FormData): Promise<void> {
  const user = await requireRole("admin", "manager", "tech");
  const accessId = String(formData.get("accessId") ?? "");
  const kind = String(formData.get("kind") ?? "pickup") as AppointmentKind;
  const scheduledForLocal = String(formData.get("scheduledFor") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || undefined;
  const notes = String(formData.get("notes") ?? "").trim() || undefined;
  const requestId = String(formData.get("requestId") ?? "").trim() || undefined;
  const notify = formData.get("notify") !== null;

  if (!accessId || !scheduledForLocal) throw new Error("Pick a date and time.");

  const appt = await accessStore.createAppointment({
    accessId,
    kind,
    scheduledFor: apptInputToIso(scheduledForLocal),
    title,
    notes,
    requestId,
    createdBy: user.name,
  });

  // If this came from a request, mark that request scheduled.
  if (requestId) await accessStore.updateRequestStatus(requestId, "scheduled");

  if (notify) {
    const access = await accessStore.getAccess(accessId);
    if (access) await sendAppointmentEmail(access, appt);
  }

  revalidatePath(`/admin/access/${accessId}`);
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/requests");
  revalidatePath("/track");
}

export async function updateAppointmentStatusAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager", "tech");
  const id = String(formData.get("appointmentId") ?? "");
  const accessId = String(formData.get("accessId") ?? "");
  const status = String(formData.get("status") ?? "scheduled") as AppointmentStatus;
  if (id) await accessStore.updateAppointmentStatus(id, status);
  revalidatePath(`/admin/access/${accessId}`);
  revalidatePath("/admin/appointments");
  revalidatePath("/track");
}
