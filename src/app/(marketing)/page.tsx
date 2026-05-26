import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  CalendarCheck2,
  CheckCircle2,
  Droplets,
  Gauge,
  Hammer,
  KeyRound,
  MapPin,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LeadForm } from "@/components/marketing/lead-form";
import { BUSINESS, formatAddressLine } from "@/lib/business";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <StorageSpotlight />
      <HowItWorks />
      <Testimonials />
      <CtaBand />
      <ContactStrip />
    </>
  );
}

// ---------- Hero ----------
function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-radial-grid">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-[1.05fr_1fr] md:gap-16 md:py-24">
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="w-fit gap-1.5 bg-primary/10 text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Booking now for spring service & storage pickups
          </Badge>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Your rig.{" "}
            <span className="text-primary">Road-ready</span>{" "}
            whenever you are.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Locally owned RV repair, storage, and maintenance in Leesburg, Indiana.
            From a leaky slide-out to a full pre-trip prep, Joe and the crew treat
            your RV like it’s their own.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="xl">
              <Link href="/contact">
                Get a free estimate
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <a href={`tel:${BUSINESS.phoneRaw}`}>
                <Phone className="h-4 w-4" />
                {BUSINESS.phone}
              </a>
            </Button>
          </div>
          <ul className="mt-8 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "Family-owned & operated",
              "All makes & models",
              "Insurance & major repair work",
              "Pickup prep on stored RVs",
            ].map((line) => (
              <li key={line} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <HeroPanel />
      </div>
    </section>
  );
}

function HeroPanel() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-brand-gray/10 blur-2xl" />
      <Card className="overflow-hidden border-2 border-foreground/5 shadow-xl">
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-brand-gray-dark via-brand-gray to-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-shop.png"
            alt="The JSC RV Repair lot — RVs and the shop"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
            <div>
              <div className="text-xs uppercase tracking-wide opacity-80">Today on the lot</div>
              <div className="text-lg font-semibold">26 RVs stored · 4 active jobs</div>
            </div>
            <Badge className="bg-success text-white">All systems go</Badge>
          </div>
        </div>
        <CardContent className="grid gap-3 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">The signature touch</div>
              <div className="text-sm text-muted-foreground">
                Tell us when you’re heading out. We’ll air the tires, charge the
                battery, top off the propane — even wash her down — so she’s ready
                to roll the second you arrive.
              </div>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <PrepTag icon={<Gauge className="h-3.5 w-3.5" />} label="Tires aired" />
            <PrepTag icon={<BatteryCharging className="h-3.5 w-3.5" />} label="Battery topped" />
            <PrepTag icon={<Droplets className="h-3.5 w-3.5" />} label="Tanks ready" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PrepTag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5 rounded-md border bg-secondary/50 px-2.5 py-1.5 text-xs font-medium">
      {icon}
      {label}
    </div>
  );
}

function RvIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="600" height="240" fill="url(#sky)" />
      {/* Mountains */}
      <path
        d="M0 180 L70 110 L130 160 L210 90 L290 170 L370 120 L460 180 L540 130 L600 170 L600 240 L0 240 Z"
        fill="rgba(255,255,255,0.07)"
      />
      {/* Road */}
      <rect x="0" y="200" width="600" height="40" fill="rgba(255,255,255,0.08)" />
      <line
        x1="0"
        y1="220"
        x2="600"
        y2="220"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
        strokeDasharray="20 14"
      />
      {/* RV body */}
      <g transform="translate(140 90)">
        <rect x="0" y="0" width="260" height="80" rx="10" fill="currentColor" />
        <path d="M260 0 Q310 0 320 35 Q325 50 320 80 L260 80 Z" fill="currentColor" />
        <rect x="10" y="14" width="44" height="34" rx="3" fill="rgba(0,0,0,0.25)" />
        <rect x="64" y="14" width="44" height="34" rx="3" fill="rgba(0,0,0,0.25)" />
        <rect x="118" y="14" width="64" height="34" rx="3" fill="rgba(0,0,0,0.25)" />
        <rect x="192" y="14" width="60" height="34" rx="3" fill="rgba(0,0,0,0.25)" />
        <rect x="0" y="62" width="320" height="18" fill="rgba(0,0,0,0.18)" />
        {/* Door */}
        <rect x="86" y="56" width="22" height="24" fill="rgba(0,0,0,0.35)" />
        {/* Wheels */}
        <circle cx="60" cy="100" r="18" fill="rgba(0,0,0,0.85)" />
        <circle cx="60" cy="100" r="7" fill="currentColor" />
        <circle cx="220" cy="100" r="18" fill="rgba(0,0,0,0.85)" />
        <circle cx="220" cy="100" r="7" fill="currentColor" />
        {/* Stripe */}
        <path d="M0 50 L260 50 L320 50 Q322 56 320 60 L0 60 Z" fill="#dc2626" opacity="0.85" />
      </g>
    </svg>
  );
}

