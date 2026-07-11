import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Wrench,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScheduleForm } from "@/components/admin/schedule-form";
import { AutoMarkRead } from "@/components/shell/auto-mark-read";
import {
  addUpdateAction,
  markMessagesReadAction,
  saveCustomerDetailsAction,
  saveInternalNotesAction,
  sendOwnerMessageAction,
  setCurrentStatusAction,
  toggleRevokeAction,
  updateAppointmentStatusAction,
  updateRequestStatusAction,
} from "@/app/actions/access-admin";
import { accessStore } from "@/lib/access-store";
import {
  formatApptWhen,
  formatCurrency,
  formatDateTime,
  relativeTime,
} from "@/lib/utils";
import type { CustomerRequest } from "@/lib/types";

export const metadata = { title: "Customer · Admin" };

const REQUEST_LABEL: Record<CustomerRequest["type"], string> = {
  pickup: "Pickup",
  service: "Service",
  other: "General",
};
const REQUEST_STATUSES = ["new", "acknowledged", "scheduled", "done", "declined"] as const;
const ITEM_TYPES = ["rv", "plan", "boat", "storage", "other"] as const;

export default async function AccessDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;

  const access = await accessStore.getAccess(id);
  if (!access) notFound();

  const [updates, requests, messages, appointments] = await Promise.all([
    accessStore.listUpdates(id),
    accessStore.listRequests(id),
    accessStore.listMessages(id),
    accessStore.listAppointments(id),
  ]);
  const nowIso = new Date().toISOString();
  const upcoming = appointments.filter(
    (a) => a.status !== "cancelled" && a.status !== "completed" && a.scheduledFor >= nowIso,
  );

  return (
    <>
      <Topbar
        title={access.customerName}
        subtitle={access.itemLabel}
        rightSlot={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/access">
              <ArrowLeft className="h-4 w-4" /> All customers
            </Link>
          </Button>
        }
      />
      {/* Owner opened the customer → clear unread badge for their side. */}
      <AutoMarkRead accessId={access.id} action={markMessagesReadAction} />

      <main className="flex-1 space-y-5 bg-secondary/20 p-6">
        {created && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <strong>Access code created.</strong> Read this code to the customer or they&apos;ll
            get it by email — they sign in at <code>/track</code> with the code + their email.
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          {/* ───────── LEFT: conversation + updates ───────── */}
          <div className="space-y-5">
            {/* Messages */}
            <Card>
              <CardContent className="p-5">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <MessageSquare className="h-4 w-4 text-primary" /> Messages
                </h2>
                <p className="mb-4 text-xs text-muted-foreground">
                  A private thread with {access.customerName.split(" ")[0]}. They see and reply from
                  their account.
                </p>
                {messages.length > 0 && (
                  <div className="mb-4 grid gap-2">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={m.sender === "owner" ? "flex justify-end" : "flex justify-start"}
                      >
                        <div
                          className={
                            "max-w-[80%] rounded-lg px-3 py-2 text-sm " +
                            (m.sender === "owner"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground")
                          }
                        >
                          <div className="whitespace-pre-wrap">{m.body}</div>
                          <div
                            className={
                              "mt-1 text-[10px] " +
                              (m.sender === "owner" ? "text-primary-foreground/70" : "text-muted-foreground")
                            }
                          >
                            {m.sender === "owner" ? "You" : access.customerName.split(" ")[0]} ·{" "}
                            {relativeTime(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <form action={sendOwnerMessageAction} className="grid gap-2">
                  <input type="hidden" name="accessId" value={access.id} />
                  <Textarea name="body" rows={2} required placeholder="Write a message to the customer…" />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" name="notify" defaultChecked className="h-3.5 w-3.5" />
                      Email the customer
                    </label>
                    <Button type="submit" size="sm">Send message</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Post an update */}
            <Card>
              <CardContent className="p-5">
                <h2 className="font-display text-lg font-semibold">Post an update</h2>
                <p className="mb-4 text-xs text-muted-foreground">
                  A milestone the customer sees on their timeline. Leave notify on to email them.
                </p>
                <form action={addUpdateAction} className="grid gap-3">
                  <input type="hidden" name="accessId" value={access.id} />
                  <Input name="title" required placeholder="Winterization complete" />
                  <Textarea name="body" rows={2} placeholder="Optional details…" />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="notify" defaultChecked className="h-4 w-4" />
                      Email the customer
                    </label>
                    <Button type="submit">Post update</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-4 font-display text-lg font-semibold">
                  Update history ({updates.length})
                </h2>
                {updates.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No updates yet.</p>
                ) : (
                  <ol className="space-y-4">
                    {updates.map((u) => (
                      <li key={u.id} className="border-l-2 border-primary/30 pl-4">
                        <div className="text-sm font-semibold">{u.title}</div>
                        {u.body && <p className="mt-1 text-sm text-muted-foreground">{u.body}</p>}
                        <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                          {formatDateTime(u.createdAt)}
                          {u.createdBy ? ` · ${u.createdBy}` : ""}
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ───────── RIGHT: record + ops ───────── */}
          <div className="space-y-5">
            {/* Access card */}
            <Card>
              <CardContent className="space-y-4 p-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Access code
                  </div>
                  <div className="mt-1 rounded bg-secondary px-3 py-2 text-center font-mono text-xl font-bold tracking-[0.15em]">
                    {access.code}
                  </div>
                </div>
                <div className="grid gap-1 text-sm">
                  <a href={`mailto:${access.email}`} className="flex items-center gap-2 hover:text-primary">
                    <Mail className="h-3.5 w-3.5" /> {access.email}
                  </a>
                  {access.phone && (
                    <a href={`tel:${access.phone}`} className="flex items-center gap-2 hover:text-primary">
                      <Phone className="h-3.5 w-3.5" /> {access.phone}
                    </a>
                  )}
                  {access.storageLocation && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {access.storageLocation}
                    </div>
                  )}
                </div>

                <form action={setCurrentStatusAction} className="grid gap-2 border-t pt-4">
                  <input type="hidden" name="accessId" value={access.id} />
                  <Label htmlFor="currentStatus" className="text-xs uppercase tracking-wide text-muted-foreground">
                    Current status (shown to customer)
                  </Label>
                  <div className="flex gap-2">
                    <Input id="currentStatus" name="currentStatus" defaultValue={access.currentStatus} />
                    <Button type="submit" variant="secondary">Save</Button>
                  </div>
                </form>

                <form action={toggleRevokeAction} className="border-t pt-4">
                  <input type="hidden" name="accessId" value={access.id} />
                  <input type="hidden" name="revoke" value={access.revoked ? "false" : "true"} />
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                      {access.revoked ? "Access is revoked." : "Access is active."}
                    </div>
                    <Button type="submit" variant={access.revoked ? "secondary" : "destructive"} size="sm">
                      {access.revoked ? "Restore" : "Revoke"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Appointments */}
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
                  <CalendarClock className="h-4 w-4 text-primary" /> Appointments
                </h2>
                {upcoming.length > 0 && (
                  <ul className="mb-3 space-y-2">
                    {upcoming.map((a) => (
                      <li key={a.id} className="rounded-md border bg-background p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{a.title || a.kind}</span>
                          <Badge variant={a.status === "confirmed" ? "success" : "info"} className="capitalize">
                            {a.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{formatApptWhen(a.scheduledFor)}</div>
                        <div className="mt-2 flex gap-2">
                          {a.status === "scheduled" && (
                            <ApptBtn id={a.id} accessId={access.id} to="confirmed" label="Confirm" variant="secondary" />
                          )}
                          <ApptBtn id={a.id} accessId={access.id} to="completed" label="Done" variant="default" />
                          <ApptBtn id={a.id} accessId={access.id} to="cancelled" label="Cancel" variant="ghost" />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <ScheduleForm accessId={access.id} />
              </CardContent>
            </Card>

            {/* Requests */}
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-4 font-display text-lg font-semibold">Requests ({requests.length})</h2>
                {requests.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">No requests yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {requests.map((r) => (
                      <li key={r.id} className="rounded-md border bg-background p-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-sm font-semibold">
                            {r.type === "pickup" ? (
                              <CalendarClock className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Wrench className="h-3.5 w-3.5 text-primary" />
                            )}
                            {REQUEST_LABEL[r.type]}
                          </span>
                          <Badge variant={r.status === "new" ? "warning" : "muted"} className="capitalize">
                            {r.status}
                          </Badge>
                        </div>
                        {r.requestedDate && (
                          <div className="mt-1 text-xs text-muted-foreground">Date: {r.requestedDate}</div>
                        )}
                        {r.details && <p className="mt-1 text-sm">{r.details}</p>}
                        <form action={updateRequestStatusAction} className="mt-2 flex gap-2">
                          <input type="hidden" name="requestId" value={r.id} />
                          <input type="hidden" name="accessId" value={access.id} />
                          <select
                            name="status"
                            defaultValue={r.status}
                            className="flex-1 rounded-md border bg-background px-2 py-1.5 text-xs capitalize"
                          >
                            {REQUEST_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <Button type="submit" size="sm" variant="secondary">Set</Button>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Customer details (CRM) */}
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-4 font-display text-lg font-semibold">Customer details</h2>
                <form action={saveCustomerDetailsAction} className="grid gap-3">
                  <input type="hidden" name="accessId" value={access.id} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name"><Input name="customerName" defaultValue={access.customerName} /></Field>
                    <Field label="Phone"><Input name="phone" defaultValue={access.phone ?? ""} /></Field>
                  </div>
                  <Field label="Email"><Input name="email" type="email" defaultValue={access.email} /></Field>
                  <Field label="Item / rig"><Input name="itemLabel" defaultValue={access.itemLabel} /></Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Type">
                      <select name="itemType" defaultValue={access.itemType} className="rounded-md border bg-background px-3 py-2 text-sm capitalize">
                        {ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="Plan"><Input name="planType" defaultValue={access.planType ?? ""} placeholder="Camper's Care Plan" /></Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Monthly $"><Input name="monthlyRate" type="number" step="1" min="0" defaultValue={access.monthlyRate ?? ""} /></Field>
                    <Field label="Storage spot"><Input name="storageLocation" defaultValue={access.storageLocation ?? ""} placeholder="Zone A-12" /></Field>
                    <Field label="Next service"><Input name="nextServiceDate" type="date" defaultValue={access.nextServiceDate ?? ""} /></Field>
                  </div>
                  <Field label="Tags (comma-separated)"><Input name="tags" defaultValue={access.tags.join(", ")} placeholder="snowbird, vip" /></Field>
                  <div className="flex justify-end">
                    <Button type="submit" size="sm">Save details</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Internal notes */}
            <Card>
              <CardContent className="p-5">
                <h2 className="font-display text-lg font-semibold">Internal notes</h2>
                <p className="mb-3 text-xs text-muted-foreground">Private — never shown to the customer.</p>
                <form action={saveInternalNotesAction} className="grid gap-2">
                  <input type="hidden" name="accessId" value={access.id} />
                  <Textarea name="internalNotes" rows={4} defaultValue={access.internalNotes ?? ""} placeholder="Gate code, preferences, reminders…" />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" variant="secondary">Save notes</Button>
                  </div>
                </form>
                {access.monthlyRate ? (
                  <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">
                    Recurring: <strong className="text-foreground">{formatCurrency(access.monthlyRate)}/mo</strong>
                    {access.planType ? ` · ${access.planType}` : ""}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ApptBtn({
  id,
  accessId,
  to,
  label,
  variant,
}: {
  id: string;
  accessId: string;
  to: string;
  label: string;
  variant: "default" | "secondary" | "ghost";
}) {
  return (
    <form action={updateAppointmentStatusAction}>
      <input type="hidden" name="appointmentId" value={id} />
      <input type="hidden" name="accessId" value={accessId} />
      <input type="hidden" name="status" value={to} />
      <Button type="submit" size="sm" variant={variant} className="text-xs">{label}</Button>
    </form>
  );
}
