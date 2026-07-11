import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BillingForm } from "@/components/admin/billing-form";
import { createInvoiceAction } from "@/app/actions/billing-admin";
import { accessStore } from "@/lib/access-store";

export const metadata = { title: "New invoice · Admin" };

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
  const { access } = await searchParams;
  const accounts = await accessStore.listAccess();
  return (
    <>
      <Topbar
        title="New invoice"
        subtitle="Bill a customer — emailed on send"
        rightSlot={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/invoices"><ArrowLeft className="h-4 w-4" /> Back</Link>
          </Button>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="p-6 md:p-8">
              <BillingForm kind="invoice" accounts={accounts} action={createInvoiceAction} defaultAccessId={access} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
