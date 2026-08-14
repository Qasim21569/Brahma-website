"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * FlickerText — large word whose letters flicker in sequence on hover, with a
 * rule beneath that retracts to the right.
 *
 * Ported from `../the-line-awwwards-SOTM/components/FlickerText.tsx`, which
 * drives per-letter `opacity` keyframes off a hand-built `times` array and
 * animates the rule's `left`/`right`/`width`. Simplified here to a per-letter
 * `delay` and a `scaleX` on the rule: the visible result is the same, and the
 * original's `times` maths is unreadable and hard to retune.
 *
 * Reduced motion returns plain text with a static rule — a rapid opacity
 * flicker is exactly the kind of effect `prefers-reduced-motion` exists for, so
 * it must not merely be shortened.
 */
export function FlickerText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const letters = [...children];

  if (reduceMotion) {
    return (
      <span className={`relative inline-block ${className}`}>
        {children}
        <span className="absolute inset-x-0 bottom-0 h-px bg-current" />
      </span>
    );
  }

  return (
    <motion.span
      initial="rest"
      animate="rest"
      whileHover="hover"
      className={`relative inline-block cursor-default ${className}`}
      /* The per-letter split is presentational. Without these, assistive tech
         can announce the heading one character at a time, and the text stops
         being selectable as a phrase. The label carries the real string. */
      aria-label={children}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          variants={{
            rest: { opacity: 1 },
            hover: {
              opacity: [1, 0.15, 1, 0.15, 1],
              transition: { duration: 0.4, delay: i * 0.035, ease: "linear" },
            },
          }}
          /* Spaces collapse without this, splitting the word. */
          style={letter === " " ? { whiteSpace: "pre" } : undefined}
        >
          {letter}
        </motion.span>
      ))}

      <motion.span
        /* origin-right so the rule collapses toward the right edge, matching
           the reference's `width:0 / right:0 / left:auto` hover state. */
        className="absolute inset-x-0 bottom-0 h-px origin-right bg-current"
        variants={{
          rest: { scaleX: 1 },
          hover: { scaleX: 0 },
        }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      />
    </motion.span>
  );
}
