import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RentalForm } from "@/components/admin/rental-form";
import { createRentalAction } from "@/app/actions/rentals";

export const metadata = { title: "New rental · Admin" };

export default async function NewRentalPage() {
  return (
    <>
      <Topbar
        title="Add a rental"
        subtitle="List one of your rigs on the public rentals page"
        rightSlot={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/rentals">
              <ArrowLeft className="h-4 w-4" /> Back to rentals
            </Link>
          </Button>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardContent className="p-6 md:p-8">
              <RentalForm action={createRentalAction} submitLabel="Add rental" />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
