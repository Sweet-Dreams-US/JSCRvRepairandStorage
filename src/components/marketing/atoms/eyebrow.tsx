import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Small mono-cap label above section headlines.
 * Drives the editorial section rhythm.
 */
export function Eyebrow({
  children,
  className,
  number,
}: {
  children: ReactNode;
  className?: string;
  number?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/80", className)}>
      {number && (
        <span className="rounded-sm border border-ink/40 px-1.5 py-0.5 text-[10px] font-bold">
          {number}
        </span>
      )}
      <span className="flex items-center gap-2">
        <span className="h-px w-6 bg-current opacity-60" />
        {children}
      </span>
    </div>
  );
}
