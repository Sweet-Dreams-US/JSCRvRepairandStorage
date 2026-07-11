// Transactional email via Resend's REST API.
//
// Uses plain `fetch` (no SDK dependency) so it runs on any runtime.
// Fully env-gated: if RESEND_API_KEY is absent every send is skipped and
// logged — nothing throws, so customer-facing forms and admin actions never
// break. This lets the site run today, before the domain + Resend are wired.

import { BUSINESS } from "./business";
import type {
  Appointment,
  CustomerAccess,
  AccessUpdate,
  CustomerRequest,
  Lead,
} from "./types";

const APPOINTMENT_LABEL: Record<Appointment["kind"], string> = {
  pickup: "Pickup",
  service: "Service",
  dropoff: "Drop-off",
  other: "Appointment",
};

/**
 * Format an appointment datetime for emails. Appointment times are stored as
 * "floating" wall-clock (entered value tagged UTC), so we always format in UTC
 * to show exactly what was scheduled — no timezone drift for a one-location shop.
 */
function fmtDateTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const REQUEST_LABEL: Record<CustomerRequest["type"], string> = {
  pickup: "Pickup request",
  service: "Service request",
  other: "General request",
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const INTEREST_LABEL: Record<Lead["interest"], string> = {
  repair: "RV Repair",
  maintenance: "Maintenance / Service",
  storage: "Storage",
  plan: "Storage & Service Plan",
  rental: "RV Rental",
  quote: "Quote request",
  other: "General inquiry",
};

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://jscrvrepair.com";
}

export type EmailResult =
  | { ok: true; id?: string; skipped?: boolean }
  | { ok: false; error: string };

type DeliverInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  logContext: string;
};

/** Low-level Resend delivery. Never throws. */
async function deliver(input: DeliverInput): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.INQUIRY_FROM_EMAIL || "JSC RV Service <onboarding@resend.dev>";

  if (!apiKey) {
    console.info(`[email] Skipped (no RESEND_API_KEY). ${input.logContext}`);
    return { ok: true, skipped: true };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[email] Resend error ${res.status}: ${detail}`);
      return { ok: false, error: `Resend responded ${res.status}` };
    }

    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[email] Send failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(bodyInner: string): string {
  return `<!doctype html>
<html><body style="margin:0;background:#f4ede1;padding:24px;">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#faf6ec;border:2px solid #1a1614;border-collapse:separate;">
    <tr><td style="background:#c8331f;height:6px;"></td></tr>
    ${bodyInner}
  </table>
</body></html>`;
}

// ─────────────── inquiry notification (to the shop) ───────────────

export type InquiryEmailResult = EmailResult;

export async function sendInquiryEmail(lead: Lead): Promise<EmailResult> {
  const to = process.env.INQUIRY_TO_EMAIL || BUSINESS.email;
  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:6px 14px 6px 0;color:#6d6a64;font:600 12px/1.4 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
       <td style="padding:6px 0;color:#1a1614;font:15px/1.5 -apple-system,Segoe UI,sans-serif;">${value}</td>
     </tr>`;

  const html = shell(`
    <tr><td style="padding:24px 28px 8px;">
      <div style="font:600 11px/1 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.18em;color:#8c1d10;">New Inquiry · JSC RV Service</div>
      <div style="margin-top:8px;font:700 24px/1.1 Georgia,serif;color:#1a1614;">${esc(INTEREST_LABEL[lead.interest])}</div>
    </td></tr>
    <tr><td style="padding:12px 28px 4px;"><table role="presentation">
      ${row("Name", esc(lead.name))}
      ${row("Phone", `<a href="tel:${esc(lead.phone)}" style="color:#c8331f;text-decoration:none;">${esc(lead.phone)}</a>`)}
      ${row("Email", `<a href="mailto:${esc(lead.email)}" style="color:#c8331f;text-decoration:none;">${esc(lead.email)}</a>`)}
      ${lead.rvType ? row("RV type", esc(lead.rvType)) : ""}
      ${row("Source", esc(lead.source))}
    </table></td></tr>
    <tr><td style="padding:8px 28px 24px;">
      <div style="font:600 12px/1.4 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#6d6a64;margin-bottom:6px;">Message</div>
      <div style="padding:14px 16px;background:#fff;border-left:3px solid #c8331f;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1614;white-space:pre-wrap;">${esc(lead.message)}</div>
    </td></tr>`);

  const text = [
    `New inquiry from the JSC RV Service website`,
    ``,
    `Interest:  ${INTEREST_LABEL[lead.interest]}`,
    lead.rvType ? `RV type:   ${lead.rvType}` : null,
    `Name:      ${lead.name}`,
    `Phone:     ${lead.phone}`,
    `Email:     ${lead.email}`,
    `Source:    ${lead.source}`,
    ``,
    `Message:`,
    lead.message,
  ]
    .filter(Boolean)
    .join("\n");

  return deliver({
    to,
    replyTo: lead.email,
    subject: `New inquiry · ${INTEREST_LABEL[lead.interest]} · ${lead.name}`,
    html,
    text,
    logContext: `Would notify ${to} — "${INTEREST_LABEL[lead.interest]}" from ${lead.name} <${lead.email}>.`,
  });
}

