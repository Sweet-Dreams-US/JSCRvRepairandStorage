import Link from "next/link";
import { ArrowRight, CalendarClock, Inbox, Wrench } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScheduleForm } from "@/components/admin/schedule-form";
import { updateRequestStatusAction } from "@/app/actions/access-admin";
import { accessStore } from "@/lib/access-store";
import { relativeTime } from "@/lib/utils";
import type { AppointmentKind, CustomerRequest } from "@/lib/types";

export const metadata = { title: "Requests · Admin" };

const TYPE_LABEL: Record<CustomerRequest["type"], string> = {
  pickup: "Pickup",
  service: "Service",
  other: "General",
};
const STATUSES = ["new", "acknowledged", "scheduled", "done", "declined"] as const;
type Filter = (typeof STATUSES)[number] | "all" | "open";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "open", label: "Open" },
  { key: "new", label: "New" },
  { key: "acknowledged", label: "Acknowledged" },
  { key: "scheduled", label: "Scheduled" },
  { key: "done", label: "Done" },
  { key: "all", label: "All" },
];

function kindForType(t: CustomerRequest["type"]): AppointmentKind {
  return t === "pickup" ? "pickup" : t === "service" ? "service" : "other";
}

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: fp } = await searchParams;
  const filter: Filter = FILTERS.some((f) => f.key === fp) ? (fp as Filter) : "open";

  const [requests, access] = await Promise.all([
    accessStore.listRequests(),
    accessStore.listAccess(),
  ]);
  const byId = new Map(access.map((a) => [a.id, a] as const));

  const count = (k: Filter) =>
    k === "all"
      ? requests.length
      : k === "open"
        ? requests.filter((r) => r.status === "new" || r.status === "acknowledged").length
        : requests.filter((r) => r.status === k).length;

  const visible = requests.filter((r) =>
    filter === "all"
      ? true
      : filter === "open"
        ? r.status === "new" || r.status === "acknowledged"
        : r.status === filter,
  );

  return (
    <>
      <Topbar
        title="Requests"
        subtitle={`${count("open")} open · ${requests.length} total`}
      />
      <main className="flex-1 space-y-5 bg-secondary/20 p-6">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = f.key === filter;
            return (
              <Link
                key={f.key}
                href={`/admin/requests?filter=${f.key}`}
                className={
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                  (active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground/70 hover:border-primary/40")
                }
              >
                {f.label}
                <span className={"rounded-full px-1.5 text-[10px] " + (active ? "bg-white/20" : "bg-muted text-muted-foreground")}>
                  {count(f.key)}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-4">
          {visible.map((r) => {
            const a = byId.get(r.accessId);
            const canSchedule = r.status === "new" || r.status === "acknowledged";
            const defaultLocal = r.requestedDate ? `${r.requestedDate}T09:00` : undefined;
            return (
              <Card
                key={r.id}
                className="border-l-4"
                style={{ borderLeftColor: r.status === "new" ? "#c8331f" : "transparent" }}
              >
                <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_300px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 text-sm font-semibold">
                        {r.type === "pickup" ? (
                          <CalendarClock className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Wrench className="h-3.5 w-3.5 text-primary" />
                        )}
                        {TYPE_LABEL[r.type]}
                      </span>
                      <Badge variant={r.status === "new" ? "warning" : "muted"} className="capitalize">
                        {r.status}
                      </Badge>
                      {a && (
                        <Link
                          href={`/admin/access/${a.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {a.customerName} · {a.itemLabel}
                        </Link>
                      )}
                    </div>
                    {r.requestedDate && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Requested date:</span> {r.requestedDate}
                      </div>
                    )}
                    {r.details && <p className="mt-1 text-sm">{r.details}</p>}
                    <div className="mt-2 flex items-center gap-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                      <span>{relativeTime(r.createdAt)}</span>
                      {a?.phone && <a href={`tel:${a.phone}`} className="hover:text-primary">{a.phone}</a>}
                      {a && <a href={`mailto:${a.email}`} className="hover:text-primary">{a.email}</a>}
                    </div>

                    <form action={updateRequestStatusAction} className="mt-3 flex items-center gap-2">
                      <input type="hidden" name="requestId" value={r.id} />
                      <input type="hidden" name="accessId" value={r.accessId} />
                      <select
                        name="status"
                        defaultValue={r.status}
                        className="rounded-md border bg-background px-2 py-1.5 text-xs capitalize"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Button type="submit" size="sm" variant="secondary">Set status</Button>
                    </form>
                  </div>

                  {canSchedule && a ? (
                    <ScheduleForm
                      accessId={a.id}
                      requestId={r.id}
                      defaultKind={kindForType(r.type)}
                      defaultLocal={defaultLocal}
                      title="Book it"
                    />
                  ) : (
                    a && (
                      <div className="flex items-start justify-end">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/access/${a.id}`}>
                            Open customer <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            );
          })}

          {visible.length === 0 && (
            <Card>
              <CardContent className="grid place-items-center gap-2 py-16 text-center">
                <Inbox className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {filter === "open" ? "No open requests. You're all caught up." : `No ${filter} requests.`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
