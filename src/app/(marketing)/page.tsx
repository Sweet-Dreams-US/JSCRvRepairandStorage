import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CalendarCheck2,
  CheckCircle2,
  Droplets,
  Gauge,
  KeyRound,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow } from "@/components/marketing/atoms/eyebrow";
import { Marquee } from "@/components/marketing/atoms/marquee";
import { OrnamentalRule } from "@/components/marketing/atoms/ornamental-rule";
import { Reveal, RevealGroup, RevealItem } from "@/components/marketing/atoms/reveal";
import { StampBadge } from "@/components/marketing/atoms/stamp-badge";
import { StampButton } from "@/components/marketing/atoms/stamp-button";
import { WordReveal } from "@/components/marketing/atoms/word-reveal";
import { LeadForm } from "@/components/marketing/lead-form";
import { BUSINESS, formatAddressLine } from "@/lib/business";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <Services />
      <StorageSpotlight />
      <HowItWorks />
      <Testimonials />
      <CtaBand />
      <ContactStrip />
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   HERO — editorial magazine cover
   ════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream bg-grain">
      <div className="container-bleed relative grid gap-10 pb-20 pt-12 lg:grid-cols-12 lg:gap-12 lg:py-20">
        {/* LEFT — editorial type stack */}
        <div className="relative z-10 flex flex-col justify-center lg:col-span-7">
          <Reveal delay={0.05}>
            <Eyebrow number="No. 01" className="mb-7">
              Est. {new Date().getFullYear() - BUSINESS.yearsInBusiness} · Leesburg, IN · All Makes Serviced
            </Eyebrow>
          </Reveal>

          <h1 className="font-display text-[clamp(3.5rem,9vw,8rem)] font-bold leading-[0.92] tracking-tight text-letterpress">
            <WordReveal
              text="Your rig."
              accent={[]}
              className="block"
              stagger={0.07}
              delay={0.15}
            />
            <WordReveal
              text="Road-ready"
              accent={["road-ready"]}
              swash={["road-ready"]}
              italic={["road-ready"]}
              className="mt-1 block font-medium"
              stagger={0.07}
              delay={0.32}
            />
            <WordReveal
              text="whenever you are."
              className="block"
              stagger={0.06}
              delay={0.55}
            />
          </h1>

          <Reveal delay={0.95} y={20}>
            <p className="mt-9 max-w-xl text-lg leading-relaxed text-ink/80 md:text-xl">
              Family-owned RV repair, storage &amp; maintenance just off St. Rd. 15.
              From slide-out motors to full pre-trip prep, Joe and the crew treat
              your rig like it&apos;s their own.
            </p>
          </Reveal>

          <Reveal delay={1.05}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <StampButton href="/contact" variant="garage" size="lg">
                Get a free estimate
                <ArrowRight />
              </StampButton>
              <StampButton href={`tel:${BUSINESS.phoneRaw}`} external variant="ink" size="lg">
                <Phone />
                {BUSINESS.phone}
              </StampButton>
            </div>
          </Reveal>

          <Reveal delay={1.2}>
            <ul className="mt-10 grid gap-y-2 text-sm text-ink/70 sm:grid-cols-2 sm:gap-x-6">
              {[
                "Family-owned · Joe answers",
                "Motorhomes · 5th wheels · TTs",
                "Boat storage & spring launch",
                "Insurance & major work welcome",
              ].map((line) => (
                <li key={line} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rotate-45 bg-garage" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* RIGHT — hero image with editorial border + stamp */}
        <div className="relative lg:col-span-5">
          <Reveal delay={0.3} y={48}>
            <div className="relative">
              <div className="absolute -inset-3 border-2 border-ink/15 md:-inset-5" />
              <div className="relative aspect-[4/5] overflow-hidden bg-ink lg:aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/hero-shop.png"
                  alt="The JSC RV Repair lot in Leesburg, Indiana"
                  className="h-full w-full object-cover saturate-90 contrast-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-cream">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-80">
                      Plate No. 6283
                    </div>
                    <div className="font-display text-xl font-semibold">
                      The Lot · St. Rd. 15
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] opacity-90">
                    <span className="h-1.5 w-1.5 rounded-full bg-patina animate-soft-pulse" />
                    Open Now
                  </span>
                </div>
              </div>
              <div className="absolute -top-4 -right-3 rotate-6 md:-top-6 md:-right-5">
                <StampBadge variant="garage" rotation={-12}>
                  ★ {BUSINESS.rating} / 5 · {BUSINESS.reviewCount}+
                </StampBadge>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   TICKER — signature mileage marquee
   ════════════════════════════════════════════════════════════ */
function Ticker() {
  const items = [
    "MILE 6,283 N ST RD 15",
    `LEESBURG · IN ${BUSINESS.address.zip}`,
    `EST ${new Date().getFullYear() - BUSINESS.yearsInBusiness}`,
    "RV · BOAT STORAGE OPEN",
    `★ ${BUSINESS.rating} / 5 · ${BUSINESS.reviewCount}+ REVIEWS`,
    "MOTORHOMES · 5TH WHEELS · TRAVEL TRAILERS",
    "BOATS · PONTOONS · CRUISERS WELCOME",
    "KOSCIUSKO & ELKHART COUNTY",
    "BOOKING SPRING LAUNCH NOW",
  ];
  return (
    <div className="relative border-y-2 border-ink bg-ink text-cream">
      <Marquee
        className="py-4 font-mono text-xs uppercase tracking-[0.28em]"
        items={items.map((s) => (
          <span key={s} className="whitespace-nowrap">{s}</span>
        ))}
      />
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SERVICES — numbered service plates
   ════════════════════════════════════════════════════════════ */
function Services() {
  const items = [
    {
      n: "01",
      icon: <Wrench />,
      title: "Repair",
      body:
        "Slide-outs, awnings, roofs, plumbing, electrical, appliances. Diagnosed straight, fixed right.",
    },
    {
      n: "02",
      icon: <Gauge />,
      title: "Maintenance",
      body:
        "Seasonal service, pre-trip inspections, manufacturer-spec mileage service, winterize & de-winterize.",
    },
    {
      n: "03",
      icon: <KeyRound />,
      title: "RV & Boat Storage",
      body:
        "Secured outdoor storage for motorhomes, trailers, and boats — plus the signature pickup-prep before every trip and spring launch.",
    },
    {
      n: "04",
      icon: <Truck />,
      title: "Major Work",
      body:
        "Insurance claims, collision, body & fiberglass, delamination, full repaints and decal work.",
    },
  ];
  return (
    <section id="services" className="relative bg-paper bg-grain">
      <div className="container-wide py-24 lg:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow number="No. 02" className="justify-center">
            The Service Bureau
          </Eyebrow>
          <h2 className="mt-7 font-display text-[clamp(2.5rem,5.2vw,4.5rem)] font-semibold leading-[1.02] tracking-tight">
            Every wrench you need.{" "}
            <span className="italic text-garage">One shop.</span>
          </h2>
          <p className="mt-5 text-lg text-ink/70">
            We work on every make and model — and we&apos;re the only ones around
            here that prep your rig before you pick it up.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <RevealItem key={item.n}>
              <ServicePlate {...item} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.3} className="mt-12 flex justify-center">
          <StampButton href="/services" variant="ink" size="md">
            See the full menu
            <ArrowRight />
          </StampButton>
        </Reveal>
      </div>
    </section>
  );
}

function ServicePlate({
  n,
  icon,
  title,
  body,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="group relative h-full overflow-hidden border-2 border-ink bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--ink)]">
      <div className="flex items-start justify-between">
        <span className="font-display text-5xl font-bold leading-none text-sand-dark transition-colors group-hover:text-garage">
          {n}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-cream [&_svg]:size-4">
          {icon}
        </span>
      </div>
      <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight">{title}</h3>
      <div className="mt-3 h-px w-12 bg-garage" />
      <p className="mt-4 text-sm leading-relaxed text-ink/75">{body}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   STORAGE SPOTLIGHT — the differentiator, with typewriter list
   ════════════════════════════════════════════════════════════ */
function StorageSpotlight() {
  const prep = [
    { l: "Tires aired to spec", icon: <Gauge /> },
    { l: "Battery test & top-off", icon: <BatteryCharging /> },
    { l: "Fresh tank filled & sanitized", icon: <Droplets /> },
    { l: "Propane topped off", icon: <Sparkles /> },
    { l: "Slides cycled & sealed", icon: <CalendarCheck2 /> },
    { l: "Exterior wash & dry", icon: <Sparkles /> },
  ];
  return (
    <section id="storage" className="relative bg-ink text-cream bg-grain bg-grain-strong">
      <div className="container-wide grid gap-14 py-24 lg:grid-cols-12 lg:gap-16 lg:py-32">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow number="No. 03" className="text-cream/70">
              Why customers stay
            </Eyebrow>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-[clamp(2.5rem,5.8vw,5.5rem)] font-semibold leading-[0.98] tracking-tight">
              Park it.{" "}
              <span className="italic text-sand-dark">Forget it.</span>{" "}
              Pick it up <span className="text-garage">trip-ready.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-7 max-w-lg text-lg text-cream/75">
              Joe&apos;s rule: just give us a heads-up before your trip and your
              rig will be aired, charged, topped off, and washed the day you
              arrive. <span className="font-display italic text-cream">Boats too</span> — winter haul-in, spring launch handled.
            </p>
          </Reveal>

          <Reveal delay={0.3} className="mt-10">
            <div className="flex flex-wrap items-center gap-4">
              <StampButton href="/storage" variant="garage" size="lg">
                See storage options
                <ArrowRight />
              </StampButton>
              <StampButton
                href="/contact?topic=storage"
                variant="cream"
                size="lg"
                className="border-cream bg-transparent text-cream hover:bg-cream hover:text-ink"
              >
                Reserve a spot
              </StampButton>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={0.2} y={48}>
            <div className="relative">
              <div className="absolute -inset-3 border-2 border-cream/15" />
              <div className="relative bg-cream p-7 text-ink shadow-[12px_12px_0_var(--garage)] md:p-10">
                <div className="flex items-start justify-between gap-3 border-b border-ink/15 pb-5">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                      Service Ticket No. JSC-PRP-01
                    </div>
                    <div className="mt-1 font-display text-2xl font-semibold">
                      Pickup-Prep Checklist
                    </div>
                  </div>
                  <StampBadge variant="garage" rotation={6}>
                    Included
                  </StampBadge>
                </div>
                <ul className="mt-6 grid gap-3">
                  {prep.map((row, i) => (
                    <li
                      key={row.l}
                      className="flex items-center gap-4 border-b border-dashed border-ink/15 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="font-mono text-xs text-ink/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-sand text-ink [&_svg]:size-3.5">
                        {row.icon}
                      </span>
                      <span className="flex-1 text-[15px] font-medium">{row.l}</span>
                      <CheckCircle2 className="h-4 w-4 text-patina" />
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50">
                  Request from your portal · 48 hours notice
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   HOW IT WORKS — engraved ritual plates
   ════════════════════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    { n: "I", title: "Reach out", body: "Call Joe, drop a message, or submit from your portal." },
    { n: "II", title: "Diagnose & quote", body: "We diagnose, photograph, send a clear written quote." },
    { n: "III", title: "Approve", body: "Approve from your phone. Parts ordered, slot on the calendar." },
    { n: "IV", title: "Pick it up ready", body: "We text when it's done. Tires, batteries, fluids — handled." },
  ];
  return (
    <section className="relative bg-cream bg-grain">
      <div className="container-wide py-24 lg:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow number="No. 04" className="justify-center">
            The Ritual
          </Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,5.2vw,4.5rem)] font-semibold leading-[1.02] tracking-tight">
            Straightforward from <span className="italic">intake to handoff</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          <OrnamentalRule variant="diamond" className="mx-auto max-w-3xl text-ink/30" />
        </Reveal>

        <RevealGroup className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <RevealItem key={s.n}>
              <div className="relative">
                <span className="absolute -top-2 -left-1 font-display text-[8rem] font-bold leading-none text-sand-dark/40 select-none">
                  {s.n}
                </span>
                <div className="relative pt-10">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-garage">
                    Step {i + 1} of 4
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold">{s.title}</h3>
                  <div className="mt-3 h-px w-10 bg-ink/30" />
                  <p className="mt-4 text-[15px] leading-relaxed text-ink/75">{s.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   TESTIMONIALS — field reports / handwritten cards
   ════════════════════════════════════════════════════════════ */
function Testimonials() {
  const items = [
    {
      name: "Tom B.",
      city: "Warsaw, IN",
      body:
        "Joe is the real deal. Honest, fair, never tries to upsell. They've stored our 5th wheel for four winters — never once had to mess with it on pickup day.",
    },
    {
      name: "Linda H.",
      city: "Syracuse, IN",
      body:
        "Called every shop within an hour. JSC was the only one that picked up, gave a real answer, and got us in that week. Slide motor fixed for less than the quote.",
    },
    {
      name: "Greg O.",
      city: "North Webster, IN",
      body:
        "Stored my Sea Ray here three seasons running. Trailer gets pulled to the front for pickup, charged, hosed off. Best decision I've made on the lake.",
    },
  ];
  return (
    <section className="relative bg-sand/40 bg-grain">
      <div className="container-wide py-24 lg:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow number="No. 05" className="justify-center">
            Field Reports
          </Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,5.2vw,4.5rem)] font-semibold leading-[1.02] tracking-tight">
            People around the lakes <span className="italic text-garage">trust us</span> with their rigs.
          </h2>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 md:grid-cols-3" stagger={0.12}>
          {items.map((t, i) => (
            <RevealItem key={t.name}>
              <article
                className="relative h-full bg-paper p-8 shadow-[8px_8px_0_rgba(26,22,20,0.85)]"
                style={{ transform: `rotate(${[-1.4, 0.8, -0.6][i]}deg)` }}
              >
                <div className="absolute -top-3 left-6 flex items-center gap-1 bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60">
                  <Star className="h-3 w-3 fill-brass text-brass" />
                  <Star className="h-3 w-3 fill-brass text-brass" />
                  <Star className="h-3 w-3 fill-brass text-brass" />
                  <Star className="h-3 w-3 fill-brass text-brass" />
                  <Star className="h-3 w-3 fill-brass text-brass" />
                </div>
                <p className="font-display text-xl italic leading-snug text-ink">
                  &ldquo;{t.body}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-ink/15 pt-5">
                  <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink font-display text-sm font-bold">
                    {t.name.replace(".", "").split(" ").map((s) => s[0]).join("")}
                  </div>
                  <div>
                    <div className="font-display text-base font-semibold">{t.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                      {t.city}
                    </div>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   CTA BAND — tear-off service ticket
   ════════════════════════════════════════════════════════════ */
function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-ink text-cream bg-grain bg-grain-strong">
      <div className="container-wide grid gap-12 py-24 lg:grid-cols-12 lg:gap-16 lg:py-32">
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow number="No. 06" className="text-cream/70">
              The handshake
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-[clamp(2.8rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-tight">
              Tell us what your rig needs.{" "}
              <span className="italic text-garage">We&apos;ll take it from there.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-md text-lg text-cream/75">
              Quick form, real human reply. Joe or Tina will follow up within one
              business day with availability and a ballpark.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <StampButton
                href={`tel:${BUSINESS.phoneRaw}`}
                external
                variant="garage"
                size="lg"
              >
                <Phone />
                {BUSINESS.phone}
              </StampButton>
              <StampButton
                href={`mailto:${BUSINESS.email}`}
                external
                variant="cream"
                size="lg"
                className="border-cream bg-transparent text-cream hover:bg-cream hover:text-ink"
              >
                Email Joe
              </StampButton>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={0.25} y={32}>
            <div className="edge-perforated-top mt-2 bg-cream text-ink shadow-[12px_12px_0_var(--garage)]">
              <div className="p-7 md:p-9">
                <div className="flex items-center justify-between border-b border-dashed border-ink/30 pb-4">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                      Service Request Form
                    </div>
                    <div className="mt-1 font-display text-xl font-semibold">
                      Send to the shop
                    </div>
                  </div>
                  <StampBadge variant="ink" rotation={6}>
                    No bots · No spam
                  </StampBadge>
                </div>
                <div className="mt-6">
                  <LeadForm compact />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   CONTACT STRIP — three enameled signs
   ════════════════════════════════════════════════════════════ */
function ContactStrip() {
  return (
    <section className="bg-cream bg-grain">
      <div className="container-wide grid gap-5 py-16 md:grid-cols-3">
        <ContactSign
          icon={<MapPin />}
          label="Visit the shop"
          line1={formatAddressLine()}
          line2={BUSINESS.address.landmark}
        />
        <ContactSign
          icon={<Phone />}
          label="Talk to Joe"
          line1={BUSINESS.phone}
          line2={BUSINESS.email}
        />
        <ContactSign
          icon={<CalendarCheck2 />}
          label="Shop hours"
          line1="Mon–Fri · 8:00–5:00"
          line2="Saturday by appointment"
        />
      </div>
    </section>
  );
}

function ContactSign({
  icon,
  label,
  line1,
  line2,
}: {
  icon: React.ReactNode;
  label: string;
  line1: string;
  line2: string;
}) {
  return (
    <Reveal>
      <div className="group flex h-full items-start gap-4 border-2 border-ink/85 bg-paper p-6 transition-all hover:-translate-y-0.5 hover:border-garage hover:shadow-[4px_4px_0_var(--ink)]">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-cream group-hover:bg-garage [&_svg]:size-4">
          {icon}
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
            {label}
          </div>
          <div className="mt-1 font-display text-lg font-semibold leading-tight">
            {line1}
          </div>
          <div className="mt-1 text-sm text-ink/60">{line2}</div>
        </div>
      </div>
    </Reveal>
  );
}
