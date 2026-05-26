"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { store } from "@/lib/store";
import type { JobStatus, PickupRequest } from "@/lib/types";

export async function changeJobStatusAction(formData: FormData) {
  const user = await requireRole("admin", "manager", "tech");
  const jobId = String(formData.get("jobId") ?? "");
  const status = String(formData.get("status") ?? "") as JobStatus;
  store.updateJobStatus(jobId, status, user.id, user.name);
  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  return { ok: true };
}

export async function addJobNoteAction(formData: FormData) {
  const user = await requireRole("admin", "manager", "tech");
  const jobId = String(formData.get("jobId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const internal = formData.get("internal") === "on";
  if (!body) return { ok: false, error: "Note cannot be empty" };
  store.addJobNote(jobId, {
    authorId: user.id,
    authorName: user.name,
    body,
    internal,
  });
  revalidatePath(`/admin/jobs/${jobId}`);
  return { ok: true };
}

export async function toggleChecklistAction(formData: FormData) {
  const user = await requireRole("admin", "manager", "tech");
  const jobId = String(formData.get("jobId") ?? "");
  const itemId = String(formData.get("itemId") ?? "");
  store.toggleChecklistItem(jobId, itemId, user.name);
  revalidatePath(`/admin/jobs/${jobId}`);
  return { ok: true };
}

export async function updatePickupStatusAction(formData: FormData) {
  const user = await requireRole("admin", "manager", "tech");
  const pickupId = String(formData.get("pickupId") ?? "");
  const status = String(formData.get("status") ?? "") as PickupRequest["status"];
  store.updatePickupStatus(pickupId, status, user.id);
  revalidatePath("/admin");
  revalidatePath("/admin/pickups");
  return { ok: true };
}

export async function recordPaymentAction(formData: FormData) {
  await requireRole("admin", "manager");
  const invoiceId = String(formData.get("invoiceId") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const method = String(formData.get("method") ?? "card") as "cash" | "check" | "card" | "ach" | "other";
  const reference = String(formData.get("reference") ?? "");
  const notedBy = String(formData.get("notedBy") ?? "Tina");
  if (amount <= 0) return { ok: false, error: "Amount must be positive" };
  store.recordPayment(invoiceId, { amount, method, reference, notedBy });
  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { ok: true };
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireRole("admin", "manager");
  const id = String(formData.get("leadId") ?? "");
  const status = String(formData.get("status") ?? "") as
    | "new"
    | "contacted"
    | "scheduled"
    | "converted"
    | "lost";
  store.updateLeadStatus(id, status);
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}
