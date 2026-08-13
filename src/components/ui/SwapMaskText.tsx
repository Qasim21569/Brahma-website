"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

/**
 * SwapMaskText — exact port of Elementis `components/Client/MaskTextClient.tsx`.
 *
 * Unlike `MaskText` (which reveals once on scroll into view), this swaps its
 * content whenever `state` changes, and the direction of the mask follows the
 * direction of travel: forward pushes lines up, backward pulls them down.
 * Used for the Selected Work card, whose text changes as you scroll.
 */
export function SwapMaskText({
  state,
  lines,
  className = "",
  style,
}: {
  state: number;
  lines: ReactNode[];
  className?: string;
  style?: CSSProperties;
}) {
  const previous = useRef(state);
  const forward = state > previous.current;

  useEffect(() => {
    previous.current = state;
  }, [state]);

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: forward ? 1 : -1,
      },
    },
  };

  const childVariants = {
    initial: {
      y: forward ? "100%" : "-100%",
      clipPath: forward ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)",
    },
    animate: {
      y: "0%",
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { ease: EASE, duration: 0.35 },
    },
    exit: (custom: boolean) => ({
      y: custom ? "-100%" : "100%",
      clipPath: custom ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      transition: { ease: EASE, duration: 0.35 },
    }),
  };

  return (
    <AnimatePresence mode="wait" custom={forward}>
      <motion.div
        key={state}
        initial="initial"
        animate="animate"
        exit="exit"
        custom={forward}
        variants={containerVariants}
        style={style}
        className={`text-center ${className}`}
      >
        {lines.map((line, i) => (
          <motion.div
            key={i}
            variants={childVariants}
            custom={forward}
            className="break-words"
          >
            {line}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
