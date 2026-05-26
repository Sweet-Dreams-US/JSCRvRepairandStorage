"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { submitLeadAction, type LeadFormState } from "@/app/actions/leads";

const initial: LeadFormState = { ok: false };

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const [state, formAction, pending] = useActionState(submitLeadAction, initial);

  useEffect(() => {
    if (state.ok && state.message) toast.success(state.message);
    else if (!state.ok && state.message) toast.error(state.message);
  }, [state]);

  if (state.ok) {
    return (
      <div className="rounded-lg border-2 border-success/30 bg-success/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h3 className="mt-3 text-lg font-semibold">Got it — thanks!</h3>
        <p className="mt-1 text-sm text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4">
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Name" name="name" required defaultError={state.errors?.name}>
          <Input name="name" placeholder="Your full name" required />
        </Field>
        <Field label="Phone" name="phone" required defaultError={state.errors?.phone}>
          <Input name="phone" type="tel" placeholder="(574) 555-0100" required />
        </Field>
      </div>
      <Field label="Email" name="email" required defaultError={state.errors?.email}>
        <Input name="email" type="email" placeholder="you@example.com" required />
      </Field>
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="What can we help with?" name="interest" required>
          <Select name="interest" defaultValue="repair">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="repair">RV Repair</SelectItem>
              <SelectItem value="maintenance">Maintenance / Service</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
              <SelectItem value="quote">Need a Quote</SelectItem>
              <SelectItem value="other">Something Else</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="RV Type (optional)" name="rvType">
          <Select name="rvType">
            <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Class A">Class A Motorhome</SelectItem>
              <SelectItem value="Class B">Class B Camper Van</SelectItem>
              <SelectItem value="Class C">Class C Motorhome</SelectItem>
              <SelectItem value="Travel Trailer">Travel Trailer</SelectItem>
              <SelectItem value="Fifth Wheel">Fifth Wheel</SelectItem>
              <SelectItem value="Toy Hauler">Toy Hauler</SelectItem>
              <SelectItem value="Pop-up">Pop-up</SelectItem>
              <SelectItem value="Boat">Boat</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Tell us a little about it" name="message" required defaultError={state.errors?.message}>
        <Textarea
          name="message"
          placeholder="Slide-out won't extend, looking for a winter storage spot, etc."
          required
          rows={4}
        />
      </Field>
      <input type="hidden" name="source" value="website" />
      <Button type="submit" disabled={pending} size="lg" className="w-full">
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Get In Touch"
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        We&rsquo;ll reach out within one business day. We never share your info.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  children,
  required,
  defaultError,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
  required?: boolean;
  defaultError?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>
        {label} {required && <span className="text-primary">*</span>}
      </Label>
      {children}
      {defaultError && <p className="text-xs text-destructive">{defaultError}</p>}
    </div>
  );
}
