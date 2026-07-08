import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Flame,
  Gauge,
  KeyRound,
  PlugZap,
  ShieldCheck,
  Snowflake,
  Truck,
  Wind,
} from "lucide-react";
import { Eyebrow } from "@/components/marketing/atoms/eyebrow";
import { Reveal } from "@/components/marketing/atoms/reveal";
import { StampButton } from "@/components/marketing/atoms/stamp-button";

type Line = { icon: React.ReactNode; label: string; note?: string };

const restCare: Line[] = [
  { icon: <KeyRound />, label: "Secured storage on our lot", note: "Fenced, lit, cameras" },
  { icon: <Snowflake />, label: "Winterization done right", note: "Lines blown, antifreeze, bypass" },
  { icon: <BatteryCharging />, label: "Inside battery storage", note: "Warm & tended all winter" },
  { icon: <Wind />, label: "One A/C service", note: "Cleaned & checked for spring" },
  { icon: <ShieldCheck />, label: "Full seal inspection", note: "Roof & seams, before leaks start" },
];

const roadReady: Line[] = [
  { icon: <Gauge />, label: "Tire inspection", note: "Tread, age, and condition" },
  { icon: <Gauge />, label: "Tire pressure set to spec", note: "Aired up before you roll" },
  { icon: <PlugZap />, label: "Plugged in — fridge cold & ready", note: "Just show up and pack" },
  { icon: <Truck />, label: "Staged for a simple pickup", note: "Pulled up front, drive-up easy" },
  { icon: <Flame />, label: "LP gas topped off", note: "On request" },
];

/**
 * The flagship "Camper's Care Plan" — a single monthly plan that bundles
 * off-season storage + service with road-ready prep. Rendered as a bold
 * ink band so it reads as the front-and-center offer on any page.
 */
export function CamperCarePlan() {
  return (
    <section
      id="care-plan"
      className="relative overflow-hidden bg-ink text-cream bg-grain bg-grain-strong"
    >
      {/* Enameled top edge */}
      <div className="h-1.5 bg-garage" />

      <div className="container-wide py-24 lg:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow number="From $65 / mo" className="justify-center text-cream/70">
            The Camper&apos;s Care Plan
          </Eyebrow>
          <h2 className="mt-7 font-display text-[clamp(2.5rem,5.4vw,4.8rem)] font-semibold leading-[1.0] tracking-tight">
            More than a parking spot.{" "}
            <span className="italic text-garage">It&apos;s peace of mind.</span>
          </h2>
          <p className="mt-6 text-lg text-cream/75">
            One monthly plan that stores your RV{" "}
            <em>and</em> keeps it camp-ready. We tuck it in for winter, look after
            it while it rests, and hand it back road-ready when the lake calls.
            It&apos;s not just storage — it&apos;s everything a camper needs.
          </p>
        </Reveal>

        {/* Two-phase plan card */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-5 lg:grid-cols-2 lg:gap-6">
          <PlanColumn
            no="01"
            tag="While it rests"
            sub="Off-season care"
            lines={restCare}
          />
          <PlanColumn
            no="02"
            tag="When you're ready to roll"
            sub="Road-ready prep"
            lines={roadReady}
          />
        </div>

        <Reveal delay={0.2} className="mt-12 flex flex-col items-center gap-4">
          <StampButton href="/contact?topic=plan" variant="garage" size="lg">
            Start your plan — from $65/mo
            <ArrowRight />
          </StampButton>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/55">
            No long contracts · Boats welcome too · Cancel anytime
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PlanColumn({
  no,
  tag,
  sub,
  lines,
}: {
  no: string;
  tag: string;
  sub: string;
  lines: Line[];
}) {
  return (
    <Reveal y={32}>
      <div className="relative h-full bg-cream p-7 text-ink shadow-[10px_10px_0_var(--garage)] md:p-9">
        <div className="flex items-start justify-between gap-3 border-b border-dashed border-ink/25 pb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
              {sub}
            </div>
            <div className="mt-1 font-display text-2xl font-semibold leading-tight">
              {tag}
            </div>
          </div>
          <span className="font-display text-4xl font-bold leading-none text-sand-dark">
            {no}
          </span>
        </div>
        <ul className="mt-6 grid gap-3.5">
          {lines.map((line) => (
            <li key={line.label} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-cream [&_svg]:size-3.5">
                {line.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-medium">
                  <span>{line.label}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-patina" />
                </div>
                {line.note && (
                  <div className="text-xs text-ink/55">{line.note}</div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
