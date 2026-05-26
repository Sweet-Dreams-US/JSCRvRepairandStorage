import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard, Printer } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PaymentForm } from "@/components/admin/payment-form";
import { store } from "@/lib/store";
import { BUSINESS, formatAddressLine } from "@/lib/business";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminInvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inv = store.getInvoice(id);
  if (!inv) notFound();
  const c = store.getCustomer(inv.customerId);
  return (
    <>
      <Topbar
        title={`Invoice ${inv.number}`}
        subtitle={`${c?.name} · created ${formatDate(inv.createdAt)}`}
        rightSlot={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/invoices"
              className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
            >
              <ArrowLeft className="h-3 w-3" /> All
            </Link>
            <Button size="sm" variant="outline">
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
          </div>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardContent className="p-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Invoice
                  </div>
                  <h1 className="font-display text-3xl font-bold">{inv.number}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Due {formatDate(inv.dueDate)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-extrabold tracking-tight text-primary">
                    JSC RV REPAIR
                  </div>
                  <div className="text-xs text-muted-foreground">{formatAddressLine()}</div>
                  <div className="text-xs text-muted-foreground">{BUSINESS.phone}</div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <div className="text-xs uppercase text-muted-foreground">Bill To</div>
                <div className="mt-1 text-sm font-semibold">{c?.name}</div>
                <div className="text-xs text-muted-foreground">{c?.address}</div>
                <div className="text-xs text-muted-foreground">{c?.email}</div>
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
                  {inv.lineItems.map((li) => (
                    <tr key={li.id}>
                      <td className="py-3">
                        <div className="font-medium">{li.description}</div>
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
                  <span className="tabular-nums">{formatCurrency(inv.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tax ({(inv.taxRate * 100).toFixed(2)}%)
                  </span>
                  <span className="tabular-nums">{formatCurrency(inv.taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="tabular-nums">{formatCurrency(inv.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="tabular-nums text-success">- {formatCurrency(inv.amountPaid)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Balance Due</span>
                  <span className="tabular-nums">{formatCurrency(inv.balanceDue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold">Status</h3>
                <div className="mt-3">
                  <Badge
                    variant={
                      inv.status === "paid"
                        ? "success"
                        : inv.status === "overdue"
                          ? "destructive"
                          : inv.status === "partial"
                            ? "warning"
                            : "info"
                    }
                    className="capitalize"
                  >
                    {inv.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {inv.balanceDue > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold">Record payment</h3>
                  <PaymentForm invoiceId={inv.id} balanceDue={inv.balanceDue} />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold">Payments ({inv.payments.length})</h3>
                <ul className="mt-3 space-y-2 text-xs">
                  {inv.payments.length === 0 && (
                    <li className="text-muted-foreground">None recorded yet.</li>
                  )}
                  {inv.payments.map((p) => (
                    <li key={p.id} className="rounded-md border bg-secondary/30 p-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="h-3 w-3" />
                          <span className="font-semibold">{formatCurrency(p.amount)}</span>
                        </span>
                        <Badge variant="muted" className="capitalize text-[9px]">{p.method}</Badge>
                      </div>
                      <div className="mt-1 text-[10px] text-muted-foreground">
                        {p.reference ?? "—"} · {formatDate(p.receivedAt)}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
