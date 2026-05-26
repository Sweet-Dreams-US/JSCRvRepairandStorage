import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { ThreadView } from "@/components/portal/thread-view";
import { requireUser } from "@/lib/auth";
import { store } from "@/lib/store";

export default async function MessageThread({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const thread = store.getThread(id);
  if (!thread) notFound();
  if (user.role === "customer" && thread.customerId !== user.id) redirect("/portal/messages");
  store.markThreadRead(id, user.id);
  const messages = store.messagesByThread(id);
  return (
    <>
      <Topbar
        title={thread.subject}
        subtitle={`${thread.participantIds.length} participants`}
        rightSlot={
          <Link
            href="/portal/messages"
            className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
          >
            <ArrowLeft className="h-3 w-3" /> Inbox
          </Link>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
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
      </main>
    </>
  );
}
