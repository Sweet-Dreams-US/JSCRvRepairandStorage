"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { sendMessageAction } from "@/app/actions/portal";
import { cn, initials, relativeTime } from "@/lib/utils";

type Msg = {
  id: string;
  fromUserId: string;
  fromName: string;
  fromRole: string;
  body: string;
  createdAt: string;
};

const initial = { ok: false } as { ok: boolean; error?: string };

export function ThreadView({
  threadId,
  messages,
  currentUserId,
}: {
  threadId: string;
  messages: Msg[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(sendMessageAction, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <Card>
      <CardContent className="grid gap-4 p-6">
        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
          {messages.map((m) => {
            const mine = m.fromUserId === currentUserId;
            return (
              <div
                key={m.id}
                className={cn("flex gap-3", mine ? "flex-row-reverse" : "flex-row")}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={cn(
                      mine ? "bg-primary text-primary-foreground" : "bg-secondary",
                      "text-[10px]",
                    )}
                  >
                    {initials(m.fromName)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "border bg-secondary/40",
                  )}
                >
                  <div className="flex items-center gap-2 text-[10px] opacity-80">
                    <span className="font-semibold">{m.fromName}</span>
                    <span className="capitalize">· {m.fromRole}</span>
                    <span>· {relativeTime(m.createdAt)}</span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap leading-relaxed">{m.body}</p>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <form ref={formRef} action={action} className="grid gap-2 border-t pt-4">
          <input type="hidden" name="threadId" value={threadId} />
          <Textarea
            name="body"
            placeholder="Type a message…"
            rows={2}
            required
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