// ─────────────── customer: access code (welcome) ───────────────

export async function sendAccessCodeEmail(access: CustomerAccess): Promise<EmailResult> {
  const url = `${siteUrl()}/track`;
  const html = shell(`
    <tr><td style="padding:24px 28px 8px;">
      <div style="font:600 11px/1 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.18em;color:#8c1d10;">Your JSC RV Service account</div>
      <div style="margin-top:8px;font:700 24px/1.1 Georgia,serif;color:#1a1614;">Track your ${esc(access.itemLabel)}</div>
    </td></tr>
    <tr><td style="padding:8px 28px 4px;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1614;">
      Hi ${esc(access.customerName)}, Joe set up an account so you can follow updates and request pickups or service any time.
    </td></tr>
    <tr><td style="padding:16px 28px 8px;">
      <div style="font:600 12px/1.4 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#6d6a64;">Your access code</div>
      <div style="margin-top:6px;padding:14px 16px;background:#1a1614;color:#f4ede1;font:700 26px/1 'Courier New',monospace;letter-spacing:.14em;text-align:center;">${esc(access.code)}</div>
    </td></tr>
    <tr><td style="padding:8px 28px 24px;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1614;">
      Go to <a href="${url}" style="color:#c8331f;">${esc(url)}</a>, enter this code and your email (${esc(access.email)}), and you're in.
    </td></tr>`);

  const text = [
    `Hi ${access.customerName},`,
    ``,
    `Joe set up a JSC RV Service account so you can track your ${access.itemLabel} and request pickups or service.`,
    ``,
    `Your access code: ${access.code}`,
    `Sign in at: ${url}`,
    `Use this code + your email (${access.email}).`,
  ].join("\n");

  return deliver({
    to: access.email,
    subject: `Your JSC RV Service access code: ${access.code}`,
    html,
    text,
    logContext: `Would send access code ${access.code} to ${access.email}.`,
  });
}

// ─────────────── customer: status update notification ───────────────

