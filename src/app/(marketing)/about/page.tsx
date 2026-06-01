import { ArrowRight, Award, Hammer, Handshake, Heart, Users, Wrench } from "lucide-react";
import { Eyebrow } from "@/components/marketing/atoms/eyebrow";
import { OrnamentalRule } from "@/components/marketing/atoms/ornamental-rule";
import { Reveal, RevealGroup, RevealItem } from "@/components/marketing/atoms/reveal";
import { StampBadge } from "@/components/marketing/atoms/stamp-badge";
import { StampButton } from "@/components/marketing/atoms/stamp-button";
import { WordReveal } from "@/components/marketing/atoms/word-reveal";
import { BUSINESS } from "@/lib/business";

export const metadata = { title: "About Joe & the Shop" };

const values = [
  {
    icon: <Handshake />,
    n: "I",
    title: "Tell it straight",
    body:
      "We tell you what we found, what we'd do, and what we'd leave alone. No mystery line items.",
  },
  {
    icon: <Hammer />,
    n: "II",
    title: "Fix it right",
    body:
      "If we can't fix it right, we'll tell you who can. We don't take on work that's beyond our shop.",
  },
  {
    icon: <Heart />,
    n: "III",
    title: "Treat it like ours",
    body:
      "We park your rig where we park ours. Wash our hands before we step inside. Small things, every time.",
  },
];

const crew = [
  { name: "Joe Crawford", role: "Owner · Master Tech", years: 8 },
  { name: "Tina Hartwell", role: "Office Manager", years: 4 },
  { name: "Marcus “Hank” Henderson", role: "Lead Tech (appliances + generators)", years: 5 },
  { name: "Daniel Klingsmith", role: "Tech (plumbing + slides)", years: 2 },
  { name: "Eddie Brooks", role: "Yard & Prep Tech", years: 1 },
];

