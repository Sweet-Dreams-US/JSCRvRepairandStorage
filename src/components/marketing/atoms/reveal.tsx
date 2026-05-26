"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

const v: Variants = {
  hidden: (y: number) => ({ opacity: 0, y, filter: "blur(6px)" }),
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/**
 * Reveal — scroll-triggered fade + rise + de-blur.
 * Single highest-impact motion primitive; reused everywhere.
 */
export function Reveal({ children, className, delay = 0, y = 32, once = true }: RevealProps) {
  return (
    <motion.div
      custom={y}
      variants={v}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.25 }}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Reveal but staggers direct children */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, y = 24 }: { children: ReactNode; className?: string; y?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y, filter: "blur(4px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
