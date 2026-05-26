import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThreadView } from "@/components/portal/thread-view";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";

export default async function AdminMessageThread({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const thread = store.getThread(id);
  if (!thread) notFound();
  store.markThreadRead(id, user.id);
  const messages = store.messagesByThread(id);
  const customer = store.getCustomer(thread.customerId);
  const job = thread.jobId ? store.getJob(thread.jobId) : undefined;

  return (
    <>
      <Topbar
        title={thread.subject}
        subtitle={customer?.name}
        rightSlot={
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
          >
            <ArrowLeft className="h-3 w-3" /> Inbox
          </Link>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <ThreadView
            threadId={id}
            messages={messages.map((m) => ({
              id: m.id,
              fromUserId: m.fromUserId,
              fromName: m.fromName,
              fromRole: m.fromRole,
              body: m.body,
              createdAt: m.createdAt,
            }))}
            currentUserId={user.id}
          />
          <div className="space-y-5">
            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold">Customer</h3>
                <Link
                  href={`/admin/customers/${customer?.id}`}
                  className="mt-3 flex items-center gap-2 rounded-md border bg-secondary/30 p-3 hover:bg-accent"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-semibold">{customer?.name}</div>
                    <div className="text-xs text-muted-foreground">{customer?.phone}</div>
                  </div>
                </Link>
              </CardContent>
            </Card>
            {job && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold">Linked job</h3>
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="mt-3 block rounded-md border bg-secondary/30 p-3 hover:bg-accent"
                  >
                    <div className="text-xs font-bold text-primary">{job.number}</div>
                    <div className="mt-0.5 text-sm font-semibold">{job.title}</div>
                    <Badge variant="info" className="mt-2 capitalize">
                      {job.status.replace("-", " ")}
                    </Badge>
                  </Link>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold">Participants</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {thread.participantIds.map((pid) => {
                    const u = store.getUser(pid);
                    if (!u) return null;
                    return (
                      <li key={pid} className="flex items-center justify-between">
                        <span>{u.name}</span>
                        <Badge variant="muted" className="capitalize">{u.role}</Badge>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
