import Link from "next/link";
import { ArrowRight, KeyRound, Plus, Tag, Users } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import type { RentalStatus } from "@/lib/types";

export const metadata = { title: "Rentals · Admin" };

const STATUS_LABEL: Record<RentalStatus, { label: string; variant: "default" | "muted" | "destructive" | "warning" | "info" | "success" }> = {
  available: { label: "Available", variant: "success" },
  booked: { label: "Booked", variant: "warning" },
  maintenance: { label: "Maintenance", variant: "muted" },
  retired: { label: "Retired", variant: "destructive" },
};

export default async function RentalsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const params = await searchParams;
  const rentals = store.listRentals();
  const showCreatedBanner = !!params.created;

  return (
    <>
      <Topbar
        title="Rental fleet"
        subtitle={
          rentals.length === 0
            ? "No rentals listed yet"
            : `${rentals.length} rental${rentals.length === 1 ? "" : "s"} · ${rentals.filter((r) => r.status === "available").length} available`
        }
        rightSlot={
          <Button asChild>
            <Link href="/admin/rentals/new">
              <Plus className="h-4 w-4" /> Add rental
            </Link>
          </Button>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        {showCreatedBanner && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            <strong>Rental added.</strong> It&apos;s live on{" "}
            <Link href="/rentals" className="underline">
              the website
            </Link>{" "}
            (if status is available or booked).
          </div>
        )}

        {rentals.length === 0 ? <EmptyState /> : <RentalGrid rentals={rentals} />}
      </main>
    </>
  );
}

function EmptyState() {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/10">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="font-display text-2xl font-bold">
            Add your first rental
          </h2>
          <p className="text-sm text-muted-foreground">
            List the rigs you&apos;d like to rent out — travel trailers, motorhomes,
            bunkhouses. Each one shows up on the public{" "}
            <Link href="/rentals" className="underline underline-offset-4">
              /rentals
            </Link>{" "}
            page so customers can browse and inquire.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/admin/rentals/new">
            <Plus className="h-4 w-4" /> Add a rental
          </Link>
        </Button>
        <div className="grid w-full max-w-lg gap-3 border-t pt-6 text-left">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Quick tips
          </div>
          <ul className="grid gap-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-primary" />
              <span>Set status to <strong>Available</strong> to show on the website.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-primary" />
              <span>Use <strong>Booked</strong> while a rental is out — it stays visible but shows as unavailable.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-primary" />
              <span>Comma-separate features. We tidy up the formatting.</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function RentalGrid({ rentals }: { rentals: ReturnType<typeof store.listRentals> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rentals.map((r) => {
        const status = STATUS_LABEL[r.status];
        return (
          <Link
            key={r.id}
            href={`/admin/rentals/${r.id}`}
            className="group block"
          >
            <Card className="h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50">
                {r.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.photoUrl}
                    alt={r.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-muted-foreground">
                    <KeyRound className="h-12 w-12 opacity-40" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </div>
              <CardContent className="space-y-3 p-5">
                <div>
                  <h3 className="font-display text-lg font-semibold leading-tight">
                    {r.name}
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    {r.year} {r.make} {r.model} · {r.type} · {r.length}ft
                  </div>
                </div>
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" /> Sleeps {r.sleeps}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {r.features.length} features
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-bold tabular-nums">
                      {formatCurrency(r.nightlyRate)}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      per night
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Edit listing <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
