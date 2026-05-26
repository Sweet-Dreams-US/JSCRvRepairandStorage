import Link from "next/link";
import { ArrowRight, FileText, Plus } from "lucide-react";
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
import { formatCurrency, formatDate, relativeTime } from "@/lib/utils";

const variants: Record<string, "default" | "success" | "destructive" | "info" | "warning" | "muted" | "secondary"> = {
  draft: "muted",
  sent: "info",
  approved: "success",
  declined: "destructive",
  expired: "secondary",
};

export default async function AdminQuotesPage() {
  const quotes = store.listQuotes();
  const open = quotes.filter((q) => q.status === "sent").length;
  const approvedTotal = quotes.filter((q) => q.status === "approved").reduce((s, q) => s + q.total, 0);
  return (
    <>
      <Topbar
        title="Quotes"
        subtitle={`${open} awaiting decision · ${formatCurrency(approvedTotal)} approved (all-time)`}
        rightSlot={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> New quote
          </Button>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">&nbsp;</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((q) => {
                  const c = store.getCustomer(q.customerId);
                  return (
                    <TableRow key={q.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{q.number}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{c?.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {q.sentAt ? relativeTime(q.sentAt) : "—"}
                      </TableCell>
                      <TableCell className="text-xs">{q.lineItems.length}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatCurrency(q.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={variants[q.status]} className="capitalize">{q.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/admin/quotes/${q.id}`}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          View <ArrowRight className="h-3 w-3" />
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
