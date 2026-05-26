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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eyebrow } from "@/components/marketing/atoms/eyebrow";
import { OrnamentalRule } from "@/components/marketing/atoms/ornamental-rule";
import { Reveal, RevealGroup, RevealItem } from "@/components/marketing/atoms/reveal";
import { StampBadge } from "@/components/marketing/atoms/stamp-badge";
import { StampButton } from "@/components/marketing/atoms/stamp-button";
import { WordReveal } from "@/components/marketing/atoms/word-reveal";
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
  },
  {
    name: "Large Outdoor",
    price: 135,
    desc: "Fifth wheels and Class C motorhomes.",
    features: ["Powered hookup", "Wider lanes", "Pickup-prep available", "Up to 36 ft"],
    badge: "Zone B",
  },
  {
    name: "XL / Class A",
    price: 175,
    desc: "Diesel pushers, large fifth wheels, big toy haulers.",
    features: ["Powered hookup", "Drive-through access", "Pickup-prep available", "40 ft+"],
    badge: "Zone C",
  },
  {
    name: "Boat Storage",
    price: 65,
    desc: "Trailerable boats and pontoons.",
    features: ["Spring launch support", "Trailer included", "Seasonal & monthly"],
    badge: "Boat Zone",
  },
];

const prepAddOns = [
  { l: "Tires aired to spec", icon: <Gauge /> },
  { l: "Battery test & top-off", icon: <BatteryCharging /> },
  { l: "Propane fill", icon: <Zap /> },
  { l: "Fresh water sanitize & fill", icon: <Droplets /> },
  { l: "Black/grey tank dump", icon: <Droplets /> },
  { l: "Exterior wash", icon: <Sparkles /> },
  { l: "Fridge cool-down (24h)", icon: <Truck /> },
  { l: "Generator load test", icon: <Zap /> },
];

const faqs = [
  {
    q: "How does pickup-prep work?",
    a: "Tell us your trip dates (from your portal or just text) and pick the prep items. We schedule them around your pickup so your rig is ready when you arrive.",
  },
  {
    q: "Is the lot secured?",
    a: "Fenced perimeter, lighting, cameras. Behind Owens Meat Market on St Rd 15 — high visibility from the road.",
  },
  {
    q: "Can I access my RV anytime?",
    a: "During business hours just stop by. After-hours access can be arranged in advance — call Joe and he'll work it out.",
  },
  {
    q: "Do you offer covered storage?",
    a: "Not at this time. All storage is outdoor. We do offer optional tarps and tire covers as a paid add-on.",
  },
  {
    q: "What about long-term winter storage?",
    a: "Most snowbird customers store November through March. We bundle winterize + spring de-winterize at a flat rate for those packages.",
  },
  {
    q: "How do I pay?",
    a: "Monthly auto-pay from your portal via card or ACH, or write a check at the office.",
  },
];

