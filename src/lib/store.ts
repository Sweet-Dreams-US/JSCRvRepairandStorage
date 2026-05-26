// In-memory data store wrapping the seed data.
// All UI / server actions hit this — swap to Postgres later by changing only this file.
// Module-level state persists across requests within a single Node process.

import { nanoid } from "nanoid";
import {
  ACTIVITY,
  CUSTOMERS,
  EXPENSES,
  INVOICES,
  JOBS,
  LEADS,
  LOT,
  MESSAGES,
  PICKUPS,
  QUOTES,
  RVS,
  SHIFTS,
  STAFF,
  THREADS,
  TIME_ENTRIES,
} from "./seed";
import type {
  ActivityEvent,
  Customer,
  Expense,
  Invoice,
  Job,
  JobNote,
  JobStatus,
  Lead,
  Message,
  PickupPrepRequest,
  PickupRequest,
  Quote,
  Rv,
  Shift,
  StaffMember,
  StorageSpot,
  Thread,
  TimeEntry,
  User,
} from "./types";

// Use globalThis so HMR in dev doesn't wipe state on every reload.
type DB = {
  customers: Customer[];
  staff: StaffMember[];
  rvs: Rv[];
  lot: StorageSpot[];
  jobs: Job[];
  quotes: Quote[];
  invoices: Invoice[];
  pickups: PickupRequest[];
  threads: Thread[];
  messages: Message[];
  leads: Lead[];
  shifts: Shift[];
  timeEntries: TimeEntry[];
  expenses: Expense[];
  activity: ActivityEvent[];
};

const g = globalThis as unknown as { __jsc_db?: DB };

if (!g.__jsc_db) {
  g.__jsc_db = {
    customers: structuredClone(CUSTOMERS),
    staff: structuredClone(STAFF),
    rvs: structuredClone(RVS),
    lot: structuredClone(LOT),
    jobs: structuredClone(JOBS),
    quotes: structuredClone(QUOTES),
    invoices: structuredClone(INVOICES),
    pickups: structuredClone(PICKUPS),
    threads: structuredClone(THREADS),
    messages: structuredClone(MESSAGES),
    leads: structuredClone(LEADS),
    shifts: structuredClone(SHIFTS),
    timeEntries: structuredClone(TIME_ENTRIES),
    expenses: structuredClone(EXPENSES),
    activity: structuredClone(ACTIVITY),
  };
}

const db = g.__jsc_db!;

