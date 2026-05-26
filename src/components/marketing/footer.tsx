import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { OrnamentalRule } from "@/components/marketing/atoms/ornamental-rule";
import { StampBadge } from "@/components/marketing/atoms/stamp-badge";
import { BUSINESS, formatAddressLine } from "@/lib/business";

export function MarketingFooter() {
  return (
    <footer className="relative bg-ink text-cream bg-grain bg-grain-strong">
      {/* Enameled top edge */}
      <div className="h-1.5 bg-garage" />

      <div className="container-wide relative grid gap-14 py-20 md:grid-cols-12">
        {/* Brand block */}
        <div className="md:col-span-5">
          <Logo invert />
          <p className="mt-6 max-w-md font-display text-xl leading-snug">
            We&apos;re your local RV service experts, here to keep your rig
            road-ready.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <a
              href={BUSINESS.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 transition-colors hover:bg-garage hover:border-garage"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={BUSINESS.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 transition-colors hover:bg-garage hover:border-garage"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <StampBadge variant="brass" rotation={4} className="ml-3 border-brass/60 text-brass">
              ★ {BUSINESS.rating} · {BUSINESS.reviewCount}+
            </StampBadge>
          </div>
        </div>

        {/* Nav */}
        <div className="md:col-span-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream/60">
            ── Explore ──
          </div>
          <ul className="mt-4 grid gap-2.5 text-sm">
            <FooterLink href="/services">Services</FooterLink>
            <FooterLink href="/storage">Storage</FooterLink>
            <FooterLink href="/about">About Joe</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/login">Customer Portal</FooterLink>
          </ul>
        </div>

        {/* Contact card — looks like an enameled service plate */}
        <div className="md:col-span-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream/60">
            ── Visit the shop ──
          </div>
          <ul className="mt-4 grid gap-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-garage shrink-0" />
              <span>
                {formatAddressLine()}
                <br />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/50">
                  {BUSINESS.address.landmark}
                </span>
              </span>
            </li>
            <li>
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="flex items-center gap-3 hover:text-garage"
              >
                <Phone className="h-4 w-4 text-garage" />
                {BUSINESS.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="flex items-center gap-3 hover:text-garage"
              >
                <Mail className="h-4 w-4 text-garage" />
                {BUSINESS.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-wide pb-10">
        <OrnamentalRule variant="compass" className="text-cream/30 mb-8" />
        <div className="flex flex-col items-start justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/55 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} JSC RV Repair · All rights reserved</span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-garage" />
            Stamped &amp; serviced in Leesburg, Indiana — Est {new Date().getFullYear() - BUSINESS.yearsInBusiness}
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-cream/85 transition-colors hover:text-garage"
      >
        <span className="font-mono text-[10px] text-cream/30 transition-colors group-hover:text-garage">
          ▸
        </span>
        {children}
      </Link>
    </li>
  );
}
