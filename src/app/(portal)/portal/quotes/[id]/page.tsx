import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, FileText, Truck, XCircle } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuoteDecisionForm } from "@/components/portal/quote-decision-form";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function QuoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const quote = store.getQuote(id);
  if (!quote || quote.customerId !== user.id) notFound();
  const rv = quote.rvId ? store.getRv(quote.rvId) : undefined;
  const job = quote.jobId ? store.getJob(quote.jobId) : undefined;

  return (
    <>
      <Topbar
        title={`Quote ${quote.number}`}
        subtitle={`Created ${formatDate(quote.createdAt)} · Valid until ${formatDate(quote.validUntil)}`}
        rightSlot={
          <Link
            href="/portal/quotes"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
          >
            <ArrowLeft className="h-3 w-3" /> Back
          </Link>
        }
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge className="bg-primary/10 text-primary">Estimate</Badge>
                  <h2 className="mt-3 font-display text-2xl font-bold">
                    {job?.title ?? "Repair estimate"}
                  </h2>
                  {rv && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <Truck className="h-3.5 w-3.5" />
                      {rv.year} {rv.make} {rv.model}
                      {rv.nickname && <span className="italic"> · &ldquo;{rv.nickname}&rdquo;</span>}
                    </p>
                  )}
                </div>
                <StatusBadge status={quote.status} />
              </div>

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
                  {quote.lineItems.map((li) => (
                    <tr key={li.id} className="text-sm">
                      <td className="py-3">
                        <div className="font-medium">{li.description}</div>
                        <div className="mt-0.5 text-xs uppercase text-muted-foreground">
                          {li.kind}
                        </div>
                      </td>
                      <td className="py-3 text-right tabular-nums">{li.quantity}</td>
                      <td className="py-3 text-right tabular-nums">
                        {formatCurrency(li.unitPrice)}
                      </td>
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
                  <span className="tabular-nums">{formatCurrency(quote.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tax ({(quote.taxRate * 100).toFixed(2)}%)
                  </span>
                  <span className="tabular-nums">{formatCurrency(quote.taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(quote.total)}</span>
                </div>
              </div>

              {quote.notes && (
                <div className="mt-6 rounded-md border-l-2 border-info/40 bg-info/5 px-4 py-3 text-sm">
                  <strong className="block text-xs uppercase tracking-wide text-info">Notes from the shop</strong>
                  <p className="mt-1 text-muted-foreground">{quote.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-5">
            {quote.status === "sent" ? (
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold">Your decision</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Approve to get this on the calendar — or send a question and
                    we’ll work it out together.
                  </p>
                  <div className="mt-4">
                    <QuoteDecisionForm quoteId={quote.id} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  {quote.status === "approved" ? (
                    <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
                  ) : quote.status === "declined" ? (
                    <XCircle className="mx-auto h-10 w-10 text-destructive" />
                  ) : (
                    <Clock className="mx-auto h-10 w-10 text-muted-foreground" />
                  )}
                  <div className="mt-2 text-sm font-semibold capitalize">{quote.status}</div>
                  {quote.decidedAt && (
                    <div className="text-xs text-muted-foreground">
                      {formatDate(quote.decidedAt)}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold">What happens next</h3>
                <ul className="mt-3 space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">1</span>
                    <span>You approve from this page.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">2</span>
                    <span>We order parts if needed and slot you in.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">3</span>
                    <span>You get a text when it’s ready.</span>
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

function StatusBadge({ status }: { status: string }) {
  if (status === "approved")
    return (
      <Badge variant="success" className="gap-1.5">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </Badge>
    );
  if (status === "declined")
    return (
      <Badge variant="destructive" className="gap-1.5">
        <XCircle className="h-3 w-3" /> Declined
      </Badge>
    );
  if (status === "sent")
    return (
      <Badge variant="info" className="gap-1.5">
        <Clock className="h-3 w-3" /> Awaiting decision
      </Badge>
    );
  return <Badge variant="muted" className="capitalize">{status}</Badge>;
}
