"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updatePickupStatusAction } from "@/app/actions/admin";

export function PickupStatusButton({
  pickupId,
  status,
  current,
}: {
  pickupId: string;
  status: string;
  current: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isCurrent = status === current;
  return (
    <Button
      size="sm"
      variant={isCurrent ? "default" : "outline"}
      disabled={pending || isCurrent}
      onClick={() => {
        startTransition(async () => {
          const fd = new FormData();
          fd.set("pickupId", pickupId);
          fd.set("status", status);
          await updatePickupStatusAction(fd);
          toast.success(`Marked ${status}`);
          router.refresh();
        });
      }}
      className="justify-start capitalize"
    >
      {status}
    </Button>
  );
}
