// Repository for real billing: quotes, invoices, and shop expenses.
// Supabase (service role) when configured, else in-memory fallback.

import { customAlphabet } from "nanoid";
import { getSupabaseAdmin } from "./supabase/server";
import type {
  CustomerInvoice,
  CustomerInvoiceStatus,
  CustomerQuote,
  CustomerQuoteStatus,
  ShopExpense,
} from "./types";

const genId = customAlphabet("23456789abcdefghijkmnpqrstuvwxyz", 10);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type BillingDB = {
  quotes: CustomerQuote[];
  invoices: CustomerInvoice[];
  expenses: ShopExpense[];
};
const g = globalThis as unknown as { __jsc_billing?: BillingDB };
if (!g.__jsc_billing) g.__jsc_billing = { quotes: [], invoices: [], expenses: [] };
const mem = g.__jsc_billing!;

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapQuote(r: any): CustomerQuote {
  return {
    id: r.id,
    accessId: r.access_id ?? undefined,
    customerName: r.customer_name,
    email: r.email,
    title: r.title,
    details: r.details ?? undefined,
    amount: Number(r.amount),
    status: r.status as CustomerQuoteStatus,
    validUntil: r.valid_until ?? undefined,
    createdBy: r.created_by ?? undefined,
    sentAt: r.sent_at ?? undefined,
    createdAt: r.created_at,
  };
}
function mapInvoice(r: any): CustomerInvoice {
  return {
    id: r.id,
    accessId: r.access_id ?? undefined,
    quoteId: r.quote_id ?? undefined,
    customerName: r.customer_name,
    email: r.email,
    title: r.title,
    details: r.details ?? undefined,
    amount: Number(r.amount),
    amountPaid: Number(r.amount_paid),
    status: r.status as CustomerInvoiceStatus,
    dueDate: r.due_date ?? undefined,
    createdBy: r.created_by ?? undefined,
    sentAt: r.sent_at ?? undefined,
    paidAt: r.paid_at ?? undefined,
    createdAt: r.created_at,
  };
}
function mapExpense(r: any): ShopExpense {
  return {
    id: r.id,
    date: r.date,
    category: r.category,
    vendor: r.vendor ?? undefined,
    description: r.description ?? undefined,
    amount: Number(r.amount),
    createdBy: r.created_by ?? undefined,
    createdAt: r.created_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export type NewQuoteInput = {
  accessId?: string;
  customerName: string;
  email: string;
  title: string;
  details?: string;
  amount: number;
  validUntil?: string;
  status?: CustomerQuoteStatus;
  createdBy?: string;
};
export type NewInvoiceInput = {
  accessId?: string;
  quoteId?: string;
  customerName: string;
  email: string;
  title: string;
  details?: string;
  amount: number;
  dueDate?: string;
  status?: CustomerInvoiceStatus;
  createdBy?: string;
};
export type NewExpenseInput = {
  date: string;
  category: string;
  vendor?: string;
  description?: string;
  amount: number;
  createdBy?: string;
};

export type FinanceSummary = {
  income: number; // collected (sum of invoice payments)
  outstanding: number; // billed but unpaid
  expenses: number;
  net: number; // income − expenses
};

export const billingStore = {
  // ── quotes ──
  async listQuotes(accessId?: string): Promise<CustomerQuote[]> {
    const sb = getSupabaseAdmin();
    if (sb) {
      let q = sb.from("quotes").select("*").order("created_at", { ascending: false });
      if (accessId) q = q.eq("access_id", accessId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapQuote);
    }
    return mem.quotes
      .filter((x) => !accessId || x.accessId === accessId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getQuote(id: string): Promise<CustomerQuote | null> {
    const sb = getSupabaseAdmin();
    if (sb) {
      if (!UUID_RE.test(id)) return null;
      const { data, error } = await sb.from("quotes").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapQuote(data) : null;
    }
    return mem.quotes.find((x) => x.id === id) ?? null;
  },

  async createQuote(input: NewQuoteInput): Promise<CustomerQuote> {
    const status = input.status ?? "draft";
    const sentAt = status === "sent" ? new Date().toISOString() : undefined;
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("quotes")
        .insert({
          access_id: input.accessId ?? null,
          customer_name: input.customerName,
          email: input.email,
          title: input.title,
          details: input.details ?? null,
          amount: input.amount,
          status,
          valid_until: input.validUntil ?? null,
          created_by: input.createdBy ?? null,
          sent_at: sentAt ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapQuote(data);
    }
    const rec: CustomerQuote = {
      id: genId(),
      accessId: input.accessId,
      customerName: input.customerName,
      email: input.email,
      title: input.title,
      details: input.details,
      amount: input.amount,
      status,
      validUntil: input.validUntil,
      createdBy: input.createdBy,
      sentAt,
      createdAt: new Date().toISOString(),
    };
    mem.quotes.unshift(rec);
    return rec;
  },

  async setQuoteStatus(id: string, status: CustomerQuoteStatus): Promise<CustomerQuote | null> {
    const patch: Record<string, unknown> = { status };
    if (status === "sent") patch.sent_at = new Date().toISOString();
    const sb = getSupabaseAdmin();
    if (sb) {
      if (!UUID_RE.test(id)) return null;
      const { data, error } = await sb.from("quotes").update(patch).eq("id", id).select().maybeSingle();
      if (error) throw error;
      return data ? mapQuote(data) : null;
    }
    const rec = mem.quotes.find((x) => x.id === id);
    if (!rec) return null;
    rec.status = status;
    if (status === "sent") rec.sentAt = new Date().toISOString();
    return rec;
  },

  // ── invoices ──
  async listInvoices(accessId?: string): Promise<CustomerInvoice[]> {
    const sb = getSupabaseAdmin();
    if (sb) {
      let q = sb.from("invoices").select("*").order("created_at", { ascending: false });
      if (accessId) q = q.eq("access_id", accessId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapInvoice);
    }
    return mem.invoices
      .filter((x) => !accessId || x.accessId === accessId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getInvoice(id: string): Promise<CustomerInvoice | null> {
    const sb = getSupabaseAdmin();
    if (sb) {
      if (!UUID_RE.test(id)) return null;
      const { data, error } = await sb.from("invoices").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapInvoice(data) : null;
    }
    return mem.invoices.find((x) => x.id === id) ?? null;
  },

  async createInvoice(input: NewInvoiceInput): Promise<CustomerInvoice> {
    const status = input.status ?? "sent";
    const sentAt = status === "sent" ? new Date().toISOString() : undefined;
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("invoices")
        .insert({
          access_id: input.accessId ?? null,
          quote_id: input.quoteId ?? null,
          customer_name: input.customerName,
          email: input.email,
          title: input.title,
          details: input.details ?? null,
          amount: input.amount,
          status,
          due_date: input.dueDate ?? null,
          created_by: input.createdBy ?? null,
          sent_at: sentAt ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapInvoice(data);
    }
    const rec: CustomerInvoice = {
      id: genId(),
      accessId: input.accessId,
      quoteId: input.quoteId,
      customerName: input.customerName,
      email: input.email,
      title: input.title,
      details: input.details,
      amount: input.amount,
      amountPaid: 0,
      status,
      dueDate: input.dueDate,
      createdBy: input.createdBy,
      sentAt,
      createdAt: new Date().toISOString(),
    };
    mem.invoices.unshift(rec);
    return rec;
  },

  /** Record a payment against an invoice; marks it paid when fully covered. */
  async recordPayment(id: string, amount: number): Promise<CustomerInvoice | null> {
    const inv = await this.getInvoice(id);
    if (!inv) return null;
    const amountPaid = Math.min(inv.amount, inv.amountPaid + amount);
    const fullyPaid = amountPaid >= inv.amount;
    const patch: Record<string, unknown> = {
      amount_paid: amountPaid,
      status: fullyPaid ? "paid" : inv.status === "draft" ? "sent" : inv.status,
      paid_at: fullyPaid ? new Date().toISOString() : null,
    };
    const sb = getSupabaseAdmin();
    if (sb) {
      if (!UUID_RE.test(id)) return null;
      const { data, error } = await sb.from("invoices").update(patch).eq("id", id).select().maybeSingle();
      if (error) throw error;
      return data ? mapInvoice(data) : null;
    }
    const rec = mem.invoices.find((x) => x.id === id)!;
    rec.amountPaid = amountPaid;
    rec.status = fullyPaid ? "paid" : rec.status === "draft" ? "sent" : rec.status;
    rec.paidAt = fullyPaid ? new Date().toISOString() : undefined;
    return rec;
  },

  async setInvoiceStatus(id: string, status: CustomerInvoiceStatus): Promise<CustomerInvoice | null> {
    const sb = getSupabaseAdmin();
    if (sb) {
      if (!UUID_RE.test(id)) return null;
      const { data, error } = await sb.from("invoices").update({ status }).eq("id", id).select().maybeSingle();
      if (error) throw error;
      return data ? mapInvoice(data) : null;
    }
    const rec = mem.invoices.find((x) => x.id === id);
    if (!rec) return null;
    rec.status = status;
    return rec;
  },

  // ── expenses ──
  async listExpenses(): Promise<ShopExpense[]> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb.from("expenses").select("*").order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapExpense);
    }
    return [...mem.expenses].sort((a, b) => b.date.localeCompare(a.date));
  },

  async addExpense(input: NewExpenseInput): Promise<ShopExpense> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("expenses")
        .insert({
          date: input.date,
          category: input.category,
          vendor: input.vendor ?? null,
          description: input.description ?? null,
          amount: input.amount,
          created_by: input.createdBy ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapExpense(data);
    }
    const rec: ShopExpense = {
      id: genId(),
      date: input.date,
      category: input.category,
      vendor: input.vendor,
      description: input.description,
      amount: input.amount,
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    };
    mem.expenses.unshift(rec);
    return rec;
  },

  async deleteExpense(id: string): Promise<void> {
    const sb = getSupabaseAdmin();
    if (sb) {
      if (!UUID_RE.test(id)) return;
      const { error } = await sb.from("expenses").delete().eq("id", id);
      if (error) throw error;
      return;
    }
    const i = mem.expenses.findIndex((x) => x.id === id);
    if (i >= 0) mem.expenses.splice(i, 1);
  },

  // ── summary ──
  async financeSummary(): Promise<FinanceSummary> {
    const [invoices, expenses] = await Promise.all([this.listInvoices(), this.listExpenses()]);
    const income = invoices.reduce((s, i) => s + i.amountPaid, 0);
    const outstanding = invoices
      .filter((i) => i.status !== "void" && i.status !== "paid")
      .reduce((s, i) => s + (i.amount - i.amountPaid), 0);
    const exp = expenses.reduce((s, e) => s + e.amount, 0);
    return { income, outstanding, expenses: exp, net: income - exp };
  },
};
