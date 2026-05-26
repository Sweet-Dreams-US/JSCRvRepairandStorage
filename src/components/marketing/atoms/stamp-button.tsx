import Link from "next/link";
import type { ReactNode, ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Base = {
  children: ReactNode;
  className?: string;
  variant?: "ink" | "garage" | "cream" | "outline";
  size?: "md" | "lg";
};

type AsLink = Base & { href: string } & Omit<ComponentProps<typeof Link>, "className" | "children">;
type AsAnchor = Base & { href: string; external: true } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;
type AsButton = Base & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const variantClasses: Record<NonNullable<Base["variant"]>, string> = {
  ink: "bg-ink text-cream border-ink hover:bg-ink-soft",
  garage: "bg-garage text-cream border-ember hover:bg-ember",
  cream: "bg-cream text-ink border-ink hover:bg-paper",
  outline: "bg-transparent text-ink border-ink hover:bg-ink hover:text-cream",
};

const sizeClasses = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/**
 * Stamped service-bureau button — letterpress feel, sharp shadow press.
 * Renders as Next/Link, external <a>, or <button> based on props.
 */
export function StampButton(props: AsLink | AsAnchor | AsButton) {
  const { variant = "ink", size = "lg", className, children } = props;
  const cls = cn(
    "stamp inline-flex items-center justify-center gap-2 rounded-md border-2 font-mono uppercase tracking-[0.16em] font-semibold transition-colors [&_svg]:size-4",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if ("external" in props && props.external) {
    // Strip props that aren't valid HTML anchor attributes
    const { href, external: _ex, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as AsAnchor;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {children}
      </a>
    );
  }
  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as AsLink;
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as AsButton;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
