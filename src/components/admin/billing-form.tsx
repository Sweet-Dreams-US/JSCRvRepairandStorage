import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CustomerAccess } from "@/lib/types";

/** Shared create form for a quote or an invoice. */
export function BillingForm({
  kind,
  accounts,
  action,
  defaultAccessId,
}: {
  kind: "quote" | "invoice";
  accounts: CustomerAccess[];
  action: (formData: FormData) => void | Promise<void>;
  defaultAccessId?: string;
}) {
  const isQuote = kind === "quote";
  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-1.5">
        <Label htmlFor="accessId">Customer</Label>
        <select
          id="accessId"
          name="accessId"
          defaultValue={defaultAccessId ?? ""}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">— One-off (enter details below) —</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.customerName} · {a.itemLabel}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Pick an existing customer, or leave as one-off and fill in the name + email.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="customerName">Name (one-off)</Label>
          <Input id="customerName" name="customerName" placeholder="Jane Whitcomb" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email (one-off)</Label>
          <Input id="email" name="email" type="email" placeholder="jane@example.com" />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required placeholder={isQuote ? "Slide-out motor replacement" : "Spring service — labor & parts"} />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="details">Details / line items</Label>
        <Textarea id="details" name="details" rows={5} placeholder={"Labor (3 hrs) — $285\nSlide motor — $220\nSeals — $45"} />
        <p className="text-xs text-muted-foreground">List the work / parts. This shows in the email.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="amount">{isQuote ? "Estimate total ($)" : "Amount ($)"}</Label>
          <Input id="amount" name="amount" type="number" min="0" step="0.01" required placeholder="550" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={isQuote ? "validUntil" : "dueDate"}>{isQuote ? "Valid until" : "Due date"}</Label>
          <Input id={isQuote ? "validUntil" : "dueDate"} name={isQuote ? "validUntil" : "dueDate"} type="date" />
        </div>
      </div>

      <label className="flex items-center gap-2 rounded-md border bg-background p-3 text-sm">
        <input type="checkbox" name="sendNow" defaultChecked className="h-4 w-4" />
        <span>
          Email it to the customer now
          <span className="block text-xs text-muted-foreground">
            (Otherwise it saves as a draft you can send later. Skips sending if email isn&apos;t configured.)
          </span>
        </span>
      </label>

      <div className="flex justify-end">
        <Button type="submit" size="lg">{isQuote ? "Create quote" : "Create invoice"}</Button>
      </div>
    </form>
  );
}
