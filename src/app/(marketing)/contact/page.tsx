import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LeadForm } from "@/components/marketing/lead-form";
import { BUSINESS, formatAddressLine } from "@/lib/business";

export const metadata = { title: "Contact Joe" };

export default function ContactPage() {
  return (
    <section className="border-b bg-radial-grid">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
        <div className="space-y-7">
          <div>
            <Badge className="bg-primary/10 text-primary">Contact</Badge>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Let’s get your rig sorted.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Fastest reply is by phone — Joe usually answers. If we’re under a
              slide-out, leave a message or drop the form to the right and we’ll
              call you back same day.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ContactCard
              icon={<Phone className="h-5 w-5 text-primary" />}
              title="Call us"
              line1={BUSINESS.phone}
              line2="Mon–Fri 8a–5p"
              href={`tel:${BUSINESS.phoneRaw}`}
            />
            <ContactCard
              icon={<Mail className="h-5 w-5 text-primary" />}
              title="Email Joe"
              line1={BUSINESS.email}
              line2="Replies within 1 business day"
              href={`mailto:${BUSINESS.email}`}
            />
            <ContactCard
              icon={<MapPin className="h-5 w-5 text-primary" />}
              title="Visit the shop"
              line1={formatAddressLine()}
              line2={BUSINESS.address.landmark}
              href="https://maps.google.com/?q=6283+N+St+Rd+15+Leesburg+IN"
              external
            />
            <ContactCard
              icon={<Clock className="h-5 w-5 text-primary" />}
              title="Hours"
              line1="Mon–Fri 8:00 AM – 5:00 PM"
              line2="Sat by appointment · Sun closed"
            />
          </div>

          <Card className="border-2">
            <CardContent className="grid gap-3 p-6 md:grid-cols-3">
              <div className="text-sm md:col-span-2">
                <div className="font-semibold">We service the Kosciusko / Elkhart County area</div>
                <p className="mt-1 text-muted-foreground">{BUSINESS.serviceArea}</p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <a
                  href={BUSINESS.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border bg-background p-2 hover:bg-accent"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href={BUSINESS.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border bg-background p-2 hover:bg-accent"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Send a request</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We’ll get back to you within one business day.
            </p>
            <div className="mt-5">
              <LeadForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  title,
  line1,
  line2,
  href,
  external,
}: {
  icon: React.ReactNode;
  title: string;
  line1: string;
  line2: string;
  href?: string;
  external?: boolean;
}) {
  const Inner = (
    <Card className="h-full border-2 transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        {icon}
        <div className="mt-3 text-sm font-semibold">{title}</div>
        <div className="mt-1 text-sm">{line1}</div>
        <div className="text-xs text-muted-foreground">{line2}</div>
      </CardContent>
    </Card>
  );
  if (href) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {Inner}
      </a>
    );
  }
  return Inner;
}
