"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { accessStore } from "@/lib/access-store";
import { requireRole } from "@/lib/auth";
import { sendAccessCodeEmail } from "@/lib/email";
import { leadsStore } from "@/lib/leads-store";
import type { AccessItemType, Lead, LeadStatus } from "@/lib/types";

function revalidateLead(id: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function setLeadStatusAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager", "tech");
  const id = String(formData.get("leadId") ?? "");
  const status = String(formData.get("status") ?? "new") as LeadStatus;
  if (id) await leadsStore.updateLead(id, { status });
  revalidateLead(id);
}

export async function logContactAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager", "tech");
  const id = String(formData.get("leadId") ?? "");
  if (!id) return;
  const lead = await leadsStore.getLead(id);
  // Logging a call/contact advances a brand-new inquiry to "contacted".
  const status: LeadStatus | undefined = lead?.status === "new" ? "contacted" : undefined;
  await leadsStore.updateLead(id, {
    lastContactedAt: new Date().toISOString(),
    ...(status ? { status } : {}),
  });
  revalidateLead(id);
}

export async function saveLeadNotesAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager", "tech");
  const id = String(formData.get("leadId") ?? "");
  const internalNotes = String(formData.get("internalNotes") ?? "");
  if (id) await leadsStore.updateLead(id, { internalNotes });
  revalidateLead(id);
}

function itemTypeFor(lead: Lead): AccessItemType {
  if (lead.rvType === "Boat") return "boat";
  if (lead.interest === "plan") return "plan";
  if (lead.interest === "storage") return "storage";
  return "rv";
}

export async function convertLeadAction(formData: FormData): Promise<void> {
  const user = await requireRole("admin", "manager");
  const id = String(formData.get("leadId") ?? "");
  const itemLabel =
    String(formData.get("itemLabel") ?? "").trim() ||
    "New customer — set item";
  const notify = formData.get("notify") !== null;
  if (!id) return;

  const lead = await leadsStore.getLead(id);
  if (!lead) redirect("/admin/leads");
  if (lead.convertedAccessId) redirect(`/admin/access/${lead.convertedAccessId}`);

  const access = await accessStore.createAccess({
    customerName: lead.name,
    email: lead.email,
    phone: lead.phone,
    itemLabel,
    itemType: itemTypeFor(lead),
    currentStatus: "New customer",
    createdBy: user.name,
  });

  await leadsStore.updateLead(id, { status: "converted", convertedAccessId: access.id });
  if (notify) await sendAccessCodeEmail(access);

  revalidateLead(id);
  revalidatePath("/admin/access");
  redirect(`/admin/access/${access.id}?created=1`);
}
