"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { BUSINESS } from "@/lib/business";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/storage", label: "Storage" },
  { href: "/about", label: "About Joe" },
  { href: "/contact", label: "Contact" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-lg">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label="JSC RV Repair home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            {BUSINESS.phone}
          </a>
          <Button asChild>
            <Link href="/login">Customer Login</Link>
          </Button>
        </div>
        <button
          className="rounded-md p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div
        className={cn(
          "border-t bg-background md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="container-wide flex flex-col gap-1 py-3">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {n.label}
            </Link>
          ))}
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold"
          >
            <Phone className="h-4 w-4 text-primary" />
            {BUSINESS.phone}
          </a>
          <Button asChild className="mt-2">
            <Link href="/login" onClick={() => setOpen(false)}>
              Customer Login
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