export default function StoragePage() {
  return (
    <>
      {/* ──────────── HERO ──────────── */}
      <section className="relative overflow-hidden bg-cream bg-grain">
        <div className="container-bleed grid gap-10 pt-14 pb-20 lg:grid-cols-12 lg:gap-16 lg:pt-20 lg:pb-28">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow number="Zone A · B · C · Boat">Storage · Reserve Now</Eyebrow>
            </Reveal>
            <h1 className="mt-7 font-display text-[clamp(3rem,7.5vw,7rem)] font-bold leading-[0.94] tracking-tight">
              <WordReveal text="Store it here." />
              <br />
              <WordReveal text="Drive away ready." delay={0.25} accent={["ready."]} swash={["ready."]} italic={["ready."]} />
            </h1>
            <Reveal delay={0.8}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/75">
                Secured outdoor storage just off St. Rd. 15 in Leesburg — plus the
                only on-site shop that preps your rig before every trip.
              </p>
            </Reveal>
            <Reveal delay={0.9}>
              <div className="mt-8 flex flex-wrap gap-3">
                <StampButton href="/contact?topic=storage" variant="garage" size="lg">
                  Reserve a spot <ArrowRight />
                </StampButton>
                <StampButton href={`tel:${BUSINESS.phoneRaw}`} external variant="ink" size="lg">
                  Call {BUSINESS.phone}
                </StampButton>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.3} y={48}>
              <div className="relative">
                <div className="absolute -inset-3 border-2 border-ink/15" />
                <div className="relative aspect-[3/2] overflow-hidden bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/aerial-lot.png"
                    alt="Aerial view of the JSC RV Repair storage lot"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-cream">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-80">
                        Aerial · The Lot
                      </div>
                      <div className="font-display text-xl font-semibold">
                        32 spots · 6,283 N St Rd 15
                      </div>
                    </div>
                    <StampBadge variant="garage" rotation={-6}>
                      24 / 32 occupied
                    </StampBadge>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ──────────── PRICING ──────────── */}
      <section className="relative bg-paper bg-grain">
        <div className="container-wide py-20 lg:py-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow number="Tier Sheet" className="justify-center">Plain pricing</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-tight">
              Pick a zone. <span className="italic text-garage">That&apos;s it.</span>
            </h2>
            <p className="mt-4 text-base text-ink/70">
              No setup fees. No long contracts. Discounts on prepaid 6 and 12-month
              terms.
            </p>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {tiers.map((t, i) => (
              <RevealItem key={t.name}>
                <div className="group flex h-full flex-col border-2 border-ink bg-cream p-7 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--garage)]">
                  <div className="flex items-start justify-between">
                    <span className="font-display text-4xl font-bold text-sand-dark group-hover:text-garage transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <StampBadge variant="ink" rotation={-4}>{t.badge}</StampBadge>
                  </div>
                  <h3 className="mt-7 font-display text-2xl font-semibold">{t.name}</h3>
                  <p className="mt-2 text-sm text-ink/65">{t.desc}</p>
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="font-display text-5xl font-bold leading-none">${t.price}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                      / month
                    </span>
                  </div>
                  <ul className="mt-5 flex-1 space-y-2 text-sm">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-patina" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <StampButton
                    href={`/contact?topic=storage&tier=${encodeURIComponent(t.name)}`}
                    variant="ink"
                    size="md"
                    className="mt-7 w-full"
                  >
                    Reserve
                    <ArrowRight />
                  </StampButton>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ──────────── PICKUP PREP DETAIL ──────────── */}
      <section className="relative bg-ink text-cream bg-grain bg-grain-strong">
        <div className="container-wide grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow number="Signature" className="text-cream/70">The pickup-prep service</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-[clamp(2.4rem,5.4vw,4.8rem)] font-semibold leading-[0.98] tracking-tight">
                Tell us when. <span className="italic text-garage">We&apos;ll handle the rest.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-md text-cream/75">
                Mix and match — only request what you need. We don&apos;t charge
                for the prep service itself; only consumables (propane, dump fees,
                fuel).
              </p>
            </Reveal>
            <Reveal delay={0.25} className="mt-7">
              <ShieldCheck className="h-5 w-5 text-patina" />
              <p className="mt-2 text-sm text-cream/65">
                Fully insured · garage liability + customer rig coverage.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.2} y={32}>
              <div className="bg-cream p-8 text-ink shadow-[12px_12px_0_var(--garage)] md:p-10">
                <div className="flex items-start justify-between gap-3 border-b border-dashed border-ink/30 pb-5">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                      Service Ticket No. JSC-PRP-02
                    </div>
                    <div className="mt-1 font-display text-2xl font-semibold">
                      Prep menu — pick any
                    </div>
                  </div>
                  <KeyRound className="h-6 w-6 text-garage" />
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {prepAddOns.map((row, i) => (
                    <div
                      key={row.l}
                      className="flex items-center gap-3 border-b border-dotted border-ink/20 pb-2 last:border-0"
                    >
                      <span className="font-mono text-xs text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-sand text-ink [&_svg]:size-3.5">
                        {row.icon}
                      </span>
                      <span className="flex-1 text-sm font-medium">{row.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ──────────── FAQ ──────────── */}
      <section className="relative bg-sand/40 bg-grain">
        <div className="container-wide grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <Reveal>
            <Eyebrow number="FAQ">Storage answers</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.02] tracking-tight">
              Six things <span className="italic">people always ask.</span>
            </h2>
            <p className="mt-6 max-w-md text-ink/70">
              Anything else, just call. Joe answers the phone whenever he&apos;s
              not under a slide-out.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="border-2 border-ink/85 bg-paper p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, idx) => (
                  <AccordionItem key={f.q} value={`item-${idx}`}>
                    <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-ink/70">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──────────── CTA ──────────── */}
      <section className="relative bg-cream bg-grain">
        <div className="container-wide grid gap-10 py-20 lg:grid-cols-[1fr_420px] lg:items-center lg:py-28">
          <Reveal>
            <Eyebrow number="No. 06">Reserve</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-tight">
              Reserve your spot.{" "}
              <span className="italic text-garage">We&apos;ll confirm fast.</span>
            </h2>
            <p className="mt-6 max-w-md text-ink/70">
              Tell us what you&apos;ve got and when you need a spot. We&apos;ll
              confirm availability and walk you through next steps.
            </p>
            <OrnamentalRule variant="diamond" className="mt-9 max-w-sm text-ink/25" />
          </Reveal>
          <Reveal delay={0.2}>
            <div className="border-2 border-ink/85 bg-paper p-7 shadow-[10px_10px_0_var(--ink)]">
              <LeadForm compact />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
