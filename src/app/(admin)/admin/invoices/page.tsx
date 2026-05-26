import Link from "next/link";
import { ArrowRight, CreditCard, FileText, Plus } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { store } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

const variants: Record<string, "default" | "success" | "destructive" | "info" | "warning" | "muted" | "secondary"> = {
  draft: "muted",
  sent: "info",
  partial: "warning",
  paid: "success",
  overdue: "destructive",
  void: "secondary",
};

export default async function AdminInvoicesPage() {
  const invoices = store.listInvoices();
  const totalAR = invoices.reduce((s, i) => s + i.balanceDue, 0);
  const overdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.balanceDue, 0);
  return (
    <>
      <Topbar
        title="Invoices"
        subtitle={`${formatCurrency(totalAR)} outstanding · ${formatCurrency(overdue)} overdue`}
        rightSlot={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> New invoice
          </Button>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">&nbsp;</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((i) => {
                  const c = store.getCustomer(i.customerId);
                  return (
                    <TableRow key={i.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{i.number}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{c?.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(i.createdAt)}
                      </TableCell>
                      <TableCell className="text-xs">{formatDate(i.dueDate)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(i.total)}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatCurrency(i.balanceDue)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={variants[i.status]} className="capitalize">{i.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/admin/invoices/${i.id}`}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Open <ArrowRight className="h-3 w-3" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
