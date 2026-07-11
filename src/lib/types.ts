// Domain types for JSC RV Service platform.

export type Role = "customer" | "tech" | "manager" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Customer extends User {
  role: "customer";
  address?: string;
  rvIds: string[];
  notes?: string;
  preferredContact: "email" | "phone" | "text";
  joinedDate: string;
  lifetimeValue: number;
}

export interface StaffMember extends User {
  role: "tech" | "manager" | "admin";
  title: string;
  hireDate: string;
  hourlyRate: number;
  skills: string[];
  color: string; // calendar color
}

export type RvType =
  | "Class A"
  | "Class B"
  | "Class C"
  | "Travel Trailer"
  | "Fifth Wheel"
  | "Toy Hauler"
  | "Pop-up"
  | "Boat";

export interface Rv {
  id: string;
  customerId: string;
  nickname?: string;
  type: RvType;
  make: string;
  model: string;
  year: number;
  length: number; // feet
  vin: string;
  plateState?: string;
  plateNumber?: string;
  color?: string;
  notes?: string;
  photoUrl?: string;
}

export type StorageStatus = "stored" | "out" | "pending-pickup" | "pending-return";

export interface StorageSpot {
  id: string;
  label: string; // e.g. "A-12"
  zone: "A" | "B" | "C" | "Boat";
  size: "small" | "medium" | "large" | "xl";
  hasPower: boolean;
  monthlyRate: number;
  occupiedByRvId?: string;
  status: StorageStatus;
}

export type JobStatus =
  | "intake"
  | "diagnosing"
  | "quote-sent"
  | "approved"
  | "in-progress"
  | "waiting-parts"
  | "qa"
  | "ready"
  | "completed"
  | "cancelled";

export type JobPriority = "low" | "normal" | "high" | "urgent";

export interface JobNote {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
  internal: boolean;
}

export interface JobChecklistItem {
  id: string;
  label: string;
  done: boolean;
  doneBy?: string;
  doneAt?: string;
}

export interface Job {
  id: string;
  number: string; // e.g. WO-1042
  customerId: string;
  rvId: string;
  title: string;
  description: string;
  status: JobStatus;
  priority: JobPriority;
  assignedTechIds: string[];
  createdAt: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  completedAt?: string;
  estimatedHours: number;
  actualHours?: number;
  notes: JobNote[];
  checklist: JobChecklistItem[];
  quoteId?: string;
  invoiceId?: string;
  tags: string[];
}

export interface QuoteLineItem {
  id: string;
  kind: "labor" | "part" | "service" | "fee";
  description: string;
  quantity: number;
  unitPrice: number;
  taxable: boolean;
}

export type QuoteStatus = "draft" | "sent" | "approved" | "declined" | "expired";

export interface Quote {
  id: string;
  number: string; // Q-2041
  jobId?: string;
  customerId: string;
  rvId?: string;
  status: QuoteStatus;
  lineItems: QuoteLineItem[];
  notes?: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  validUntil: string;
  createdAt: string;
  sentAt?: string;
  decidedAt?: string;
  declineReason?: string;
}

export type InvoiceStatus = "draft" | "sent" | "partial" | "paid" | "overdue" | "void";

export interface PaymentRecord {
  id: string;
  amount: number;
  method: "cash" | "check" | "card" | "ach" | "other";
  reference?: string;
  receivedAt: string;
  notedBy: string;
}

export interface Invoice {
  id: string;
  number: string; // INV-3055
  jobId?: string;
  quoteId?: string;
  customerId: string;
  status: InvoiceStatus;
  lineItems: QuoteLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  dueDate: string;
  createdAt: string;
  sentAt?: string;
  payments: PaymentRecord[];
}

export type PickupPrepRequest =
  | "tires-aired"
  | "battery-check"
  | "water-fill"
  | "propane-check"
  | "exterior-wash"
  | "dump-tanks"
  | "fuel-up"
  | "fridge-cooldown"
  | "generator-test"
  | "slide-test";

export interface PickupRequest {
  id: string;
  customerId: string;
  rvId: string;
  pickupDate: string;
  returnDate?: string;
  prepRequests: PickupPrepRequest[];
  notes?: string;
  status: "pending" | "confirmed" | "prepping" | "ready" | "picked-up" | "returned" | "cancelled";
  createdAt: string;
  preppedById?: string;
  preppedAt?: string;
}

export interface Message {
  id: string;
  threadId: string;
  fromUserId: string;
  fromName: string;
  fromRole: Role;
  body: string;
  attachments?: { name: string; url: string }[];
  createdAt: string;
  readBy: string[];
}

