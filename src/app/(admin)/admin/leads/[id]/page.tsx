import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail, Phone, PhoneCall, UserCheck } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  convertLeadAction,
  logContactAction,
  saveLeadNotesAction,
  setLeadStatusAction,
} from "@/app/actions/leads-admin";
import { leadsStore } from "@/lib/leads-store";
import { formatDateTime, relativeTime } from "@/lib/utils";
import type { Lead } from "@/lib/types";

export const metadata = { title: "Inquiry · Admin" };

const INTEREST_LABEL: Record<Lead["interest"], string> = {
  plan: "Storage & Service Plan",
  storage: "Storage",
  rental: "RV Rental",
  repair: "Repair",
  maintenance: "Maintenance",
  quote: "Quote",
  other: "General",
};
const STATUSES = ["new", "contacted", "scheduled", "converted", "lost"] as const;

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await leadsStore.getLead(id);
  if (!lead) notFound();

  const converted = !!lead.convertedAccessId;

  return (
    <>
      <Topbar
        title={lead.name}
        subtitle={`${INTEREST_LABEL[lead.interest]} · ${lead.source}`}
        rightSlot={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/leads">
              <ArrowLeft className="h-4 w-4" /> All inquiries
            </Link>
          </Button>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-[1fr_320px]">
          {/* LEFT: the inquiry */}
          <div className="space-y-5">
            <Card>
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">{INTEREST_LABEL[lead.interest]}</Badge>
                  <Badge variant="secondary" className="capitalize">{lead.source}</Badge>
                  {lead.rvType && <Badge variant="outline">{lead.rvType}</Badge>}
                  <Badge variant={lead.status === "new" ? "warning" : "muted"} className="capitalize">{lead.status}</Badge>
                </div>
                <div className="rounded-md border-l-4 border-primary bg-background p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Their message</div>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{lead.message}</p>
                </div>
                <div className="grid gap-2 text-sm">
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4" /> {lead.phone}</a>
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4" /> {lead.email}</a>
                </div>
                <div className="border-t pt-3 text-xs text-muted-foreground">
                  Received {formatDateTime(lead.createdAt)}
                  {lead.lastContactedAt && <> · last contacted {relativeTime(lead.lastContactedAt)}</>}
                </div>
              </CardContent>
            </Card>

            {/* Internal notes */}
            <Card>
              <CardContent className="p-5">
                <h2 className="font-display text-lg font-semibold">Notes</h2>
                <p className="mb-3 text-xs text-muted-foreground">Private notes on this inquiry.</p>
                <form action={saveLeadNotesAction} className="grid gap-2">
                  <input type="hidden" name="leadId" value={lead.id} />
                  <Textarea name="internalNotes" rows={4} defaultValue={lead.internalNotes ?? ""} placeholder="Called and left a voicemail; interested in winter storage…" />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" variant="secondary">Save notes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: move it along */}
          <div className="space-y-5">
            {/* Log contact */}
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-1 font-display text-lg font-semibold">1 · Reach out</h2>
                <p className="mb-3 text-xs text-muted-foreground">
                  Call or email them, then log it so it moves to “contacted.”
                </p>
                <div className="grid gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <a href={`tel:${lead.phone}`}><Phone className="h-4 w-4" /> Call {lead.phone}</a>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <a href={`mailto:${lead.email}?subject=JSC%20RV%20Service`}><Mail className="h-4 w-4" /> Email</a>
                  </Button>
                  <form action={logContactAction}>
                    <input type="hidden" name="leadId" value={lead.id} />
                    <Button type="submit" size="sm" className="w-full">
                      <PhoneCall className="h-4 w-4" /> Log contact
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardContent className="p-5">
                <h2 className="mb-1 font-display text-lg font-semibold">2 · Status</h2>
                <form action={setLeadStatusAction} className="mt-2 flex gap-2">
                  <input type="hidden" name="leadId" value={lead.id} />
                  <select name="status" defaultValue={lead.status} className="flex-1 rounded-md border bg-background px-2 py-1.5 text-sm capitalize">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Button type="submit" size="sm" variant="secondary">Set</Button>
                </form>
              </CardContent>
            </Card>

            {/* Convert */}
            <Card className={converted ? "" : "border-primary/40"}>
              <CardContent className="p-5">
                <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold">
                  <UserCheck className="h-4 w-4 text-primary" /> 3 · Win it
                </h2>
                {converted ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">This inquiry is now a customer.</p>
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/admin/access/${lead.convertedAccessId}`}>
                        Open customer <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <form action={convertLeadAction} className="grid gap-2">
                    <input type="hidden" name="leadId" value={lead.id} />
                    <p className="mb-1 text-xs text-muted-foreground">
                      Turn this inquiry into a customer with an access code they can log in with.
                    </p>
                    <Label htmlFor="itemLabel" className="text-xs">What they bought / their rig</Label>
                    <Input
                      id="itemLabel"
                      name="itemLabel"
                      placeholder={lead.rvType ? lead.rvType : "2021 Jayco Jay Flight 28BHS"}
                    />
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" name="notify" defaultChecked className="h-3.5 w-3.5" />
                      Email them the access code
                    </label>
                    <Button type="submit" size="sm" className="w-full">Convert to customer</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
