import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Inbox,
  MessageSquare,
  Phone,
  Plus,
  Users,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { accessStore } from "@/lib/access-store";
import { supabaseConfigured } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Customers · Admin" };

export default async function CustomersPage() {
  const [accounts, requests, unread] = await Promise.all([
    accessStore.listAccess(),
    accessStore.listRequests(),
    accessStore.unreadByAccessForOwner(),
  ]);
  const openByAccount = new Map<string, number>();
  for (const r of requests) {
    if (r.status === "new") openByAccount.set(r.accessId, (openByAccount.get(r.accessId) ?? 0) + 1);
  }
  const openTotal = requests.filter((r) => r.status === "new").length;
  const active = accounts.filter((a) => !a.revoked && a.status === "active");
  const mrr = active.reduce((s, a) => s + (a.monthlyRate ?? 0), 0);

  return (
    <>
      <Topbar
        title="Customers"
        subtitle={
          accounts.length === 0
            ? "No customers yet"
            : `${accounts.length} customer${accounts.length === 1 ? "" : "s"} · ${openTotal} open request${openTotal === 1 ? "" : "s"}${mrr ? ` · ${formatCurrency(mrr)}/mo recurring` : ""}`
        }
        rightSlot={
          <Button asChild>
            <Link href="/admin/access/new">
              <Plus className="h-4 w-4" /> New customer
            </Link>
          </Button>
        }
      />
      <main className="flex-1 space-y-4 bg-secondary/20 p-6">
        {!supabaseConfigured() && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <strong>Demo storage:</strong> Supabase isn&apos;t fully connected (no service-role key),
            so customers live in memory and reset on restart. Add
            <code> SUPABASE_SERVICE_ROLE_KEY</code> to persist.
          </div>
        )}

        {accounts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {accounts.map((a) => {
              const open = openByAccount.get(a.id) ?? 0;
              const unreadN = unread[a.id] ?? 0;
              return (
                <Link key={a.id} href={`/admin/access/${a.id}`} className="group block">
                  <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-secondary px-2 py-1 font-mono text-sm font-semibold tracking-wider">
                          {a.code}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {unreadN > 0 && (
                            <Badge variant="default" className="gap-1">
                              <MessageSquare className="h-3 w-3" /> {unreadN}
                            </Badge>
                          )}
                          {a.revoked ? (
                            <Badge variant="destructive">Revoked</Badge>
                          ) : (
                            <Badge variant="success">{a.currentStatus}</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{a.customerName}</div>
                        <div className="text-xs text-muted-foreground">{a.itemLabel}</div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {a.planType && <Badge variant="muted" className="text-[10px]">{a.planType}</Badge>}
                        {a.monthlyRate ? (
                          <Badge variant="outline" className="text-[10px]">{formatCurrency(a.monthlyRate)}/mo</Badge>
                        ) : null}
                        {a.tags.slice(0, 2).map((t) => (
                          <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-3">
                          {a.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {a.phone}
                            </span>
                          )}
                          {a.nextServiceDate && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarClock className="h-3 w-3" /> {a.nextServiceDate}
                            </span>
                          )}
                        </span>
                        {open > 0 && (
                          <span className="inline-flex items-center gap-1 font-medium text-primary">
                            <Inbox className="h-3 w-3" /> {open}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

function EmptyState() {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/10">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="font-display text-2xl font-bold">Add your first customer</h2>
          <p className="text-sm text-muted-foreground">
            When someone buys storage, a plan, or a rental, add them here with an access code.
            They sign in at <code>/track</code> to follow updates, message you, and request
            pickups or service — and you manage it all from one place.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/access/new">
            <Plus className="h-4 w-4" /> New customer <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
