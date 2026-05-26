import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function LotPage() {
  const lot = store.listLot();
  const stats = store.computeStats();
  const zones: ("A" | "B" | "C" | "Boat")[] = ["A", "B", "C", "Boat"];
  return (
    <>
      <Topbar
        title="Storage Lot"
        subtitle={`${stats.lotOccupied}/${stats.lotTotal} spots occupied · ${formatCurrency(stats.monthlyStorageRev)}/mo recurring`}
      />
      <main className="flex-1 space-y-6 bg-secondary/20 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          {zones.map((z) => {
            const spots = lot.filter((s) => s.zone === z);
            const occ = spots.filter((s) => s.occupiedByRvId).length;
            return (
              <Card key={z}>
                <CardContent className="p-5">
                  <div className="text-xs uppercase text-muted-foreground">Zone {z}</div>
                  <div className="mt-2 text-3xl font-bold">
                    {occ}<span className="text-lg text-muted-foreground">/{spots.length}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatCurrency(spots.filter((s) => s.occupiedByRvId).reduce((sum, s) => sum + s.monthlyRate, 0))}
                    {" "}/mo
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {zones.map((z) => {
          const spots = lot.filter((s) => s.zone === z);
          return (
            <Card key={z}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Zone {z}</h2>
                  <Badge variant="muted" className="capitalize">{spots[0]?.size} size</Badge>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
                  {spots.map((s) => {
                    const rv = s.occupiedByRvId ? store.getRv(s.occupiedByRvId) : undefined;
                    const customer = rv ? store.getCustomer(rv.customerId) : undefined;
                    const colorMap: Record<string, string> = {
                      stored: "bg-success/10 border-success/30",
                      "pending-pickup": "bg-warning/10 border-warning/40",
                      "pending-return": "bg-info/10 border-info/30",
                      out: "bg-background border-border",
                    };
                    return (
                      <div
                        key={s.id}
                        className={`flex flex-col rounded-md border-2 p-3 ${colorMap[s.status]}`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold">{s.label}</span>
                          {s.hasPower && <Badge variant="outline" className="text-[9px]">⚡</Badge>}
                        </div>
                        {rv ? (
                          <>
                            <div className="mt-2 text-xs font-semibold line-clamp-1">
                              {rv.nickname ?? rv.make}
                            </div>
                            <div className="text-[10px] text-muted-foreground line-clamp-1">
                              {rv.year} {rv.make} {rv.model}
                            </div>
                            <div className="mt-1 text-[10px] text-muted-foreground line-clamp-1">
                              {customer?.name}
                            </div>
                            <Badge
                              variant={s.status === "pending-pickup" ? "warning" : "success"}
                              className="mt-2 w-fit text-[9px] capitalize"
                            >
                              {s.status.replace("-", " ")}
                            </Badge>
                          </>
                        ) : (
                          <div className="mt-2 text-xs italic text-muted-foreground">Open</div>
                        )}
                        <div className="mt-auto pt-2 text-[10px] text-muted-foreground">
                          {formatCurrency(s.monthlyRate)}/mo
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>
    </>
  );
}
