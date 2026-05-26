import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  CreditCard,
  Droplets,
  FileText,
  Gauge,
  Hammer,
  MapPin,
  MessageSquare,
  Truck,
  Wrench,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { formatCurrency, formatDate, formatDateTime, relativeTime } from "@/lib/utils";
import type { PickupPrepRequest } from "@/lib/types";

const PREP_LABELS: Record<PickupPrepRequest, string> = {
  "tires-aired": "Tires aired",
  "battery-check": "Battery top-off",
  "water-fill": "Fresh tank fill",
  "propane-check": "Propane fill",
  "exterior-wash": "Exterior wash",
  "dump-tanks": "Tanks dumped",
  "fuel-up": "Fuel-up",
  "fridge-cooldown": "Fridge cool-down",
  "generator-test": "Generator test",
  "slide-test": "Slides cycled",
};

export default async function PortalDashboard() {
  const user = await requireUser();
  const rvs = store.rvsByCustomer(user.id);
  const jobs = store.jobsByCustomer(user.id);
  const quotes = store.quotesByCustomer(user.id);
  const invoices = store.invoicesByCustomer(user.id);
  const pickups = store.pickupsByCustomer(user.id);
  const threads = store.threadsForUser(user.id);
  const activeJobs = jobs.filter((j) => !["completed", "cancelled"].includes(j.status));
  const openQuote = quotes.find((q) => q.status === "sent");
  const unpaid = invoices.filter((i) => i.balanceDue > 0);
  const upcomingPickup = pickups
    .filter((p) => !["picked-up", "returned", "cancelled"].includes(p.status))
    .sort((a, b) => a.pickupDate.localeCompare(b.pickupDate))[0];

  return (
    <>
      <Topbar
        title={`Welcome, ${user.name.split(" ")[0]}`}
        subtitle="Here’s what’s going on with your RV today."
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        {/* Quick stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Truck className="h-4 w-4" />}
            label="RVs on file"
            value={rvs.length}
            sub={rvs.map((r) => r.nickname ?? `${r.year} ${r.make}`).join(", ")}
          />
          <StatCard
            icon={<Wrench className="h-4 w-4" />}
            label="Active jobs"
            value={activeJobs.length}
            sub={activeJobs[0]?.title ?? "Nothing in the shop"}
          />
          <StatCard
            icon={<FileText className="h-4 w-4" />}
            label="Open quotes"
            value={quotes.filter((q) => q.status === "sent").length}
            sub={openQuote ? `${openQuote.number} · ${formatCurrency(openQuote.total)}` : "All clear"}
          />
          <StatCard
            icon={<CreditCard className="h-4 w-4" />}
            label="Outstanding balance"
            value={formatCurrency(unpaid.reduce((s, i) => s + i.balanceDue, 0))}
            sub={`${unpaid.length} invoice${unpaid.length === 1 ? "" : "s"}`}
            highlight={unpaid.length > 0}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Pickup card */}
          <Card className="lg:col-span-2 border-2 border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge className="bg-primary/10 text-primary">Pickup</Badge>
                  <h2 className="mt-3 font-display text-2xl font-bold">
                    {upcomingPickup ? "Your next trip" : "Heading out soon?"}
                  </h2>
                  {upcomingPickup ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      We have you down for{" "}
                      <span className="font-semibold text-foreground">
                        {formatDate(upcomingPickup.pickupDate)}
                      </span>
                      {upcomingPickup.returnDate && (
                        <> · returning {formatDate(upcomingPickup.returnDate)}</>
                      )}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tell us when you’re heading out and we’ll prep your rig.
                    </p>
                  )}
                </div>
                <Badge variant={upcomingPickup ? "success" : "muted"} className="capitalize">
                  {upcomingPickup?.status ?? "Nothing scheduled"}
                </Badge>
              </div>

              {upcomingPickup ? (
                <>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {upcomingPickup.prepRequests.map((p) => (
                      <div key={p} className="flex items-center gap-2 rounded-md border bg-secondary/30 px-3 py-2">
                        {iconFor(p)}
                        <span className="text-sm">{PREP_LABELS[p]}</span>
                        <CheckCircle2 className="ml-auto h-4 w-4 text-success" />
                      </div>
                    ))}
                  </div>
                  {upcomingPickup.notes && (
                    <div className="mt-4 rounded-md border-l-2 border-primary/40 bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
                      Notes to the shop: <span className="italic">{upcomingPickup.notes}</span>
                    </div>
                  )}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                      Requested {relativeTime(upcomingPickup.createdAt)}
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/portal/pickup">
                        Manage <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="mt-5">
                  <Button asChild size="lg">
                    <Link href="/portal/pickup">
                      Schedule a pickup <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Open quote */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Quote needs your decision
                </span>
              </div>
              {openQuote ? (
                <>
                  <h3 className="mt-3 font-display text-xl font-bold">{openQuote.number}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {openQuote.lineItems.length} items · valid until{" "}
                    {formatDate(openQuote.validUntil)}
                  </p>
                  <div className="mt-4 text-3xl font-bold">{formatCurrency(openQuote.total)}</div>
                  <Button asChild className="mt-5 w-full">
                    <Link href={`/portal/quotes/${openQuote.id}`}>
                      Review quote <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="mt-3 font-display text-xl font-bold">All caught up</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No open quotes. We’ll let you know if anything new comes in.
                  </p>
                  <Button asChild variant="outline" className="mt-5 w-full">
                    <Link href="/portal/quotes">View quote history</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Active jobs + RV summary */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">In the shop</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/portal/rvs">See all RVs <ArrowRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
              <Separator className="my-4" />
              {activeJobs.length === 0 ? (
                <EmptyState
                  icon={<Hammer className="h-6 w-6 text-muted-foreground" />}
                  title="Nothing in the shop"
                  body="When work is scheduled or in progress, you’ll see it here."
                />
              ) : (
                <ul className="grid gap-3">
                  {activeJobs.map((j) => {
                    const rv = store.getRv(j.rvId);
                    return (
                      <li key={j.id} className="flex items-start gap-3 rounded-lg border bg-background p-4">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                          <Wrench className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold truncate">{j.title}</span>
                            <Badge variant={statusVariant(j.status)} className="capitalize whitespace-nowrap">
                              {j.status.replace("-", " ")}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {j.number} · {rv ? `${rv.year} ${rv.make} ${rv.model}` : "—"}
                          </p>
                          {j.scheduledStart && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <CalendarCheck2 className="h-3 w-3" />
                              {formatDateTime(j.scheduledStart)}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Your RVs</h2>
              <Separator className="my-4" />
              <ul className="grid gap-3">
                {rvs.map((rv) => {
                  const spot = store.lotSpotForRv(rv.id);
                  return (
                    <li key={rv.id} className="rounded-lg border bg-secondary/30 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          {rv.nickname ?? `${rv.year} ${rv.make}`}
                        </span>
                        {spot && (
                          <Badge variant="outline" className="gap-1">
                            <MapPin className="h-3 w-3" /> {spot.label}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {rv.type} · {rv.length}&apos; · {rv.make} {rv.model}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Recent messages</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/portal/messages">Open inbox <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
            <Separator className="my-4" />
            {threads.length === 0 ? (
              <EmptyState
                icon={<MessageSquare className="h-6 w-6 text-muted-foreground" />}
                title="No messages yet"
                body="Reach out anytime — Joe and Tina respond fast."
              />
            ) : (
              <ul className="grid gap-3">
                {threads.slice(0, 3).map((t) => {
                  const lastMsg = store.messagesByThread(t.id).at(-1);
                  const unread = t.unreadFor[user.id] ?? 0;
                  return (
                    <li key={t.id}>
                      <Link
                        href={`/portal/messages/${t.id}`}
                        className="flex items-start gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-accent"
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold truncate">{t.subject}</span>
                            {unread > 0 && (
                              <Badge variant="default" className="bg-primary text-primary-foreground">
                                {unread} new
                              </Badge>
                            )}
                          </div>
                          {lastMsg && (
                            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                              <strong className="text-foreground">{lastMsg.fromName}:</strong>{" "}
                              {lastMsg.body}
                            </p>
                          )}
                          {lastMsg && (
                            <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {relativeTime(lastMsg.createdAt)}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function statusVariant(
  s: string,
): "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" | "muted" {
  if (["completed", "ready"].includes(s)) return "success";
  if (["in-progress", "quote-sent"].includes(s)) return "info";
  if (["waiting-parts", "approved"].includes(s)) return "warning";
  if (["intake", "diagnosing"].includes(s)) return "secondary";
  return "outline";
}

function iconFor(p: PickupPrepRequest) {
  if (p === "tires-aired") return <Gauge className="h-3.5 w-3.5 text-muted-foreground" />;
  if (p === "battery-check") return <BatteryCharging className="h-3.5 w-3.5 text-muted-foreground" />;
  if (p === "water-fill" || p === "dump-tanks") return <Droplets className="h-3.5 w-3.5 text-muted-foreground" />;
  return <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />;
}

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-2 border-primary/30" : ""}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {icon}
          {label}
        </div>
        <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
        <div className="mt-1 truncate text-xs text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="grid place-items-center rounded-lg border-2 border-dashed py-10 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">{icon}</div>
      <div className="mt-3 text-sm font-semibold">{title}</div>
      <div className="mt-1 max-w-xs text-xs text-muted-foreground">{body}</div>
    </div>
  );
}
