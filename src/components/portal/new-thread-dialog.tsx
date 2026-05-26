"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { startNewThreadAction } from "@/app/actions/portal";

const initial = { ok: false } as { ok: boolean; error?: string; threadId?: string };

export function NewThreadDialog() {
  const router = useRouter();
  const [state, action, pending] = useActionState(startNewThreadAction, initial);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.ok && state.threadId) {
      toast.success("Message sent!");
      setOpen(false);
      router.push(`/portal/messages/${state.threadId}`);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" /> New message
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New message to the shop</DialogTitle>
          <DialogDescription>
            Joe, Tina, or the techs will respond as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input name="subject" placeholder="What is this about?" required />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="body">Message</Label>
            <Textarea name="body" placeholder="What can we help with?" rows={5} required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
