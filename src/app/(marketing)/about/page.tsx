import Link from "next/link";
import { ArrowRight, Award, Hammer, Handshake, Heart, Users, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BUSINESS } from "@/lib/business";

export const metadata = { title: "About Joe & the Shop" };

const values = [
  {
    icon: <Handshake className="h-5 w-5" />,
    title: "Tell it straight",
    body:
      "We’ll tell you what we found, what we’d do about it, and what we’d leave alone. No mystery line items.",
  },
  {
    icon: <Hammer className="h-5 w-5" />,
    title: "Fix it right",
    body:
      "If we can’t fix it right, we’ll tell you who can. We don’t take on work that’s beyond our shop.",
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: "Treat it like ours",
    body:
      "We park your rig where we park ours. We wash our hands before we step inside. Small things, every time.",
  },
];

const crew = [
  { name: "Joe Crawford", role: "Owner, Master Tech" },
  { name: "Tina Hartwell", role: "Office Manager" },
  { name: "Marcus “Hank” Henderson", role: "Lead Tech (appliances + generators)" },
  { name: "Daniel Klingsmith", role: "Tech (plumbing + slides)" },
  { name: "Eddie Brooks", role: "Yard & Prep Tech" },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b bg-radial-grid">
        <div className="container-wide grid gap-10 py-16 md:grid-cols-[1.1fr_1fr] md:items-center md:py-24">
          <div>
            <Badge className="bg-primary/10 text-primary">About</Badge>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Hi, I’m Joe.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              I’ve been turning wrenches on RVs since I bought my first project
              trailer in college. JSC RV Repair is the shop I always wished was
              around when I started: honest people, fair prices, and a real
              understanding that your RV is more than a vehicle — it’s where you
              go to slow down with the people you love.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">
                  Come say hi <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/services">See what we do</Link>
              </Button>
            </div>
          </div>
          <Card className="overflow-hidden border-2 border-foreground/5 shadow-xl">
            <CardContent className="grid gap-5 p-6">
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Years" value={`${BUSINESS.yearsInBusiness}+`} />
                <Stat label="RVs serviced" value="1,200+" />
                <Stat label="Reviews" value={`${BUSINESS.rating}★`} />
              </div>
              <div className="grid gap-3 border-t pt-5">
                <div className="text-sm font-semibold">Meet the crew</div>
                {crew.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between rounded-md border bg-secondary/30 px-3 py-2"
                  >
                    <span className="text-sm font-medium">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.role}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b">
        <div className="container-wide py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              How we work
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Three things you’ll never have to wonder about
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((v) => (
              <Card key={v.title} className="border-2">
                <CardContent className="p-6">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
                    {v.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b bg-foreground text-background">
        <div className="container-wide grid gap-8 py-16 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Built on the lakes. Built for the lakes.
            </h2>
            <p className="mt-3 max-w-xl text-background/70">
              Born and raised in Kosciusko County, we know the routes you take,
              the parks you frequent, and the storms that roll through Lake
              Wawasee in August. We’re your shop because we’re your neighbors.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-background text-foreground">
              <CardContent className="p-5">
                <Award className="h-5 w-5 text-primary" />
                <div className="mt-3 text-sm font-semibold">RVDA & NRVTA trained</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ongoing certification across the major systems we service.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background text-foreground">
              <CardContent className="p-5">
                <Users className="h-5 w-5 text-primary" />
                <div className="mt-3 text-sm font-semibold">Family run</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Joe answers the phone. Tina runs the front. Hank, Danny, and
                  Eddie are in the shop daily.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background text-foreground">
              <CardContent className="p-5">
                <Wrench className="h-5 w-5 text-primary" />
                <div className="mt-3 text-sm font-semibold">Full service</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Repair, storage, prep, and insurance work — all under one roof.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-background text-foreground">
              <CardContent className="p-5">
                <Heart className="h-5 w-5 text-primary" />
                <div className="mt-3 text-sm font-semibold">Local for life</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sponsoring the Leesburg 4th of July parade since 2018.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-secondary/30 p-3 text-center">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
