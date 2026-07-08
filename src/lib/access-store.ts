// Repository for the code-based customer-access feature.
//
// Uses Supabase (service role) when configured, and otherwise a process-local
// in-memory store so the feature works in the demo before Supabase keys are
// added. Every method is async and returns the same shapes from either backend.

import { customAlphabet } from "nanoid";
import { getSupabaseAdmin } from "./supabase/server";
import type {
  AccessItemType,
  AccessStatus,
  AccessUpdate,
  CustomerAccess,
  CustomerRequest,
  CustomerRequestStatus,
  CustomerRequestType,
} from "./types";

// Unambiguous alphabet (no 0/O/1/I) for codes people read over the phone.
const genSuffix = customAlphabet("23456789ABCDEFGHJKMNPQRSTUVWXYZ", 6);
function newCode(): string {
  return `JSC-${genSuffix()}`;
}
function newId(prefix: string): string {
  return `${prefix}-${genSuffix()}${genSuffix()}`;
}

// ─────────────── in-memory backend (demo / fallback) ───────────────
type AccessDB = {
  access: CustomerAccess[];
  updates: AccessUpdate[];
  requests: CustomerRequest[];
};
const g = globalThis as unknown as { __jsc_access?: AccessDB };
if (!g.__jsc_access) {
  g.__jsc_access = { access: [], updates: [], requests: [] };
}
const mem = g.__jsc_access!;

