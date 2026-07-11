// Real data only. The single owner account below exists because admin auth
// looks it up (the password login signs you in as "staff-joe"). Everything
// else the business uses — customers, inquiries, quotes, invoices, expenses,
// appointments — is real and lives in Supabase. No mock/demo records.

import type {
  ActivityEvent,
  Customer,
  Expense,
  Invoice,
  Job,
  Lead,
  Message,
  PickupRequest,
  Quote,
  Rv,
  Shift,
  StaffMember,
  StorageSpot,
  Thread,
  TimeEntry,
} from "./types";

// ---------- OWNER (real account for admin sign-in) ----------
export const STAFF: StaffMember[] = [
  {
    id: "staff-joe",
    email: "joe@jscrvrepair.com",
    name: "Joe Crawford",
    role: "admin",
    phone: "(574) 453-1573",
    title: "Owner",
    hireDate: "2018-01-01T00:00:00.000Z",
    hourlyRate: 0,
    skills: [],
    color: "#c8331f",
    createdAt: "2018-01-01T00:00:00.000Z",
  },
];

// ---------- everything else starts empty ----------
export const CUSTOMERS: Customer[] = [];
export const RVS: Rv[] = [];
export const LOT: StorageSpot[] = [];
export const JOBS: Job[] = [];
export const QUOTES: Quote[] = [];
export const INVOICES: Invoice[] = [];
export const PICKUPS: PickupRequest[] = [];
export const THREADS: Thread[] = [];
export const MESSAGES: Message[] = [];
export const LEADS: Lead[] = [];
export const SHIFTS: Shift[] = [];
export const TIME_ENTRIES: TimeEntry[] = [];
export const EXPENSES: Expense[] = [];
export const ACTIVITY: ActivityEvent[] = [];
