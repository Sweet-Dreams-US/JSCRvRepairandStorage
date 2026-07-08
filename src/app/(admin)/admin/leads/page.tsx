import Link from "next/link";
import { Inbox, MailCheck, Mail, Phone } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { BUSINESS } from "@/lib/business";
import { store } from "@/lib/store";
import { relativeTime } from "@/lib/utils";
import type { Lead } from "@/lib/types";

export const metadata = { title: "Inquiries · Admin" };

const sourceColor: Record<string, "info" | "warning" | "success" | "secondary" | "default"> = {
  website: "info",
  google: "warning",
  facebook: "default",
  referral: "success",
  other: "secondary",
};

// Interests the shop most wants surfaced get a highlighted (primary) badge.
const INTEREST: Record<Lead["interest"], { label: string; highlight: boolean }> = {
  plan: { label: "Storage & Service Plan", highlight: true },
  storage: { label: "Storage", highlight: true },
  rental: { label: "RV Rental", highlight: false },
  repair: { label: "Repair", highlight: false },
  maintenance: { label: "Maintenance", highlight: false },
  quote: { label: "Quote", highlight: false },
  other: { label: "General", highlight: false },
};

type Filter = "new" | "contacted" | "scheduled" | "converted" | "all";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "scheduled", label: "Scheduled" },
  { key: "converted", label: "Converted" },
  { key: "all", label: "All" },
];

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: filterParam } = await searchParams;
  const filter: Filter = FILTERS.some((f) => f.key === filterParam)
    ? (filterParam as Filter)
    : "new";

  const all = store.listLeads();
  const count = (status: string) => all.filter((l) => l.status === status).length;
  const visible = filter === "all" ? all : all.filter((l) => l.status === filter);
  const newCount = count("new");

  return (
    <>
      <Topbar
        title="Inquiries"
        subtitle={`${newCount} new · ${all.length} total`}
      />
      <main className="flex-1 space-y-5 bg-secondary/20 p-6">
        {/* Delivery note */}
        <div className="flex items-center gap-2 rounded-md border border-info/30 bg-info/5 px-3 py-2 text-xs text-foreground/80">
          <MailCheck className="h-3.5 w-3.5 shrink-0 text-info" />
          <span>
            New inquiries from the website are saved here and emailed to{" "}
            <a href={`mailto:${BUSINESS.email}`} className="font-medium underline">
              {BUSINESS.email}
            </a>
            .
          </span>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const n = f.key === "all" ? all.length : count(f.key);
            const active = f.key === filter;
            return (
              <Link
                key={f.key}
                href={`/admin/leads?filter=${f.key}`}
                className={
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                  (active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground/70 hover:border-primary/40")
                }
              >
                {f.label}
                <span
                  className={
                    "rounded-full px-1.5 text-[10px] " +
                    (active ? "bg-white/20" : "bg-muted text-muted-foreground")
                  }
                >
                  {n}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Inquiry list */}
        <div className="grid gap-4">
          {visible.map((l) => {
            const interest = INTEREST[l.interest] ?? { label: l.interest, highlight: false };
            return (
              <Card
                key={l.id}
                className="border-l-4"
                style={{ borderLeftColor: l.status === "new" ? "#c8331f" : "transparent" }}
              >
                <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_220px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{l.name}</span>
                      <Badge variant={interest.highlight ? "default" : "muted"}>
                        {interest.label}
                      </Badge>
                      <Badge variant={sourceColor[l.source]} className="capitalize">
                        {l.source}
                      </Badge>
                      {l.rvType && (
                        <Badge variant="outline" className="text-[10px]">
                          {l.rvType}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-foreground">“{l.message}”</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <a href={`tel:${l.phone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="h-3 w-3" /> {l.phone}
                      </a>
                      <a href={`mailto:${l.email}`} className="flex items-center gap-1 hover:text-primary">
                        <Mail className="h-3 w-3" /> {l.email}
                      </a>
                      <span>{relativeTime(l.createdAt)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase text-muted-foreground">
                      Status
                    </div>
                    <LeadStatusSelect leadId={l.id} current={l.status} />
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {visible.length === 0 && (
            <Card>
              <CardContent className="grid place-items-center gap-2 py-16 text-center">
                <Inbox className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {filter === "new"
                    ? "No new inquiries. You're all caught up."
                    : `No ${filter} inquiries.`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
