"use client";

import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

/**
 * HoverReveal — Elementis / the-line pattern.
 *
 * Cross-fades between two text states on hover with a brief flicker.
 * Uses AnimatePresence for enter/exit choreography matching the reference.
 */
export function HoverReveal({
  defaultText,
  hoverText,
  className = "",
}: {
  defaultText: ReactNode;
  hoverText: ReactNode;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={className}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isHovered ? "after" : "before"}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0 },
          }}
          exit={{
            opacity: [0, 0, 1, 1, 0, 0],
            transition: {
              duration: 0.3,
              times: [0, 0.1, 0.1, 0.2, 0.2, 0.3].map((t) => t / 0.3),
              ease: EASE,
            },
          }}
          className="h-fit"
        >
          {isHovered ? hoverText : defaultText}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
