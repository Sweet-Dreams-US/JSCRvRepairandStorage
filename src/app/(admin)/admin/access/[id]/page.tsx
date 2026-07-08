import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, Mail, Wrench } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  addUpdateAction,
  setCurrentStatusAction,
  toggleRevokeAction,
  updateRequestStatusAction,
} from "@/app/actions/access-admin";
import { accessStore } from "@/lib/access-store";
import { formatDateTime, relativeTime } from "@/lib/utils";
import type { CustomerRequest } from "@/lib/types";

export const metadata = { title: "Access · Admin" };

const REQUEST_LABEL: Record<CustomerRequest["type"], string> = {
  pickup: "Pickup",
  service: "Service",
  other: "General",
};
const REQUEST_STATUSES = ["new", "acknowledged", "scheduled", "done", "declined"] as const;

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

  const [updates, requests] = await Promise.all([
    accessStore.listUpdates(id),
    accessStore.listRequests(id),
  ]);

  return (
    <>
      <Topbar
        title={access.customerName}
        subtitle={access.itemLabel}
        rightSlot={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/access">
              <ArrowLeft className="h-4 w-4" /> All access
            </Link>
          </Button>
        }
      />
      <main className="flex-1 space-y-5 bg-secondary/20 p-6">
        {created && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <strong>Access code created.</strong> Read this code to the customer or
            they&apos;ll get it by email — they sign in at <code>/track</code> with the
            code + their email.
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          {/* LEFT — updates */}
          <div className="space-y-5">
            {/* Post an update */}
            <Card>
              <CardContent className="p-5">
                <h2 className="font-display text-lg font-semibold">Post an update</h2>
                <p className="mb-4 text-xs text-muted-foreground">
                  The customer sees this on their panel. Leave &ldquo;notify&rdquo; on to
                  email them, too.
                </p>
                <form action={addUpdateAction} className="grid gap-3">
                  <input type="hidden" name="accessId" value={access.id} />
                  <div className="grid gap-1.5">
                    <Label htmlFor="title">Update</Label>
                    <Input id="title" name="title" required placeholder="Winterization complete" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="body">Details (optional)</Label>
                    <Textarea id="body" name="body" rows={3} placeholder="Lines blown out, antifreeze in, battery pulled for inside storage." />
                  </div>
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
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No updates yet. Post the first one above.
                  </p>
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

          {/* RIGHT — meta + requests */}
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
                      {access.revoked
                        ? "Access is revoked — the customer can't sign in."
                        : "Access is active."}
                    </div>
                    <Button type="submit" variant={access.revoked ? "secondary" : "destructive"} size="sm">
                      {access.revoked ? "Restore" : "Revoke"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Requests */}
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-4 font-display text-lg font-semibold">
                  Requests ({requests.length})
                </h2>
                {requests.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No requests from this customer yet.
                  </p>
                ) : (
                  <ul className="space-y-4">
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
                          <div className="mt-1 text-xs text-muted-foreground">
                            Requested date: {r.requestedDate}
                          </div>
                        )}
                        {r.details && <p className="mt-1 text-sm">{r.details}</p>}
                        <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                          {relativeTime(r.createdAt)}
                        </div>
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
          </div>
        </div>
      </main>
    </>
  );
}
