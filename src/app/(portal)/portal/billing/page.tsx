import { Calendar, CheckCircle2, CreditCard, DollarSign, FileText } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary" | "info" | "muted"> = {
  paid: "success",
  partial: "warning",
  overdue: "destructive",
  sent: "info",
  draft: "muted",
  void: "secondary",
};

export default async function BillingPage() {
  const user = await requireUser();
  const invoices = store.invoicesByCustomer(user.id);
  const outstanding = invoices.reduce((s, i) => s + i.balanceDue, 0);
  const paid12mo = invoices
    .filter((i) => Date.now() - new Date(i.createdAt).getTime() < 365 * 86400000)
    .reduce((s, i) => s + i.amountPaid, 0);

  return (
    <>
      <Topbar title="Billing" subtitle="Invoices, payments, and lifetime spend." />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className={outstanding > 0 ? "border-2 border-primary/40" : ""}>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Outstanding balance
              </div>
              <div className="mt-2 text-3xl font-bold tabular-nums">
                {formatCurrency(outstanding)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {invoices.filter((i) => i.balanceDue > 0).length} unpaid invoice(s)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                Paid in last 12 mo
              </div>
              <div className="mt-2 text-3xl font-bold tabular-nums">
                {formatCurrency(paid12mo)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Thanks for being a customer.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-4 w-4" />
                On-file payment
              </div>
              <div className="mt-2 text-base font-semibold">Visa ending in 4421</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Used for storage auto-pay. Click to update (demo).
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="font-display text-lg font-semibold">Invoices</h2>
              <Badge variant="muted" className="gap-1.5">
                <CreditCard className="h-3 w-3" />
                Card · ACH · Check
              </Badge>
            </div>
            <Separator />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      No invoices yet.
                    </TableCell>
                  </TableRow>
                )}
                {invoices.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {i.number}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(i.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(i.dueDate)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(i.total)}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
                      {formatCurrency(i.balanceDue)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[i.status] ?? "muted"} className="capitalize">
                        {i.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