// ---------- READS ----------
export const store = {
  // Lookups
  getUser(id: string): User | undefined {
    return db.customers.find((c) => c.id === id) ?? db.staff.find((s) => s.id === id);
  },
  getCustomerByEmail(email: string) {
    return db.customers.find((c) => c.email.toLowerCase() === email.toLowerCase());
  },
  getStaffByEmail(email: string) {
    return db.staff.find((s) => s.email.toLowerCase() === email.toLowerCase());
  },
  getUserByEmail(email: string): User | undefined {
    return this.getCustomerByEmail(email) ?? this.getStaffByEmail(email);
  },

  // Customers
  listCustomers() {
    return [...db.customers];
  },
  getCustomer(id: string) {
    return db.customers.find((c) => c.id === id);
  },

  // Staff
  listStaff() {
    return [...db.staff];
  },
  getStaff(id: string) {
    return db.staff.find((s) => s.id === id);
  },

  // RVs
  listRvs() {
    return [...db.rvs];
  },
  getRv(id: string) {
    return db.rvs.find((r) => r.id === id);
  },
  rvsByCustomer(customerId: string) {
    return db.rvs.filter((r) => r.customerId === customerId);
  },

  // Storage lot
  listLot() {
    return [...db.lot];
  },
  getLotSpot(id: string) {
    return db.lot.find((s) => s.id === id);
  },
  lotSpotForRv(rvId: string) {
    return db.lot.find((s) => s.occupiedByRvId === rvId);
  },

  // Jobs
  listJobs() {
    return [...db.jobs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  getJob(id: string) {
    return db.jobs.find((j) => j.id === id);
  },
  jobsByCustomer(customerId: string) {
    return db.jobs.filter((j) => j.customerId === customerId);
  },
  jobsByStatus(status: JobStatus) {
    return db.jobs.filter((j) => j.status === status);
  },
  jobsByTech(staffId: string) {
    return db.jobs.filter((j) => j.assignedTechIds.includes(staffId));
  },
  activeJobs() {
    return db.jobs.filter(
      (j) => !["completed", "cancelled"].includes(j.status),
    );
  },

  // Quotes
  listQuotes() {
    return [...db.quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  getQuote(id: string) {
    return db.quotes.find((q) => q.id === id);
  },
  quotesByCustomer(customerId: string) {
    return db.quotes.filter((q) => q.customerId === customerId);
  },

  // Invoices
  listInvoices() {
    return [...db.invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  getInvoice(id: string) {
    return db.invoices.find((i) => i.id === id);
  },
  invoicesByCustomer(customerId: string) {
    return db.invoices.filter((i) => i.customerId === customerId);
  },

  // Pickups
  listPickups() {
    return [...db.pickups].sort((a, b) => a.pickupDate.localeCompare(b.pickupDate));
  },
  pickupsByCustomer(customerId: string) {
    return db.pickups.filter((p) => p.customerId === customerId);
  },
  upcomingPickups(days = 14) {
    const cutoff = Date.now() + days * 86400000;
    return db.pickups.filter(
      (p) =>
        new Date(p.pickupDate).getTime() < cutoff &&
        ["pending", "confirmed", "prepping", "ready"].includes(p.status),
    );
  },

  // Threads + messages
  listThreads() {
    return [...db.threads].sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
  },
  getThread(id: string) {
    return db.threads.find((t) => t.id === id);
  },
  threadsByCustomer(customerId: string) {
    return db.threads.filter((t) => t.customerId === customerId);
  },
  threadsForUser(userId: string) {
    return db.threads.filter((t) => t.participantIds.includes(userId));
  },
  messagesByThread(threadId: string) {
    return db.messages
      .filter((m) => m.threadId === threadId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  // Leads
  listLeads() {
    return [...db.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  newLeads() {
    return db.leads.filter((l) => l.status === "new");
  },

  // Shifts
  listShifts() {
    return [...db.shifts];
  },
  shiftsByStaff(staffId: string) {
    return db.shifts.filter((s) => s.staffId === staffId);
  },

  // Time entries
  listTimeEntries() {
    return [...db.timeEntries];
  },
  timeByJob(jobId: string) {
    return db.timeEntries.filter((t) => t.jobId === jobId);
  },

  // Expenses
  listExpenses() {
    return [...db.expenses].sort((a, b) => b.date.localeCompare(a.date));
  },

  // Activity
  recentActivity(limit = 20) {
    return [...db.activity]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  },

  // ---------- WRITES ----------
  createLead(input: Omit<Lead, "id" | "status" | "createdAt">) {
    const lead: Lead = {
      ...input,
      id: `lead-${nanoid(6)}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    db.leads.unshift(lead);
    db.activity.unshift({
      id: `act-${nanoid(6)}`,
      kind: "lead-created",
      actorId: lead.id,
      actorName: lead.name,
      description: `New lead from ${lead.source} — ${lead.interest}`,
      targetType: "lead",
      targetId: lead.id,
      createdAt: lead.createdAt,
    });
    return lead;
  },

  updateLeadStatus(id: string, status: Lead["status"]) {
    const lead = db.leads.find((l) => l.id === id);
    if (!lead) return null;
    lead.status = status;
    return lead;
  },

  createPickup(input: {
    customerId: string;
    rvId: string;
    pickupDate: string;
    returnDate?: string;
    prepRequests: PickupPrepRequest[];
    notes?: string;
  }) {
    const pickup: PickupRequest = {
      id: `pickup-${nanoid(6)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      ...input,
    };
    db.pickups.unshift(pickup);
    const customer = db.customers.find((c) => c.id === input.customerId);
    db.activity.unshift({
      id: `act-${nanoid(6)}`,
      kind: "pickup-requested",
      actorId: input.customerId,
      actorName: customer?.name ?? "Customer",
      description: `Requested pickup on ${new Date(input.pickupDate).toLocaleDateString()}`,
      targetType: "pickup",
      targetId: pickup.id,
      createdAt: pickup.createdAt,
    });
    return pickup;
  },

  updatePickupStatus(id: string, status: PickupRequest["status"], preppedById?: string) {
    const pickup = db.pickups.find((p) => p.id === id);
    if (!pickup) return null;
    pickup.status = status;
    if (status === "ready" || status === "prepping") {
      pickup.preppedById = preppedById;
      pickup.preppedAt = new Date().toISOString();
    }
    return pickup;
  },

  decideQuote(
    quoteId: string,
    decision: "approved" | "declined",
    actorId: string,
    actorName: string,
    declineReason?: string,
  ) {
    const quote = db.quotes.find((q) => q.id === quoteId);
    if (!quote) return null;
    quote.status = decision;
    quote.decidedAt = new Date().toISOString();
    if (decision === "declined") quote.declineReason = declineReason;

    db.activity.unshift({
      id: `act-${nanoid(6)}`,
      kind: decision === "approved" ? "quote-approved" : "quote-declined",
      actorId,
      actorName,
      description: `${decision === "approved" ? "Approved" : "Declined"} quote ${quote.number} ($${quote.total.toFixed(2)})`,
      targetType: "quote",
      targetId: quote.id,
      createdAt: quote.decidedAt,
    });

    // If approved and linked to a job, advance the job
    if (decision === "approved" && quote.jobId) {
      const job = db.jobs.find((j) => j.id === quote.jobId);
      if (job && (job.status === "quote-sent" || job.status === "diagnosing")) {
        job.status = "approved";
      }
    }

    return quote;
  },

  updateJobStatus(jobId: string, status: JobStatus, actorId: string, actorName: string) {
    const job = db.jobs.find((j) => j.id === jobId);
    if (!job) return null;
    const prev = job.status;
    job.status = status;
    if (status === "completed") job.completedAt = new Date().toISOString();
    db.activity.unshift({
      id: `act-${nanoid(6)}`,
      kind: "job-status-changed",
      actorId,
      actorName,
      description: `${job.number}: ${prev} → ${status}`,
      targetType: "job",
      targetId: job.id,
      createdAt: new Date().toISOString(),
    });
    return job;
  },

  addJobNote(jobId: string, note: Omit<JobNote, "id" | "createdAt">) {
    const job = db.jobs.find((j) => j.id === jobId);
    if (!job) return null;
    const newNote: JobNote = {
      ...note,
      id: `note-${nanoid(6)}`,
      createdAt: new Date().toISOString(),
    };
    job.notes.push(newNote);
    return newNote;
  },

  toggleChecklistItem(jobId: string, itemId: string, doneBy: string) {
    const job = db.jobs.find((j) => j.id === jobId);
    if (!job) return null;
    const item = job.checklist.find((c) => c.id === itemId);
    if (!item) return null;
    item.done = !item.done;
    item.doneBy = item.done ? doneBy : undefined;
    item.doneAt = item.done ? new Date().toISOString() : undefined;
    return item;
  },

  sendMessage(input: { threadId: string; fromUserId: string; body: string }) {
    const thread = db.threads.find((t) => t.id === input.threadId);
    if (!thread) return null;
    const user = this.getUser(input.fromUserId);
    if (!user) return null;
    const msg: Message = {
      id: `msg-${nanoid(6)}`,
      threadId: input.threadId,
      fromUserId: input.fromUserId,
      fromName: user.name,
      fromRole: user.role,
      body: input.body,
      createdAt: new Date().toISOString(),
      readBy: [input.fromUserId],
    };
    db.messages.push(msg);
    thread.lastMessageAt = msg.createdAt;
    thread.participantIds.forEach((pid) => {
      if (pid !== input.fromUserId) {
        thread.unreadFor[pid] = (thread.unreadFor[pid] ?? 0) + 1;
      }
    });
    return msg;
  },

  markThreadRead(threadId: string, userId: string) {
    const thread = db.threads.find((t) => t.id === threadId);
    if (!thread) return;
    thread.unreadFor[userId] = 0;
    db.messages
      .filter((m) => m.threadId === threadId)
      .forEach((m) => {
        if (!m.readBy.includes(userId)) m.readBy.push(userId);
      });
  },

  createThread(input: {
    subject: string;
    customerId: string;
    jobId?: string;
    participantIds: string[];
    firstMessageFrom: string;
    firstMessageBody: string;
  }) {
    const thread: Thread = {
      id: `thread-${nanoid(6)}`,
      subject: input.subject,
      customerId: input.customerId,
      jobId: input.jobId,
      participantIds: input.participantIds,
      lastMessageAt: new Date().toISOString(),
      unreadFor: input.participantIds.reduce<Record<string, number>>((acc, id) => {
        acc[id] = id === input.firstMessageFrom ? 0 : 1;
        return acc;
      }, {}),
    };
    db.threads.unshift(thread);
    this.sendMessage({
      threadId: thread.id,
      fromUserId: input.firstMessageFrom,
      body: input.firstMessageBody,
    });
    return thread;
  },

  recordPayment(invoiceId: string, payment: { amount: number; method: "cash" | "check" | "card" | "ach" | "other"; reference?: string; notedBy: string }) {
    const inv = db.invoices.find((i) => i.id === invoiceId);
    if (!inv) return null;
    const pay = {
      id: `pay-${nanoid(6)}`,
      receivedAt: new Date().toISOString(),
      ...payment,
    };
    inv.payments.push(pay);
    inv.amountPaid += payment.amount;
    inv.balanceDue = Math.max(0, inv.total - inv.amountPaid);
    inv.status = inv.balanceDue === 0 ? "paid" : "partial";
    db.activity.unshift({
      id: `act-${nanoid(6)}`,
      kind: "payment-received",
      actorId: payment.notedBy,
      actorName: payment.notedBy,
      description: `Logged $${payment.amount.toFixed(2)} ${payment.method} payment on ${inv.number}`,
      targetType: "invoice",
      targetId: inv.id,
      createdAt: pay.receivedAt,
    });
    return pay;
  },

  // Analytics helpers
  computeStats() {
    const activeJobs = this.activeJobs();
    const jobsByStatus = activeJobs.reduce<Record<string, number>>((acc, j) => {
      acc[j.status] = (acc[j.status] ?? 0) + 1;
      return acc;
    }, {});
    const totalRevenue = db.invoices.reduce((sum, i) => sum + i.amountPaid, 0);
    const outstandingAR = db.invoices.reduce((sum, i) => sum + i.balanceDue, 0);
    const overdueAR = db.invoices
      .filter((i) => i.status === "overdue")
      .reduce((sum, i) => sum + i.balanceDue, 0);
    const lotOccupied = db.lot.filter((s) => s.occupiedByRvId).length;
    const lotTotal = db.lot.length;
    const monthlyStorageRev = db.lot
      .filter((s) => s.occupiedByRvId)
      .reduce((sum, s) => sum + s.monthlyRate, 0);
    const totalExpenses30d = db.expenses
      .filter((e) => Date.now() - new Date(e.date).getTime() < 30 * 86400000)
      .reduce((sum, e) => sum + e.amount, 0);
    const newLeads = db.leads.filter((l) => l.status === "new").length;
    const upcomingPickups = this.upcomingPickups(14).length;
    return {
      activeJobs: activeJobs.length,
      jobsByStatus,
      totalRevenue,
      outstandingAR,
      overdueAR,
      lotOccupied,
      lotTotal,
      lotOccupancyPct: Math.round((lotOccupied / lotTotal) * 100),
      monthlyStorageRev,
      totalExpenses30d,
      newLeads,
      upcomingPickups,
      customerCount: db.customers.length,
      rvCount: db.rvs.length,
    };
  },

  revenueByMonth() {
    // 12 months back
    const buckets: Record<string, { month: string; revenue: number; expenses: number; profit: number }> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short" });
      buckets[key] = { month: label, revenue: 0, expenses: 0, profit: 0 };
    }
    db.invoices.forEach((inv) => {
      inv.payments.forEach((p) => {
        const d = new Date(p.receivedAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (buckets[key]) buckets[key].revenue += p.amount;
      });
    });
    db.expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (buckets[key]) buckets[key].expenses += e.amount;
    });
    // Demo: fill historical months with synthetic, smoothly increasing values
    Object.entries(buckets).forEach(([key, b], idx) => {
      if (b.revenue === 0 && idx < 10) {
        b.revenue = 18000 + idx * 1100 + Math.round(Math.random() * 3000);
      }
      if (b.expenses === 0 && idx < 10) {
        b.expenses = 12000 + idx * 600 + Math.round(Math.random() * 2200);
      }
      b.profit = b.revenue - b.expenses;
    });
    return Object.values(buckets);
  },

  jobsByTechSummary() {
    return db.staff
      .filter((s) => s.role === "tech")
      .map((s) => ({
        name: s.name.split(" ")[0],
        active: db.jobs.filter((j) => j.assignedTechIds.includes(s.id) && !["completed", "cancelled"].includes(j.status)).length,
        completed: db.jobs.filter((j) => j.assignedTechIds.includes(s.id) && j.status === "completed").length,
        color: s.color,
      }));
  },

  expenseBreakdown() {
    const groups: Record<string, number> = {};
    db.expenses
      .filter((e) => Date.now() - new Date(e.date).getTime() < 90 * 86400000)
      .forEach((e) => {
        groups[e.category] = (groups[e.category] ?? 0) + e.amount;
      });
    return Object.entries(groups).map(([category, amount]) => ({ category, amount }));
  },
};

export type Store = typeof store;
