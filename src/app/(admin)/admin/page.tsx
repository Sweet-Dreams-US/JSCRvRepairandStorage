import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  DollarSign,
  Inbox,
  MapPinned,
  MessageSquare,
  Plus,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  Wrench,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { accessStore } from "@/lib/access-store";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";
import {
  formatApptWhen,
  formatCurrency,
  formatDate,
  formatDateTime,
  relativeTime,
} from "@/lib/utils";

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

  // Live CRM data (Supabase) — the real business. Fail-soft so the page always renders.
  const [summary, upcomingAppts, openReqs, custActivity, accounts] = await Promise.all([
    accessStore.dashboardSummary().catch(() => null),
    accessStore.upcomingAppointments(6).catch(() => []),
    accessStore.listRequests().then((r) => r.filter((x) => x.status === "new")).catch(() => []),
    accessStore.recentActivity(8).catch(() => []),
    accessStore.listAccess().catch(() => []),
  ]);
  const nameById = new Map(accounts.map((a) => [a.id, a] as const));

  return (
    <>
      <Topbar
        title={`Good ${greeting()}, ${user.name.split(" ")[0]}`}
        subtitle="Here’s where the shop stands right now."
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        {/* ───────── LIVE COMMAND CENTER (real customers) ───────── */}
        {summary && (
          <section className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <LiveStat icon={<Users className="h-4 w-4" />} label="Customers" value={summary.activeCustomers} sub={`${summary.totalCustomers} total`} href="/admin/access" />
              <LiveStat icon={<Inbox className="h-4 w-4" />} label="Open requests" value={summary.openRequests} sub="Awaiting action" href="/admin/requests" accent={summary.openRequests > 0 ? "primary" : undefined} />
              <LiveStat icon={<MessageSquare className="h-4 w-4" />} label="Unread messages" value={summary.unreadMessages} sub="From customers" href="/admin/access" accent={summary.unreadMessages > 0 ? "primary" : undefined} />
              <LiveStat icon={<CalendarClock className="h-4 w-4" />} label="Upcoming" value={summary.upcomingAppointments} sub="Appointments" href="/admin/appointments" />
              <LiveStat icon={<DollarSign className="h-4 w-4" />} label="Recurring" value={formatCurrency(summary.monthlyRecurring)} sub="Per month" href="/admin/access" accent="success" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm"><Link href="/admin/access/new"><Plus className="h-4 w-4" /> New customer</Link></Button>
              <Button asChild size="sm" variant="secondary"><Link href="/admin/requests">Triage requests</Link></Button>
              <Button asChild size="sm" variant="secondary"><Link href="/admin/appointments">Schedule</Link></Button>
              <Button asChild size="sm" variant="ghost"><Link href="/admin/leads">Inquiries ({newLeads.length})</Link></Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {/* Needs attention: open requests */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold">Needs attention</h2>
                    <Button asChild size="sm" variant="ghost"><Link href="/admin/requests">All <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
                  </div>
                  <Separator className="my-3" />
                  {openReqs.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No open requests. Nicely done.</p>
                  ) : (
                    <ul className="space-y-2">
                      {openReqs.slice(0, 5).map((r) => {
                        const a = nameById.get(r.accessId);
                        return (
                          <li key={r.id}>
                            <Link href={a ? `/admin/access/${a.id}` : "/admin/requests"} className="block rounded-md border bg-background p-3 hover:border-primary/40">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold capitalize">{r.type} request</span>
                                <Badge variant="warning">new</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {a ? `${a.customerName} · ${a.itemLabel}` : "Customer"}
                                {r.requestedDate ? ` · ${r.requestedDate}` : ""}
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming appointments */}
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold">Upcoming appointments</h2>
                    <Button asChild size="sm" variant="ghost"><Link href="/admin/appointments">All <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
                  </div>
                  <Separator className="my-3" />
                  {upcomingAppts.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">Nothing scheduled yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {upcomingAppts.map((ap) => {
                        const a = nameById.get(ap.accessId);
                        return (
                          <li key={ap.id} className="flex items-center gap-3 rounded-md border bg-background p-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                              <CalendarClock className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold">
                                {ap.title || ap.kind} · {formatApptWhen(ap.scheduledFor)}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {a ? `${a.customerName} · ${a.itemLabel}` : "Customer"}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            {custActivity.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h2 className="mb-3 font-display text-lg font-semibold">Recent customer activity</h2>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {custActivity.map((it, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span className="truncate">
                          <span className="font-medium">{it.customerName}</span>
                          <span className="text-muted-foreground"> — {it.summary}</span>
                        </span>
                        <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">{relativeTime(it.at)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </section>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Separator className="flex-1" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Demo operations data
          </span>
          <Separator className="flex-1" />
        </div>

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
            label="New inquiries"
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
                <h2 className="font-display text-lg font-semibold">New inquiries</h2>
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

function LiveStat({
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
  accent?: "primary" | "success";
}) {
  const ring =
    accent === "primary"
      ? "border-primary/40 bg-primary/5"
      : accent === "success"
        ? "border-success/40 bg-success/5"
        : "border-border bg-background";
  return (
    <Link href={href}>
      <Card className={`border-2 transition-shadow hover:shadow-md ${ring}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {icon}
            {label}
          </div>
          <div className="mt-1.5 text-2xl font-bold tabular-nums">{value}</div>
          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{sub}</div>
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