export default function AboutPage() {
  return (
    <>
      {/* ──────────── HERO ──────────── */}
      <section className="relative overflow-hidden bg-cream bg-grain">
        <div className="container-bleed grid gap-10 pt-14 pb-16 lg:grid-cols-12 lg:gap-16 lg:pt-20 lg:pb-24">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow number="Vol. 01">A short note from the owner</Eyebrow>
            </Reveal>
            <h1 className="mt-7 font-display text-[clamp(3rem,7.5vw,7rem)] font-bold leading-[0.94] tracking-tight">
              <WordReveal text="Hi," />{" "}
              <WordReveal text="I'm" delay={0.08} />{" "}
              <WordReveal text="Joe." delay={0.14} accent={["joe."]} swash={["joe."]} italic={["joe."]} />
            </h1>
            <Reveal delay={0.6}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/80">
                I&apos;ve been turning wrenches on RVs since I bought my first
                project trailer in college. JSC RV Service is the shop I always
                wished was around when I started:{" "}
                <span className="font-display italic text-ink">
                  honest people, fair prices, and a real understanding
                </span>{" "}
                that your RV is more than a vehicle — it&apos;s where you go to
                slow down with the people you love.
              </p>
            </Reveal>
            <Reveal delay={0.75}>
              <div className="mt-8 flex flex-wrap gap-3">
                <StampButton href="/contact" variant="garage" size="lg">
                  Come say hi <ArrowRight />
                </StampButton>
                <StampButton href="/services" variant="ink" size="lg">
                  See what we do
                </StampButton>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.3} y={48}>
              <div className="relative">
                <div className="absolute -inset-3 border-2 border-ink/15" />
                <div className="relative bg-paper p-7 shadow-[10px_10px_0_var(--ink)]">
                  <div className="grid grid-cols-3 gap-3 border-b border-ink/15 pb-5">
                    <Stat label="Years" value={`${BUSINESS.yearsInBusiness}+`} />
                    <Stat label="Rigs" value="1,200+" />
                    <Stat label="Reviews" value={`${BUSINESS.rating}★`} />
                  </div>
                  <div className="mt-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                      Crew Roster · Active
                    </div>
                    <ul className="mt-3 grid gap-2">
                      {crew.map((c) => (
                        <li
                          key={c.name}
                          className="flex items-center justify-between border-b border-dotted border-ink/15 pb-2 last:border-0"
                        >
                          <div>
                            <div className="font-display text-sm font-semibold">{c.name}</div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">
                              {c.role}
                            </div>
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-garage">
                            {c.years}y
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="absolute -top-4 -left-3 -rotate-6">
                  <StampBadge variant="garage" rotation={-12}>
                    Family · Owned · Operated
                  </StampBadge>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ──────────── VALUES ──────────── */}
      <section className="relative bg-paper bg-grain">
        <div className="container-wide py-20 lg:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow number="Vol. 02" className="justify-center">House rules</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-tight">
              Three things <span className="italic text-garage">you&apos;ll never wonder about</span>.
            </h2>
          </Reveal>

          <Reveal delay={0.15} className="mt-12">
            <OrnamentalRule variant="diamond" className="mx-auto max-w-2xl text-ink/30" />
          </Reveal>

          <RevealGroup className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-3" stagger={0.12}>
            {values.map((v) => (
              <RevealItem key={v.title}>
                <div className="relative">
                  <span className="absolute -top-3 -left-1 font-display text-[7rem] font-bold leading-none text-sand-dark/35 select-none">
                    {v.n}
                  </span>
                  <div className="relative pt-10">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-cream [&_svg]:size-5">
                      {v.icon}
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-semibold">{v.title}</h3>
                    <div className="mt-3 h-px w-10 bg-garage" />
                    <p className="mt-4 text-[15px] leading-relaxed text-ink/75">{v.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ──────────── HERITAGE / LAKE PHOTO ──────────── */}
      <section className="relative bg-ink text-cream">
        <div className="container-bleed grid items-stretch gap-0 lg:grid-cols-12">
          <div className="relative aspect-[16/10] lg:col-span-7 lg:aspect-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/lake-sunset.png"
              alt="A Class A motorhome at sunset on Lake Wawasee"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/40" />
          </div>
          <div className="flex flex-col justify-center gap-7 p-10 lg:col-span-5 lg:p-14">
            <Reveal>
              <Eyebrow number="Vol. 03" className="text-cream/70">Local for life</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold leading-[1.02] tracking-tight">
                Built on the lakes.{" "}
                <span className="italic text-garage">Built for the lakes.</span>
              </h2>
              <p className="mt-6 max-w-md text-cream/80">
                Born and raised in Kosciusko County. We know the routes you take,
                the parks you frequent, and the storms that roll through Lake
                Wawasee in August. We&apos;re your shop because we&apos;re your
                neighbors.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Badge icon={<Award />} label="RVDA & NRVTA trained" />
                <Badge icon={<Users />} label="Family run · daily" />
                <Badge icon={<Wrench />} label="Full service · one roof" />
                <Badge icon={<Heart />} label="Leesburg 4th of July sponsor" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ──────────── CTA STRIP ──────────── */}
      <section className="bg-cream bg-grain py-20 text-center">
        <div className="container-tight">
          <Reveal>
            <Eyebrow number="Vol. 04" className="justify-center">Visit</Eyebrow>
            <p className="mt-6 font-display text-[clamp(2.2rem,4.5vw,3.5rem)] font-semibold leading-[1.04] tracking-tight">
              We&apos;d love to <span className="italic text-garage">meet your rig.</span>
            </p>
            <div className="mt-7 flex justify-center">
              <StampButton href="/contact" variant="garage" size="lg">
                Get in touch <ArrowRight />
              </StampButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-ink/15 px-2 text-center last:border-0">
      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink/55">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold leading-none">{value}</div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 border border-cream/20 px-3 py-2.5 text-xs">
      <span className="text-garage [&_svg]:size-3.5">{icon}</span>
      <span className="text-cream/85">{label}</span>
    </div>
  );
}
