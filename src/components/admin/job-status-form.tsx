"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { changeJobStatusAction } from "@/app/actions/admin";
import type { JobStatus } from "@/lib/types";

const ALL_STATUSES: { key: JobStatus; label: string; tone: "default" | "success" | "destructive" | "secondary" }[] = [
  { key: "intake", label: "Intake", tone: "secondary" },
  { key: "diagnosing", label: "Diagnosing", tone: "secondary" },
  { key: "quote-sent", label: "Quote sent", tone: "secondary" },
  { key: "approved", label: "Approved", tone: "default" },
  { key: "in-progress", label: "In progress", tone: "default" },
  { key: "waiting-parts", label: "Waiting parts", tone: "secondary" },
  { key: "qa", label: "QA", tone: "secondary" },
  { key: "ready", label: "Ready", tone: "success" },
  { key: "completed", label: "Completed", tone: "success" },
  { key: "cancelled", label: "Cancelled", tone: "destructive" },
];

export function JobStatusForm({ jobId, current }: { jobId: string; current: JobStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const set = (status: JobStatus) => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("jobId", jobId);
      fd.set("status", status);
      await changeJobStatusAction(fd);
      toast.success(`Moved to ${status.replace("-", " ")}`);
      router.refresh();
    });
  };

  return (
    <div className="grid gap-1.5">
      {ALL_STATUSES.map((s) => (
        <Button
          key={s.key}
          variant={current === s.key ? s.tone : "outline"}
          size="sm"
          disabled={pending || current === s.key}
          onClick={() => set(s.key)}
          className="justify-start"
        >
          {s.label}
        </Button>
      ))}
    </div>
  );
}
