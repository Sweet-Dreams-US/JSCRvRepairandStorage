import Link from "next/link";
import { CalendarClock, CalendarX } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updateAppointmentStatusAction } from "@/app/actions/access-admin";
import { accessStore } from "@/lib/access-store";
import { formatApptWhen } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

export const metadata = { title: "Appointments · Admin" };

const KIND_LABEL: Record<Appointment["kind"], string> = {
  pickup: "Pickup",
  service: "Service",
  dropoff: "Drop-off",
  other: "Appointment",
};
const STATUS_VARIANT: Record<
  Appointment["status"],
  "success" | "info" | "muted" | "destructive"
> = {
  scheduled: "info",
  confirmed: "success",
  completed: "muted",
  cancelled: "destructive",
};

type Filter = "upcoming" | "all" | "completed" | "cancelled";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
];

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: fp } = await searchParams;
  const filter: Filter = FILTERS.some((f) => f.key === fp) ? (fp as Filter) : "upcoming";

  const [appts, access] = await Promise.all([
    accessStore.listAppointments(),
    accessStore.listAccess(),
  ]);
  const byId = new Map(access.map((a) => [a.id, a] as const));
  const nowIso = new Date().toISOString();

  const visible = appts.filter((a) => {
    if (filter === "all") return true;
    if (filter === "completed") return a.status === "completed";
    if (filter === "cancelled") return a.status === "cancelled";
    // upcoming
    return (a.status === "scheduled" || a.status === "confirmed") && a.scheduledFor >= nowIso;
  });
  const upcomingCount = appts.filter(
    (a) => (a.status === "scheduled" || a.status === "confirmed") && a.scheduledFor >= nowIso,
  ).length;

  return (
    <>
      <Topbar title="Appointments" subtitle={`${upcomingCount} upcoming · ${appts.length} total`} />
      <main className="flex-1 space-y-5 bg-secondary/20 p-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = f.key === filter;
            return (
              <Link
                key={f.key}
                href={`/admin/appointments?filter=${f.key}`}
                className={
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                  (active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground/70 hover:border-primary/40")
                }
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        <div className="grid gap-3">
          {visible.map((a) => {
            const cust = byId.get(a.accessId);
            const past = a.scheduledFor < nowIso;
            return (
              <Card key={a.id}>
                <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <CalendarClock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">
                          {a.title || `${KIND_LABEL[a.kind]}`}
                        </span>
                        <Badge variant={STATUS_VARIANT[a.status]} className="capitalize">
                          {a.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-[10px]">{a.kind}</Badge>
                      </div>
                      <div className="mt-1 text-sm font-medium">{formatApptWhen(a.scheduledFor)}</div>
                      {cust && (
                        <Link
                          href={`/admin/access/${cust.id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          {cust.customerName} · {cust.itemLabel}
                        </Link>
                      )}
                      {a.notes && <p className="mt-1 text-xs text-muted-foreground">{a.notes}</p>}
                    </div>
                  </div>

                  {a.status !== "completed" && a.status !== "cancelled" && (
                    <div className="flex shrink-0 items-center gap-2">
                      {a.status === "scheduled" && (
                        <StatusButton id={a.id} accessId={a.accessId} to="confirmed" label="Confirm" variant="secondary" />
                      )}
                      <StatusButton
                        id={a.id}
                        accessId={a.accessId}
                        to="completed"
                        label={past ? "Mark done" : "Complete"}
                        variant="default"
                      />
                      <StatusButton id={a.id} accessId={a.accessId} to="cancelled" label="Cancel" variant="ghost" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {visible.length === 0 && (
            <Card>
              <CardContent className="grid place-items-center gap-2 py-16 text-center">
                <CalendarX className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {filter === "upcoming"
                    ? "Nothing on the calendar. Schedule from a request or a customer."
                    : `No ${filter} appointments.`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}

function StatusButton({
  id,
  accessId,
  to,
  label,
  variant,
}: {
  id: string;
  accessId: string;
  to: Appointment["status"];
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
