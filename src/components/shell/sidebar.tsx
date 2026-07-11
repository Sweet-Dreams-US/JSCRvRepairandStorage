"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  Home,
  Inbox,
  ListTodo,
  KeyRound,
  LineChart,
  MapPinned,
  Menu,
  MessageSquare,
  Sparkles,
  Ticket,
  Truck,
  UserCog,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  inbox: Inbox,
  "list-todo": ListTodo,
  "calendar-clock": CalendarClock,
  truck: Truck,
  "calendar-check": CalendarCheck2,
  "calendar-days": CalendarDays,
  "file-text": FileText,
  "message-square": MessageSquare,
  "credit-card": CreditCard,
  "clipboard-list": ClipboardList,
  sparkles: Sparkles,
  "map-pinned": MapPinned,
  users: Users,
  "user-cog": UserCog,
  "line-chart": LineChart,
  wallet: Wallet,
  "key-round": KeyRound,
  ticket: Ticket,
};

export type SidebarItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  badge?: string | number;
};

export function Sidebar({
  items,
  brand = "portal",
}: {
  items: SidebarItem[];
  brand?: "portal" | "admin";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on Escape, lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const navList = (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/portal" &&
            item.href !== "/admin" &&
            pathname.startsWith(item.href));
        const Icon = ICONS[item.icon] ?? Home;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge !== 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-primary/15 text-primary",
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const helpBlock = (
    <div className="border-t p-3 text-xs text-muted-foreground">
      <div className="font-semibold text-foreground">Need help?</div>
      <div className="mt-0.5">Call Joe: (574) 453-1573</div>
    </div>
  );

  return (
    <>
      {/* ──────────── Mobile: floating hamburger trigger ──────────── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-nav-sheet"
        className="fixed top-3 left-3 z-30 grid h-10 w-10 place-items-center rounded-full border bg-background/95 shadow-md backdrop-blur-sm transition-colors hover:bg-accent md:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* ──────────── Mobile: backdrop ──────────── */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={cn(
          "fixed inset-0 z-30 bg-black/50 transition-opacity duration-200 md:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />

      {/* ──────────── Mobile: drop-down sheet ──────────── */}
      <div
        id="mobile-nav-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        aria-hidden={!open}
        className={cn(
          "fixed inset-x-0 top-0 z-40 flex max-h-[92vh] flex-col border-b bg-secondary/95 shadow-2xl backdrop-blur-lg transition-transform duration-300 ease-out md:hidden",
          open
            ? "translate-y-0 pointer-events-auto"
            : "-translate-y-full pointer-events-none",
        )}
      >
        {/* Sheet header: X (same coords as hamburger) + brand */}
        <div className="flex items-center justify-between gap-3 border-b bg-background/60 px-3 py-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="grid h-10 w-10 place-items-center rounded-full border bg-background shadow-sm transition-colors hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <Logo />
            <Badge variant="muted" className="capitalize">
              {brand === "admin" ? "Admin" : "Portal"}
            </Badge>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">{navList}</nav>

        {helpBlock}
      </div>

      {/* ──────────── Desktop aside (unchanged behavior) ──────────── */}
      <aside className="hidden w-60 shrink-0 border-r bg-secondary/30 md:flex md:flex-col">
        <div className="border-b px-4 py-4">
          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
          <Badge variant="muted" className="mt-2 capitalize">
            {brand === "admin" ? "Admin Console" : "Customer Portal"}
          </Badge>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">{navList}</nav>
        {helpBlock}
      </aside>
    </>
  );
}
