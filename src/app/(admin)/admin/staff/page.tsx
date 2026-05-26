import { Calendar, ClipboardCheck, Clock } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { store } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function StaffPage() {
  const staff = store.listStaff();
  const jobs = store.listJobs();
  const allShifts = store.listShifts();

  return (
    <>
      <Topbar title="Staff" subtitle={`${staff.length} on the crew`} />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {staff.map((s) => {
            const activeJobs = jobs.filter(
              (j) => j.assignedTechIds.includes(s.id) && !["completed", "cancelled"].includes(j.status),
            );
            const completedThisYear = jobs.filter(
              (j) =>
                j.assignedTechIds.includes(s.id) &&
                j.status === "completed" &&
                new Date(j.completedAt ?? j.createdAt).getFullYear() === new Date().getFullYear(),
            ).length;
            const upcomingShifts = allShifts
              .filter((sh) => sh.staffId === s.id && new Date(sh.start) > new Date())
              .slice(0, 3);
            return (
              <Card key={s.id} className="overflow-hidden">
                <div
                  className="h-3"
                  style={{ background: s.color }}
                />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-semibold">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.title}</div>
                    </div>
                    <Badge variant="muted" className="capitalize">{s.role}</Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {s.email} · {s.phone}
                  </p>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <Mini label="Active" value={activeJobs.length} />
                    <Mini label="YTD done" value={completedThisYear} />
                    <Mini label="Rate" value={`$${s.hourlyRate}/h`} />
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <div className="text-xs font-semibold uppercase text-muted-foreground">
                      Skills
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {s.skills.map((sk) => (
                        <Badge key={sk} variant="outline" className="text-[10px]">{sk}</Badge>
                      ))}
                    </div>
                  </div>
                  {upcomingShifts.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div className="text-xs font-semibold uppercase text-muted-foreground">
                        Upcoming shifts
                      </div>
                      <ul className="mt-2 space-y-1 text-xs">
                        {upcomingShifts.map((sh) => (
                          <li key={sh.id} className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(sh.start)}
                            </span>
                            <span className="text-muted-foreground">
                              {new Date(sh.start).toLocaleTimeString([], { hour: "numeric" })}–
                              {new Date(sh.end).toLocaleTimeString([], { hour: "numeric" })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className="mt-4 text-[10px] text-muted-foreground">
                    Hired {formatDate(s.hireDate)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}

function Mini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border bg-secondary/30 p-2">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-base font-bold">{value}</div>
    </div>
  );
}
