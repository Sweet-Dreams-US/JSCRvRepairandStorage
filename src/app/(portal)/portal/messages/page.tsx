import Link from "next/link";
import { MessageSquare, Plus } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NewThreadDialog } from "@/components/portal/new-thread-dialog";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";
import { relativeTime } from "@/lib/utils";

export default async function MessagesPage() {
  const user = await requireUser();
  const threads = store.threadsForUser(user.id);
  return (
    <>
      <Topbar
        title="Messages"
        subtitle="Talk directly with Joe, Tina, and the techs."
        rightSlot={<NewThreadDialog />}
      />
      <main className="flex-1 space-y-4 bg-secondary/20 p-6">
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {threads.length === 0 && (
                <li className="py-12 text-center text-sm text-muted-foreground">
                  No messages yet. Start a new one to reach the shop.
                </li>
              )}
              {threads.map((t) => {
                const msgs = store.messagesByThread(t.id);
                const last = msgs.at(-1);
                const unread = t.unreadFor[user.id] ?? 0;
                return (
                  <li key={t.id}>
                    <Link
                      href={`/portal/messages/${t.id}`}
                      className="flex items-start gap-4 p-5 transition-colors hover:bg-accent"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold">{t.subject}</span>
                          {unread > 0 && <Badge>{unread} new</Badge>}
                        </div>
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
            </ul>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
