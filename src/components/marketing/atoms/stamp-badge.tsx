import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  rotation?: number;
  variant?: "garage" | "ink" | "patina" | "brass";
};

const variantClass = {
  garage: "border-garage text-garage",
  ink: "border-ink text-ink",
  patina: "border-patina text-patina",
  brass: "border-brass text-brass",
};

/**
 * Rotated stamp badge — looks like a hand-pressed service stamp.
 * Used for "STAMPED MAY 2026", "EST 2018", "★ APPROVED" callouts.
 */
export function StampBadge({ children, className, rotation = -8, variant = "ink" }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border-2 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] opacity-90",
        variantClass[variant],
        className,
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {children}
    </span>
  );
}
