import { CalendarCheck2, Hammer, History, MapPin, Truck, Wrench } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function MyRvsPage() {
  const user = await requireUser();
  const rvs = store.rvsByCustomer(user.id);
  return (
    <>
      <Topbar title="My RVs" subtitle="The rigs we have on file for you." />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        {rvs.map((rv) => {
          const spot = store.lotSpotForRv(rv.id);
          const jobs = store.listJobs().filter((j) => j.rvId === rv.id);
          const activeJobs = jobs.filter((j) => !["completed", "cancelled"].includes(j.status));
          const completedJobs = jobs.filter((j) => j.status === "completed");
          return (
            <Card key={rv.id} className="overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
                <div className="relative bg-gradient-to-br from-brand-gray-dark to-zinc-800 p-6 text-white">
                  <Badge className="bg-white/10 text-white">{rv.type}</Badge>
                  <h2 className="mt-3 font-display text-2xl font-bold">
                    {rv.nickname ?? `${rv.year} ${rv.make}`}
                  </h2>
                  <p className="mt-1 text-sm text-white/80">
                    {rv.year} {rv.make} {rv.model}
                  </p>
                  <Separator className="my-4 bg-white/10" />
                  <dl className="grid gap-2 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-white/60">Length</dt>
                      <dd>{rv.length}&apos;</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-white/60">VIN</dt>
                      <dd className="font-mono">{rv.vin.slice(-8)}</dd>
                    </div>
                    {rv.plateNumber && (
                      <div className="flex justify-between">
                        <dt className="text-white/60">Plate</dt>
                        <dd>{rv.plateState} · {rv.plateNumber}</dd>
                      </div>
                    )}
                    {rv.color && (
                      <div className="flex justify-between">
                        <dt className="text-white/60">Color</dt>
                        <dd>{rv.color}</dd>
                      </div>
                    )}
                    {spot && (
                      <div className="flex justify-between">
                        <dt className="text-white/60">Spot</dt>
                        <dd className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {spot.label}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                <CardContent className="grid gap-4 p-6">
                  {rv.notes && (
                    <div className="rounded-md border-l-2 border-info/40 bg-info/5 px-3 py-2 text-sm">
                      <strong>On file: </strong>
                      {rv.notes}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold">Active work</h3>
                    </div>
                    {activeJobs.length === 0 ? (
                      <p className="mt-2 text-xs text-muted-foreground">Nothing currently in the shop.</p>
                    ) : (
                      <ul className="mt-2 grid gap-2">
                        {activeJobs.map((j) => (
                          <li key={j.id} className="rounded-md border bg-secondary/30 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold">{j.title}</span>
                              <Badge variant="info" className="capitalize">{j.status.replace("-", " ")}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {j.number}
                              {j.scheduledStart && <> · {formatDateTime(j.scheduledStart)}</>}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold">Service history</h3>
                    </div>
                    {completedJobs.length === 0 ? (
                      <p className="mt-2 text-xs text-muted-foreground">No completed jobs yet.</p>
                    ) : (
                      <ul className="mt-2 divide-y">
                        {completedJobs.slice(0, 5).map((j) => (
                          <li key={j.id} className="flex items-center justify-between py-2 text-sm">
                            <div>
                              <div className="font-medium">{j.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {j.number} · {j.completedAt ? formatDate(j.completedAt) : "—"}
                              </div>
                            </div>
                            <Badge variant="success">Completed</Badge>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          );
        })}
        {rvs.length === 0 && (
          <Card>
            <CardContent className="grid place-items-center gap-3 py-16 text-center">
              <Truck className="h-10 w-10 text-muted-foreground" />
              <h2 className="text-lg font-semibold">No RVs on file yet</h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                Once Joe adds your rig, you’ll see it here with full service history.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
