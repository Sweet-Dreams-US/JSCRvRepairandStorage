import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

const statusBadge: Record<string, "default" | "success" | "destructive" | "secondary" | "warning" | "info" | "muted"> = {
  draft: "muted",
  sent: "info",
  approved: "success",
  declined: "destructive",
  expired: "secondary",
};

export default async function QuotesPage() {
  const user = await requireUser();
  const quotes = store.quotesByCustomer(user.id);

  return (
    <>
      <Topbar title="Quotes" subtitle="Review and approve work — straight from your phone." />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">&nbsp;</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                      No quotes yet.
                    </TableCell>
                  </TableRow>
                )}
                {quotes.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {q.number}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(q.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm">{q.lineItems.length} items</TableCell>
                    <TableCell className="font-semibold tabular-nums">
                      {formatCurrency(q.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadge[q.status]} className="capitalize">
                        {q.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/portal/quotes/${q.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        View <ArrowRight className="h-3 w-3" />
                      </Link>
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
