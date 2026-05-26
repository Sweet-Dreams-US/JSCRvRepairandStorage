import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Printer, Send } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { store } from "@/lib/store";
import { BUSINESS, formatAddressLine } from "@/lib/business";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminQuoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = store.getQuote(id);
  if (!q) notFound();
  const c = store.getCustomer(q.customerId);
  const rv = q.rvId ? store.getRv(q.rvId) : undefined;
  const job = q.jobId ? store.getJob(q.jobId) : undefined;
  return (
    <>
      <Topbar
        title={`Quote ${q.number}`}
        subtitle={`${c?.name} · created ${formatDate(q.createdAt)}`}
        rightSlot={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/quotes"
              className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
            >
              <ArrowLeft className="h-3 w-3" /> All
            </Link>
            {q.status === "draft" && (
              <Button size="sm">
                <Send className="h-3.5 w-3.5" /> Send to customer
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
          </div>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Estimate
                </div>
                <h1 className="font-display text-3xl font-bold">{q.number}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Created {formatDate(q.createdAt)} · Valid until {formatDate(q.validUntil)}
                </p>
              </div>
              <div className="text-right">
                <div className="font-display text-lg font-extrabold tracking-tight text-primary">
                  JSC RV REPAIR
                </div>
                <div className="text-xs text-muted-foreground">{formatAddressLine()}</div>
                <div className="text-xs text-muted-foreground">{BUSINESS.phone}</div>
                <div className="text-xs text-muted-foreground">{BUSINESS.email}</div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Bill To</div>
                <div className="mt-1 text-sm font-semibold">{c?.name}</div>
                <div className="text-xs text-muted-foreground">{c?.address}</div>
                <div className="text-xs text-muted-foreground">{c?.email}</div>
              </div>
              {rv && (
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Vehicle</div>
                  <div className="mt-1 text-sm font-semibold">
                    {rv.year} {rv.make} {rv.model}
                  </div>
                  <div className="text-xs text-muted-foreground">{rv.type} · {rv.length}&apos;</div>
                  <div className="text-xs text-muted-foreground font-mono">VIN: {rv.vin}</div>
                </div>
              )}
            </div>

            {job && (
              <div className="mt-6 rounded-md border-l-2 border-primary/40 bg-secondary/30 px-3 py-2 text-sm">
                <strong>Work order:</strong> {job.title}
              </div>
            )}

            <Separator className="my-6" />

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs uppercase text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Description</th>
                  <th className="pb-2 text-right font-medium">Qty</th>
                  <th className="pb-2 text-right font-medium">Unit</th>
                  <th className="pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {q.lineItems.map((li) => (
                  <tr key={li.id}>
                    <td className="py-3">
                      <div className="font-medium">{li.description}</div>
                      <div className="text-xs uppercase text-muted-foreground">{li.kind}</div>
                    </td>
                    <td className="py-3 text-right tabular-nums">{li.quantity}</td>
                    <td className="py-3 text-right tabular-nums">{formatCurrency(li.unitPrice)}</td>
                    <td className="py-3 text-right font-semibold tabular-nums">
                      {formatCurrency(li.quantity * li.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{formatCurrency(q.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax ({(q.taxRate * 100).toFixed(2)}%)</span>
                <span className="tabular-nums">{formatCurrency(q.taxAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(q.total)}</span>
              </div>
            </div>

            {q.notes && (
              <div className="mt-6 rounded-md border bg-info/5 p-3 text-sm">
                <strong className="text-xs uppercase text-info">Notes</strong>
                <p className="mt-1 text-muted-foreground">{q.notes}</p>
              </div>
            )}

            <Separator className="my-6" />

            <div className="flex items-center justify-between">
              <Badge
                variant={
                  q.status === "approved"
                    ? "success"
                    : q.status === "declined"
                      ? "destructive"
                      : "info"
                }
                className="capitalize"
              >
                {q.status}
              </Badge>
              {q.decidedAt && (
                <span className="text-xs text-muted-foreground">
                  Decided {formatDate(q.decidedAt)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
