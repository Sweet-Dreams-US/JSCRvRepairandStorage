import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { scheduleAppointmentAction } from "@/app/actions/access-admin";
import type { AppointmentKind } from "@/lib/types";

/**
 * Compact "schedule an appointment" form. Used on the requests inbox (to convert
 * a request into a booking) and on the customer detail page.
 */
export function ScheduleForm({
  accessId,
  requestId,
  defaultKind = "pickup",
  defaultLocal,
  title,
}: {
  accessId: string;
  requestId?: string;
  defaultKind?: AppointmentKind;
  defaultLocal?: string; // "YYYY-MM-DDTHH:mm"
  title?: string;
}) {
  return (
    <form action={scheduleAppointmentAction} className="grid gap-2 rounded-md border bg-background p-3">
      <input type="hidden" name="accessId" value={accessId} />
      {requestId && <input type="hidden" name="requestId" value={requestId} />}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <CalendarClock className="h-3.5 w-3.5 text-primary" />
        {title ?? "Schedule appointment"}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <select
          name="kind"
          defaultValue={defaultKind}
          className="rounded-md border bg-background px-2 py-1.5 text-sm capitalize"
        >
          <option value="pickup">Pickup</option>
          <option value="service">Service</option>
          <option value="dropoff">Drop-off</option>
          <option value="other">Other</option>
        </select>
        <Input
          type="datetime-local"
          name="scheduledFor"
          defaultValue={defaultLocal}
          required
          className="text-sm"
        />
      </div>
      <Input name="title" placeholder="Title (optional)" className="text-sm" />
      <Input name="notes" placeholder="Notes for the customer (optional)" className="text-sm" />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" name="notify" defaultChecked className="h-3.5 w-3.5" />
          Email the customer
        </label>
        <Button type="submit" size="sm">Schedule</Button>
      </div>
    </form>
  );
}