export interface Thread {
  id: string;
  subject: string;
  customerId: string;
  jobId?: string;
  rvId?: string;
  participantIds: string[];
  lastMessageAt: string;
  unreadFor: Record<string, number>;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  rvType?: RvType;
  interest: "repair" | "storage" | "maintenance" | "plan" | "rental" | "quote" | "other";
  message: string;
  source: "website" | "facebook" | "referral" | "google" | "other";
  status: "new" | "contacted" | "scheduled" | "converted" | "lost";
  createdAt: string;
  assignedTo?: string;
  rentalId?: string; // populated when a lead originates from a specific rental listing
}

// ────────────── CUSTOMER ACCESS (code-based) ──────────────
export type AccessItemType = "rv" | "plan" | "boat" | "storage" | "other";
export type AccessStatus = "active" | "completed" | "archived";

export interface CustomerAccess {
  id: string;
  code: string; // human-typable, e.g. "JSC-7Q2K"
  customerName: string;
  email: string;
  phone?: string;
  itemLabel: string; // what they bought / their rig, e.g. "2021 Jayco Jay Flight 28BHS"
  itemType: AccessItemType;
  currentStatus: string; // short headline, e.g. "In winter storage"
  status: AccessStatus;
  planType?: string; // e.g. "Camper's Care Plan", "Winter Storage"
  monthlyRate?: number; // $/mo, if on a recurring plan
  storageLocation?: string; // e.g. "Zone A · Spot 12"
  nextServiceDate?: string; // ISO date
  tags: string[]; // e.g. ["snowbird", "vip"]
  internalNotes?: string; // admin-only, never shown to the customer
  createdBy?: string;
  revoked: boolean;
  createdAt: string;
}

export interface AccessUpdate {
  id: string;
  accessId: string;
  title: string;
  body?: string;
  createdBy?: string;
  createdAt: string;
}

export type CustomerRequestType = "pickup" | "service" | "other";
export type CustomerRequestStatus =
  | "new"
  | "acknowledged"
  | "scheduled"
  | "done"
  | "declined";

export interface CustomerRequest {
  id: string;
  accessId: string;
  type: CustomerRequestType;
  requestedDate?: string; // ISO date, for pickup requests
  details?: string;
  status: CustomerRequestStatus;
  createdAt: string;
}

// Two-way message between the shop and a customer.
export type MessageSender = "owner" | "customer";
export interface CustomerMessage {
  id: string;
  accessId: string;
  sender: MessageSender;
  body: string;
  readByOwner: boolean;
  readByCustomer: boolean;
  createdAt: string;
}

// Scheduled appointment tied to a customer.
export type AppointmentKind = "pickup" | "service" | "dropoff" | "other";
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled";
export interface Appointment {
  id: string;
  accessId: string;
  requestId?: string; // set when scheduled from a customer request
  kind: AppointmentKind;
  title?: string;
  scheduledFor: string; // ISO datetime
  status: AppointmentStatus;
  notes?: string;
  createdBy?: string;
  createdAt: string;
}

// ────────────── RENTALS ──────────────
export type RentalStatus = "available" | "booked" | "maintenance" | "retired";

export interface Rental {
  id: string;
  name: string; // display name, e.g. "The Lakeside"
  type: RvType;
  year: number;
  make: string;
  model: string;
  length: number; // feet
  sleeps: number;
  nightlyRate: number;
  weeklyRate: number;
  minNights: number;
  securityDeposit: number;
  status: RentalStatus;
  description: string;
  features: string[]; // ["Generator", "Solar", "Bunk beds"]
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ShiftKind = "shop" | "lot" | "office" | "on-call";

export interface Shift {
  id: string;
  staffId: string;
  start: string;
  end: string;
  kind: ShiftKind;
  notes?: string;
}

export interface TimeEntry {
  id: string;
  staffId: string;
  jobId?: string;
  start: string;
  end?: string;
  notes?: string;
  billable: boolean;
}

export interface Expense {
  id: string;
  date: string;
  category: "parts" | "tools" | "fuel" | "utilities" | "rent" | "insurance" | "payroll" | "marketing" | "other";
  vendor: string;
  amount: number;
  description: string;
  jobId?: string;
  receiptUrl?: string;
}

export type ActivityKind =
  | "job-created"
  | "job-status-changed"
  | "quote-sent"
  | "quote-approved"
  | "quote-declined"
  | "invoice-sent"
  | "payment-received"
  | "pickup-requested"
  | "pickup-confirmed"
  | "message-sent"
  | "lead-created"
  | "rv-checked-in"
  | "rv-checked-out";

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  actorId: string;
  actorName: string;
  description: string;
  targetType?: "job" | "quote" | "invoice" | "rv" | "customer" | "lead" | "pickup";
  targetId?: string;
  createdAt: string;
}
