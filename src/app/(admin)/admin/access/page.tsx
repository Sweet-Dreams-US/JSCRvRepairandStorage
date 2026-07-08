import Link from "next/link";
import { ArrowRight, Inbox, Plus, Ticket } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { accessStore } from "@/lib/access-store";
import { supabaseConfigured } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Customer Access · Admin" };

export default async function AccessListPage() {
  const [accounts, requests] = await Promise.all([
    accessStore.listAccess(),
    accessStore.listRequests(),
  ]);
  const openByAccount = new Map<string, number>();
  for (const r of requests) {
    if (r.status === "new") {
      openByAccount.set(r.accessId, (openByAccount.get(r.accessId) ?? 0) + 1);
    }
  }
  const openTotal = requests.filter((r) => r.status === "new").length;

  return (
    <>
      <Topbar
        title="Customer Access"
        subtitle={
          accounts.length === 0
            ? "No access codes yet"
            : `${accounts.length} account${accounts.length === 1 ? "" : "s"} · ${openTotal} open request${openTotal === 1 ? "" : "s"}`
        }
        rightSlot={
          <Button asChild>
            <Link href="/admin/access/new">
              <Plus className="h-4 w-4" /> New access code
            </Link>
          </Button>
        }
      />
      <main className="flex-1 space-y-4 bg-secondary/20 p-6">
        {!supabaseConfigured() && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <strong>Demo storage:</strong> Supabase isn&apos;t fully connected yet
            (no service-role key), so access codes live in memory and reset on
            restart. Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to persist.
          </div>
        )}

        {accounts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {accounts.map((a) => {
              const open = openByAccount.get(a.id) ?? 0;
              return (
                <Link key={a.id} href={`/admin/access/${a.id}`} className="group block">
                  <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-secondary px-2 py-1 font-mono text-sm font-semibold tracking-wider">
                          {a.code}
                        </span>
                        {a.revoked ? (
                          <Badge variant="destructive">Revoked</Badge>
                        ) : (
                          <Badge variant="success">{a.currentStatus}</Badge>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{a.customerName}</div>
                        <div className="text-xs text-muted-foreground">{a.itemLabel}</div>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                        <span>{formatDate(a.createdAt)}</span>
                        {open > 0 && (
                          <span className="inline-flex items-center gap-1 font-medium text-primary">
                            <Inbox className="h-3 w-3" /> {open} open
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
          <Ticket className="h-8 w-8 text-primary" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="font-display text-2xl font-bold">Create your first access code</h2>
          <p className="text-sm text-muted-foreground">
            When a customer buys storage, a plan, or a rental, generate a code and
            enter their email. They can sign in at <code>/track</code> to follow
            updates and request pickups or service — no account signup needed. Post
            an update and they get an email automatically.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/access/new">
            <Plus className="h-4 w-4" /> New access code <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
