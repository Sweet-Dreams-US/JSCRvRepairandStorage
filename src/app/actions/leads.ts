"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendInquiryEmail } from "@/lib/email";
import { leadsStore } from "@/lib/leads-store";
import type { Lead, RvType } from "@/lib/types";

const leadSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a phone number"),
  rvType: z.string().optional(),
  interest: z.enum(["repair", "storage", "maintenance", "plan", "rental", "quote", "other"]),
  message: z.string().min(5, "Tell us a bit about how we can help"),
  source: z.string().default("website"),
});

export type LeadFormState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export async function submitLeadAction(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      errors[field] = issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }
  const lead = await leadsStore.createLead({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    rvType: parsed.data.rvType ? (parsed.data.rvType as RvType) : undefined,
    interest: parsed.data.interest as Lead["interest"],
    message: parsed.data.message,
    source: (parsed.data.source as Lead["source"]) ?? "website",
  });

  // Notify the shop by email. Awaited so it completes before the
  // serverless function suspends; never throws (see sendInquiryEmail).
  await sendInquiryEmail(lead);

  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  return {
    ok: true,
    message: "Thanks! Joe will reach out within one business day.",
  };
}
