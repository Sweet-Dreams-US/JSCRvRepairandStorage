import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Droplets,
  Gauge,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadForm } from "@/components/marketing/lead-form";
import { BUSINESS } from "@/lib/business";

export const metadata = { title: "RV & Boat Storage" };

const tiers = [
  {
    name: "Standard Outdoor",
    price: 95,
    desc: "Fits most travel trailers up to 32'.",
    features: ["Secured fenced lot", "Monthly auto-renew", "Pickup-prep available", "Up to 32 ft"],
    badge: "Zone A",
    color: "info" as const,
  },
  {
    name: "Large Outdoor",
    price: 135,
    desc: "Built for fifth wheels and Class C motorhomes.",
    features: ["Powered hookup", "Wider lanes", "Pickup-prep available", "Up to 36 ft"],
    badge: "Zone B",
    color: "default" as const,
  },
  {
    name: "XL / Class A",
    price: 175,
    desc: "Diesel pushers, large fifth wheels, big toy haulers.",
    features: ["Powered hookup", "Drive-through access", "Pickup-prep available", "40 ft+"],
    badge: "Zone C",
    color: "warning" as const,
  },
  {
    name: "Boat Storage",
    price: 65,
    desc: "Trailerable boats and pontoons.",
    features: ["Spring launch support", "Trailer included", "Seasonal & monthly"],
    badge: "Boat Zone",
    color: "secondary" as const,
  },
];

const prepAddOns = [
  { l: "Tires aired to spec", icon: <Gauge className="h-4 w-4" /> },
  { l: "Battery test & top-off", icon: <BatteryCharging className="h-4 w-4" /> },
  { l: "Propane fill", icon: <Zap className="h-4 w-4" /> },
  { l: "Fresh water sanitize & fill", icon: <Droplets className="h-4 w-4" /> },
  { l: "Black/grey tank dump", icon: <Droplets className="h-4 w-4" /> },
  { l: "Exterior wash", icon: <Sparkles className="h-4 w-4" /> },
  { l: "Fridge cool-down (24h)", icon: <Truck className="h-4 w-4" /> },
  { l: "Generator load test", icon: <Zap className="h-4 w-4" /> },
];

const faqs = [
  {
    q: "How does pickup-prep work?",
    a: "When you know your trip dates, log into your portal (or just text/call us) and pick the prep items you want. We schedule them around your pickup time so your rig is ready to roll when you arrive.",
  },
  {
    q: "Is the lot secured?",
    a: "Yes. Fenced perimeter with lighting and cameras. The lot is right behind Owens Meat Market on St Rd 15 — high visibility from the road.",
  },
  {
    q: "Can I access my RV anytime?",
    a: "During business hours, just stop by. After-hours access can be arranged in advance — call Joe and he’ll work it out.",
  },
  {
    q: "Do you offer covered storage?",
    a: "Not at this time. All storage is outdoor. We do offer optional tarps and tire covers as a paid service.",
  },
  {
    q: "What about long-term winter storage?",
    a: "Most of our snowbird customers store from November through March. We bundle winterize + spring de-winterize at a flat rate for those packages.",
  },
  {
    q: "How do I pay?",
    a: "Monthly auto-pay from your portal via card or ACH, or write a check at the office. Whatever works for you.",
  },
];

export default function StoragePage() {
  return (
    <>
      <section className="border-b bg-radial-grid">
        <div className="container-wide grid gap-12 py-16 md:grid-cols-[1.1fr_1fr] md:items-center md:py-24">
          <div>
            <Badge className="bg-primary/10 text-primary">RV & Boat Storage</Badge>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Store it here. <span className="text-primary">Drive away ready.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Secured outdoor storage just off St Rd 15 in Leesburg — plus the
              only on-site shop that preps your rig before every trip.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact?topic=storage">
                  Reserve a spot <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`tel:${BUSINESS.phoneRaw}`}>Call {BUSINESS.phone}</a>
              </Button>
            </div>
          </div>
          <Card className="border-2 border-foreground/5 bg-background shadow-xl">
            <CardContent className="grid gap-5 p-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <KeyRound className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm font-semibold">What sets us apart</div>
                  <div className="text-xs text-muted-foreground">
                    The pickup-prep service customers can&apos;t stop talking about
                  </div>
                </div>
                <Badge variant="success" className="ml-auto">Included with notice</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {prepAddOns.map((row) => (
                  <div key={row.l} className="flex items-center gap-2 rounded-md border bg-secondary/30 px-3 py-2">
                    <span className="text-primary">{row.icon}</span>
                    <span className="text-sm font-medium">{row.l}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Mix and match — only request what you need.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b">
        <div className="container-wide py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Pricing
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Straightforward monthly rates
            </h2>
            <p className="mt-3 text-muted-foreground">
              No setup fees. No long-term contracts. Discounts on prepaid 6 and
              12-month terms.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t) => (
              <Card key={t.name} className="flex flex-col border-2 transition-shadow hover:shadow-md">
                <CardContent className="flex flex-1 flex-col p-6">
                  <Badge variant={t.color} className="w-fit">{t.badge}</Badge>
                  <h3 className="mt-3 text-lg font-semibold">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${t.price}</span>
                    <span className="text-sm text-muted-foreground">/ month</span>
                  </div>
                  <ul className="mt-4 grid gap-2 text-sm">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-6 w-full">
                    <Link href={`/contact?topic=storage&tier=${encodeURIComponent(t.name)}`}>
                      Get this spot
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b bg-secondary/30">
        <div className="container-wide grid gap-10 py-20 md:grid-cols-2">
          <div>
            <Badge className="bg-primary/10 text-primary">FAQ</Badge>
            <h2 className="mt-3 font-display text-3xl font-bold">Storage questions, answered</h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Anything else, just call. Joe answers the phone whenever he&apos;s
              not under a slide-out.
            </p>
            <div className="mt-6 flex items-center gap-2 rounded-lg border bg-background p-4">
              <ShieldCheck className="h-5 w-5 text-success" />
              <p className="text-sm">
                Fully insured. Garage liability + customer rig coverage.
              </p>
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, idx) => (
                  <AccordionItem key={f.q} value={`item-${idx}`}>
                    <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b">
        <div className="container-wide grid gap-10 py-16 md:grid-cols-[1fr_420px] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Reserve your spot</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Tell us what you&apos;ve got and when you need a spot. We&apos;ll
              confirm availability and walk you through next steps.
            </p>
          </div>
          <Card>
            <CardContent className="p-6">
              <LeadForm compact />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
