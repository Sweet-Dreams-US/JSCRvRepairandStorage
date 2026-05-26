import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { store } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";

function startOfWeek(d: Date) {
  const dt = new Date(d);
  dt.setDate(d.getDate() - d.getDay());
  dt.setHours(0, 0, 0, 0);
  return dt;
}

export default async function SchedulePage() {
  const staff = store.listStaff();
  const shifts = store.listShifts();
  const jobs = store.activeJobs().filter((j) => j.scheduledStart);
  const pickups = store.upcomingPickups(30);

  const today = new Date();
  const weekStart = startOfWeek(today);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  return (
    <>
      <Topbar
        title="Schedule"
        subtitle="Staff shifts, scheduled jobs, and upcoming pickups for the week"
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Weekly view</h2>
              <div className="text-xs text-muted-foreground">
                Week of {weekStart.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              </div>
            </div>
            <Separator className="my-4" />

            <div className="overflow-x-auto">
              <div className="grid min-w-[1100px] grid-cols-[200px_repeat(7,1fr)] gap-2 text-xs">
                <div></div>
                {days.map((d) => (
                  <div
                    key={d.toISOString()}
                    className="rounded-t-md border bg-secondary p-2 text-center font-semibold"
                  >
                    <div className="text-muted-foreground">
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-lg">{d.getDate()}</div>
                  </div>
                ))}
                {staff.map((s) => (
                  <ScheduleRow
                    key={s.id}
                    staff={s}
                    days={days}
                    shifts={shifts.filter((sh) => sh.staffId === s.id)}
                    jobs={jobs.filter((j) => j.assignedTechIds.includes(s.id))}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Upcoming pickups</h2>
              <Separator className="my-4" />
              <ul className="space-y-3">
                {pickups.map((p) => {
                  const customer = store.getCustomer(p.customerId);
                  const rv = store.getRv(p.rvId);
                  return (
                    <li key={p.id} className="rounded-md border bg-background p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold">{customer?.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {rv?.year} {rv?.make} {rv?.model}
                          </div>
                        </div>
                        <Badge variant="info" className="capitalize">
                          {p.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs">
                        Pickup: <strong>{new Date(p.pickupDate).toLocaleDateString()}</strong>{" "}
                        {p.returnDate && (<> · Return: <strong>{new Date(p.returnDate).toLocaleDateString()}</strong></>)}
                      </div>
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        Prep: {p.prepRequests.join(", ")}
                      </div>
                    </li>
                  );
                })}
                {pickups.length === 0 && (
                  <li className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">
                    No pickups scheduled.
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Scheduled jobs</h2>
              <Separator className="my-4" />
              <ul className="space-y-3">
                {jobs
                  .sort((a, b) => (a.scheduledStart ?? "").localeCompare(b.scheduledStart ?? ""))
                  .map((j) => {
                    const techs = j.assignedTechIds.map((id) => store.getStaff(id)).filter(Boolean);
                    return (
                      <li key={j.id} className="rounded-md border bg-background p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold">{j.title}</div>
                            <div className="text-xs text-muted-foreground">{j.number}</div>
                          </div>
                          <Badge variant="default" className="capitalize">
                            {j.priority}
                          </Badge>
                        </div>
                        {j.scheduledStart && (
                          <div className="mt-2 text-xs">
                            {formatDateTime(j.scheduledStart)} — {j.estimatedHours}h estimated
                          </div>
                        )}
                        <div className="mt-2 flex -space-x-1">
                          {techs.map((t) => (
                            <div
                              key={t!.id}
                              className="grid h-5 w-5 place-items-center rounded-full border-2 border-background text-[9px] font-semibold uppercase text-white"
                              style={{ background: t!.color }}
                              title={t!.name}
                            >
                              {t!.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                            </div>
                          ))}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

function ScheduleRow({
  staff,
  days,
  shifts,
  jobs,
}: {
  staff: { id: string; name: string; title: string; color: string };
  days: Date[];
  shifts: { start: string; end: string; kind: string }[];
  jobs: { id: string; title: string; scheduledStart?: string; number: string }[];
}) {
  return (
    <>
      <div className="flex items-center gap-2 rounded-md border bg-secondary/40 p-2">
        <div
          className="h-2 w-2 rounded-full"
          style={{ background: staff.color }}
        />
        <div>
          <div className="text-xs font-semibold">{staff.name.split(" ")[0]}</div>
          <div className="text-[10px] text-muted-foreground line-clamp-1">{staff.title}</div>
        </div>
      </div>
      {days.map((d) => {
        const dayShift = shifts.find(
          (sh) => new Date(sh.start).toDateString() === d.toDateString(),
        );
        const dayJobs = jobs.filter(
          (j) => j.scheduledStart && new Date(j.scheduledStart).toDateString() === d.toDateString(),
        );
        return (
          <div
            key={d.toISOString()}
            className="min-h-[64px] rounded-md border bg-background p-1.5 text-[10px]"
          >
            {dayShift && (
              <div
                className="mb-1 rounded px-1 py-0.5 text-white"
                style={{ background: staff.color }}
              >
                {new Date(dayShift.start).toLocaleTimeString([], { hour: "numeric" })}–
                {new Date(dayShift.end).toLocaleTimeString([], { hour: "numeric" })}
              </div>
            )}
            {dayJobs.map((j) => (
              <div key={j.id} className="rounded bg-primary/15 px-1 py-0.5 text-primary line-clamp-1">
                {j.number}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
