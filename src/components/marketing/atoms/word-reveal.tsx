"use client";

import { motion } from "motion/react";

type WordRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Words that should render in the brand garage red */
  accent?: string[];
  /** Words that should render in italic display */
  italic?: string[];
  /** Words that get a decorative under-swash */
  swash?: string[];
};

/**
 * Hero-style word-by-word reveal with optional per-word accent styling.
 * Each word rises, fades, and de-blurs in sequence — feels like a curtain rising.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  accent = [],
  italic = [],
  swash = [],
}: WordRevealProps) {
  const words = text.split(/\s+/);
  return (
    <span className={className}>
      {words.map((raw, i) => {
        const clean = raw.replace(/[.,!?]$/, "").toLowerCase();
        const isAccent = accent.some((a) => clean === a.toLowerCase());
        const isItalic = italic.some((a) => clean === a.toLowerCase());
        const isSwash = swash.some((a) => clean === a.toLowerCase());
        return (
          <motion.span
            key={`${raw}-${i}`}
            initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: delay + i * stagger,
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={[
              "inline-block whitespace-pre",
              isAccent ? "text-garage" : "",
              isItalic ? "italic" : "",
              isSwash ? "swash" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {raw}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        );
      })}
    </span>
  );
}
