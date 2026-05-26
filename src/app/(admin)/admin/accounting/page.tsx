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
import { store } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

const categoryColor: Record<string, "info" | "warning" | "success" | "destructive" | "muted" | "secondary"> = {
  parts: "info",
  tools: "info",
  fuel: "warning",
  utilities: "muted",
  rent: "destructive",
  insurance: "destructive",
  payroll: "destructive",
  marketing: "success",
  other: "secondary",
};

export default async function AccountingPage() {
  const expenses = store.listExpenses();
  const revenue = store.revenueByMonth();
  const currentMonth = revenue.at(-1)!;
  const ytdRev = revenue.reduce((s, r) => s + r.revenue, 0);
  const ytdExp = revenue.reduce((s, r) => s + r.expenses, 0);
  const ytdProfit = ytdRev - ytdExp;
  const totalExpenses30 = expenses
    .filter((e) => Date.now() - new Date(e.date).getTime() < 30 * 86400000)
    .reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <Topbar title="Accounting" subtitle="P&L, expenses, and cash position" />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="MTD Revenue" value={formatCurrency(currentMonth.revenue)} tone="success" />
          <MetricCard label="MTD Expenses" value={formatCurrency(currentMonth.expenses)} tone="warning" />
          <MetricCard
            label="MTD Profit"
            value={formatCurrency(currentMonth.profit)}
            tone={currentMonth.profit >= 0 ? "success" : "destructive"}
          />
          <MetricCard label="YTD Profit" value={formatCurrency(ytdProfit)} tone="default" />
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-semibold">Monthly P&L</h2>
            <Separator className="my-4" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenue.map((r) => {
                  const margin = r.revenue ? Math.round((r.profit / r.revenue) * 100) : 0;
                  return (
                    <TableRow key={r.month}>
                      <TableCell className="font-semibold">{r.month}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(r.revenue)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(r.expenses)}</TableCell>
                      <TableCell className={`text-right tabular-nums font-semibold ${r.profit >= 0 ? "text-success" : "text-destructive"}`}>
                        {formatCurrency(r.profit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={margin >= 30 ? "success" : margin >= 15 ? "info" : "warning"}>
                          {margin}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Recent expenses</h2>
              <Badge variant="muted">{formatCurrency(totalExpenses30)} last 30 days</Badge>
            </div>
            <Separator className="my-4" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(e.date)}</TableCell>
                    <TableCell>
                      <Badge variant={categoryColor[e.category]} className="capitalize">
                        {e.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{e.vendor}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{e.description}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(e.amount)}
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

function MetricCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "success" | "warning" | "destructive";
}) {
  const toneCls = {
    default: "",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  }[tone];
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className={`mt-2 text-2xl font-bold tabular-nums ${toneCls}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
