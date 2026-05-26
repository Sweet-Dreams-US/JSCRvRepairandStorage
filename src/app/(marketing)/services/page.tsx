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
import { Eyebrow } from "@/components/marketing/atoms/eyebrow";
import { OrnamentalRule } from "@/components/marketing/atoms/ornamental-rule";
import { Reveal, RevealGroup, RevealItem } from "@/components/marketing/atoms/reveal";
import { StampBadge } from "@/components/marketing/atoms/stamp-badge";
import { StampButton } from "@/components/marketing/atoms/stamp-button";
import { WordReveal } from "@/components/marketing/atoms/word-reveal";
import { LeadForm } from "@/components/marketing/lead-form";
import { BUSINESS } from "@/lib/business";

export const metadata = { title: "Services — RV Repair & Maintenance" };

const sections = [
  {
    n: "01",
    title: "Diagnostics & Repair",
    icon: <Wrench />,
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
    n: "02",
    title: "Routine Maintenance",
    icon: <Cog />,
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
    n: "03",
    title: "Appliances & Systems",
    icon: <Flame />,
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
    n: "04",
    title: "Body, Roof & Insurance",
    icon: <Shield />,
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
    icon: <Sparkles />,
  },
  {
    name: "Full Pre-Trip",
    price: "$385",
    blurb: "Tires, brakes, slides, seals, generator, all systems checked & signed off.",
    badge: "Peace of Mind",
    icon: <CheckCircle2 />,
  },
  {
    name: "Winterize",
    price: "$145",
    blurb: "Blow-out, antifreeze, bypass water heater, drop holding tanks.",
    badge: "Seasonal",
    icon: <Snowflake />,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ──────────── HERO ──────────── */}
      <section className="relative overflow-hidden bg-cream bg-grain">
        <div className="container-bleed grid gap-10 pt-14 pb-20 lg:grid-cols-12 lg:gap-16 lg:pt-20 lg:pb-28">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow number="No. 01">The Service Menu · Updated {new Date().getFullYear()}</Eyebrow>
            </Reveal>
            <h1 className="mt-7 font-display text-[clamp(3rem,7.5vw,7rem)] font-bold leading-[0.94] tracking-tight">
              <WordReveal text="Every wrench" />
              <br />
              <WordReveal text="you need." delay={0.2} accent={["need."]} swash={["need."]} italic={["need."]} />
              <br />
              <WordReveal text="One shop." delay={0.45} italic={["one", "shop."]} />
            </h1>
            <Reveal delay={0.8}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/75">
                We work on every make and model — Class A motorhomes through pop-ups,
                fifth wheels, toy haulers, and boats. From a five-minute fix to a
                total restoration.
              </p>
            </Reveal>
            <Reveal delay={0.9}>
              <div className="mt-8 flex flex-wrap gap-3">
                <StampButton href="/contact" variant="garage" size="lg">
                  Get a quote <ArrowRight />
                </StampButton>
                <StampButton href={`tel:${BUSINESS.phoneRaw}`} external variant="ink" size="lg">
                  Call {BUSINESS.phone}
                </StampButton>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.35} y={48}>
              <div className="relative">
                <div className="absolute -inset-3 border-2 border-ink/15" />
                <div className="relative aspect-[4/5] overflow-hidden bg-ink lg:aspect-[3/4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/wrench-hands.png"
                    alt="A technician torquing an RV slide-out hardware bolt"
                    className="h-full w-full object-cover contrast-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-cream">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-80">
                      Work order WO-1043
                    </div>
                    <div className="font-display text-xl font-semibold">Slide-out torque · in progress</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-3 rotate-6">
                  <StampBadge variant="garage" rotation={-10}>
                    Hank · Lead Tech
                  </StampBadge>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ──────────── PACKAGES ──────────── */}
      <section className="relative bg-paper bg-grain">
        <div className="container-wide py-20 lg:py-28">
          <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
            <Reveal>
              <Eyebrow number="No. 02">Flat-rate packages</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.04] tracking-tight">
                Three jobs we know <span className="italic text-garage">cold</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-sm text-sm text-ink/65">
                Common bundles at a flat rate. Anything custom — call and we&apos;ll
                quote within the day.
              </p>
            </Reveal>
          </div>

          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {packages.map((p, i) => (
              <RevealItem key={p.name}>
                <div className="group relative h-full bg-cream border-2 border-ink p-7 transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--garage)]">
                  <div className="flex items-start justify-between">
                    <span className="font-display text-5xl font-bold leading-none text-sand-dark group-hover:text-garage transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-cream [&_svg]:size-4">
                      {p.icon}
                    </span>
                  </div>
                  <StampBadge variant="ink" rotation={-3} className="mt-7">
                    {p.badge}
                  </StampBadge>
                  <h3 className="mt-3 font-display text-2xl font-semibold">{p.name}</h3>
                  <p className="mt-3 text-sm text-ink/70">{p.blurb}</p>
                  <div className="mt-6 flex items-end justify-between border-t border-ink/15 pt-4">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink/55">
                        Starts at
                      </div>
                      <div className="font-display text-3xl font-bold">{p.price}</div>
                    </div>
                    <StampButton href="/contact" variant="garage" size="md">
                      Book
                    </StampButton>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ──────────── SERVICE MENU ──────────── */}
      <section className="relative bg-cream bg-grain">
        <div className="container-wide py-20 lg:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow number="No. 03" className="justify-center">The complete menu</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-tight">
              Everything we do, <span className="italic text-garage">on one page</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="mt-12">
            <OrnamentalRule variant="stars" className="mx-auto max-w-2xl text-ink/30" />
          </Reveal>

          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2" stagger={0.1}>
            {sections.map((sec) => (
              <RevealItem key={sec.n}>
                <article className="relative h-full border-2 border-ink/85 bg-paper p-7 transition-all hover:border-garage hover:shadow-[6px_6px_0_var(--ink)]">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-4xl font-bold text-sand-dark">{sec.n}</span>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-cream [&_svg]:size-5">
                      {sec.icon}
                    </span>
                    <h3 className="font-display text-2xl font-semibold tracking-tight">{sec.title}</h3>
                  </div>
                  <p className="mt-4 text-sm text-ink/70">{sec.blurb}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {sec.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-[13px]">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-garage" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ──────────── CTA ──────────── */}
      <section className="relative bg-ink text-cream bg-grain bg-grain-strong">
        <div className="container-wide grid gap-12 py-20 lg:grid-cols-[1fr_420px] lg:items-center lg:py-28">
          <Reveal>
            <Eyebrow number="No. 04" className="text-cream/70">Not sure?</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,5rem)] font-semibold leading-[1.02] tracking-tight">
              Just describe the symptom.{" "}
              <span className="italic text-garage">We&apos;ll handle the rest.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-cream/75">
              Even a vague description — &ldquo;something&apos;s leaking from
              underneath&rdquo; — and we&apos;ll tell you what we&apos;d check,
              the ballpark, and when we could get you in.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="bg-cream p-7 text-ink shadow-[12px_12px_0_var(--garage)]">
              <LeadForm compact />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
