"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { decideQuoteAction } from "@/app/actions/portal";

const initial = { ok: false } as { ok: boolean; error?: string };

export function QuoteDecisionForm({ quoteId }: { quoteId: string }) {
  const [state, action, pending] = useActionState(decideQuoteAction, initial);
  const [mode, setMode] = useState<"none" | "decline">("none");
  useEffect(() => {
    if (state.ok) toast.success("Thanks! We got your decision.");
    else if (state.error) toast.error(state.error);
  }, [state]);

  if (mode === "decline") {
    return (
      <form action={action} className="grid gap-3">
        <input type="hidden" name="quoteId" value={quoteId} />
        <input type="hidden" name="decision" value="declined" />
        <Textarea
          name="reason"
          placeholder="Reason (optional) — we always want to know what would help"
          rows={3}
        />
        <div className="flex gap-2">
          <Button type="submit" variant="destructive" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Decline quote
          </Button>
          <Button type="button" variant="ghost" onClick={() => setMode("none")}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="grid gap-3">
      <form action={action}>
        <input type="hidden" name="quoteId" value={quoteId} />
        <input type="hidden" name="decision" value="approved" />
        <Button type="submit" disabled={pending} className="w-full" size="lg" variant="success">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          Approve quote
        </Button>
      </form>
      <Button variant="outline" onClick={() => setMode("decline")}>
        Decline / send a question
      </Button>
    </div>
  );
}
