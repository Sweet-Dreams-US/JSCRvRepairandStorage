"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { recordPaymentAction } from "@/app/actions/admin";

export function PaymentForm({ invoiceId, balanceDue }: { invoiceId: string; balanceDue: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <form
      action={(fd) => {
        startTransition(async () => {
          const res = await recordPaymentAction(fd);
          if (res.ok) {
            toast.success("Payment recorded");
            router.refresh();
          } else if (res.error) {
            toast.error(res.error);
          }
        });
      }}
      className="mt-3 grid gap-3"
    >
      <input type="hidden" name="invoiceId" value={invoiceId} />
      <input type="hidden" name="notedBy" value="Tina" />
      <div className="grid gap-1">
        <Label htmlFor="amount">Amount</Label>
        <Input
          name="amount"
          type="number"
          step="0.01"
          defaultValue={balanceDue.toFixed(2)}
          required
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="method">Method</Label>
        <Select name="method" defaultValue="card">
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="ach">ACH</SelectItem>
            <SelectItem value="check">Check</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1">
        <Label htmlFor="reference">Reference</Label>
        <Input name="reference" placeholder="e.g. Visa ****4421 or Check #1234" />
      </div>
      <Button type="submit" disabled={pending} size="sm">
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        Record payment
      </Button>
    </form>
  );
}
