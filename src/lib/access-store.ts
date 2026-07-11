// Repository for the code-based customer-access CRM.
//
// This is the real, live spine of the business tool: customers (with their
// plan / storage / service info), the updates and requests tied to them,
// two-way messaging, and scheduled appointments.
//
// Uses Supabase (service role) when configured, and otherwise a process-local
// in-memory store so the feature works before Supabase keys are added. Every
// method is async and returns the same shapes from either backend.

import { customAlphabet } from "nanoid";
import { getSupabaseAdmin } from "./supabase/server";
import type {
  AccessItemType,
  AccessStatus,
  AccessUpdate,
  Appointment,
  AppointmentKind,
  AppointmentStatus,
  CustomerAccess,
  CustomerMessage,
  CustomerRequest,
  CustomerRequestStatus,
  CustomerRequestType,
  MessageSender,
} from "./types";

// Unambiguous alphabet (no 0/O/1/I) for codes people read over the phone.
const genSuffix = customAlphabet("23456789ABCDEFGHJKMNPQRSTUVWXYZ", 6);
function newCode(): string {
  return `JSC-${genSuffix()}`;
}
function newId(prefix: string): string {
  return `${prefix}-${genSuffix()}${genSuffix()}`;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(s: string): boolean {
  return UUID_RE.test(s);
}

// ─────────────── in-memory backend (demo / fallback) ───────────────
type AccessDB = {
  access: CustomerAccess[];
  updates: AccessUpdate[];
  requests: CustomerRequest[];
  messages: CustomerMessage[];
  appointments: Appointment[];
};
const g = globalThis as unknown as { __jsc_access?: AccessDB };
if (!g.__jsc_access) {
  g.__jsc_access = { access: [], updates: [], requests: [], messages: [], appointments: [] };
}
const mem = g.__jsc_access!;
// Self-heal older in-memory shapes that predate messages/appointments.
if (!mem.messages) mem.messages = [];
if (!mem.appointments) mem.appointments = [];

// ─────────────── row mappers (Supabase snake_case → camelCase) ───────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
function mapAccess(r: any): CustomerAccess {
  return {
    id: r.id,
    code: r.code,
    customerName: r.customer_name,
    email: r.email,
    phone: r.phone ?? undefined,
    itemLabel: r.item_label,
    itemType: r.item_type as AccessItemType,
    currentStatus: r.current_status,
    status: r.status as AccessStatus,
    planType: r.plan_type ?? undefined,
    monthlyRate: r.monthly_rate == null ? undefined : Number(r.monthly_rate),
    storageLocation: r.storage_location ?? undefined,
    nextServiceDate: r.next_service_date ?? undefined,
    tags: Array.isArray(r.tags) ? r.tags : [],
    internalNotes: r.internal_notes ?? undefined,
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
function mapMessage(r: any): CustomerMessage {
  return {
    id: r.id,
    accessId: r.access_id,
    sender: r.sender as MessageSender,
    body: r.body,
    readByOwner: r.read_by_owner,
    readByCustomer: r.read_by_customer,
    createdAt: r.created_at,
  };
}
function mapAppointment(r: any): Appointment {
  return {
    id: r.id,
    accessId: r.access_id,
    requestId: r.request_id ?? undefined,
    kind: r.kind as AppointmentKind,
    title: r.title ?? undefined,
    scheduledFor: r.scheduled_for,
    status: r.status as AppointmentStatus,
    notes: r.notes ?? undefined,
    createdBy: r.created_by ?? undefined,
    createdAt: r.created_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export type NewAccessInput = {
  customerName: string;
  email: string;
  phone?: string;
  itemLabel: string;
  itemType: AccessItemType;
  currentStatus?: string;
  planType?: string;
  monthlyRate?: number;
  storageLocation?: string;
  nextServiceDate?: string;
  createdBy?: string;
};

export type AccessPatch = Partial<{
  customerName: string;
  email: string;
  phone: string;
  itemLabel: string;
  itemType: AccessItemType;
  currentStatus: string;
  status: AccessStatus;
  planType: string;
  monthlyRate: number | null;
  storageLocation: string;
  nextServiceDate: string | null;
  tags: string[];
  internalNotes: string;
  revoked: boolean;
}>;

export type DashboardSummary = {
  totalCustomers: number;
  activeCustomers: number;
  openRequests: number;
  unreadMessages: number;
  upcomingAppointments: number;
  monthlyRecurring: number;
};

export type ActivityItem = {
  kind: "update" | "request" | "message" | "appointment";
  accessId: string;
  customerName: string;
  summary: string;
  at: string;
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
      // A stale/forged session cookie could carry a non-UUID id — treat as
      // "not found" rather than letting Postgres throw (22P02).
      if (!isUuid(id)) return null;
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
          phone: input.phone ?? null,
          item_label: input.itemLabel,
          item_type: input.itemType,
          current_status: input.currentStatus ?? "Active",
          plan_type: input.planType ?? null,
          monthly_rate: input.monthlyRate ?? null,
          storage_location: input.storageLocation ?? null,
          next_service_date: input.nextServiceDate ?? null,
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
      phone: input.phone,
      itemLabel: input.itemLabel,
      itemType: input.itemType,
      currentStatus: input.currentStatus ?? "Active",
      status: "active",
      planType: input.planType,
      monthlyRate: input.monthlyRate,
      storageLocation: input.storageLocation,
      nextServiceDate: input.nextServiceDate,
      tags: [],
      createdBy: input.createdBy,
      revoked: false,
      createdAt: new Date().toISOString(),
    };
    mem.access.unshift(rec);
    return rec;
  },

  async updateAccess(id: string, patch: AccessPatch): Promise<CustomerAccess | null> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const row: Record<string, unknown> = {};
      const map: Record<keyof AccessPatch, string> = {
        customerName: "customer_name",
        email: "email",
        phone: "phone",
        itemLabel: "item_label",
        itemType: "item_type",
        currentStatus: "current_status",
        status: "status",
        planType: "plan_type",
        monthlyRate: "monthly_rate",
        storageLocation: "storage_location",
        nextServiceDate: "next_service_date",
        tags: "tags",
        internalNotes: "internal_notes",
        revoked: "revoked",
      };
      for (const key of Object.keys(patch) as (keyof AccessPatch)[]) {
        if (patch[key] !== undefined) row[map[key]] = patch[key];
      }
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

  async getRequest(id: string): Promise<CustomerRequest | null> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("customer_requests")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data ? mapRequest(data) : null;
    }
    return mem.requests.find((r) => r.id === id) ?? null;
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

  // ── customer_messages (two-way) ──
  async listMessages(accessId: string): Promise<CustomerMessage[]> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("customer_messages")
        .select("*")
        .eq("access_id", accessId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapMessage);
    }
    return mem.messages
      .filter((m) => m.accessId === accessId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  async addMessage(
    accessId: string,
    sender: MessageSender,
    body: string,
  ): Promise<CustomerMessage> {
    const readByOwner = sender === "owner";
    const readByCustomer = sender === "customer";
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("customer_messages")
        .insert({
          access_id: accessId,
          sender,
          body,
          read_by_owner: readByOwner,
          read_by_customer: readByCustomer,
        })
        .select()
        .single();
      if (error) throw error;
      return mapMessage(data);
    }
    const rec: CustomerMessage = {
      id: newId("msg"),
      accessId,
      sender,
      body,
      readByOwner,
      readByCustomer,
      createdAt: new Date().toISOString(),
    };
    mem.messages.push(rec);
    return rec;
  },

  /** Mark the whole thread read for one side (owner viewing, or customer viewing). */
  async markThreadRead(accessId: string, reader: MessageSender): Promise<void> {
    const col = reader === "owner" ? "read_by_owner" : "read_by_customer";
    const sb = getSupabaseAdmin();
    if (sb) {
      const { error } = await sb
        .from("customer_messages")
        .update({ [col]: true })
        .eq("access_id", accessId)
        .eq(col, false);
      if (error) throw error;
      return;
    }
    for (const m of mem.messages) {
      if (m.accessId === accessId) {
        if (reader === "owner") m.readByOwner = true;
        else m.readByCustomer = true;
      }
    }
  },

  /** Total messages from customers the owner hasn't read yet. */
  async countUnreadForOwner(): Promise<number> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { count, error } = await sb
        .from("customer_messages")
        .select("*", { count: "exact", head: true })
        .eq("sender", "customer")
        .eq("read_by_owner", false);
      if (error) throw error;
      return count ?? 0;
    }
    return mem.messages.filter((m) => m.sender === "customer" && !m.readByOwner).length;
  },

  /** Per-customer unread-for-owner counts, for list badges. */
  async unreadByAccessForOwner(): Promise<Record<string, number>> {
    const sb = getSupabaseAdmin();
    const out: Record<string, number> = {};
    if (sb) {
      const { data, error } = await sb
        .from("customer_messages")
        .select("access_id")
        .eq("sender", "customer")
        .eq("read_by_owner", false);
      if (error) throw error;
      for (const r of data ?? []) out[r.access_id] = (out[r.access_id] ?? 0) + 1;
      return out;
    }
    for (const m of mem.messages) {
      if (m.sender === "customer" && !m.readByOwner) {
        out[m.accessId] = (out[m.accessId] ?? 0) + 1;
      }
    }
    return out;
  },

  // ── appointments ──
  async listAppointments(accessId?: string): Promise<Appointment[]> {
    const sb = getSupabaseAdmin();
    if (sb) {
      let q = sb.from("appointments").select("*").order("scheduled_for", { ascending: true });
      if (accessId) q = q.eq("access_id", accessId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map(mapAppointment);
    }
    return mem.appointments
      .filter((a) => !accessId || a.accessId === accessId)
      .sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
  },

  /** Upcoming, non-cancelled appointments across all customers. */
  async upcomingAppointments(limit = 50): Promise<Appointment[]> {
    const all = await this.listAppointments();
    const nowIso = new Date().toISOString();
    return all
      .filter((a) => a.status !== "cancelled" && a.status !== "completed" && a.scheduledFor >= nowIso)
      .slice(0, limit);
  },

  async createAppointment(input: {
    accessId: string;
    kind: AppointmentKind;
    scheduledFor: string;
    title?: string;
    notes?: string;
    requestId?: string;
    createdBy?: string;
  }): Promise<Appointment> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("appointments")
        .insert({
          access_id: input.accessId,
          request_id: input.requestId ?? null,
          kind: input.kind,
          title: input.title ?? null,
          scheduled_for: input.scheduledFor,
          notes: input.notes ?? null,
          created_by: input.createdBy ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return mapAppointment(data);
    }
    const rec: Appointment = {
      id: newId("apt"),
      accessId: input.accessId,
      requestId: input.requestId,
      kind: input.kind,
      title: input.title,
      scheduledFor: input.scheduledFor,
      status: "scheduled",
      notes: input.notes,
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    };
    mem.appointments.push(rec);
    return rec;
  },

  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<Appointment | null> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("appointments")
        .update({ status })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data ? mapAppointment(data) : null;
    }
    const rec = mem.appointments.find((a) => a.id === id);
    if (!rec) return null;
    rec.status = status;
    return rec;
  },

  // ── dashboard / activity ──
  async dashboardSummary(): Promise<DashboardSummary> {
    const [access, requests, unread, upcoming] = await Promise.all([
      this.listAccess(),
      this.listRequests(),
      this.countUnreadForOwner(),
      this.upcomingAppointments(500),
    ]);
    const active = access.filter((a) => !a.revoked && a.status === "active");
    return {
      totalCustomers: access.length,
      activeCustomers: active.length,
      openRequests: requests.filter((r) => r.status === "new").length,
      unreadMessages: unread,
      upcomingAppointments: upcoming.length,
      monthlyRecurring: active.reduce((sum, a) => sum + (a.monthlyRate ?? 0), 0),
    };
  },

  /** Unified recent-activity feed across updates, requests, messages, appointments. */
  async recentActivity(limit = 12): Promise<ActivityItem[]> {
    const [access, updates, requests, appointments] = await Promise.all([
      this.listAccess(),
      // pull recent items from each stream; per-customer lists are cheap in aggregate here
      this._recentUpdates(40),
      this.listRequests(),
      this.listAppointments(),
    ]);
    const nameById = new Map(access.map((a) => [a.id, a.customerName] as const));
    const items: ActivityItem[] = [];
    for (const u of updates) {
      items.push({
        kind: "update",
        accessId: u.accessId,
        customerName: nameById.get(u.accessId) ?? "Customer",
        summary: `Update posted — “${u.title}”`,
        at: u.createdAt,
      });
    }
    for (const r of requests) {
      items.push({
        kind: "request",
        accessId: r.accessId,
        customerName: nameById.get(r.accessId) ?? "Customer",
        summary: `${cap(r.type)} request${r.status === "new" ? " (new)" : ""}`,
        at: r.createdAt,
      });
    }
    for (const a of appointments) {
      items.push({
        kind: "appointment",
        accessId: a.accessId,
        customerName: nameById.get(a.accessId) ?? "Customer",
        summary: `${cap(a.kind)} appointment ${a.status}`,
        at: a.createdAt,
      });
    }
    return items.sort((x, y) => y.at.localeCompare(x.at)).slice(0, limit);
  },

  // Internal: recent updates across all customers (Supabase can do it in one query).
  async _recentUpdates(limit: number): Promise<AccessUpdate[]> {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data, error } = await sb
        .from("access_updates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []).map(mapUpdate);
    }
    return [...mem.updates].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
  },
};

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
