import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Rental, RvType } from "@/lib/types";

/**
 * Shared rental form used for both create (no rental prop) and edit (rental prop).
 * The form posts to whatever server action the parent wires up.
 */
export function RentalForm({
  rental,
  action,
  submitLabel = "Save rental",
}: {
  rental?: Rental;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel?: string;
}) {
  const types: RvType[] = [
    "Class A",
    "Class B",
    "Class C",
    "Travel Trailer",
    "Fifth Wheel",
    "Toy Hauler",
    "Pop-up",
  ];
  return (
    <form action={action} className="grid gap-6">
      {rental && <input type="hidden" name="id" value={rental.id} />}

      {/* Identity */}
      <fieldset className="grid gap-4">
        <legend className="font-display text-lg font-semibold">Identity</legend>
        <div className="grid gap-1.5">
          <Label htmlFor="name">Display name</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={rental?.name}
            placeholder="The Lakeside · Bunkhouse"
          />
          <p className="text-xs text-muted-foreground">
            How customers will see it in the listing — give it a memorable name.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="grid gap-1.5 sm:col-span-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              defaultValue={rental?.type ?? "Travel Trailer"}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              name="year"
              type="number"
              min="1990"
              max={new Date().getFullYear() + 1}
              defaultValue={rental?.year ?? new Date().getFullYear()}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="length">Length (ft)</Label>
            <Input
              id="length"
              name="length"
              type="number"
              min="10"
              max="55"
              defaultValue={rental?.length ?? 28}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Label htmlFor="make">Make</Label>
            <Input id="make" name="make" required defaultValue={rental?.make} placeholder="Jayco" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              name="model"
              required
              defaultValue={rental?.model}
              placeholder="Jay Flight 28BHS"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sleeps">Sleeps</Label>
            <Input
              id="sleeps"
              name="sleeps"
              type="number"
              min="1"
              max="12"
              defaultValue={rental?.sleeps ?? 4}
            />
          </div>
        </div>
      </fieldset>

      {/* Pricing */}
      <fieldset className="grid gap-4">
        <legend className="font-display text-lg font-semibold">Pricing</legend>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="grid gap-1.5">
            <Label htmlFor="nightlyRate">Nightly ($)</Label>
            <Input
              id="nightlyRate"
              name="nightlyRate"
              type="number"
              min="0"
              step="5"
              defaultValue={rental?.nightlyRate ?? 180}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="weeklyRate">Weekly ($)</Label>
            <Input
              id="weeklyRate"
              name="weeklyRate"
              type="number"
              min="0"
              step="25"
              defaultValue={rental?.weeklyRate ?? 1080}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="minNights">Min nights</Label>
            <Input
              id="minNights"
              name="minNights"
              type="number"
              min="1"
              max="14"
              defaultValue={rental?.minNights ?? 2}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="securityDeposit">Security deposit ($)</Label>
            <Input
              id="securityDeposit"
              name="securityDeposit"
              type="number"
              min="0"
              step="50"
              defaultValue={rental?.securityDeposit ?? 500}
            />
          </div>
        </div>
      </fieldset>

      {/* Listing copy */}
      <fieldset className="grid gap-4">
        <legend className="font-display text-lg font-semibold">Listing copy</legend>
        <div className="grid gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={rental?.description}
            placeholder="What makes this rental special — perfect for lake trips, family-sized, pet-friendly, etc."
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="features">Features</Label>
          <Input
            id="features"
            name="features"
            defaultValue={rental?.features.join(", ")}
            placeholder="Generator, Solar, Bunk beds, Outdoor shower"
          />
          <p className="text-xs text-muted-foreground">Comma-separated. We&apos;ll tidy formatting.</p>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="photoUrl">Photo URL</Label>
          <Input
            id="photoUrl"
            name="photoUrl"
            type="url"
            defaultValue={rental?.photoUrl}
            placeholder="https://… (optional)"
          />
        </div>
      </fieldset>

      {/* Status */}
      <fieldset className="grid gap-1.5">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={rental?.status ?? "available"}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="available">Available — show on website</option>
          <option value="booked">Booked — show but mark unavailable</option>
          <option value="maintenance">In maintenance — hide from website</option>
          <option value="retired">Retired — hide from website</option>
        </select>
      </fieldset>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
