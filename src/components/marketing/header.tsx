"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { StampButton } from "@/components/marketing/atoms/stamp-button";
import { BUSINESS } from "@/lib/business";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/services", label: "Services", n: "01" },
  { href: "/storage", label: "Storage", n: "02" },
  { href: "/about", label: "About Joe", n: "03" },
  { href: "/contact", label: "Contact", n: "04" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-ink/10 transition-all duration-300",
        scrolled ? "bg-cream/95 backdrop-blur-md shadow-[0_1px_0_rgba(26,22,20,0.08)]" : "bg-cream",
      )}
    >
      <div className="container-bleed flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label="JSC RV Repair home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="group relative flex items-center gap-2 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-garage"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 transition-colors group-hover:text-garage">
                {n.n}
              </span>
              <span>{n.label}</span>
              <span className="absolute -bottom-px left-0 h-px w-0 bg-garage transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink hover:text-garage"
          >
            <Phone className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
            <span className="border-b border-dashed border-ink/30 group-hover:border-garage">
              {BUSINESS.phone}
            </span>
          </a>
          <StampButton href="/login" variant="garage" size="md">
            Portal
          </StampButton>
        </div>

        <button
          className="rounded-md p-2 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("border-t border-ink/10 bg-cream lg:hidden", open ? "block" : "hidden")}>
        <nav className="container-wide flex flex-col gap-1 py-4">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium hover:bg-paper"
            >
              <span className="font-mono text-[10px] text-ink/40">{n.n}</span>
              {n.label}
            </Link>
          ))}
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="flex items-center gap-2 rounded-md px-3 py-3 font-mono text-xs uppercase tracking-[0.18em]"
          >
            <Phone className="h-4 w-4 text-garage" />
            {BUSINESS.phone}
          </a>
          <StampButton href="/login" variant="garage" size="md" className="mt-2 w-full">
            Open Customer Portal
          </StampButton>
        </nav>
      </div>
    </header>
  );
}
