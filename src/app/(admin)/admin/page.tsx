import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  DollarSign,
  Inbox,
  MessageSquare,
  Plus,
  Users,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { accessStore } from "@/lib/access-store";
import { requireUser } from "@/lib/auth";
import { leadsStore } from "@/lib/leads-store";
import { formatApptWhen, formatCurrency, relativeTime } from "@/lib/utils";

export default async function AdminDashboard() {
  const user = await requireUser();

  const [summary, leads, upcomingAppts, openReqs, activity, accounts] = await Promise.all([
    accessStore.dashboardSummary().catch(() => null),
    leadsStore.listLeads().catch(() => []),
    accessStore.upcomingAppointments(6).catch(() => []),
    accessStore.listRequests().then((r) => r.filter((x) => x.status === "new")).catch(() => []),
    accessStore.recentActivity(8).catch(() => []),
    accessStore.listAccess().catch(() => []),
  ]);
  const nameById = new Map(accounts.map((a) => [a.id, a] as const));
  const newLeads = leads.filter((l) => l.status === "new");

  return (
    <>
      <Topbar
        title={`Good ${greeting()}, ${user.name.split(" ")[0]}`}
        subtitle="Here’s where the shop stands right now."
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        {/* Stat row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Stat icon={<Inbox className="h-4 w-4" />} label="New inquiries" value={newLeads.length} sub="Need a reply" href="/admin/leads" accent={newLeads.length > 0 ? "primary" : undefined} />
          <Stat icon={<Users className="h-4 w-4" />} label="Customers" value={summary?.activeCustomers ?? 0} sub={`${summary?.totalCustomers ?? 0} total`} href="/admin/access" />
          <Stat icon={<Inbox className="h-4 w-4" />} label="Open requests" value={summary?.openRequests ?? 0} sub="Awaiting action" href="/admin/requests" accent={(summary?.openRequests ?? 0) > 0 ? "primary" : undefined} />
          <Stat icon={<MessageSquare className="h-4 w-4" />} label="Unread messages" value={summary?.unreadMessages ?? 0} sub="From customers" href="/admin/access" accent={(summary?.unreadMessages ?? 0) > 0 ? "primary" : undefined} />
          <Stat icon={<CalendarClock className="h-4 w-4" />} label="Upcoming" value={summary?.upcomingAppointments ?? 0} sub="Appointments" href="/admin/appointments" />
          <Stat icon={<DollarSign className="h-4 w-4" />} label="Recurring" value={formatCurrency(summary?.monthlyRecurring ?? 0)} sub="Per month" href="/admin/access" accent="success" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm"><Link href="/admin/access/new"><Plus className="h-4 w-4" /> New customer</Link></Button>
          <Button asChild size="sm" variant="secondary"><Link href="/admin/leads">Inquiries ({newLeads.length})</Link></Button>
          <Button asChild size="sm" variant="secondary"><Link href="/admin/requests">Triage requests</Link></Button>
          <Button asChild size="sm" variant="secondary"><Link href="/admin/appointments">Schedule</Link></Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* New inquiries */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">New inquiries</h2>
                <Button asChild size="sm" variant="ghost"><Link href="/admin/leads">All <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
              </div>
              <Separator className="my-3" />
              {newLeads.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No new inquiries right now.</p>
              ) : (
                <ul className="space-y-2">
                  {newLeads.slice(0, 5).map((l) => (
                    <li key={l.id}>
                      <Link href={`/admin/leads/${l.id}`} className="block rounded-md border bg-background p-3 hover:border-primary/40">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{l.name}</span>
                          <span className="text-[11px] text-muted-foreground">{relativeTime(l.createdAt)}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{l.message}</p>
                      </Link>
                    </li>
                  ))}
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
                          <div className="truncate text-sm font-semibold">{ap.title || ap.kind} · {formatApptWhen(ap.scheduledFor)}</div>
                          <div className="truncate text-xs text-muted-foreground">{a ? `${a.customerName} · ${a.itemLabel}` : "Customer"}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Needs attention (open requests) */}
        {openReqs.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Needs attention</h2>
                <Button asChild size="sm" variant="ghost"><Link href="/admin/requests">All <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
              </div>
              <Separator className="my-3" />
              <ul className="grid gap-2 sm:grid-cols-2">
                {openReqs.slice(0, 6).map((r) => {
                  const a = nameById.get(r.accessId);
                  return (
                    <li key={r.id}>
                      <Link href={a ? `/admin/access/${a.id}` : "/admin/requests"} className="block rounded-md border bg-background p-3 hover:border-primary/40">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold capitalize">{r.type} request</span>
                          <Badge variant="warning">new</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{a ? `${a.customerName} · ${a.itemLabel}` : "Customer"}</div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        )}

        {activity.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-3 font-display text-lg font-semibold">Recent activity</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {activity.map((it, i) => (
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
      </main>
    </>
  );
}

function Stat({
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
