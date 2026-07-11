// Repository for inquiries (leads) from the public site.
// Supabase (service role) when configured, else in-memory fallback.

import { customAlphabet } from "nanoid";
import { getSupabaseAdmin } from "./supabase/server";
import type { Lead, LeadStatus, RvType } from "./types";

const genId = customAlphabet("23456789abcdefghijkmnpqrstuvwxyz", 10);

type LeadsDB = { leads: Lead[] };
const g = globalThis as unknown as { __jsc_leads?: LeadsDB };
if (!g.__jsc_leads) g.__jsc_leads = { leads: [] };
const mem = g.__jsc_leads!;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* eslint-disable @typescript-eslint/no-explicit-any */
function map(r: any): Lead {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    rvType: r.rv_type ?? undefined,
    interest: r.interest,
    message: r.message,
    source: r.source,
    status: r.status as LeadStatus,
    internalNotes: r.internal_notes ?? undefined,
    lastContactedAt: r.last_contacted_at ?? undefined,
    convertedAccessId: r.converted_access_id ?? undefined,
    createdAt: r.created_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export type NewLeadInput = {
  name: string;
  email: string;
  phone: string;
  rvType?: RvType;
  interest: Lead["interest"];
  message: string;
  source: Lead["source"];
};

export type LeadPatch = Partial<{
  status: LeadStatus;
  internalNotes: string;
  lastContactedAt: string | null;
  convertedAccessId: string | null;
}>;

export const leadsStore = {
  async listLeads(): Promise<Lead[]> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(map);
    }
    return [...mem.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getLead(id: string): Promise<Lead | null> {
    const sb = getSupabaseAdmin();
    if (sb) {
      if (!UUID_RE.test(id)) return null;
      const { data, error } = await sb.from("leads").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? map(data) : null;
    }
    return mem.leads.find((l) => l.id === id) ?? null;
  },

  async countNew(): Promise<number> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { count, error } = await sb
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");
      if (error) throw error;
      return count ?? 0;
    }
    return mem.leads.filter((l) => l.status === "new").length;
  },

  async createLead(input: NewLeadInput): Promise<Lead> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("leads")
        .insert({
          name: input.name,
          email: input.email,
          phone: input.phone,
          rv_type: input.rvType ?? null,
          interest: input.interest,
          message: input.message,
          source: input.source,
        })
        .select()
        .single();
      if (error) throw error;
      return map(data);
    }
    const rec: Lead = {
      id: genId(),
      name: input.name,
      email: input.email,
      phone: input.phone,
      rvType: input.rvType,
      interest: input.interest,
      message: input.message,
      source: input.source,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    mem.leads.unshift(rec);
    return rec;
  },

  async updateLead(id: string, patch: LeadPatch): Promise<Lead | null> {
    const sb = getSupabaseAdmin();
    if (sb) {
      if (!UUID_RE.test(id)) return null;
      const row: Record<string, unknown> = {};
      if (patch.status !== undefined) row.status = patch.status;
      if (patch.internalNotes !== undefined) row.internal_notes = patch.internalNotes;
      if (patch.lastContactedAt !== undefined) row.last_contacted_at = patch.lastContactedAt;
      if (patch.convertedAccessId !== undefined) row.converted_access_id = patch.convertedAccessId;
      const { data, error } = await sb
        .from("leads")
        .update(row)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data ? map(data) : null;
    }
    const rec = mem.leads.find((l) => l.id === id);
    if (!rec) return null;
    Object.assign(rec, patch);
    return rec;
  },
};
