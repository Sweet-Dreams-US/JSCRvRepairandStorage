import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { BUSINESS, formatAddressLine } from "@/lib/business";

export function MarketingFooter() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container-wide grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            {BUSINESS.about}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={BUSINESS.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border bg-background p-2 transition-colors hover:bg-accent"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={BUSINESS.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border bg-background p-2 transition-colors hover:bg-accent"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/services" className="hover:text-primary">Services</Link></li>
            <li><Link href="/storage" className="hover:text-primary">Storage</Link></li>
            <li><Link href="/about" className="hover:text-primary">About Joe</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/login" className="hover:text-primary">Customer Portal</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Visit Us</h3>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <span>
                {formatAddressLine()}
                <br />
                <span className="text-xs">{BUSINESS.address.landmark}</span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${BUSINESS.phoneRaw}`} className="hover:text-primary">{BUSINESS.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-primary">{BUSINESS.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t bg-secondary/40">
        <div className="container-wide flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</span>
          <span>Serving Kosciusko & Elkhart counties since {new Date().getFullYear() - BUSINESS.yearsInBusiness}.</span>
        </div>
      </div>
    </footer>
  );
}
