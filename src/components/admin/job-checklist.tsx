"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { toggleChecklistAction } from "@/app/actions/admin";
import { relativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  label: string;
  done: boolean;
  doneBy?: string;
  doneAt?: string;
};

export function JobChecklist({ jobId, items }: { jobId: string; items: Item[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const toggle = (id: string) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("jobId", jobId);
      fd.set("itemId", id);
      await toggleChecklistAction(fd);
      router.refresh();
    });
  };
  return (
    <ul className="grid gap-2">
      {items.length === 0 && (
        <li className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">
          No checklist items.
        </li>
      )}
      {items.map((it) => (
        <li key={it.id}>
          <button
            type="button"
            disabled={pending}
            onClick={() => toggle(it.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md border bg-background p-3 text-left text-sm transition-colors hover:bg-accent",
              it.done && "opacity-70",
            )}
          >
            {it.done ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
            <span className={cn("flex-1", it.done && "line-through text-muted-foreground")}>{it.label}</span>
            {it.done && it.doneBy && (
              <span className="text-[10px] text-muted-foreground">
                {it.doneBy} · {it.doneAt && relativeTime(it.doneAt)}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
