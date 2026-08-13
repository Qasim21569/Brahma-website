"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";

interface CountUpProps {
  /** Target value to count to. */
  to: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  prefix?: string;
  suffix?: string;
  /** Zero-pad the integer to this many digits (e.g. 2 → "02"). */
  pad?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Count-up number that animates from 0 to `to` when it scrolls into view.
 *
 * The motion value is seeded at `to`, not 0, so the server and the first client
 * render both emit the final figure — the number is correct with JS off and
 * visible to crawlers, and hydration cannot mismatch. The value is reset to 0
 * only at the moment it scrolls into view, immediately before animating.
 */
export function CountUp({
  to,
  duration = 2,
  className,
  style,
  prefix = "",
  suffix = "",
  pad = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const count = useMotionValue(to);
  const text = useTransform(count, (v) => {
    const n = Math.floor(v).toString().padStart(pad, "0");
    return `${prefix}${n}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    count.set(0);
    const controls = animate(count, to, { duration, ease: EASE });
    return () => controls.stop();
  }, [inView, to, duration, count]);

  return (
    <motion.span ref={ref} className={className} style={style}>
      {text}
    </motion.span>
  );
}
