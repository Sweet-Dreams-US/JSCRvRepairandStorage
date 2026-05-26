import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  variant?: "diamond" | "stars" | "compass";
};

/**
 * Letterpress-style decorative rule with a centered ornament.
 * Use between sections instead of plain <hr> for the service-bureau feel.
 */
export function OrnamentalRule({ className, variant = "diamond" }: Props) {
  return (
    <div className={cn("flex items-center gap-3 text-ink", className)}>
      <span className="h-px flex-1 bg-current opacity-40" />
      <Ornament variant={variant} />
      <span className="h-px flex-1 bg-current opacity-40" />
    </div>
  );
}

function Ornament({ variant }: { variant: Props["variant"] }) {
  if (variant === "stars") {
    return (
      <span className="flex items-center gap-1.5 text-current">
        <Star /> <Star /> <Star />
      </span>
    );
  }
  if (variant === "compass") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3 L14 12 L12 21 L10 12 Z" fill="currentColor" />
        <path d="M3 12 L12 10 L21 12 L12 14 Z" fill="currentColor" opacity="0.6" />
      </svg>
    );
  }
  return (
    <span className="flex items-center gap-2 text-current">
      <Diamond /> <Diamond /> <Diamond />
    </span>
  );
}

function Diamond() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
    </svg>
  );
}
function Star() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2 L14.6 9 L22 9.5 L16.3 14 L18.2 21 L12 17 L5.8 21 L7.7 14 L2 9.5 L9.4 9 Z" />
    </svg>
  );
}
