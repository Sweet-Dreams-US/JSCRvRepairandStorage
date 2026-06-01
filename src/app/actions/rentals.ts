"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { store } from "@/lib/store";
import type { Rental, RentalStatus, RvType } from "@/lib/types";

/**
 * Parse the comma-separated features input from the rental form into a clean string[].
 *
 * Example input: "Generator, Solar panel, Bunk beds ,outdoor shower,, "
 * Should produce: ["Generator", "Solar panel", "Bunk beds", "Outdoor shower"]
 *
 * Considerations:
 *   - Trim whitespace from each item
 *   - Drop empty strings
 *   - Title-case each entry (capitalize first letter, leave the rest alone) so the listing
 *     looks tidy regardless of how Joe types it
 *   - Deduplicate (a feature listed twice shouldn't show twice)
 *
 * TODO(user): implement this helper. Joe will type freely; we want
 * his pretty-looking output without him having to format it.
 */
function parseFeatures(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .filter((s, i, arr) => arr.indexOf(s) === i);
}

function parseRentalForm(formData: FormData) {
  // Numeric fields default to 0 so an empty form fails validation explicitly
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "Travel Trailer") as RvType;
  const year = Number(formData.get("year") ?? 0);
  const make = String(formData.get("make") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const length = Number(formData.get("length") ?? 0);
  const sleeps = Number(formData.get("sleeps") ?? 0);
  const nightlyRate = Number(formData.get("nightlyRate") ?? 0);
  const weeklyRate = Number(formData.get("weeklyRate") ?? 0);
  const minNights = Number(formData.get("minNights") ?? 2);
  const securityDeposit = Number(formData.get("securityDeposit") ?? 0);
  const description = String(formData.get("description") ?? "").trim();
  const features = parseFeatures(String(formData.get("features") ?? ""));
  const photoUrl = String(formData.get("photoUrl") ?? "").trim() || undefined;
  const status = (String(formData.get("status") ?? "available") as RentalStatus);

  const errors: string[] = [];
  if (!name) errors.push("Name is required");
  if (year < 1990 || year > new Date().getFullYear() + 1) errors.push("Year looks wrong");
  if (!make) errors.push("Make is required");
  if (!model) errors.push("Model is required");
  if (sleeps < 1) errors.push("Sleeps must be at least 1");
  if (nightlyRate <= 0) errors.push("Nightly rate must be positive");

  return {
    errors,
    data: {
      name,
      type,
      year,
      make,
      model,
      length,
      sleeps,
      nightlyRate,
      weeklyRate,
      minNights,
      securityDeposit,
      description,
      features,
      photoUrl,
      status,
    } satisfies Omit<Rental, "id" | "createdAt" | "updatedAt">,
  };
}

export async function createRentalAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const { errors, data } = parseRentalForm(formData);
  if (errors.length) {
    // Browser validation should normally prevent this; thrown errors surface via error.tsx
    throw new Error(`Couldn't add rental: ${errors.join(", ")}`);
  }
  const rental = store.createRental(data);
  revalidatePath("/admin/rentals");
  revalidatePath("/rentals");
  redirect(`/admin/rentals?created=${rental.id}`);
}

export async function updateRentalAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const id = String(formData.get("id") ?? "");
  const { errors, data } = parseRentalForm(formData);
  if (errors.length) {
    throw new Error(`Couldn't save rental: ${errors.join(", ")}`);
  }
  store.updateRental(id, data);
  revalidatePath("/admin/rentals");
  revalidatePath(`/admin/rentals/${id}`);
  revalidatePath("/rentals");
  redirect(`/admin/rentals/${id}`);
}

export async function deleteRentalAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const id = String(formData.get("id") ?? "");
  store.deleteRental(id);
  revalidatePath("/admin/rentals");
  revalidatePath("/rentals");
  redirect("/admin/rentals");
}

export async function setRentalStatusAction(formData: FormData): Promise<void> {
  await requireRole("admin", "manager");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "available") as RentalStatus;
  store.updateRental(id, { status });
  revalidatePath("/admin/rentals");
  revalidatePath(`/admin/rentals/${id}`);
  revalidatePath("/rentals");
}
