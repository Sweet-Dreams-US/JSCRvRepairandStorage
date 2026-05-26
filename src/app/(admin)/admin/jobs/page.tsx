import Link from "next/link";
import { ArrowRight, Calendar, Clock, Hammer, Plus, User } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { store } from "@/lib/store";
import type { JobStatus } from "@/lib/types";
import { formatDateTime, relativeTime } from "@/lib/utils";

const COLUMNS: { key: JobStatus; label: string; color: string }[] = [
  { key: "intake", label: "Intake", color: "bg-secondary" },
  { key: "diagnosing", label: "Diagnosing", color: "bg-info/10" },
  { key: "quote-sent", label: "Quote Sent", color: "bg-warning/10" },
  { key: "approved", label: "Approved", color: "bg-success/10" },
  { key: "in-progress", label: "In Progress", color: "bg-primary/10" },
  { key: "waiting-parts", label: "Waiting Parts", color: "bg-warning/10" },
  { key: "ready", label: "Ready", color: "bg-success/10" },
];

export default async function AdminJobsPage() {
  const jobs = store.activeJobs();
  return (
    <>
      <Topbar
        title="Jobs"
        subtitle={`${jobs.length} active jobs in the shop`}
        rightSlot={
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" /> New job
          </Button>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <div className="grid auto-cols-[320px] grid-flow-col gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colJobs = jobs.filter((j) => j.status === col.key);
            return (
              <div key={col.key} className="flex w-80 shrink-0 flex-col">
                <div className={`flex items-center justify-between rounded-t-lg border border-b-0 px-3 py-2 ${col.color}`}>
                  <div className="text-xs font-semibold uppercase tracking-wide">
                    {col.label}
                  </div>
                  <Badge variant="muted">{colJobs.length}</Badge>
                </div>
                <div className="grid flex-1 gap-2 rounded-b-lg border bg-background p-2">
                  {colJobs.length === 0 && (
                    <div className="rounded-md border border-dashed py-8 text-center text-xs text-muted-foreground">
                      Empty
                    </div>
                  )}
                  {colJobs.map((j) => {
                    const customer = store.getCustomer(j.customerId);
                    const rv = store.getRv(j.rvId);
                    const techs = j.assignedTechIds.map((id) => store.getStaff(id)).filter(Boolean);
                    return (
                      <Link
                        key={j.id}
                        href={`/admin/jobs/${j.id}`}
                        className="rounded-md border bg-card p-3 shadow-sm transition-all hover:border-primary hover:shadow"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-primary">{j.number}</span>
                          <Badge
                            variant={
                              j.priority === "urgent"
                                ? "destructive"
                                : j.priority === "high"
                                  ? "warning"
                                  : "outline"
                            }
                            className="text-[10px] capitalize"
                          >
                            {j.priority}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm font-semibold leading-snug line-clamp-2">
                          {j.title}
                        </div>
                        <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {customer?.name}
                          </div>
                          {rv && (
                            <div className="flex items-center gap-1">
                              <Hammer className="h-3 w-3" />
                              {rv.year} {rv.make}
                            </div>
                          )}
                          {j.scheduledStart && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDateTime(j.scheduledStart)}
                            </div>
                          )}
                        </div>
                        {techs.length > 0 && (
                          <div className="mt-3 flex -space-x-1">
                            {techs.map((t) => (
                              <div
                                key={t!.id}
                                className="grid h-5 w-5 place-items-center rounded-full border-2 border-background text-[9px] font-semibold uppercase text-white"
                                style={{ background: t!.color }}
                                title={t!.name}
                              >
                                {t!.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {relativeTime(j.createdAt)}
                          </span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
