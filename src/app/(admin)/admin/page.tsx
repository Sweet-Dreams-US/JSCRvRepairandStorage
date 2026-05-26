import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarCheck2,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileText,
  MapPinned,
  Sparkles,
  TrendingUp,
  UserPlus,
  Wrench,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { formatCurrency, formatDate, formatDateTime, relativeTime } from "@/lib/utils";

export default async function AdminDashboard() {
  const user = await requireUser();
  const stats = store.computeStats();
  const activity = store.recentActivity(8);
  const upcomingPickups = store.upcomingPickups(7);
  const todayJobs = store.activeJobs().filter((j) => {
    if (!j.scheduledStart) return false;
    const start = new Date(j.scheduledStart);
    const today = new Date();
    return start.toDateString() === today.toDateString();
  });
  const revenueByMonth = store.revenueByMonth();
  const newLeads = store.newLeads();

  return (
    <>
      <Topbar
        title={`Good ${greeting()}, ${user.name.split(" ")[0]}`}
        subtitle="Here’s where the shop stands right now."
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        {/* Top stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatBlock
            icon={<Wrench className="h-4 w-4" />}
            label="Active jobs"
            value={stats.activeJobs}
            sub={`${stats.jobsByStatus["in-progress"] ?? 0} in progress · ${stats.jobsByStatus["waiting-parts"] ?? 0} waiting parts`}
            href="/admin/jobs"
            accent="primary"
          />
          <StatBlock
            icon={<MapPinned className="h-4 w-4" />}
            label="Lot occupancy"
            value={`${stats.lotOccupancyPct}%`}
            sub={`${stats.lotOccupied} / ${stats.lotTotal} spots · ${formatCurrency(stats.monthlyStorageRev)} monthly`}
            href="/admin/lot"
            accent="info"
          />
          <StatBlock
            icon={<DollarSign className="h-4 w-4" />}
            label="Outstanding A/R"
            value={formatCurrency(stats.outstandingAR)}
            sub={
              stats.overdueAR > 0
                ? `${formatCurrency(stats.overdueAR)} overdue`
                : "Nothing overdue"
            }
            href="/admin/invoices"
            accent={stats.overdueAR > 0 ? "destructive" : "success"}
          />
          <StatBlock
            icon={<UserPlus className="h-4 w-4" />}
            label="New leads"
            value={stats.newLeads}
            sub="Awaiting first touch"
            href="/admin/leads"
            accent="warning"
          />
        </div>

        {/* Charts + Today */}
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold">Revenue vs expenses</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Last 12 months · trailing payments and recorded expenses
                  </p>
                </div>
                <Badge variant="info" className="gap-1.5">
                  <TrendingUp className="h-3 w-3" /> +14% YoY
                </Badge>
              </div>
              <div className="mt-5 h-72">
                <RevenueChart data={revenueByMonth} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Today on the bay</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {todayJobs.length} jobs scheduled · {upcomingPickups.length} pickups within 7 days
              </p>
              <Separator className="my-4" />
              {todayJobs.length === 0 && upcomingPickups.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Nothing scheduled — light day.
                </p>
              ) : (
                <ul className="grid gap-3">
                  {todayJobs.map((j) => {
                    const rv = store.getRv(j.rvId);
                    const customer = store.getCustomer(j.customerId);
                    return (
                      <li key={j.id} className="flex items-start gap-3 rounded-md border bg-secondary/30 p-3">
                        <Wrench className="mt-0.5 h-4 w-4 text-primary" />
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/admin/jobs/${j.id}`}
                            className="text-sm font-semibold hover:underline"
                          >
                            {j.title}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {customer?.name} · {rv?.make} {rv?.model}
                          </p>
                          {j.scheduledStart && (
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {formatDateTime(j.scheduledStart)}
                            </p>
                          )}
                        </div>
                        <Badge variant={j.priority === "high" ? "destructive" : "info"} className="capitalize">
                          {j.priority}
                        </Badge>
                      </li>
                    );
                  })}
                  {upcomingPickups.slice(0, 3).map((p) => {
                    const customer = store.getCustomer(p.customerId);
                    return (
                      <li key={p.id} className="flex items-start gap-3 rounded-md border bg-primary/5 p-3">
                        <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold">Pickup prep — {customer?.name}</div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatDate(p.pickupDate)} · {p.prepRequests.length} prep items
                          </p>
                        </div>
                        <Badge variant="warning" className="capitalize">{p.status}</Badge>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity + Leads */}
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Activity feed</h2>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <Separator className="my-4" />
              <ul className="space-y-4">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-bold uppercase">
                      {a.actorName.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <strong>{a.actorName}</strong> — {a.description}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {relativeTime(a.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">New leads</h2>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/admin/leads">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              <Separator className="my-4" />
              {newLeads.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Nothing new. Great hustle.
                </p>
              ) : (
                <ul className="space-y-3">
                  {newLeads.map((l) => (
                    <li key={l.id} className="rounded-md border bg-background p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{l.name}</span>
                        <Badge variant="warning" className="capitalize">{l.interest}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{l.message}</p>
                      <div className="mt-2 text-[10px] uppercase text-muted-foreground">
                        Source: {l.source} · {relativeTime(l.createdAt)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Jobs by status overview */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-semibold">Job pipeline</h2>
            <Separator className="my-4" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { key: "intake", label: "Intake" },
                { key: "diagnosing", label: "Diagnosing" },
                { key: "quote-sent", label: "Quote sent" },
                { key: "approved", label: "Approved" },
                { key: "in-progress", label: "In progress" },
                { key: "waiting-parts", label: "Waiting parts" },
                { key: "qa", label: "QA" },
                { key: "ready", label: "Ready" },
              ].map((s) => {
                const count = stats.jobsByStatus[s.key] ?? 0;
                const pct = stats.activeJobs ? Math.round((count / stats.activeJobs) * 100) : 0;
                return (
                  <div key={s.key} className="rounded-lg border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase text-muted-foreground">
                        {s.label}
                      </span>
                      <span className="text-lg font-bold">{count}</span>
                    </div>
                    <Progress value={pct} className="mt-2 h-1" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function StatBlock({
  icon,
  label,
  value,
  sub,
  href,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub: string;
  href: string;
  accent: "primary" | "info" | "success" | "warning" | "destructive";
}) {
  const accentMap: Record<typeof accent, string> = {
    primary: "border-primary/30 bg-primary/5",
    info: "border-info/30 bg-info/5",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    destructive: "border-destructive/30 bg-destructive/5",
  };
  return (
    <Link href={href}>
      <Card className={`border-2 transition-shadow hover:shadow-md ${accentMap[accent]}`}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {icon}
              {label}
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="mt-2 text-3xl font-bold tabular-nums">{value}</div>
          <div className="mt-1 truncate text-xs text-muted-foreground">{sub}</div>
        </CardContent>
      </Card>
    </Link>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
