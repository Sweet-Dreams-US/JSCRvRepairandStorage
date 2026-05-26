import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Truck,
  Wrench,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { store } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = store.getCustomer(id);
  if (!c) notFound();
  const rvs = store.rvsByCustomer(c.id);
  const jobs = store.jobsByCustomer(c.id);
  const quotes = store.quotesByCustomer(c.id);
  const invoices = store.invoicesByCustomer(c.id);
  const threads = store.threadsByCustomer(c.id);
  const outstanding = invoices.reduce((s, i) => s + i.balanceDue, 0);

  return (
    <>
      <Topbar
        title={c.name}
        subtitle={`Customer since ${formatDate(c.joinedDate)}`}
        rightSlot={
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
          >
            <ArrowLeft className="h-3 w-3" /> All customers
          </Link>
        }
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">RVs ({rvs.length})</h2>
                <Separator className="my-4" />
                <ul className="grid gap-3 sm:grid-cols-2">
                  {rvs.map((rv) => {
                    const spot = store.lotSpotForRv(rv.id);
                    return (
                      <li key={rv.id} className="rounded-md border bg-secondary/30 p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold">
                            {rv.nickname ?? `${rv.year} ${rv.make}`}
                          </div>
                          {spot && (
                            <Badge variant="outline" className="gap-1 text-[10px]">
                              <MapPin className="h-3 w-3" /> {spot.label}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {rv.year} {rv.make} {rv.model} · {rv.type} · {rv.length}&apos;
                        </div>
                        <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                          VIN: {rv.vin}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">Jobs ({jobs.length})</h2>
                <Separator className="my-4" />
                <ul className="space-y-2">
                  {jobs.length === 0 && (
                    <li className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">
                      No jobs yet.
                    </li>
                  )}
                  {jobs.map((j) => (
                    <li key={j.id}>
                      <Link
                        href={`/admin/jobs/${j.id}`}
                        className="flex items-center justify-between rounded-md border bg-background p-3 hover:bg-accent"
                      >
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-primary" />
                          <div>
                            <div className="text-sm font-semibold">{j.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {j.number} · {formatDate(j.createdAt)}
                            </div>
                          </div>
                        </div>
                        <Badge variant="info" className="capitalize">
                          {j.status.replace("-", " ")}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">Financial</h2>
                <Separator className="my-4" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Stat label="Lifetime value" value={formatCurrency(c.lifetimeValue)} />
                  <Stat
                    label="Outstanding"
                    value={formatCurrency(outstanding)}
                    accent={outstanding > 0 ? "destructive" : "success"}
                  />
                  <Stat label="Open quotes" value={quotes.filter((q) => q.status === "sent").length} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold">Contact</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {c.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" /> {c.email}
                  </div>
                  {c.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                      <span>{c.address}</span>
                    </div>
                  )}
                  <Badge variant="muted" className="mt-2 capitalize">
                    Prefers {c.preferredContact}
                  </Badge>
                </div>
                {c.notes && (
                  <div className="mt-4 rounded-md border-l-2 border-info/40 bg-info/5 px-3 py-2 text-xs">
                    {c.notes}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold">Quick links</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" /> {quotes.length} quote(s)
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" /> {invoices.length} invoice(s)
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" /> {threads.length} thread(s)
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" /> {rvs.length} RV(s)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: React.ReactNode; accent?: "destructive" | "success" }) {
  const color = accent === "destructive" ? "text-destructive" : accent === "success" ? "text-success" : "";
  return (
    <div className="rounded-md border bg-secondary/30 p-3">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className={`mt-1 text-xl font-bold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
