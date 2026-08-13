"use client";

import { useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { MaskText } from "./MaskText";

/**
 * ResponsiveMaskText — MaskText with hand-set line breaks per breakpoint.
 *
 * Elementis breaks every headline manually and ships a different line array
 * for mobile and desktop; that control is most of why the typography reads as
 * designed rather than flowed.
 *
 * SSR NOTE: renders the DESKTOP array on the server and swaps after hydration.
 * It must never return null — that would hide the headline from crawlers and
 * flash empty space on load. See docs/MASTER-PLAN.md §4.8.
 */
export function ResponsiveMaskText({
  mobile,
  desktop,
  className,
  style,
  delay,
  stagger,
  once,
  amount,
}: {
  mobile: ReactNode[];
  desktop: ReactNode[];
  className?: string;
  style?: CSSProperties;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <MaskText
      lines={isMobile ? mobile : desktop}
      className={className}
      style={style}
      delay={delay}
      stagger={stagger}
      once={once}
      amount={amount}
    />
  );
}
