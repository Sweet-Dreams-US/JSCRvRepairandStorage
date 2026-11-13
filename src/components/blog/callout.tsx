import { ArrowRight, BookOpen, Wrench } from "lucide-react";
import { StampButton } from "@/components/marketing/atoms/stamp-button";
import type { CalloutKind, CalloutLink } from "@/lib/blog-markdown";
import { cn } from "@/lib/utils";

/**
 * A :::tip or :::note block inside a post.
 * Tip: a service plate with the lesson, and its link as a button under the text.
 * Note: a plain brass-edged card for a researched fact.
 */
export function Callout({
  kind,
  title,
  html,
  links,
}: {
  kind: CalloutKind;
  title: string;
  html: string;
  links: CalloutLink[];
}) {
  const isTip = kind === "tip";
  return (
    <aside
      className={cn(
        "blog-callout relative my-10 p-6 sm:p-7",
        isTip
          ? "border-2 border-ink/85! bg-paper shadow-[6px_6px_0_var(--garage)]"
          : "border-l-4 border-brass! bg-sand/45",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em]",
          isTip ? "text-garage" : "text-brass",
        )}
      >
        {isTip ? <Wrench className="h-3.5 w-3.5" aria-hidden /> : <BookOpen className="h-3.5 w-3.5" aria-hidden />}
        {isTip ? "Shop tip" : "Research note"}
      </div>
      {title && <p className="mt-2.5 font-display text-xl font-semibold leading-snug text-ink">{title}</p>}
      {html && (
        <div
          className={cn("blog-callout-body text-ink/80", title ? "mt-3" : "mt-2.5")}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      {isTip && links.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {links.map((l) =>
            /^https?:/i.test(l.href) ? (
              <StampButton
                key={`${l.href}-${l.text}`}
                href={l.href}
                external
                variant="garage"
                size="md"
                className="w-full text-center leading-snug sm:w-auto"
              >
                {l.text} <ArrowRight />
              </StampButton>
            ) : (
              <StampButton
                key={`${l.href}-${l.text}`}
                href={l.href}
                variant="garage"
                size="md"
                className="w-full text-center leading-snug sm:w-auto"
              >
                {l.text} <ArrowRight />
              </StampButton>
            ),
          )}
        </div>
      )}
    </aside>
  );
}
