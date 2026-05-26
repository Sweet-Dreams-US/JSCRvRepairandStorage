"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";
import type { PickupPrepRequest } from "@/lib/types";

const PREP_VALUES: PickupPrepRequest[] = [
  "tires-aired",
  "battery-check",
  "water-fill",
  "propane-check",
  "exterior-wash",
  "dump-tanks",
  "fuel-up",
  "fridge-cooldown",
  "generator-test",
  "slide-test",
];

const pickupSchema = z.object({
  rvId: z.string().min(1),
  pickupDate: z.string().min(1),
  returnDate: z.string().optional(),
  prep: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export async function createPickupAction(_prev: unknown, formData: FormData) {
  const user = await requireUser();
  if (user.role !== "customer") return { ok: false, error: "Only customers can request pickups" };
  const raw = {
    rvId: formData.get("rvId"),
    pickupDate: formData.get("pickupDate"),
    returnDate: formData.get("returnDate") || undefined,
    prep: formData.getAll("prep"),
    notes: formData.get("notes") || undefined,
  };
  const parsed = pickupSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Please fill in required fields" };
  const prepRequests = (parsed.data.prep ?? []).filter((p): p is PickupPrepRequest =>
    PREP_VALUES.includes(p as PickupPrepRequest),
  );
  store.createPickup({
    customerId: user.id,
    rvId: parsed.data.rvId,
    pickupDate: parsed.data.pickupDate,
    returnDate: parsed.data.returnDate,
    prepRequests,
    notes: parsed.data.notes,
  });
  revalidatePath("/portal");
  revalidatePath("/portal/pickup");
  revalidatePath("/admin");
  return { ok: true };
}

export async function decideQuoteAction(_prev: unknown, formData: FormData) {
  const user = await requireUser();
  const quoteId = String(formData.get("quoteId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const reason = String(formData.get("reason") ?? "");
  if (decision !== "approved" && decision !== "declined") {
    return { ok: false, error: "Invalid decision" };
  }
  const quote = store.getQuote(quoteId);
  if (!quote) return { ok: false, error: "Quote not found" };
  if (user.role === "customer" && quote.customerId !== user.id) {
    return { ok: false, error: "Not your quote" };
  }
  store.decideQuote(
    quoteId,
    decision,
    user.id,
    user.name,
    decision === "declined" ? reason : undefined,
  );
  revalidatePath("/portal");
  revalidatePath("/portal/quotes");
  revalidatePath("/admin");
  revalidatePath("/admin/quotes");
  return { ok: true };
}

export async function sendMessageAction(_prev: unknown, formData: FormData) {
  const user = await requireUser();
  const threadId = String(formData.get("threadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { ok: false, error: "Message can't be empty" };
  const thread = store.getThread(threadId);
  if (!thread) return { ok: false, error: "Thread not found" };
  if (user.role === "customer" && thread.customerId !== user.id) {
    return { ok: false, error: "Not your thread" };
  }
  store.sendMessage({ threadId, fromUserId: user.id, body });
  revalidatePath(`/portal/messages/${threadId}`);
  revalidatePath(`/admin/messages/${threadId}`);
  revalidatePath("/portal");
  revalidatePath("/admin");
  return { ok: true };
}

export async function startNewThreadAction(_prev: unknown, formData: FormData) {
  const user = await requireUser();
  if (user.role !== "customer") return { ok: false, error: "Customer only" };
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!subject || !body) return { ok: false, error: "Subject and message required" };
  const thread = store.createThread({
    subject,
    customerId: user.id,
    participantIds: [user.id, "staff-tina", "staff-joe"],
    firstMessageFrom: user.id,
    firstMessageBody: body,
  });
  revalidatePath("/portal/messages");
  revalidatePath("/admin/messages");
  return { ok: true, threadId: thread.id };
}
