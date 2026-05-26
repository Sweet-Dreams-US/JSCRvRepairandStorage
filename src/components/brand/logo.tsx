import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "full" | "icon" | "stacked";
  invert?: boolean;
};

export function Logo({ className, variant = "full", invert = false }: LogoProps) {
  const red = invert ? "#fff" : "#dc2626";
  const gray = invert ? "rgba(255,255,255,0.85)" : "#4b5563";
  if (variant === "icon") {
    return <RvSilhouette className={className} color={red} />;
  }
  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <RvSilhouette className="h-10 w-auto" color={gray} />
        <span className="font-display text-xl font-extrabold tracking-tight" style={{ color: red }}>
          JSC RV REPAIR
        </span>
      </div>
    );
  }
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <RvSilhouette className="h-8 w-auto shrink-0" color={gray} />
      <span className="font-display text-lg font-extrabold tracking-tight" style={{ color: red }}>
        JSC RV REPAIR
      </span>
    </div>
  );
}

function RvSilhouette({ className, color }: { className?: string; color: string }) {
  return (
    <svg
      viewBox="0 0 240 110"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="6"
      className={className}
      aria-label="RV silhouette"
    >
      {/* Body */}
      <path d="M14 28 H170 Q205 28 220 56 Q228 72 222 82 H210" />
      <path d="M14 28 V82 H210" />
      {/* Hitch */}
      <path d="M14 82 L4 92 H32" />
      {/* Wheel */}
      <circle cx="68" cy="92" r="14" fill={color} stroke="none" />
      <circle cx="68" cy="92" r="6" fill="#fff" stroke="none" />
      {/* Windows */}
      <rect x="34" y="42" width="28" height="22" rx="3" fill={color} stroke="none" />
      <rect x="78" y="42" width="22" height="22" rx="3" fill={color} stroke="none" />
      <rect x="116" y="42" width="40" height="22" rx="3" fill={color} stroke="none" />
    </svg>
  );
}
