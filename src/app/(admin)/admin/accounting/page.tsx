import { Receipt, Trash2, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addExpenseAction, deleteExpenseAction } from "@/app/actions/billing-admin";
import { billingStore } from "@/lib/billing-store";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Accounting · Admin" };

const CATEGORIES = ["parts", "tools", "fuel", "utilities", "rent", "insurance", "payroll", "marketing", "other"];

export default async function AccountingPage() {
  const [summary, expenses, invoices] = await Promise.all([
    billingStore.financeSummary(),
    billingStore.listExpenses(),
    billingStore.listInvoices(),
  ]);
  const recentPayments = invoices
    .filter((i) => i.amountPaid > 0)
    .sort((a, b) => (b.paidAt ?? b.createdAt).localeCompare(a.paidAt ?? a.createdAt))
    .slice(0, 8);

  return (
    <>
      <Topbar title="Accounting" subtitle="Income, expenses, and what you're owed" />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard icon={<TrendingUp className="h-4 w-4" />} label="Income collected" value={formatCurrency(summary.income)} accent="success" />
          <SummaryCard icon={<Wallet className="h-4 w-4" />} label="Outstanding" value={formatCurrency(summary.outstanding)} accent="warning" />
          <SummaryCard icon={<TrendingDown className="h-4 w-4" />} label="Expenses" value={formatCurrency(summary.expenses)} accent="destructive" />
          <SummaryCard icon={<Receipt className="h-4 w-4" />} label="Net" value={formatCurrency(summary.net)} accent={summary.net >= 0 ? "success" : "destructive"} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Add expense */}
          <Card>
            <CardContent className="p-5">
              <h2 className="font-display text-lg font-semibold">Add expense</h2>
              <form action={addExpenseAction} className="mt-4 grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input id="amount" name="amount" type="number" min="0" step="0.01" required placeholder="120" />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" name="category" defaultValue="parts" className="rounded-md border bg-background px-3 py-2 text-sm capitalize">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input id="vendor" name="vendor" placeholder="NAPA, Menards…" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="description">Note</Label>
                  <Input id="description" name="description" placeholder="Slide seals for WO…" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="sm">Add expense</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Ledger */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-4 font-display text-lg font-semibold">Expenses ({expenses.length})</h2>
                {expenses.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No expenses recorded yet.</p>
                ) : (
                  <ul className="divide-y">
                    {expenses.map((e) => (
                      <li key={e.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                        <div>
                          <div className="font-medium capitalize">
                            {e.category}{e.vendor ? ` · ${e.vendor}` : ""}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(e.date)}{e.description ? ` · ${e.description}` : ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold tabular-nums">{formatCurrency(e.amount)}</span>
                          <form action={deleteExpenseAction}>
                            <input type="hidden" name="expenseId" value={e.id} />
                            <Button type="submit" size="icon" variant="ghost" className="h-7 w-7">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </form>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h2 className="mb-4 font-display text-lg font-semibold">Recent payments</h2>
                {recentPayments.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No payments yet. Record one from an invoice.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {recentPayments.map((i) => (
                      <li key={i.id} className="flex items-center justify-between py-2.5 text-sm">
                        <div>
                          <div className="font-medium">{i.customerName}</div>
                          <div className="text-xs text-muted-foreground">{i.title}</div>
                        </div>
                        <span className="font-semibold tabular-nums text-success">{formatCurrency(i.amountPaid)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "success" | "warning" | "destructive";
}) {
  const ring = {
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    destructive: "border-destructive/30 bg-destructive/5",
  }[accent];
  return (
    <Card className={`border-2 ${ring}`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {icon}
          {label}
        </div>
        <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}
