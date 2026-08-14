"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/**
 * InlineList — slash-separated inline list that staggers in.
 *
 * Ported from `../the-line-awwwards-SOTM/components/List.tsx`: items separated
 * by a light `/`, revealed with `staggerChildren: 0.06`, the first separator
 * hidden via `first:[&>:first-child]:hidden`.
 *
 * Wraps rather than overflowing — the reference sits on one line because its
 * lists are short; ours carries six capability chips and must fold on mobile.
 */
export function InlineList({
  items,
  className = "",
}: {
  items: ReactNode[];
  className?: string;
}) {
  return (
    <motion.div
      initial="initial"
      whileInView="inView"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ inView: { transition: { staggerChildren: 0.06 } } }}
      className={`flex cursor-default flex-wrap items-center gap-y-1 ${className}`}
    >
      {items.map((item, i) => (
        <div key={i} className="flex items-center first:[&>:first-child]:hidden">
          <span className="font-light opacity-40">/&nbsp;</span>
          <motion.span
            variants={{
              initial: { opacity: 0 },
              inView: { opacity: 1, transition: { duration: 0 } },
            }}
          >
            {item}
          </motion.span>
          &nbsp;
        </div>
      ))}
    </motion.div>
  );
}