// ─────────────── row mappers (Supabase snake_case → camelCase) ───────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
function mapAccess(r: any): CustomerAccess {
  return {
    id: r.id,
    code: r.code,
    customerName: r.customer_name,
    email: r.email,
    itemLabel: r.item_label,
    itemType: r.item_type as AccessItemType,
    currentStatus: r.current_status,
    status: r.status as AccessStatus,
    createdBy: r.created_by ?? undefined,
    revoked: r.revoked,
    createdAt: r.created_at,
  };
}
function mapUpdate(r: any): AccessUpdate {
  return {
    id: r.id,
    accessId: r.access_id,
    title: r.title,
    body: r.body ?? undefined,
    createdBy: r.created_by ?? undefined,
    createdAt: r.created_at,
  };
}
function mapRequest(r: any): CustomerRequest {
  return {
    id: r.id,
    accessId: r.access_id,
    type: r.type as CustomerRequestType,
    requestedDate: r.requested_date ?? undefined,
    details: r.details ?? undefined,
    status: r.status as CustomerRequestStatus,
    createdAt: r.created_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export type NewAccessInput = {
  customerName: string;
  email: string;
  itemLabel: string;
  itemType: AccessItemType;
  currentStatus?: string;
  createdBy?: string;
};

export const accessStore = {
  // ── customer_access ──
  async listAccess(): Promise<CustomerAccess[]> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("customer_access")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapAccess);
    }
    return [...mem.access].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getAccess(id: string): Promise<CustomerAccess | null> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("customer_access")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data ? mapAccess(data) : null;
    }
    return mem.access.find((a) => a.id === id) ?? null;
  },

  async getAccessByCode(code: string): Promise<CustomerAccess | null> {
    const normalized = code.trim().toUpperCase();
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("customer_access")
        .select("*")
        .eq("code", normalized)
        .maybeSingle();
      if (error) throw error;
      return data ? mapAccess(data) : null;
    }
    return mem.access.find((a) => a.code.toUpperCase() === normalized) ?? null;
  },

  /** Look up by code and confirm the email matches (case-insensitive) and not revoked. */
  async verifyAccess(code: string, email: string): Promise<CustomerAccess | null> {
    const found = await this.getAccessByCode(code);
    if (!found || found.revoked) return null;
    if (found.email.trim().toLowerCase() !== email.trim().toLowerCase()) return null;
    return found;
  },

  async createAccess(input: NewAccessInput): Promise<CustomerAccess> {
    // Generate a code that isn't already taken.
    let code = newCode();
    for (let i = 0; i < 8; i++) {
      const existing = await this.getAccessByCode(code);
      if (!existing) break;
      code = newCode();
    }

    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("customer_access")
        .insert({
          code,
          customer_name: input.customerName,
          email: input.email,
          item_label: input.itemLabel,
          item_type: input.itemType,
          current_status: input.currentStatus ?? "Active",
          created_by: input.createdBy ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapAccess(data);
    }

    const rec: CustomerAccess = {
      id: newId("acc"),
      code,
      customerName: input.customerName,
      email: input.email,
      itemLabel: input.itemLabel,
      itemType: input.itemType,
      currentStatus: input.currentStatus ?? "Active",
      status: "active",
      createdBy: input.createdBy,
      revoked: false,
      createdAt: new Date().toISOString(),
    };
    mem.access.unshift(rec);
    return rec;
  },

  async updateAccess(
    id: string,
    patch: Partial<Pick<CustomerAccess, "currentStatus" | "status" | "revoked" | "itemLabel">>,
  ): Promise<CustomerAccess | null> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const row: Record<string, unknown> = {};
      if (patch.currentStatus !== undefined) row.current_status = patch.currentStatus;
      if (patch.status !== undefined) row.status = patch.status;
      if (patch.revoked !== undefined) row.revoked = patch.revoked;
      if (patch.itemLabel !== undefined) row.item_label = patch.itemLabel;
      const { data, error } = await sb
        .from("customer_access")
        .update(row)
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data ? mapAccess(data) : null;
    }
    const rec = mem.access.find((a) => a.id === id);
    if (!rec) return null;
    Object.assign(rec, patch);
    return rec;
  },

  // ── access_updates ──
  async listUpdates(accessId: string): Promise<AccessUpdate[]> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("access_updates")
        .select("*")
        .eq("access_id", accessId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapUpdate);
    }
    return mem.updates
      .filter((u) => u.accessId === accessId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async addUpdate(
    accessId: string,
    input: { title: string; body?: string; createdBy?: string },
  ): Promise<AccessUpdate> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("access_updates")
        .insert({
          access_id: accessId,
          title: input.title,
          body: input.body ?? null,
          created_by: input.createdBy ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapUpdate(data);
    }
    const rec: AccessUpdate = {
      id: newId("upd"),
      accessId,
      title: input.title,
      body: input.body,
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    };
    mem.updates.unshift(rec);
    return rec;
  },

  // ── customer_requests ──
  async listRequests(accessId?: string): Promise<CustomerRequest[]> {
    const sb = getSupabaseAdmin();
    if (sb) {
      let q = sb.from("customer_requests").select("*").order("created_at", { ascending: false });
      if (accessId) q = q.eq("access_id", accessId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapRequest);
    }
    return mem.requests
      .filter((r) => !accessId || r.accessId === accessId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async countOpenRequests(): Promise<number> {
    const all = await this.listRequests();
    return all.filter((r) => r.status === "new").length;
  },

  async createRequest(
    accessId: string,
    input: { type: CustomerRequestType; requestedDate?: string; details?: string },
  ): Promise<CustomerRequest> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("customer_requests")
        .insert({
          access_id: accessId,
          type: input.type,
          requested_date: input.requestedDate ?? null,
          details: input.details ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapRequest(data);
    }
    const rec: CustomerRequest = {
      id: newId("req"),
      accessId,
      type: input.type,
      requestedDate: input.requestedDate,
      details: input.details,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    mem.requests.unshift(rec);
    return rec;
  },

  async updateRequestStatus(
    id: string,
    status: CustomerRequestStatus,
  ): Promise<CustomerRequest | null> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("customer_requests")
        .update({ status })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data ? mapRequest(data) : null;
    }
    const rec = mem.requests.find((r) => r.id === id);
    if (!rec) return null;
    rec.status = status;
    return rec;
  },
};
