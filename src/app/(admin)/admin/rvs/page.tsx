import Link from "next/link";
import { MapPin, Truck } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { store } from "@/lib/store";

export default async function AdminRvsPage() {
  const rvs = store.listRvs();
  return (
    <>
      <Topbar title="RVs" subtitle={`${rvs.length} rigs on file`} />
      <main className="flex-1 bg-secondary/20 p-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RV</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Year / Length</TableHead>
                  <TableHead>VIN</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rvs.map((rv) => {
                  const owner = store.getCustomer(rv.customerId);
                  const spot = store.lotSpotForRv(rv.id);
                  return (
                    <TableRow key={rv.id}>
                      <TableCell>
                        <div className="font-semibold">
                          {rv.nickname ?? `${rv.make} ${rv.model}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {rv.make} {rv.model}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="muted">{rv.type}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {rv.year} · {rv.length}&apos;
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground">
                        {rv.vin}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/customers/${rv.customerId}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {owner?.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {spot ? (
                          <Badge variant="outline" className="gap-1">
                            <MapPin className="h-3 w-3" /> {spot.label}
                          </Badge>
                        ) : (
                          <Badge variant="muted">Off-site</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