export async function sendCustomerUpdateEmail(
  access: CustomerAccess,
  update: AccessUpdate,
): Promise<EmailResult> {
  const url = `${siteUrl()}/track`;
  const html = shell(`
    <tr><td style="padding:24px 28px 8px;">
      <div style="font:600 11px/1 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.18em;color:#8c1d10;">Update · ${esc(access.itemLabel)}</div>
      <div style="margin-top:8px;font:700 23px/1.15 Georgia,serif;color:#1a1614;">${esc(update.title)}</div>
    </td></tr>
    ${
      update.body
        ? `<tr><td style="padding:6px 28px 8px;">
             <div style="padding:14px 16px;background:#fff;border-left:3px solid #c8331f;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1614;white-space:pre-wrap;">${esc(update.body)}</div>
           </td></tr>`
        : ""
    }
    <tr><td style="padding:12px 28px 24px;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1614;">
      See everything on your account: <a href="${url}" style="color:#c8331f;">${esc(url)}</a>
    </td></tr>`);

  const text = [
    `Update on your ${access.itemLabel}:`,
    ``,
    update.title,
    update.body ? `\n${update.body}` : "",
    ``,
    `View your account: ${url}`,
  ]
    .filter(Boolean)
    .join("\n");

  return deliver({
    to: access.email,
    replyTo: process.env.INQUIRY_TO_EMAIL || BUSINESS.email,
    subject: `Update on your ${access.itemLabel} — ${update.title}`,
    html,
    text,
    logContext: `Would notify ${access.email} — update "${update.title}" on ${access.itemLabel}.`,
  });
}

// ─────────────── customer request notification (to the shop) ───────────────

