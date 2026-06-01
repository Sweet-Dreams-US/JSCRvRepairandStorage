import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RentalForm } from "@/components/admin/rental-form";
import { deleteRentalAction, updateRentalAction } from "@/app/actions/rentals";
import { store } from "@/lib/store";

export const metadata = { title: "Edit rental · Admin" };

export default async function EditRentalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rental = store.getRental(id);
  if (!rental) notFound();

  return (
    <>
      <Topbar
        title={`Edit · ${rental.name}`}
        subtitle={`${rental.year} ${rental.make} ${rental.model}`}
        rightSlot={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/rentals">
              <ArrowLeft className="h-4 w-4" /> Back to rentals
            </Link>
          </Button>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card>
            <CardContent className="p-6 md:p-8">
              <RentalForm
                rental={rental}
                action={updateRentalAction}
                submitLabel="Save changes"
              />
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardContent className="flex flex-col items-start justify-between gap-3 p-5 md:flex-row md:items-center">
              <div>
                <div className="font-display text-sm font-semibold">
                  Delete this listing
                </div>
                <div className="text-xs text-muted-foreground">
                  Removes it from the public rentals page immediately. Not recoverable.
                </div>
              </div>
              <form action={deleteRentalAction}>
                <input type="hidden" name="id" value={rental.id} />
                <Button type="submit" variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