// ---------- Trust Bar ----------
function TrustBar() {
  return (
    <section className="border-b bg-background">
      <div className="container-wide grid gap-6 py-6 text-sm md:grid-cols-4 md:gap-3">
        <TrustStat
          icon={<Star className="h-4 w-4 fill-warning text-warning" />}
          label={`${BUSINESS.rating} / 5 · ${BUSINESS.reviewCount}+ reviews`}
        />
        <TrustStat icon={<ShieldCheck className="h-4 w-4 text-success" />} label="Fully insured · garage liability" />
        <TrustStat icon={<Hammer className="h-4 w-4 text-primary" />} label={`${BUSINESS.yearsInBusiness}+ years in the shop`} />
        <TrustStat icon={<MapPin className="h-4 w-4 text-info" />} label={`Leesburg, IN · ${BUSINESS.address.landmark}`} />
      </div>
    </section>
  );
}
function TrustStat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-muted-foreground">
      {icon}
      <span className="font-medium text-foreground">{label}</span>
    </div>
  );
}

// ---------- Services ----------
function Services() {
  const items = [
    {
      icon: <Wrench className="h-5 w-5" />,
      title: "Repair",
      body:
        "Slide-outs, awnings, roofs, plumbing, electrical, appliances. Diagnostics straight talk — no upsells.",
    },
    {
      icon: <Gauge className="h-5 w-5" />,
      title: "Maintenance",
      body:
        "Seasonal service, pre-trip inspections, manufacturer-spec mileage service, winterize/de-winterize.",
    },
    {
      icon: <KeyRound className="h-5 w-5" />,
      title: "Storage",
      body:
        "Secured outdoor RV & boat storage with optional pickup-prep service before every trip.",
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Major Work",
      body:
        "Insurance claims, collision, body & fiberglass, delamination, full repaints and decal work.",
    },
  ];
  return (
    <section id="services" className="border-b">
      <div className="container-wide py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            What We Do
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            A full-service RV shop — and the only one that preps your rig before you pick it up.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.title} className="border-2 transition-all hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-6">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline" size="lg">
            <Link href="/services">
              See all services <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ---------- Storage Spotlight ----------
function StorageSpotlight() {
  return (
    <section id="storage" className="border-b bg-secondary/30">
      <div className="container-wide grid gap-12 py-20 md:grid-cols-2 md:items-center">
        <div className="space-y-5">
          <Badge className="bg-primary/10 text-primary">Why customers stay</Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Park it. Forget it. Pick it up trip-ready.
          </h2>
          <p className="text-muted-foreground">
            Joe’s rule: just give us a heads-up and we’ll have your rig ready to
            roll the day you arrive. No more scrambling the night before your
            trip wondering if the tires are flat or the battery is dead.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {BUSINESS.storageFeatures.map((f) => (
              <div key={f} className="flex items-start gap-2 rounded-lg border bg-background p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/storage">
                See storage options <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact?topic=storage">Reserve a spot</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-3 rounded-2xl border-2 border-foreground/5 bg-background p-5 shadow-lg">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <div className="text-sm font-semibold">Pickup-prep checklist</div>
              <div className="text-xs text-muted-foreground">
                Just tap what you need before your trip.
              </div>
            </div>
            <Badge variant="success">Included</Badge>
          </div>
          {[
            { l: "Tires aired to manufacturer spec", icon: <Gauge className="h-4 w-4" /> },
            { l: "House batteries tested + topped off", icon: <BatteryCharging className="h-4 w-4" /> },
            { l: "Fresh tank filled & sanitized", icon: <Droplets className="h-4 w-4" /> },
            { l: "Propane topped off (just pay fill cost)", icon: <Sparkles className="h-4 w-4" /> },
            { l: "Slides cycled & sealed", icon: <CalendarCheck2 className="h-4 w-4" /> },
            { l: "Exterior wash & dry", icon: <Sparkles className="h-4 w-4" /> },
          ].map((row) => (
            <div key={row.l} className="flex items-center gap-3 rounded-md border bg-secondary/40 px-3 py-2.5">
              <span className="text-primary">{row.icon}</span>
              <span className="text-sm font-medium">{row.l}</span>
              <CheckCircle2 className="ml-auto h-4 w-4 text-success" />
            </div>
          ))}
          <p className="pt-2 text-center text-xs text-muted-foreground">
            Request these directly from the Customer Portal once you’re a storage customer.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------- How it Works ----------
function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Reach out",
      body:
        "Call Joe, drop a message through the form, or submit a request from your portal if you’re already with us.",
    },
    {
      n: 2,
      title: "Diagnose & quote",
      body:
        "We diagnose, photograph anything important, and send you a clear written quote. No hidden line items.",
    },
    {
      n: 3,
      title: "Approve",
      body: "Approve right from your phone. We order parts and slot it into the calendar.",
    },
    {
      n: 4,
      title: "Pick it up road-ready",
      body: "We’ll text when it’s done. Tires, batteries, fluids — handled.",
    },
  ];
  return (
    <section className="border-b">
      <div className="container-wide py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</div>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            Straightforward from intake to handoff
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-xl border bg-background p-6">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary font-bold text-primary-foreground">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Testimonials ----------
function Testimonials() {
  const items = [
    {
      name: "Tom B.",
      city: "Warsaw, IN",
      body:
        "Joe is the real deal. Honest, fair, and never tries to upsell. They’ve stored our 5th wheel for four winters and we’ve never once had to mess with it on pickup day.",
    },
    {
      name: "Linda H.",
      city: "Syracuse, IN",
      body:
        "I called every shop within an hour of us. JSC was the only one that picked up the phone, gave me a real answer, and got us in that week. Slide motor fixed for less than the quote.",
    },
    {
      name: "Greg O.",
      city: "North Webster, IN",
      body:
        "Stored my Sea Ray here three seasons running. Trailer gets pulled to the front for pickup, charged, hosed off. Best decision I made.",
    },
  ];
  return (
    <section className="border-b bg-radial-grid">
      <div className="container-wide py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Customers
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
            People around the lakes trust us with their rigs.
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <Card key={t.name} className="border-2">
              <CardContent className="p-6">
                <Quote className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm leading-relaxed">{t.body}</p>
                <div className="mt-5 flex items-center gap-3 border-t pt-4">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {t.name.split(" ").map((s) => s[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.city}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- CTA Band ----------
function CtaBand() {
  return (
    <section className="border-b bg-foreground text-background">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Tell us what your rig needs — we’ll take it from there.
          </h2>
          <p className="mt-3 max-w-xl text-background/70">
            Quick form, real human reply. Joe or Tina will follow up within one
            business day with availability and a ballpark.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild variant="default" size="lg">
              <a href={`tel:${BUSINESS.phoneRaw}`}>
                <Phone className="h-4 w-4" />
                Call {BUSINESS.phone}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-background/30 bg-transparent text-background hover:bg-background/10"
            >
              <a href={`mailto:${BUSINESS.email}`}>Email Joe</a>
            </Button>
          </div>
        </div>
        <Card className="border-foreground/10 bg-background text-foreground shadow-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Send a request</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We never share your info. We never use auto-bots.
            </p>
            <div className="mt-4">
              <LeadForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ---------- Contact Strip ----------
function ContactStrip() {
  return (
    <section>
      <div className="container-wide grid gap-6 py-12 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <MapPin className="h-5 w-5 text-primary" />
            <div className="mt-3 text-sm font-semibold">Visit the shop</div>
            <p className="mt-1 text-sm text-muted-foreground">{formatAddressLine()}</p>
            <p className="text-xs text-muted-foreground">{BUSINESS.address.landmark}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Phone className="h-5 w-5 text-primary" />
            <div className="mt-3 text-sm font-semibold">Talk to Joe</div>
            <p className="mt-1 text-sm text-muted-foreground">{BUSINESS.phone}</p>
            <p className="text-xs text-muted-foreground">{BUSINESS.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <CalendarCheck2 className="h-5 w-5 text-primary" />
            <div className="mt-3 text-sm font-semibold">Shop hours</div>
            <p className="mt-1 text-sm text-muted-foreground">Mon–Fri 8:00 AM – 5:00 PM</p>
            <p className="text-xs text-muted-foreground">Saturday by appointment · Closed Sunday</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