export async function sendCustomerRequestEmail(
  access: CustomerAccess,
  request: CustomerRequest,
): Promise<EmailResult> {
  const to = process.env.INQUIRY_TO_EMAIL || BUSINESS.email;
  const label = REQUEST_LABEL[request.type];
  const html = shell(`
    <tr><td style="padding:24px 28px 8px;">
      <div style="font:600 11px/1 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.18em;color:#8c1d10;">${esc(label)} · customer panel</div>
      <div style="margin-top:8px;font:700 23px/1.15 Georgia,serif;color:#1a1614;">${esc(access.customerName)} — ${esc(access.itemLabel)}</div>
    </td></tr>
    <tr><td style="padding:8px 28px 4px;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1614;">
      ${request.requestedDate ? `<div><strong>Requested date:</strong> ${esc(request.requestedDate)}</div>` : ""}
      ${request.details ? `<div style="margin-top:8px;padding:14px 16px;background:#fff;border-left:3px solid #c8331f;white-space:pre-wrap;">${esc(request.details)}</div>` : ""}
      <div style="margin-top:10px;color:#6d6a64;font-size:13px;">Reply to reach ${esc(access.customerName)} at ${esc(access.email)}. Manage in the admin panel → Customer Access.</div>
    </td></tr>`);

  const text = [
    `${label} from the customer panel`,
    ``,
    `Customer: ${access.customerName} <${access.email}>`,
    `Item:     ${access.itemLabel}`,
    request.requestedDate ? `Date:     ${request.requestedDate}` : null,
    request.details ? `\nDetails:\n${request.details}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return deliver({
    to,
    replyTo: access.email,
    subject: `${label} · ${access.customerName} · ${access.itemLabel}`,
    html,
    text,
    logContext: `Would notify ${to} — ${label} from ${access.customerName} on ${access.itemLabel}.`,
  });
}

// ─────────────── messaging: owner → customer ───────────────

export async function sendCustomerMessageEmail(
  access: CustomerAccess,
  body: string,
): Promise<EmailResult> {
  const url = `${siteUrl()}/track`;
  const html = shell(`
    <tr><td style="padding:24px 28px 8px;">
      <div style="font:600 11px/1 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.18em;color:#8c1d10;">New message · JSC RV Service</div>
      <div style="margin-top:8px;font:700 22px/1.2 Georgia,serif;color:#1a1614;">You have a message about your ${esc(access.itemLabel)}</div>
    </td></tr>
    <tr><td style="padding:8px 28px 4px;">
      <div style="padding:14px 16px;background:#fff;border-left:3px solid #c8331f;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1614;white-space:pre-wrap;">${esc(body)}</div>
    </td></tr>
    <tr><td style="padding:14px 28px 24px;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1614;">
      Reply from your account: <a href="${url}" style="color:#c8331f;">${esc(url)}</a>
    </td></tr>`);
  const text = [
    `New message from JSC RV Service about your ${access.itemLabel}:`,
    ``,
    body,
    ``,
    `Reply from your account: ${url}`,
  ].join("\n");
  return deliver({
    to: access.email,
    replyTo: process.env.INQUIRY_TO_EMAIL || BUSINESS.email,
    subject: `New message about your ${access.itemLabel}`,
    html,
    text,
    logContext: `Would message ${access.email} about ${access.itemLabel}.`,
  });
}

// ─────────────── messaging: customer → owner (to the shop) ───────────────

export async function sendOwnerMessageEmail(
  access: CustomerAccess,
  body: string,
): Promise<EmailResult> {
  const to = process.env.INQUIRY_TO_EMAIL || BUSINESS.email;
  const html = shell(`
    <tr><td style="padding:24px 28px 8px;">
      <div style="font:600 11px/1 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.18em;color:#8c1d10;">Customer message · customer panel</div>
      <div style="margin-top:8px;font:700 22px/1.2 Georgia,serif;color:#1a1614;">${esc(access.customerName)} — ${esc(access.itemLabel)}</div>
    </td></tr>
    <tr><td style="padding:8px 28px 4px;">
      <div style="padding:14px 16px;background:#fff;border-left:3px solid #c8331f;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1614;white-space:pre-wrap;">${esc(body)}</div>
      <div style="margin-top:10px;color:#6d6a64;font-size:13px;">Reply to reach ${esc(access.customerName)} at ${esc(access.email)}, or answer in the admin panel.</div>
    </td></tr>`);
  const text = [
    `Message from ${access.customerName} <${access.email}> about ${access.itemLabel}:`,
    ``,
    body,
  ].join("\n");
  return deliver({
    to,
    replyTo: access.email,
    subject: `Message · ${access.customerName} · ${access.itemLabel}`,
    html,
    text,
    logContext: `Would notify ${to} — message from ${access.customerName}.`,
  });
}

// ─────────────── appointment: owner → customer ───────────────

export async function sendAppointmentEmail(
  access: CustomerAccess,
  appt: Appointment,
): Promise<EmailResult> {
  const url = `${siteUrl()}/track`;
  const label = APPOINTMENT_LABEL[appt.kind];
  const when = fmtDateTime(appt.scheduledFor);
  const html = shell(`
    <tr><td style="padding:24px 28px 8px;">
      <div style="font:600 11px/1 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.18em;color:#8c1d10;">${esc(label)} scheduled · JSC RV Service</div>
      <div style="margin-top:8px;font:700 22px/1.2 Georgia,serif;color:#1a1614;">${esc(appt.title || `${label} — ${access.itemLabel}`)}</div>
    </td></tr>
    <tr><td style="padding:12px 28px 6px;">
      <div style="padding:14px 16px;background:#1a1614;color:#f4ede1;font:600 18px/1.3 -apple-system,Segoe UI,sans-serif;text-align:center;">${esc(when)}</div>
    </td></tr>
    ${appt.notes ? `<tr><td style="padding:6px 28px 4px;"><div style="padding:12px 16px;background:#fff;border-left:3px solid #c8331f;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1614;white-space:pre-wrap;">${esc(appt.notes)}</div></td></tr>` : ""}
    <tr><td style="padding:14px 28px 24px;font:15px/1.6 -apple-system,Segoe UI,sans-serif;color:#1a1614;">
      Details on your account: <a href="${url}" style="color:#c8331f;">${esc(url)}</a> · Questions? Call ${esc(BUSINESS.phone)}.
    </td></tr>`);
  const text = [
    `${label} scheduled for your ${access.itemLabel}:`,
    ``,
    when,
    appt.notes ? `\n${appt.notes}` : "",
    ``,
    `Details: ${url}  ·  Questions? ${BUSINESS.phone}`,
  ]
    .filter(Boolean)
    .join("\n");
  return deliver({
    to: access.email,
    replyTo: process.env.INQUIRY_TO_EMAIL || BUSINESS.email,
    subject: `${label} scheduled — ${when}`,
    html,
    text,
    logContext: `Would notify ${access.email} — ${label} scheduled for ${when}.`,
  });
}
