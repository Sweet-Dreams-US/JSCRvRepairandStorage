import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarCheck2,
  Clock,
  ListChecks,
  MessageSquare,
  Tag,
  Truck,
  User,
} from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JobNoteForm } from "@/components/admin/job-note-form";
import { JobStatusForm } from "@/components/admin/job-status-form";
import { JobChecklist } from "@/components/admin/job-checklist";
import { store } from "@/lib/store";
import { formatDate, formatDateTime, relativeTime } from "@/lib/utils";

export default async function AdminJobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = store.getJob(id);
  if (!job) notFound();
  const customer = store.getCustomer(job.customerId);
  const rv = store.getRv(job.rvId);
  const techs = job.assignedTechIds.map((tid) => store.getStaff(tid)).filter(Boolean);
  const quote = job.quoteId ? store.getQuote(job.quoteId) : undefined;
  const timeLogged = store.timeByJob(job.id).reduce((sum, t) => {
    if (!t.end) return sum;
    return sum + (new Date(t.end).getTime() - new Date(t.start).getTime()) / 3600000;
  }, 0);

  return (
    <>
      <Topbar
        title={job.title}
        subtitle={`${job.number} · ${customer?.name} · ${rv ? `${rv.year} ${rv.make} ${rv.model}` : "—"}`}
        rightSlot={
          <Link
            href="/admin/jobs"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
          >
            <ArrowLeft className="h-3 w-3" /> Board
          </Link>
        }
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default" className="capitalize">{job.status.replace("-", " ")}</Badge>
                  <Badge
                    variant={
                      job.priority === "urgent" ? "destructive" : job.priority === "high" ? "warning" : "outline"
                    }
                    className="capitalize"
                  >
                    {job.priority} priority
                  </Badge>
                  {job.tags.map((t) => (
                    <Badge key={t} variant="muted" className="capitalize">
                      <Tag className="h-3 w-3" /> {t}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-sm">{job.description}</p>
                <Separator className="my-5" />
                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <Info icon={<Clock />} label="Created" value={relativeTime(job.createdAt)} />
                  <Info
                    icon={<CalendarCheck2 />}
                    label="Scheduled"
                    value={job.scheduledStart ? formatDateTime(job.scheduledStart) : "Not scheduled"}
                  />
                  <Info
                    icon={<Clock />}
                    label="Time"
                    value={`${timeLogged.toFixed(1)} / ${job.estimatedHours}h`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold">Checklist</h2>
                </div>
                <div className="mt-4">
                  <JobChecklist
                    jobId={job.id}
                    items={job.checklist.map((c) => ({
                      id: c.id,
                      label: c.label,
                      done: c.done,
                      doneBy: c.doneBy,
                      doneAt: c.doneAt,
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <h2 className="text-lg font-semibold">Notes</h2>
                </div>
                <ul className="mt-4 space-y-3">
                  {job.notes.length === 0 && (
                    <li className="rounded-md border border-dashed py-6 text-center text-sm text-muted-foreground">
                      No notes yet.
                    </li>
                  )}
                  {job.notes.map((n) => (
                    <li key={n.id} className="rounded-md border bg-secondary/30 p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold">{n.authorName}</span>
                        <span className="flex items-center gap-2 text-muted-foreground">
                          {n.internal && <Badge variant="warning" className="text-[10px]">Internal</Badge>}
                          {relativeTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm">{n.body}</p>
                    </li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <JobNoteForm jobId={job.id} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold">Move to status</h3>
                <div className="mt-3">
                  <JobStatusForm jobId={job.id} current={job.status} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold">Customer</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" />{customer?.name}</div>
                  <div className="text-xs text-muted-foreground">{customer?.email}</div>
                  <div className="text-xs text-muted-foreground">{customer?.phone}</div>
                  {customer?.notes && (
                    <p className="mt-2 rounded-md bg-secondary/30 p-2 text-xs italic text-muted-foreground">
                      {customer.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold">RV</h3>
                {rv ? (
                  <div className="mt-3 space-y-1 text-sm">
                    <div className="font-semibold">{rv.nickname ?? `${rv.year} ${rv.make}`}</div>
                    <div className="text-xs text-muted-foreground">{rv.year} {rv.make} {rv.model}</div>
                    <div className="text-xs text-muted-foreground">{rv.type} · {rv.length}&apos;</div>
                    <div className="text-xs text-muted-foreground font-mono">VIN: {rv.vin.slice(-8)}</div>
                    {rv.notes && (
                      <p className="mt-2 rounded-md bg-secondary/30 p-2 text-xs italic text-muted-foreground">
                        {rv.notes}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">No RV linked.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold">Assigned techs</h3>
                <ul className="mt-3 space-y-2">
                  {techs.length === 0 && (
                    <li className="text-xs text-muted-foreground">Unassigned.</li>
                  )}
                  {techs.map((t) => (
                    <li key={t!.id} className="flex items-center gap-2">
                      <div
                        className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold uppercase text-white"
                        style={{ background: t!.color }}
                      >
                        {t!.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-sm">{t!.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {quote && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold">Linked quote</h3>
                  <div className="mt-3">
                    <Link
                      href={`/admin/quotes/${quote.id}`}
                      className="flex items-center justify-between rounded-md border bg-secondary/30 p-3 text-sm hover:bg-accent"
                    >
                      <div>
                        <div className="font-semibold">{quote.number}</div>
                        <div className="text-xs text-muted-foreground capitalize">{quote.status}</div>
                      </div>
                      <span className="font-bold">${quote.total.toFixed(2)}</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border bg-secondary/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="h-3 w-3">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
