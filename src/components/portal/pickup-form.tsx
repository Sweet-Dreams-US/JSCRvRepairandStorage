"use client";

import { useActionState, useEffect } from "react";
import { CalendarCheck2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPickupAction } from "@/app/actions/portal";
import type { Rv } from "@/lib/types";

const PREP_OPTIONS = [
  { id: "tires-aired", label: "Air tires to spec" },
  { id: "battery-check", label: "Test & top off battery" },
  { id: "water-fill", label: "Fill & sanitize fresh tank" },
  { id: "propane-check", label: "Top off propane" },
  { id: "dump-tanks", label: "Dump black + grey tanks" },
  { id: "exterior-wash", label: "Exterior wash" },
  { id: "fridge-cooldown", label: "Fridge cool-down (24h before)" },
  { id: "generator-test", label: "Generator load test" },
  { id: "slide-test", label: "Cycle all slides + seal check" },
  { id: "fuel-up", label: "Top off fuel (drivable RV)" },
];

const initial = { ok: false } as { ok: boolean; error?: string };

export function PickupForm({ rvs }: { rvs: Rv[] }) {
  const [state, formAction, pending] = useActionState(createPickupAction, initial);
  useEffect(() => {
    if (state.ok) toast.success("Request sent! We’ll confirm shortly.");
    else if (state.error) toast.error(state.error);
  }, [state]);
  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-1.5">
        <Label htmlFor="rvId">Which RV?</Label>
        <Select name="rvId" defaultValue={rvs[0]?.id}>
          <SelectTrigger><SelectValue placeholder="Select your RV" /></SelectTrigger>
          <SelectContent>
            {rvs.map((rv) => (
              <SelectItem key={rv.id} value={rv.id}>
                {rv.nickname ?? `${rv.year} ${rv.make} ${rv.model}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="pickupDate">Pickup date</Label>
          <Input type="date" name="pickupDate" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="returnDate">Return date (optional)</Label>
          <Input type="date" name="returnDate" />
        </div>
      </div>
      <div>
        <Label className="mb-2 block">What should we take care of?</Label>
        <div className="grid gap-2 sm:grid-cols-2">
          {PREP_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 rounded-md border bg-background p-3 transition-colors hover:bg-accent"
            >
              <Checkbox name="prep" value={opt.id} />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes / special requests</Label>
        <Textarea
          name="notes"
          rows={3}
          placeholder="Anything we should know? Specific time window for pickup?"
        />
      </div>
      <Button type="submit" disabled={pending} size="lg">
        {pending ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
        ) : (
          <><CalendarCheck2 className="h-4 w-4" /> Send pickup request</>
        )}
      </Button>
    </form>
  );
}
