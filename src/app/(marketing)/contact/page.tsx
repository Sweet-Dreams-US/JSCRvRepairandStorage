import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Eyebrow } from "@/components/marketing/atoms/eyebrow";
import { OrnamentalRule } from "@/components/marketing/atoms/ornamental-rule";
import { Reveal } from "@/components/marketing/atoms/reveal";
import { StampBadge } from "@/components/marketing/atoms/stamp-badge";
import { WordReveal } from "@/components/marketing/atoms/word-reveal";
import { LeadForm } from "@/components/marketing/lead-form";
import { BUSINESS, formatAddressLine } from "@/lib/business";

export const metadata = { title: "Contact Joe" };

/** Map a ?topic= (and optional tier/rental) into a preselected interest + prefilled note. */
function presetFromTopic(sp: { topic?: string; tier?: string; rental?: string }): {
  defaultInterest: string;
  presetNote?: string;
} {
  switch (sp.topic) {
    case "plan":
      return {
        defaultInterest: "plan",
        presetNote: "I'm interested in the Camper's Care Plan (storage + service). ",
      };
    case "storage":
      return {
        defaultInterest: "storage",
        presetNote: sp.tier
          ? `I'd like to reserve a storage spot — ${sp.tier}. `
          : "I'd like to reserve a storage spot. ",
      };
    case "boat-storage":
      return {
        defaultInterest: "storage",
        presetNote: "I'd like to store my boat with you. ",
      };
    case "rental":
      return {
        defaultInterest: "rental",
        presetNote: sp.rental
          ? `I'm interested in renting the ${sp.rental}. `
          : "I'm interested in an RV rental. ",
      };
    case "maintenance":
      return { defaultInterest: "maintenance" };
    case "repair":
      return { defaultInterest: "repair" };
    default:
      return { defaultInterest: "repair" };
  }
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; tier?: string; rental?: string }>;
}) {
  const sp = await searchParams;
  const { defaultInterest, presetNote } = presetFromTopic(sp);

  return (
    <>
      {/* ──────────── HERO ──────────── */}
      <section className="relative overflow-hidden bg-cream bg-grain">
        <div className="container-bleed grid gap-12 pt-14 pb-16 lg:grid-cols-12 lg:gap-16 lg:pt-20 lg:pb-24">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow number="Front Desk">Hours · Mon–Fri · 8a – 5p</Eyebrow>
            </Reveal>
            <h1 className="mt-7 font-display text-[clamp(3rem,7.5vw,7rem)] font-bold leading-[0.94] tracking-tight">
              <WordReveal text="Let's get" />
              <br />
              <WordReveal text="your rig" delay={0.15} />
              <br />
              <WordReveal text="sorted." delay={0.3} accent={["sorted."]} swash={["sorted."]} italic={["sorted."]} />
            </h1>
            <Reveal delay={0.7}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/75">
                Fastest reply is by phone — Joe usually answers. If we&apos;re
                under a slide-out, leave a message or drop the form to the right
                and we&apos;ll call back same day.
              </p>
            </Reveal>

            <Reveal delay={0.85}>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <ContactCard
                  icon={<Phone />}
                  label="Call us"
                  line1={BUSINESS.phone}
                  line2="Mon–Fri 8a – 5p"
                  href={`tel:${BUSINESS.phoneRaw}`}
                />
                <ContactCard
                  icon={<Mail />}
                  label="Email Joe"
                  line1={BUSINESS.email}
                  line2="Replies within 1 business day"
                  href={`mailto:${BUSINESS.email}`}
                />
                <ContactCard
                  icon={<MapPin />}
                  label="Visit the shop"
                  line1={formatAddressLine()}
                  line2={BUSINESS.address.landmark}
                  href="https://maps.google.com/?q=6283+N+St+Rd+15+Leesburg+IN"
                  external
                />
                <ContactCard
                  icon={<Clock />}
                  label="Hours"
                  line1="Mon–Fri · 8:00 – 5:00"
                  line2="Sat by appointment · Sun closed"
                />
              </div>
            </Reveal>

            <Reveal delay={0.95} className="mt-10">
              <div className="border-2 border-ink/85 bg-paper p-6">
                <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                      Service Area
                    </div>
                    <p className="mt-2 font-display text-lg leading-tight">
                      Serving the <span className="italic text-garage">Kosciusko &amp; Elkhart County</span> area
                    </p>
                    <p className="mt-1 text-xs text-ink/65">{BUSINESS.serviceArea}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={BUSINESS.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink/85 hover:bg-ink hover:text-cream"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href={BUSINESS.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink/85 hover:bg-ink hover:text-cream"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.3} y={48}>
              <div className="relative">
                <div className="absolute -inset-3 border-2 border-ink/15" />
                <div className="relative bg-paper p-7 shadow-[12px_12px_0_var(--garage)]">
                  <div className="flex items-start justify-between gap-3 border-b border-dashed border-ink/30 pb-5">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
                        Service Request · No. SR-01
                      </div>
                      <div className="mt-1 font-display text-xl font-semibold">
                        Send a request
                      </div>
                    </div>
                    <StampBadge variant="garage" rotation={6}>
                      24h reply
                    </StampBadge>
                  </div>
                  <div className="mt-6">
                    <LeadForm defaultInterest={defaultInterest} presetNote={presetNote} />
                  </div>
                </div>
                <div className="absolute -bottom-4 left-4 -rotate-3">
                  <StampBadge variant="ink" rotation={-2}>
                    No bots · No spam · Real humans
                  </StampBadge>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="container-wide pb-16">
        <OrnamentalRule variant="compass" className="text-ink/30" />
      </div>
    </>
  );
}

function ContactCard({
  icon,
  label,
  line1,
  line2,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  line1: string;
  line2: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <div className="group h-full border-2 border-ink/85 bg-paper p-5 transition-all hover:-translate-y-0.5 hover:border-garage hover:shadow-[4px_4px_0_var(--ink)]">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-cream group-hover:bg-garage [&_svg]:size-3.5">
          {icon}
        </span>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
            {label}
          </div>
          <div className="mt-1 font-display text-base font-semibold leading-tight">{line1}</div>
          <div className="mt-0.5 text-xs text-ink/55">{line2}</div>
        </div>
      </div>
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block h-full"
      >
        {inner}
      </a>
    );
  }
  return inner;
}
