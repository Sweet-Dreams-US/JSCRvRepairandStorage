import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/shell/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAccessAction } from "@/app/actions/access-admin";

export const metadata = { title: "New customer · Admin" };

export default function NewCustomerPage() {
  return (
    <>
      <Topbar
        title="New customer"
        subtitle="Create an account + access code for a customer"
        rightSlot={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/access">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </Button>
        }
      />
      <main className="flex-1 bg-secondary/20 p-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="p-6 md:p-8">
              <form action={createAccessAction} className="grid gap-6">
                {/* Contact */}
                <fieldset className="grid gap-4">
                  <legend className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Contact
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="customerName">Customer name</Label>
                      <Input id="customerName" name="customerName" required placeholder="Jane Whitcomb" />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="(574) 555-0100" />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
                    <p className="text-xs text-muted-foreground">
                      They sign in with this email + the code. Updates & messages go here.
                    </p>
                  </div>
                </fieldset>

                {/* Item */}
                <fieldset className="grid gap-4">
                  <legend className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    What they have with you
                  </legend>
                  <div className="grid gap-1.5">
                    <Label htmlFor="itemLabel">Item / rig</Label>
                    <Input
                      id="itemLabel"
                      name="itemLabel"
                      required
                      placeholder="2021 Jayco Jay Flight 28BHS"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="itemType">Type</Label>
                      <select id="itemType" name="itemType" defaultValue="rv" className="rounded-md border bg-background px-3 py-2 text-sm">
                        <option value="rv">RV</option>
                        <option value="plan">Care Plan</option>
                        <option value="boat">Boat</option>
                        <option value="storage">Storage</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="currentStatus">Starting status</Label>
                      <Input id="currentStatus" name="currentStatus" defaultValue="Checked in" />
                    </div>
                  </div>
                </fieldset>

                {/* Plan / ops */}
                <fieldset className="grid gap-4">
                  <legend className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Plan &amp; storage <span className="normal-case font-normal">(optional)</span>
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="planType">Plan</Label>
                      <Input id="planType" name="planType" placeholder="Camper's Care Plan" />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="monthlyRate">Monthly rate ($)</Label>
                      <Input id="monthlyRate" name="monthlyRate" type="number" min="0" step="1" placeholder="65" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="storageLocation">Storage spot</Label>
                      <Input id="storageLocation" name="storageLocation" placeholder="Zone A · Spot 12" />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="nextServiceDate">Next service date</Label>
                      <Input id="nextServiceDate" name="nextServiceDate" type="date" />
                    </div>
                  </div>
                </fieldset>

                <label className="flex items-center gap-2 rounded-md border bg-background p-3 text-sm">
                  <input type="checkbox" name="notify" defaultChecked className="h-4 w-4" />
                  <span>
                    Email the access code to the customer now
                    <span className="block text-xs text-muted-foreground">
                      (Skips sending if email isn&apos;t configured — you&apos;ll still see the code next.)
                    </span>
                  </span>
                </label>

                <div className="flex justify-end">
                  <Button type="submit" size="lg">Create customer</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
