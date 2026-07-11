"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { accessStore } from "@/lib/access-store";
import { billingStore } from "@/lib/billing-store";
import { requireRole } from "@/lib/auth";
import { sendInvoiceEmail, sendQuoteEmail } from "@/lib/email";
import type { CustomerQuoteStatus } from "@/lib/types";

function num(v: FormDataEntryValue | null): number {
  const n = Number(String(v ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Resolve the bill-to customer: an existing customer (by accessId) wins,
 * otherwise the typed name/email for a one-off. */
async function resolveCustomer(formData: FormData) {
  const accessId = String(formData.get("accessId") ?? "").trim() || undefined;
  if (accessId) {
    const a = await accessStore.getAccess(accessId);
    if (a) return { accessId: a.id, customerName: a.customerName, email: a.email };
  }
  return {
    accessId: undefined as string | undefined,
    customerName: String(formData.get("customerName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
  };
}

// ── quotes ──
export async function createQuoteAction(formData: FormData): Promise<void> {
  const user = await requireRole("admin", "manager");
  const { accessId, customerName, email } = await resolveCustomer(formData);
  const title = String(formData.get("title") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim() || undefined;
  const amount = num(formData.get("amount"));
  const validUntil = String(formData.get("validUntil") ?? "").trim() || undefined;
  const sendNow = formData.get("sendNow") !== null;

  if (!customerName || !email || !title) throw new Error("Customer, email, and a title are required.");

  const quote = await billingStore.createQuote({
    accessId,
    customerName,
    email,
    title,
    details,
    amount,
    validUntil,
    status: sendNow ? "sent" : "draft",
    createdBy: user.name,
  });
  if (sendNow) await sendQuoteEmail(quote);

  revalidatePath("/admin/quotes");
  if (accessId) revalidatePath(`/admin/access/${accessId}`);
  redirect("/admin/quotes");
}

export async function sendQuoteAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const id = String(formData.get("quoteId") ?? "");
  const quote = await billingStore.setQuoteStatus(id, "sent");
  if (quote) await sendQuoteEmail(quote);
  revalidatePath("/admin/quotes");
  if (quote?.accessId) revalidatePath(`/admin/access/${quote.accessId}`);
}

export async function setQuoteStatusAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const id = String(formData.get("quoteId") ?? "");
  const status = String(formData.get("status") ?? "draft") as CustomerQuoteStatus;
  await billingStore.setQuoteStatus(id, status);
  revalidatePath("/admin/quotes");
}

// ── invoices ──
export async function createInvoiceAction(formData: FormData): Promise<void> {
  const user = await requireRole("admin", "manager");
  const { accessId, customerName, email } = await resolveCustomer(formData);
  const title = String(formData.get("title") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim() || undefined;
  const amount = num(formData.get("amount"));
  const dueDate = String(formData.get("dueDate") ?? "").trim() || undefined;
  const sendNow = formData.get("sendNow") !== null;

  if (!customerName || !email || !title) throw new Error("Customer, email, and a title are required.");

  const invoice = await billingStore.createInvoice({
    accessId,
    customerName,
    email,
    title,
    details,
    amount,
    dueDate,
    status: sendNow ? "sent" : "draft",
    createdBy: user.name,
  });
  if (sendNow) await sendInvoiceEmail(invoice);

  revalidatePath("/admin/invoices");
  revalidatePath("/admin/accounting");
  if (accessId) revalidatePath(`/admin/access/${accessId}`);
  redirect("/admin/invoices");
}

export async function sendInvoiceAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const id = String(formData.get("invoiceId") ?? "");
  const invoice = await billingStore.setInvoiceStatus(id, "sent");
  if (invoice) await sendInvoiceEmail(invoice);
  revalidatePath("/admin/invoices");
  if (invoice?.accessId) revalidatePath(`/admin/access/${invoice.accessId}`);
}

export async function recordPaymentAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const id = String(formData.get("invoiceId") ?? "");
  const amount = num(formData.get("amount"));
  if (id && amount > 0) await billingStore.recordPayment(id, amount);
  revalidatePath("/admin/invoices");
  revalidatePath("/admin/accounting");
}

// ── expenses ──
export async function addExpenseAction(formData: FormData): Promise<void> {
  const user = await requireRole("admin", "manager");
  const date = String(formData.get("date") ?? "").trim() || new Date().toISOString().slice(0, 10);
  const category = String(formData.get("category") ?? "other").trim() || "other";
  const vendor = String(formData.get("vendor") ?? "").trim() || undefined;
  const description = String(formData.get("description") ?? "").trim() || undefined;
  const amount = num(formData.get("amount"));
  if (amount <= 0) throw new Error("Enter an amount.");
  await billingStore.addExpense({ date, category, vendor, description, amount, createdBy: user.name });
  revalidatePath("/admin/accounting");
}

export async function deleteExpenseAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const id = String(formData.get("expenseId") ?? "");
  if (id) await billingStore.deleteExpense(id);
  revalidatePath("/admin/accounting");
}
