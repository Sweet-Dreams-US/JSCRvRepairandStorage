import Link from "next/link";
import { ArrowRight, Mail, Phone, Truck } from "lucide-react";
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
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function CustomersPage() {
  const customers = store.listCustomers();
  return (
    <>
      <Topbar
        title="Customers"
        subtitle={`${customers.length} on file · ${formatCurrency(customers.reduce((s, c) => s + c.lifetimeValue, 0))} lifetime value`}
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>RVs</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Lifetime</TableHead>
                  <TableHead className="text-right">&nbsp;</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-semibold">{c.name}</div>
                      {c.address && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {c.address}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {c.phone}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {c.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="muted" className="gap-1">
                        <Truck className="h-3 w-3" /> {c.rvIds.length}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(c.joinedDate)}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(c.lifetimeValue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        Open <ArrowRight className="h-3 w-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
