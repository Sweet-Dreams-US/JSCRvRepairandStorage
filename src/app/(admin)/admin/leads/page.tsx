import { Mail, Phone, UserPlus } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { store } from "@/lib/store";
import { relativeTime } from "@/lib/utils";

const sourceColor: Record<string, "info" | "warning" | "success" | "secondary" | "default"> = {
  website: "info",
  google: "warning",
  facebook: "default",
  referral: "success",
  other: "secondary",
};

const statusColor: Record<string, "warning" | "info" | "success" | "muted" | "destructive"> = {
  new: "warning",
  contacted: "info",
  scheduled: "info",
  converted: "success",
  lost: "muted",
};

export default async function LeadsPage() {
  const leads = store.listLeads();
  return (
    <>
      <Topbar
        title="Leads"
        subtitle={`${leads.length} total · ${leads.filter((l) => l.status === "new").length} new`}
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <div className="grid gap-4">
          {leads.map((l) => (
            <Card key={l.id} className="border-l-4" style={{ borderLeftColor: l.status === "new" ? "#dc2626" : "transparent" }}>
              <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_220px]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{l.name}</span>
                    <Badge variant={sourceColor[l.source]} className="capitalize">
                      {l.source}
                    </Badge>
                    <Badge variant="muted" className="capitalize">{l.interest}</Badge>
                    {l.rvType && <Badge variant="outline" className="text-[10px]">{l.rvType}</Badge>}
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
          ))}
          {leads.length === 0 && (
            <Card>
              <CardContent className="grid place-items-center gap-2 py-16 text-center">
                <UserPlus className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No leads yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
