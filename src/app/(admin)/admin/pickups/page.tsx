import { CalendarCheck2, Sparkles } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PickupStatusButton } from "@/components/admin/pickup-status-button";
import { store } from "@/lib/store";
import { formatDate, relativeTime } from "@/lib/utils";

const STATUS_FLOW: Array<"pending" | "confirmed" | "prepping" | "ready" | "picked-up" | "returned"> = [
  "pending",
  "confirmed",
  "prepping",
  "ready",
  "picked-up",
  "returned",
];

const STATUS_VARIANT: Record<string, "info" | "warning" | "success" | "muted" | "secondary"> = {
  pending: "warning",
  confirmed: "info",
  prepping: "warning",
  ready: "success",
  "picked-up": "muted",
  returned: "secondary",
  cancelled: "muted",
};

export default async function AdminPickupsPage() {
  const pickups = store.listPickups();
  const active = pickups.filter((p) => !["picked-up", "returned", "cancelled"].includes(p.status));
  const done = pickups.filter((p) => ["picked-up", "returned", "cancelled"].includes(p.status));
  return (
    <>
      <Topbar
        title="Pickups & Prep"
        subtitle={`${active.length} pickups in flight · keeping rigs trip-ready`}
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="font-display text-lg font-semibold">Active</h2>
              <Badge variant="info" className="gap-1">
                <Sparkles className="h-3 w-3" /> JSC differentiator
              </Badge>
            </div>
            <ul className="divide-y">
              {active.length === 0 && (
                <li className="py-10 text-center text-sm text-muted-foreground">
                  Nothing scheduled.
                </li>
              )}
              {active.map((p) => {
                const customer = store.getCustomer(p.customerId);
                const rv = store.getRv(p.rvId);
                return (
                  <li key={p.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={STATUS_VARIANT[p.status]} className="capitalize">
                          {p.status}
                        </Badge>
                        <span className="text-sm font-semibold">{customer?.name}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {rv?.year} {rv?.make} {rv?.model}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarCheck2 className="h-3 w-3" />
                        Pickup {formatDate(p.pickupDate)}
                        {p.returnDate && <> · Return {formatDate(p.returnDate)}</>}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.prepRequests.map((r) => (
                          <Badge key={r} variant="outline" className="text-[10px] capitalize">
                            {r.replace("-", " ")}
                          </Badge>
                        ))}
                      </div>
                      {p.notes && (
                        <p className="mt-2 rounded-md border-l-2 border-primary/30 bg-secondary/30 px-3 py-2 text-xs italic text-muted-foreground">
                          “{p.notes}”
                        </p>
                      )}
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        Requested {relativeTime(p.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      {STATUS_FLOW.map((s) => (
                        <PickupStatusButton key={s} pickupId={p.id} status={s} current={p.status} />
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {done.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Recent</h2>
              <ul className="mt-3 divide-y">
                {done.slice(0, 8).map((p) => {
                  const customer = store.getCustomer(p.customerId);
                  return (
                    <li
                      key={p.id}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <span>{customer?.name} · {formatDate(p.pickupDate)}</span>
                      <Badge variant="muted" className="capitalize">{p.status}</Badge>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
