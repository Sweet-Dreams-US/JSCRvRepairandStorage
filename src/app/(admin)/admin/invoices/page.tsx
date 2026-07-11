import Link from "next/link";
import { CreditCard, Plus } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { recordPaymentAction, sendInvoiceAction } from "@/app/actions/billing-admin";
import { billingStore } from "@/lib/billing-store";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { CustomerInvoice } from "@/lib/types";

export const metadata = { title: "Invoices · Admin" };

const STATUS: Record<CustomerInvoice["status"], "muted" | "info" | "success" | "destructive" | "warning"> = {
  draft: "muted",
  sent: "info",
  paid: "success",
  overdue: "destructive",
  void: "muted",
};

export default async function InvoicesPage() {
  const invoices = await billingStore.listInvoices();
  const outstanding = invoices
    .filter((i) => i.status !== "void" && i.status !== "paid")
    .reduce((s, i) => s + (i.amount - i.amountPaid), 0);
  const collected = invoices.reduce((s, i) => s + i.amountPaid, 0);

  return (
    <>
      <Topbar
        title="Invoices"
        subtitle={
          invoices.length === 0
            ? "No invoices yet"
            : `${formatCurrency(outstanding)} outstanding · ${formatCurrency(collected)} collected`
        }
        rightSlot={
          <Button asChild>
            <Link href="/admin/invoices/new"><Plus className="h-4 w-4" /> New invoice</Link>
          </Button>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        {invoices.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4">
            {invoices.map((inv) => {
              const due = inv.amount - inv.amountPaid;
              return (
                <Card key={inv.id}>
                  <CardContent className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{inv.title}</span>
                        <Badge variant={STATUS[inv.status]} className="capitalize">{inv.status}</Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {inv.accessId ? (
                          <Link href={`/admin/access/${inv.accessId}`} className="hover:text-primary">{inv.customerName}</Link>
                        ) : inv.customerName}
                        {" · "}{inv.email}
                      </div>
                      {inv.details && <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{inv.details}</p>}
                      <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                        {formatDate(inv.createdAt)}{inv.dueDate ? ` · due ${inv.dueDate}` : ""}
                        {inv.amountPaid > 0 ? ` · paid ${formatCurrency(inv.amountPaid)}` : ""}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="text-2xl font-bold tabular-nums">{formatCurrency(inv.amount)}</div>
                        {due > 0 && inv.status !== "void" && (
                          <div className="text-xs text-muted-foreground">{formatCurrency(due)} due</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {inv.status === "draft" && (
                          <form action={sendInvoiceAction}>
                            <input type="hidden" name="invoiceId" value={inv.id} />
                            <Button type="submit" size="sm">Send</Button>
                          </form>
                        )}
                        {due > 0 && inv.status !== "void" && (
                          <form action={recordPaymentAction} className="flex items-center gap-1">
                            <input type="hidden" name="invoiceId" value={inv.id} />
                            <Input name="amount" type="number" min="0" step="0.01" defaultValue={due} className="h-8 w-24 text-sm" />
                            <Button type="submit" size="sm" variant="secondary">Record</Button>
                          </form>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="font-display text-2xl font-bold">No invoices yet</h2>
          <p className="text-sm text-muted-foreground">
            Bill a customer — the invoice emails to them, and recording a payment feeds your
            accounting.
          </p>
        </div>
        <Button asChild size="lg"><Link href="/admin/invoices/new"><Plus className="h-4 w-4" /> New invoice</Link></Button>
      </CardContent>
    </Card>
  );
}
