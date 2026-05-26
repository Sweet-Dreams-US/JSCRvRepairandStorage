import { Topbar } from "@/components/shell/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { TechWorkloadChart } from "@/components/admin/tech-workload-chart";
import { ExpenseDonut } from "@/components/admin/expense-donut";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function AnalyticsPage() {
  const stats = store.computeStats();
  const revenue = store.revenueByMonth();
  const workload = store.jobsByTechSummary();
  const expenseSplit = store.expenseBreakdown();
  const ytdRevenue = revenue.reduce((s, r) => s + r.revenue, 0);
  const ytdExpenses = revenue.reduce((s, r) => s + r.expenses, 0);
  const ytdProfit = ytdRevenue - ytdExpenses;
  const margin = ytdRevenue ? Math.round((ytdProfit / ytdRevenue) * 100) : 0;

  return (
    <>
      <Topbar title="Analytics" subtitle="How the shop is performing this year" />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KPICard label="YTD Revenue" value={formatCurrency(ytdRevenue)} trend="+14% YoY" tone="success" />
          <KPICard label="YTD Expenses" value={formatCurrency(ytdExpenses)} trend="+8% YoY" tone="info" />
          <KPICard label="Net Profit" value={formatCurrency(ytdProfit)} trend={`${margin}% margin`} tone="default" />
          <KPICard label="Active customers" value={String(stats.customerCount)} trend="+12 this year" tone="warning" />
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-display text-lg font-semibold">Revenue vs Expenses</h2>
            <Separator className="my-4" />
            <div className="h-80">
              <RevenueChart data={revenue} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Tech workload</h2>
              <p className="text-xs text-muted-foreground">Active vs completed jobs per technician</p>
              <Separator className="my-4" />
              <div className="h-72">
                <TechWorkloadChart data={workload} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Expense breakdown</h2>
              <p className="text-xs text-muted-foreground">Last 90 days</p>
              <Separator className="my-4" />
              <div className="h-72">
                <ExpenseDonut data={expenseSplit} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

function KPICard({
  label,
  value,
  trend,
  tone,
}: {
  label: string;
  value: string;
  trend: string;
  tone: "default" | "success" | "warning" | "info";
}) {
  const toneCls = {
    default: "border-primary/30 bg-primary/5",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    info: "border-info/30 bg-info/5",
  }[tone];
  return (
    <Card className={`border-2 ${toneCls}`}>
      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-2 text-2xl font-bold tabular-nums">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{trend}</div>
      </CardContent>
    </Card>
  );
}
