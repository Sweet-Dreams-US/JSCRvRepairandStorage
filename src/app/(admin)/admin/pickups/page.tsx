import Link from "next/link";
import { CalendarClock, Sparkles } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScheduleForm } from "@/components/admin/schedule-form";
import { updateAppointmentStatusAction } from "@/app/actions/access-admin";
import { accessStore } from "@/lib/access-store";
import { formatApptWhen, relativeTime } from "@/lib/utils";

export const metadata = { title: "Pickups · Admin" };

export default async function PickupsPage() {
  const [requests, appointments, access] = await Promise.all([
    accessStore.listRequests(),
    accessStore.listAppointments(),
    accessStore.listAccess(),
  ]);
  const byId = new Map(access.map((a) => [a.id, a] as const));
  const nowIso = new Date().toISOString();

  const pendingPickups = requests.filter(
    (r) => r.type === "pickup" && (r.status === "new" || r.status === "acknowledged"),
  );
  const scheduledPickups = appointments.filter(
    (a) => a.kind === "pickup" && a.status !== "cancelled" && a.status !== "completed" && a.scheduledFor >= nowIso,
  );

  return (
    <>
      <Topbar
        title="Pickups"
        subtitle={`${pendingPickups.length} to schedule · ${scheduledPickups.length} coming up`}
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        {/* To schedule */}
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Pickup requests to schedule</h2>
          {pendingPickups.length === 0 ? (
            <Card>
              <CardContent className="grid place-items-center gap-2 py-10 text-center">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No pickup requests waiting. Customers request these from their account.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingPickups.map((r) => {
                const a = byId.get(r.accessId);
                const defaultLocal = r.requestedDate ? `${r.requestedDate}T09:00` : undefined;
                return (
                  <Card key={r.id}>
                    <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_300px]">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold">{a ? a.customerName : "Customer"}</span>
                          <Badge variant="warning" className="capitalize">{r.status}</Badge>
                          {a && <Link href={`/admin/access/${a.id}`} className="text-sm text-primary hover:underline">{a.itemLabel}</Link>}
                        </div>
                        {r.requestedDate && <div className="mt-1 text-sm">Requested for {r.requestedDate}</div>}
                        {r.details && <p className="mt-1 text-sm text-muted-foreground">{r.details}</p>}
                        <div className="mt-2 flex items-center gap-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                          <span>{relativeTime(r.createdAt)}</span>
                          {a?.phone && <a href={`tel:${a.phone}`} className="hover:text-primary">{a.phone}</a>}
                        </div>
                      </div>
                      {a && (
                        <ScheduleForm accessId={a.id} requestId={r.id} defaultKind="pickup" defaultLocal={defaultLocal} title="Schedule pickup" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Coming up */}
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Scheduled pickups</h2>
          {scheduledPickups.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Nothing scheduled. Book a pickup above or from a customer.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {scheduledPickups.map((ap) => {
                const a = byId.get(ap.accessId);
                return (
                  <Card key={ap.id}>
                    <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <CalendarClock className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{ap.title || "Pickup"}</span>
                            <Badge variant={ap.status === "confirmed" ? "success" : "info"} className="capitalize">{ap.status}</Badge>
                          </div>
                          <div className="text-sm font-medium">{formatApptWhen(ap.scheduledFor)}</div>
                          {a && <Link href={`/admin/access/${a.id}`} className="text-xs text-primary hover:underline">{a.customerName} · {a.itemLabel}</Link>}
                          {ap.notes && <p className="mt-1 text-xs text-muted-foreground">{ap.notes}</p>}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {ap.status === "scheduled" && (
                          <StatusBtn id={ap.id} accessId={ap.accessId} to="confirmed" label="Confirm" variant="secondary" />
                        )}
                        <StatusBtn id={ap.id} accessId={ap.accessId} to="completed" label="Done" variant="default" />
                        <StatusBtn id={ap.id} accessId={ap.accessId} to="cancelled" label="Cancel" variant="ghost" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function StatusBtn({
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
      <Button type="submit" size="sm" variant={variant}>{label}</Button>
    </form>
  );
}
