"use client";

import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * StyledLink — Elementis signature list link.
 *
 * A full-width row with the label left and an arrow right, sitting on a
 * half-opacity rule. On hover a solid rule sweeps in from the right and
 * settles, then exits the same way. Used for section link stacks.
 */
export function StyledLink({
  href,
  children,
  className = "",
  tone = "dark",
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /** "dark" = dark text on light bg. "light" = light text on dark bg. */
  tone?: "dark" | "light";
  external?: boolean;
}) {
  const color = tone === "light" ? "text-cream" : "text-primary";
  const rule = tone === "light" ? "bg-cream" : "bg-primary";

  const inner = (
    <motion.div
      initial="initial"
      whileHover="hover"
      className={`relative flex w-full cursor-pointer items-center justify-between gap-6 overflow-hidden py-4 pr-2 ${color} ${className}`}
    >
      <span className="font-body-lg text-body-lg leading-tight">{children}</span>

      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="w-4 h-4 shrink-0"
        aria-hidden="true"
      >
        <path
          d={external ? "M4 12L12 4M12 4H6M12 4v6" : "M3 8h9M8.5 4.5 12 8l-3.5 3.5"}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <MotionConfig transition={{ duration: 0.45, ease: "circInOut" }}>
        <div className={`absolute inset-x-0 bottom-0 h-px opacity-40 ${rule}`} />
        <motion.div
          className={`absolute inset-x-0 bottom-0 h-px ${rule}`}
          variants={{
            initial: { x: "100%" },
            hover: { x: ["-100%", "0%"] },
          }}
        />
      </MotionConfig>
    </motion.div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return <Link href={href}>{inner}</Link>;
}
