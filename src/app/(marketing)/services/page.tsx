import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cog,
  Flame,
  Shield,
  Snowflake,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LeadForm } from "@/components/marketing/lead-form";
import { BUSINESS } from "@/lib/business";

export const metadata = { title: "Services — RV Repair & Maintenance" };

const sections = [
  {
    title: "Diagnostics & Repair",
    icon: <Wrench className="h-5 w-5" />,
    blurb:
      "When something stops working, we figure out why and tell you the real story — not the most expensive one.",
    items: [
      "Slide-out motors, rails, gears, and seals",
      "Awning fabric, arms, motors, and torsion springs",
      "Roof seam inspection, resealing, partial & full re-roofs",
      "Plumbing — fresh, gray, black tanks, fittings, valves",
      "Water heaters (Atwood, Suburban, Truma)",
      "Inverters, converters, transfer switches",
      "House battery + solar diagnosis",
      "Brake controllers, wheel bearings, suspension",
    ],
  },
  {
    title: "Routine Maintenance",
    icon: <Cog className="h-5 w-5" />,
    blurb:
      "Stay on top of your rig with manufacturer-spec service intervals — and skip the headaches before they start.",
    items: [
      "Annual service packages (basic, full, road-warrior)",
      "Pre-trip inspections + safety checks",
      "Winterize / de-winterize",
      "Bearing repack & wheel torque",
      "Generator oil + filter service",
      "Slide & seal lubrication",
      "LP system pressure test",
      "Tire & tread inspection",
    ],
  },
  {
    title: "Appliances & Systems",
    icon: <Flame className="h-5 w-5" />,
    blurb:
      "Our techs are certified on the major appliance brands — and not afraid of the weird ones either.",
    items: [
      "Refrigeration (Norcold, Dometic, residential conversions)",
      "Furnace & A/C diagnosis + replacement",
      "Toilets, faucets, sinks, showers",
      "Awning & TV antenna control boards",
      "Theater seating actuators",
      "Generator service (Onan, Cummins)",
    ],
  },
  {
    title: "Body, Roof & Insurance",
    icon: <Shield className="h-5 w-5" />,
    blurb:
      "Big or small, cosmetic or structural — including direct work with your insurance adjuster.",
    items: [
      "Front cap delamination & repair",
      "Filon & fiberglass panel work",
      "Decal removal & replacement",
      "Hail, branch, and parking-lot damage",
      "Full + partial repaints",
      "Insurance claim photo packets & documentation",
    ],
  },
];

const packages = [
  {
    name: "Spring Tune-Up",
    price: "$195",
    blurb: "De-winterize, sanitize, top-off, check tires and battery. Ready to roll.",
    badge: "Most Popular",
    badgeColor: "default" as const,
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    name: "Full Pre-Trip",
    price: "$385",
    blurb: "Tires, brakes, slides, seals, generator, all systems checked & signed off.",
    badge: "Peace of Mind",
    badgeColor: "info" as const,
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    name: "Winterize",
    price: "$145",
    blurb: "Blow-out, antifreeze, bypass water heater, drop holding tanks.",
    badge: "Seasonal",
    badgeColor: "secondary" as const,
    icon: <Snowflake className="h-5 w-5" />,
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="border-b bg-radial-grid">
        <div className="container-wide grid gap-6 py-16 md:grid-cols-[1.2fr_1fr] md:items-center md:py-24">
          <div>
            <Badge className="bg-primary/10 text-primary">Services</Badge>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Every wrench you need. One shop.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              We work on every make and model — Class A motorhomes through pop-ups,
              fifth wheels, toy haulers, and boats. From a five-minute fix to a
              total restoration.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">
                  Get a quote <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`tel:${BUSINESS.phoneRaw}`}>Call {BUSINESS.phone}</a>
              </Button>
            </div>
          </div>
          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold">Service packages</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Common bundles at a flat rate. Custom work always available.
              </p>
              <div className="mt-5 grid gap-3">
                {packages.map((p) => (
                  <div key={p.name} className="flex items-start gap-3 rounded-lg border bg-secondary/30 p-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                      {p.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{p.name}</span>
                        <Badge variant={p.badgeColor}>{p.badge}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{p.blurb}</p>
                    </div>
                    <div className="text-sm font-semibold">{p.price}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b">
        <div className="container-wide py-12">
          <div className="overflow-hidden rounded-2xl border-2 border-foreground/5 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/shop-interior.png"
              alt="JSC RV Repair shop interior"
              className="h-72 w-full object-cover sm:h-96"
            />
          </div>
        </div>
      </section>

      <section className="border-b">
        <div className="container-wide py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((sec) => (
              <Card key={sec.title} className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
                      {sec.icon}
                    </div>
                    <h2 className="text-xl font-semibold">{sec.title}</h2>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{sec.blurb}</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {sec.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b bg-foreground text-background">
        <div className="container-wide grid gap-10 py-16 md:grid-cols-[1fr_420px] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Not sure what you need? Just ask.
            </h2>
            <p className="mt-3 max-w-xl text-background/70">
              Describe the symptom — even a vague one — and we’ll tell you what
              we’d check, ballpark cost, and when we could get you in.
            </p>
          </div>
          <Card className="text-foreground">
            <CardContent className="p-6">
              <LeadForm compact />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
