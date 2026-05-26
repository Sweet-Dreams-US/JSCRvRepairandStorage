"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileText,
  Home,
  LineChart,
  MapPinned,
  MessageSquare,
  Sparkles,
  Truck,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
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
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-secondary/30 md:flex md:flex-col">
      <div className="border-b px-4 py-4">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <Badge variant="muted" className="mt-2 capitalize">
          {brand === "admin" ? "Admin Console" : "Customer Portal"}
        </Badge>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/portal" && item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = ICONS[item.icon] ?? Home;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
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
                        active ? "bg-white/20 text-white" : "bg-primary/15 text-primary",
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
      </nav>
      <div className="border-t p-3 text-xs text-muted-foreground">
        <div className="font-semibold text-foreground">Need help?</div>
        <div className="mt-0.5">Call Joe: (574) 453-1573</div>
      </div>
    </aside>
  );
}
