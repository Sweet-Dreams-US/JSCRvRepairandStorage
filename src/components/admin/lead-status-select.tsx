"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateLeadStatusAction } from "@/app/actions/admin";

export function LeadStatusSelect({ leadId, current }: { leadId: string; current: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Select
      defaultValue={current}
      onValueChange={(value) => {
        startTransition(async () => {
          const fd = new FormData();
          fd.set("leadId", leadId);
          fd.set("status", value);
          await updateLeadStatusAction(fd);
          toast.success(`Marked ${value}`);
          router.refresh();
        });
      }}
      disabled={pending}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">New</SelectItem>
        <SelectItem value="contacted">Contacted</SelectItem>
        <SelectItem value="scheduled">Scheduled</SelectItem>
        <SelectItem value="converted">Converted</SelectItem>
        <SelectItem value="lost">Lost</SelectItem>
      </SelectContent>
    </Select>
  );
}
