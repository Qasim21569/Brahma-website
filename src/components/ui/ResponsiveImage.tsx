"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ParallaxContainer } from "@/components/ui/ParallaxContainer";

/**
 * ResponsiveImage — exact port of Elementis
 * `components/Client/ResponsiveImage.tsx`.
 *
 * Applies the in-frame parallax on desktop and renders the child untouched on
 * mobile, where the reference deliberately runs no scroll effect.
 *
 * SSR: renders the desktop path on the server and drops the effect after
 * hydration if the viewport is small — never returns null (§4.8).
 */
export function ResponsiveImage({
  children,
  parallaxAmount = 8,
  className = "",
}: {
  children: ReactNode;
  parallaxAmount?: number;
  className?: string;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return <>{children}</>;

  return (
    <ParallaxContainer parallaxAmount={parallaxAmount} className={className}>
      {children}
    </ParallaxContainer>
  );
}
