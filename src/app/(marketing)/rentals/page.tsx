import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  KeyRound,
  Mail,
  Phone,
  Tag,
  Users,
} from "lucide-react";
import { Eyebrow } from "@/components/marketing/atoms/eyebrow";
import { OrnamentalRule } from "@/components/marketing/atoms/ornamental-rule";
import { Reveal, RevealGroup, RevealItem } from "@/components/marketing/atoms/reveal";
import { StampBadge } from "@/components/marketing/atoms/stamp-badge";
import { StampButton } from "@/components/marketing/atoms/stamp-button";
import { WordReveal } from "@/components/marketing/atoms/word-reveal";
import { BUSINESS } from "@/lib/business";
import { store } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import type { Rental } from "@/lib/types";

export const metadata = {
  title: "RV Rentals — Travel Trailers & Motorhomes",
  description:
    "Rent one of our road-ready RVs by the night or week — perfect for a Lake Wawasee weekend or your first time behind the wheel.",
};

export default async function RentalsPage() {
  const rentals = store.publicRentals();
  return (
    <>
      {/* ──────────── HERO ──────────── */}
      <section className="relative overflow-hidden bg-cream bg-grain">
        <div className="container-bleed grid gap-10 pb-20 pt-12 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="relative z-10 flex flex-col justify-center lg:col-span-7">
            <Reveal>
              <Eyebrow number="No. 04">Borrow · don&apos;t buy · yet</Eyebrow>
            </Reveal>
            <h1 className="mt-7 font-display text-[clamp(3rem,7.5vw,7rem)] font-bold leading-[0.94] tracking-tight text-letterpress">
              <WordReveal text="Hit the lake." />
              <br />
              <WordReveal
                text="We've got"
                delay={0.15}
              />{" "}
              <WordReveal
                text="the rig."
                delay={0.3}
                accent={["the", "rig."]}
                swash={["the", "rig."]}
                italic={["the", "rig."]}
              />
            </h1>
            <Reveal delay={0.7}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/75">
                Skip the dealer. Skip the hotel. Take one of our road-ready RVs
                up to Wawasee for the weekend, or out west for the week. Honest
                pricing, friendly handoff, and Joe one call away if anything pops.
              </p>
            </Reveal>
            <Reveal delay={0.85}>
              <div className="mt-8 flex flex-wrap gap-3">
                <StampButton href="#fleet" variant="garage" size="lg">
                  {rentals.length > 0 ? "Browse the fleet" : "Get on the waitlist"}{" "}
                  <ArrowRight />
                </StampButton>
                <StampButton href={`tel:${BUSINESS.phoneRaw}`} external variant="ink" size="lg">
                  <Phone /> {BUSINESS.phone}
                </StampButton>
              </div>
            </Reveal>
            <Reveal delay={0.95}>
              <ul className="mt-10 grid gap-y-2 text-sm text-ink/70 sm:grid-cols-2 sm:gap-x-6">
                {[
                  "Walk-around at handoff · no surprises",
                  "Insurance & roadside help included",
                  "Pet-friendly options",
                  "Joe answers when you call",
                ].map((line) => (
                  <li key={line} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rotate-45 bg-garage" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="relative lg:col-span-5">
            <Reveal delay={0.3} y={48}>
              <div className="relative">
                <div className="absolute -inset-3 border-2 border-ink/15" />
                <div className="relative bg-paper p-8 shadow-[12px_12px_0_var(--garage)]">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                    Rental Voucher · Series 26
                  </div>
                  <div className="mt-3 font-display text-3xl font-bold leading-tight">
                    Out-the-door pricing.
                  </div>
                  <div className="mt-6 grid gap-3 text-sm">
                    <Row label="Nightly" value="From $145" />
                    <Row label="Weekend (2 nt min)" value="From $290" />
                    <Row label="Week (7 nt)" value="From $895" />
                    <Row label="Security deposit" value="$500–$1,000" />
                  </div>
                  <p className="mt-6 border-t border-dashed border-ink/30 pt-4 text-xs text-ink/60">
                    Pricing varies by rig. Mileage, generator, and pet fees explained
                    plainly — no surprise charges at return.
                  </p>
                </div>
                <div className="absolute -top-4 -right-3 rotate-6">
                  <StampBadge variant="garage" rotation={-10}>
                    No hidden fees
                  </StampBadge>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ──────────── FLEET — populated OR empty state ──────────── */}
      <section id="fleet" className="relative bg-paper bg-grain">
        <div className="container-wide py-20 lg:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow number="The Fleet" className="justify-center">
              {rentals.length > 0 ? `${rentals.length} rig${rentals.length === 1 ? "" : "s"} ready` : "Coming soon"}
            </Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-tight">
              {rentals.length > 0 ? (
                <>
                  Pick your <span className="italic text-garage">rig</span>.
                </>
              ) : (
                <>
                  The fleet&apos;s <span className="italic text-garage">on the way</span>.
                </>
              )}
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="mt-12">
            <OrnamentalRule variant="stars" className="mx-auto max-w-2xl text-ink/30" />
          </Reveal>

          <div className="mt-12">
            {rentals.length === 0 ? <ComingSoon /> : <FleetGrid rentals={rentals} />}
          </div>
        </div>
      </section>

      {/* ──────────── HOW IT WORKS ──────────── */}
      <section className="relative bg-cream bg-grain">
        <div className="container-wide py-20 lg:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow number="Easy" className="justify-center">
              How it works
            </Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.02] tracking-tight">
              Three steps from <span className="italic">phone call</span> to{" "}
              <span className="italic text-garage">campfire</span>.
            </h2>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-8 md:grid-cols-3" stagger={0.1}>
            {[
              {
                n: "I",
                title: "Tell us when",
                body:
                  "Call, text, or use the form. Joe holds the rig for 24 hours while we lock in dates & insurance.",
                icon: <CalendarCheck2 />,
              },
              {
                n: "II",
                title: "Walk-around handoff",
                body:
                  "Pick up at the shop. We walk you through every switch, tank, and outlet. Coffee while we go.",
                icon: <KeyRound />,
              },
              {
                n: "III",
                title: "Bring it back fueled",
                body:
                  "Drop the keys when you return. Wash & dump add-ons available — or just leave it for us.",
                icon: <Tag />,
              },
            ].map((step) => (
              <RevealItem key={step.n}>
                <div className="relative">
                  <span className="absolute -top-2 -left-1 font-display text-[7rem] font-bold leading-none text-sand-dark/30 select-none">
                    {step.n}
                  </span>
                  <div className="relative pt-12">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-cream [&_svg]:size-5">
                      {step.icon}
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-semibold">{step.title}</h3>
                    <div className="mt-3 h-px w-10 bg-garage" />
                    <p className="mt-4 text-[15px] leading-relaxed text-ink/75">{step.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ──────────── CTA STRIP ──────────── */}
      <section className="relative bg-ink text-cream bg-grain bg-grain-strong">
        <div className="container-wide grid items-center gap-10 py-20 md:grid-cols-2 lg:py-24">
          <Reveal>
            <Eyebrow number="Ready?" className="text-cream/70">
              Reserve a rig
            </Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-tight">
              Plan your trip with us.{" "}
              <span className="italic text-garage">We&apos;ll handle the rest.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-cream/75">
              Fastest way to lock in dates is by phone. Joe usually answers on the
              first ring. Otherwise drop a message and we&apos;ll call back the
              same day.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="grid gap-4">
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="group flex items-center justify-between gap-4 border-2 border-cream/20 bg-ink/40 p-6 transition-colors hover:border-garage hover:bg-garage/10"
              >
                <div className="flex items-center gap-4">
                  <Phone className="h-6 w-6 text-garage" />
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/55">
                      Call Joe
                    </div>
                    <div className="font-display text-2xl font-semibold">{BUSINESS.phone}</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-cream/30 transition-all group-hover:translate-x-1 group-hover:text-garage" />
              </a>
              <a
                href={`mailto:${BUSINESS.email}?subject=Rental%20inquiry`}
                className="group flex items-center justify-between gap-4 border-2 border-cream/20 bg-ink/40 p-6 transition-colors hover:border-garage hover:bg-garage/10"
              >
                <div className="flex items-center gap-4">
                  <Mail className="h-6 w-6 text-garage" />
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/55">
                      Email
                    </div>
                    <div className="font-display text-2xl font-semibold">{BUSINESS.email}</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-cream/30 transition-all group-hover:translate-x-1 group-hover:text-garage" />
              </a>
              <Link
                href="/contact?topic=rental"
                className="group flex items-center justify-between gap-4 border-2 border-cream/20 bg-ink/40 p-6 transition-colors hover:border-garage hover:bg-garage/10"
              >
                <div className="flex items-center gap-4">
                  <CalendarCheck2 className="h-6 w-6 text-garage" />
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/55">
                      Send a request
                    </div>
                    <div className="font-display text-2xl font-semibold">Rental inquiry form</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-cream/30 transition-all group-hover:translate-x-1 group-hover:text-garage" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ──────────── Empty state — "Coming soon" ──────────── */
function ComingSoon() {
  return (
    <Reveal>
      <div className="mx-auto max-w-3xl">
        <div className="relative border-2 border-ink bg-cream p-10 text-center md:p-14">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cream px-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-garage">
              ── Coming soon ──
            </span>
          </div>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-garage bg-garage/10">
            <KeyRound className="h-8 w-8 text-garage" />
          </div>
          <h3 className="mt-7 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Stocking the fleet.
          </h3>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink/75">
            We&apos;re prepping a small fleet of rental rigs for the {new Date().getFullYear()}{" "}
            season — travel trailers and a couple of motorhomes that go where the
            lake takes you. Want first dibs when they hit the lot?
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <StampButton href="/contact?topic=rental" variant="garage" size="lg">
              Get on the waitlist <ArrowRight />
            </StampButton>
            <StampButton href={`tel:${BUSINESS.phoneRaw}`} external variant="ink" size="lg">
              <Phone /> {BUSINESS.phone}
            </StampButton>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-dashed border-ink/20 pt-8 text-left sm:grid-cols-4">
            <Stat label="Target" value="Spring" />
            <Stat label="Rigs planned" value="4–6" />
            <Stat label="Range" value="$145+/nt" />
            <Stat label="Pickup" value="At the shop" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink/55">{label}</div>
      <div className="mt-1 font-display text-lg font-bold leading-none">{value}</div>
    </div>
  );
}

/* ──────────── Populated state — fleet grid ──────────── */
function FleetGrid({ rentals }: { rentals: Rental[] }) {
  return (
    <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
      {rentals.map((r) => (
        <RevealItem key={r.id}>
          <article className="group flex h-full flex-col border-2 border-ink bg-cream transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--garage)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-ink">
              {r.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.photoUrl}
                  alt={r.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-full place-items-center text-cream/40">
                  <KeyRound className="h-16 w-16" />
                </div>
              )}
              <div className="absolute top-3 left-3">
                {r.status === "available" ? (
                  <StampBadge variant="patina" rotation={-4}>
                    Available now
                  </StampBadge>
                ) : (
                  <StampBadge variant="ink" rotation={-4}>
                    Booked · check back
                  </StampBadge>
                )}
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                {r.type} · {r.year} {r.make}
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
                {r.name}
              </h3>
              <p className="mt-3 line-clamp-3 flex-1 text-sm text-ink/70">{r.description}</p>
              <div className="mt-5 flex items-center gap-4 border-y border-dashed border-ink/20 py-3 text-xs text-ink/60">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" /> Sleeps {r.sleeps}
                </span>
                <span>{r.length}ft</span>
                <span>{r.features.length} features</span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="font-display text-3xl font-bold tabular-nums">
                    {formatCurrency(r.nightlyRate)}
                    <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                      /night
                    </span>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">
                    {formatCurrency(r.weeklyRate)} / week
                  </div>
                </div>
                <StampButton
                  href={`/contact?topic=rental&rental=${encodeURIComponent(r.name)}`}
                  variant="garage"
                  size="md"
                >
                  Inquire <ArrowRight />
                </StampButton>
              </div>
            </div>
          </article>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-ink/20 pb-2 last:border-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">{label}</span>
      <span className="font-display text-base font-semibold tabular-nums">{value}</span>
    </div>
  );
}
