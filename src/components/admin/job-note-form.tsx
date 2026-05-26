"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addJobNoteAction } from "@/app/actions/admin";

export function JobNoteForm({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(fd) => {
        startTransition(async () => {
          const res = await addJobNoteAction(fd);
          if (res.ok) {
            formRef.current?.reset();
            toast.success("Note added");
            router.refresh();
          } else if (res.error) {
            toast.error(res.error);
          }
        });
      }}
      className="grid gap-3"
    >
      <input type="hidden" name="jobId" value={jobId} />
      <Textarea name="body" rows={3} placeholder="Add a note for the team or for the customer…" required />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Checkbox name="internal" defaultChecked /> Internal only (don&apos;t share with customer)
        </label>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          Post note
        </Button>
      </div>
    </form>
  );
}
