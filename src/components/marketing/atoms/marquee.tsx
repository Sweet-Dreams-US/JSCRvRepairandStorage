import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: ReactNode[];
  className?: string;
  /** ms per full loop; default 55000 (matches CSS keyframe) */
  durationMs?: number;
  /** Repeat the items inline twice for a seamless loop */
  doubled?: boolean;
};

/**
 * Mileage ticker — service-station scrolling marquee.
 * Pure-CSS, server-renderable, GPU-cheap.
 */
export function Marquee({ items, className, durationMs, doubled = true }: MarqueeProps) {
  const stream = doubled ? [...items, ...items] : items;
  const style = durationMs ? ({ animationDuration: `${durationMs}ms` } as React.CSSProperties) : undefined;
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="marquee-track" style={style}>
        {stream.map((node, i) => (
          <span key={i} className="flex shrink-0 items-center gap-12">
            {node}
            <Diamond />
          </span>
        ))}
      </div>
    </div>
  );
}

function Diamond() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
