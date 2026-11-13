"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: string; title: string };

/**
 * Contents for a post, built from its `##` headings.
 *
 * Wide screens: a small panel fixed in the top right corner, with a reading
 * progress bar and the current section marked.
 * Phones and tablets: a bar fixed to the bottom showing the current section
 * and an arrow. The arrow opens the full list; tapping a section jumps to it
 * and closes the list. If the site ever gets a bottom call bar, set the CSS
 * variable --site-bottom-bar to its height and this bar stacks above it.
 *
 * Both hide when the article is not on screen, so they never sit on the footer.
 */
export function PostToc({ items, articleId }: { items: Item[]; articleId: string }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const article = document.getElementById(articleId);
    if (!article) return;
    const heads = items.map((i) => ({ id: i.id, el: document.getElementById(i.id) }));

    const update = () => {
      frame.current = null;
      const vh = window.innerHeight;
      const rect = article.getBoundingClientRect();
      // Reaches 100% just as the end of the article reaches the lower part of
      // the screen, which is also when the contents hide so they never sit on
      // the footer.
      const marker = vh * 0.6;
      setProgress(Math.min(1, Math.max(0, (marker - rect.top) / Math.max(rect.height, 1))));
      setShown(rect.top < vh * 0.5 && rect.bottom > marker);
      let current: string | null = null;
      for (const h of heads) {
        if (h.el && h.el.getBoundingClientRect().top <= 140) current = h.id;
      }
      setActiveId(current);
    };
    const schedule = () => {
      if (frame.current == null) frame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [items, articleId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const jump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    try {
      window.history.replaceState(null, "", `#${id}`);
    } catch {
      /* the jump still worked */
    }
    setOpen(false);
  }, []);

  if (items.length === 0) return null;

  const pct = Math.round(progress * 100);
  const activeIndex = activeId ? items.findIndex((i) => i.id === activeId) : -1;
  const activeTitle = activeIndex >= 0 ? items[activeIndex].title : null;
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <>
      {/* Wide screens: small panel in the top right corner */}
      <nav
        aria-label="Contents"
        aria-hidden={!shown}
        inert={!shown}
        className={cn(
          "fixed right-6 top-28 z-30 hidden w-60 transition-all duration-300 xl:block",
          shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <div className="border-2 border-ink/85! bg-paper shadow-[5px_5px_0_var(--ink)]">
          <div className="border-b border-dashed border-ink/30! px-4 pb-3 pt-3.5">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60">
              <span>In this article</span>
              <span className="tabular-nums text-garage">{pct}%</span>
            </div>
            <div
              className="mt-2.5 h-1.5 w-full bg-sand"
              role="progressbar"
              aria-label="Reading progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
            >
              <div className="h-full bg-garage transition-[width] duration-150" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <ol className="max-h-[calc(100vh-15rem)] overflow-y-auto px-2 py-2">
            {items.map((item, i) => {
              const active = item.id === activeId;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active ? "location" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      jump(item.id);
                    }}
                    className={cn(
                      "flex gap-2.5 rounded-sm px-2 py-1.5 text-[13px] leading-snug transition-colors",
                      active ? "bg-ink text-cream" : "text-ink/75 hover:bg-sand/60 hover:text-ink",
                    )}
                  >
                    <span className={cn("pt-0.5 font-mono text-[10px]", active ? "text-brass" : "text-garage")}>
                      {num(i)}
                    </span>
                    <span>{item.title}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      {/* Phones and tablets: bar fixed to the bottom */}
      <div className="xl:hidden">
        {open && <div className="fixed inset-0 z-30 bg-ink/40" aria-hidden onClick={() => setOpen(false)} />}
        <div
          aria-hidden={!shown && !open}
          inert={!shown && !open}
          className={cn(
            "fixed inset-x-0 z-40 transition-transform duration-300",
            shown || open ? "translate-y-0" : "translate-y-full",
          )}
          style={{ bottom: "var(--site-bottom-bar, 0px)" }}
        >
          <div className="relative border-t-2 border-ink! bg-paper pb-[env(safe-area-inset-bottom)]">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-sand" aria-hidden>
              <div className="h-full bg-garage transition-[width] duration-150" style={{ width: `${pct}%` }} />
            </div>

            {open && (
              <nav
                id="post-toc-sheet"
                aria-label="Contents"
                className="absolute inset-x-0 bottom-full border-t-2 border-ink! bg-paper shadow-[0_-14px_24px_-14px_rgba(26,22,20,0.4)]"
              >
                <div className="flex items-center justify-between px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60">
                  <span>In this article</span>
                  <span className="tabular-nums text-garage">{pct}%</span>
                </div>
                <ol className="max-h-[50vh] overflow-y-auto pb-2">
                  {items.map((item, i) => {
                    const active = item.id === activeId;
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          aria-current={active ? "location" : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            jump(item.id);
                          }}
                          className={cn(
                            "flex min-h-11 items-center gap-3 border-l-4 px-4 py-2.5 text-[15px] leading-snug",
                            active ? "border-garage! bg-cream font-semibold" : "border-transparent!",
                          )}
                        >
                          <span className="font-mono text-[10px] text-garage">{num(i)}</span>
                          <span>{item.title}</span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}

            <button
              type="button"
              aria-expanded={open}
              aria-controls="post-toc-sheet"
              aria-label={open ? "Close contents" : "Open contents"}
              onClick={() => setOpen((o) => !o)}
              className="flex h-14 w-full items-center gap-3 px-4 text-left"
            >
              <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-garage">
                {activeIndex >= 0 ? `${num(activeIndex)} of ${num(items.length - 1)}` : "Contents"}
              </span>
              <span className="min-w-0 flex-1 truncate font-display text-[15px] font-semibold text-ink">
                {activeTitle ?? "In this article"}
              </span>
              <ChevronUp
                className={cn("h-5 w-5 shrink-0 text-ink transition-transform duration-200", open && "rotate-180")}
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
