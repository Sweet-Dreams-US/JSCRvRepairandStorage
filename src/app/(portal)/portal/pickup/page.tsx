import { CalendarCheck2 } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PickupForm } from "@/components/portal/pickup-form";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { formatDate, formatDateTime, relativeTime } from "@/lib/utils";

const PREP_LABEL: Record<string, string> = {
  "tires-aired": "Tires aired",
  "battery-check": "Battery check & top-off",
  "water-fill": "Fresh tank fill",
  "propane-check": "Propane fill",
  "exterior-wash": "Exterior wash",
  "dump-tanks": "Dump black + grey tanks",
  "fuel-up": "Fuel-up (cost at pump)",
  "fridge-cooldown": "Fridge cool-down (24h)",
  "generator-test": "Generator load test",
  "slide-test": "Slides cycled & sealed",
};

export default async function PickupPage() {
  const user = await requireUser();
  const rvs = store.rvsByCustomer(user.id);
  const pickups = store.pickupsByCustomer(user.id);
  const upcoming = pickups.filter((p) => !["picked-up", "returned", "cancelled"].includes(p.status));
  const past = pickups.filter((p) => ["picked-up", "returned", "cancelled"].includes(p.status));

  return (
    <>
      <Topbar
        title="Schedule a Pickup"
        subtitle="Tell us when you’re heading out — we’ll take care of the prep."
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-bold">New pickup request</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose what you’d like done before you arrive. We don’t charge for
                the prep service — only any consumables (propane fill, dump
                station fees, fuel, etc).
              </p>
              <div className="mt-5">
                <PickupForm rvs={rvs} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-2 border-primary/15 bg-primary/5">
              <CardContent className="p-5">
                <Badge className="bg-primary text-primary-foreground">Heads-up policy</Badge>
                <p className="mt-2 text-sm">
                  Give us at least <strong>48 hours notice</strong> for full prep
                  packages. Quick stuff like &ldquo;please air the tires&rdquo; can
                  usually be done same-day if you call.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold">Upcoming pickups</h3>
                <div className="mt-3 space-y-3">
                  {upcoming.length === 0 && (
                    <p className="text-xs text-muted-foreground">Nothing scheduled.</p>
                  )}
                  {upcoming.map((p) => {
                    const rv = store.getRv(p.rvId);
                    return (
                      <div key={p.id} className="rounded-md border bg-background p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-semibold">
                            {rv?.nickname ?? rv?.make ?? "RV"}
                          </div>
                          <Badge variant="info" className="capitalize">
                            {p.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarCheck2 className="h-3 w-3" />
                          {formatDate(p.pickupDate)}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.prepRequests.map((r) => (
                            <Badge key={r} variant="outline" className="text-[10px]">
                              {PREP_LABEL[r] ?? r}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {past.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold">Past pickups</h3>
                  <ul className="mt-3 space-y-2 text-xs">
                    {past.slice(0, 5).map((p) => {
                      const rv = store.getRv(p.rvId);
                      return (
                        <li key={p.id} className="flex items-center justify-between">
                          <span>{rv?.make} — {formatDate(p.pickupDate)}</span>
                          <span className="text-muted-foreground capitalize">{p.status}</span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
