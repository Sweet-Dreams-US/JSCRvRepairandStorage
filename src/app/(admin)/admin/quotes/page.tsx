import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sendQuoteAction, setQuoteStatusAction } from "@/app/actions/billing-admin";
import { billingStore } from "@/lib/billing-store";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { CustomerQuote } from "@/lib/types";

export const metadata = { title: "Quotes · Admin" };

const STATUS: Record<CustomerQuote["status"], "muted" | "info" | "success" | "destructive"> = {
  draft: "muted",
  sent: "info",
  approved: "success",
  declined: "destructive",
};

export default async function QuotesPage() {
  const quotes = await billingStore.listQuotes();
  const outstanding = quotes.filter((q) => q.status === "sent").reduce((s, q) => s + q.amount, 0);

  return (
    <>
      <Topbar
        title="Quotes"
        subtitle={quotes.length === 0 ? "No quotes yet" : `${quotes.length} total · ${formatCurrency(outstanding)} awaiting approval`}
        rightSlot={
          <Button asChild>
            <Link href="/admin/quotes/new"><Plus className="h-4 w-4" /> New quote</Link>
          </Button>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        {quotes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {quotes.map((q) => (
              <Card key={q.id}>
                <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{q.title}</span>
                      <Badge variant={STATUS[q.status]} className="capitalize">{q.status}</Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {q.accessId ? (
                        <Link href={`/admin/access/${q.accessId}`} className="hover:text-primary">{q.customerName}</Link>
                      ) : q.customerName}
                      {" · "}{q.email}
                    </div>
                    {q.details && <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{q.details}</p>}
                    <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                      {formatDate(q.createdAt)}{q.validUntil ? ` · valid until ${q.validUntil}` : ""}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-2xl font-bold tabular-nums">{formatCurrency(q.amount)}</div>
                    <div className="flex gap-2">
                      {q.status === "draft" && (
                        <form action={sendQuoteAction}>
                          <input type="hidden" name="quoteId" value={q.id} />
                          <Button type="submit" size="sm">Send</Button>
                        </form>
                      )}
                      {q.status === "sent" && (
                        <>
                          <form action={setQuoteStatusAction}>
                            <input type="hidden" name="quoteId" value={q.id} />
                            <input type="hidden" name="status" value="approved" />
                            <Button type="submit" size="sm" variant="secondary">Approved</Button>
                          </form>
                          <form action={setQuoteStatusAction}>
                            <input type="hidden" name="quoteId" value={q.id} />
                            <input type="hidden" name="status" value="declined" />
                            <Button type="submit" size="sm" variant="ghost">Declined</Button>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="font-display text-2xl font-bold">No quotes yet</h2>
          <p className="text-sm text-muted-foreground">
            Create a quote for a customer — it emails them the estimate and they can approve by
            replying or calling.
          </p>
        </div>
        <Button asChild size="lg"><Link href="/admin/quotes/new"><Plus className="h-4 w-4" /> New quote</Link></Button>
      </CardContent>
    </Card>
  );
}
