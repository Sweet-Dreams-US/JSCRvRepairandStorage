import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { relativeTime } from "@/lib/utils";

export default async function AdminMessagesPage() {
  const user = await requireUser();
  const threads = store.listThreads();
  const unread = threads.reduce((sum, t) => sum + (t.unreadFor[user.id] ?? 0), 0);
  return (
    <>
      <Topbar
        title="Inbox"
        subtitle={`${threads.length} threads · ${unread} unread`}
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {threads.map((t) => {
                const customer = store.getCustomer(t.customerId);
                const msgs = store.messagesByThread(t.id);
                const last = msgs.at(-1);
                const isUnread = (t.unreadFor[user.id] ?? 0) > 0;
                return (
                  <li key={t.id}>
                    <Link
                      href={`/admin/messages/${t.id}`}
                      className="flex items-start gap-4 p-5 transition-colors hover:bg-accent"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`text-sm ${isUnread ? "font-bold" : "font-semibold"}`}>
                            {t.subject}
                          </span>
                          {isUnread && <Badge>{t.unreadFor[user.id]} unread</Badge>}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {customer?.name}
                        </p>
                        {last && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            <strong className="text-foreground">{last.fromName}:</strong>{" "}
                            {last.body}
                          </p>
                        )}
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {relativeTime(t.lastMessageAt)}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
              {threads.length === 0 && (
                <li className="py-12 text-center text-sm text-muted-foreground">
                  No threads yet.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
