import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  variant?: "full" | "icon" | "stacked";
  invert?: boolean;
};

export function Logo({ className, variant = "full", invert = false }: LogoProps) {
  const red = invert ? "#f4ede1" : "#c8331f";
  const ink = invert ? "rgba(244,237,225,0.9)" : "#1a1614";

  if (variant === "icon") {
    return <RvSilhouette className={className} color={red} />;
  }

  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <RvSilhouette className="h-10 w-auto" color={ink} />
        <div className="flex flex-col items-center leading-none">
          <span className="font-display text-2xl font-extrabold tracking-tight" style={{ color: red }}>
            JSC
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.32em]" style={{ color: ink }}>
            RV · Repair
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <RvSilhouette className="h-9 w-auto shrink-0" color={ink} />
      <div className="flex flex-col leading-none">
        <span
          className="font-display text-xl font-extrabold tracking-tight"
          style={{ color: red }}
        >
          JSC <span className="font-display italic font-medium opacity-90">RV Repair</span>
        </span>
        <span
          className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em]"
          style={{ color: ink, opacity: invert ? 0.65 : 0.55 }}
        >
          Leesburg · IN · Est 2018
        </span>
      </div>
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
      <path d="M14 28 H170 Q205 28 220 56 Q228 72 222 82 H210" />
      <path d="M14 28 V82 H210" />
      <path d="M14 82 L4 92 H32" />
      <circle cx="68" cy="92" r="14" fill={color} stroke="none" />
      <circle cx="68" cy="92" r="6" fill="#fff" stroke="none" />
      <rect x="34" y="42" width="28" height="22" rx="3" fill={color} stroke="none" />
      <rect x="78" y="42" width="22" height="22" rx="3" fill={color} stroke="none" />
      <rect x="116" y="42" width="40" height="22" rx="3" fill={color} stroke="none" />
    </svg>
  );
}
