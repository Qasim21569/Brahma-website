"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { initials } from "@/data/company";

/**
 * TeamPhoto — desaturated headshot that returns to full colour on engagement.
 *
 * Desktop: CSS `group-hover:grayscale-0` (no JS). Mobile: tap latches colour,
 * exclusive across the grid — only one portrait is in colour at a time.
 * The previous eye-icon overlay is gone; the photo itself is the control.
 */
export function TeamPhoto({
  src,
  name,
  role,
  revealed = false,
  onSelect,
  className = "",
}: {
  src: string | null;
  name: string;
  role: string;
  revealed?: boolean;
  onSelect?: () => void;
  className?: string;
}) {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  if (!src) {
    return (
      <div
        className={`flex aspect-[3/4] w-full items-center justify-center bg-surface-container ${className}`}
        aria-hidden="true"
      >
        <span className="font-display-hero text-[36px] leading-none text-primary/25">
          {initials(name)}
        </span>
      </div>
    );
  }

  const interactive = !canHover && Boolean(onSelect);

  return (
    <div
      className={`group relative aspect-[3/4] w-full overflow-hidden bg-surface-container ${className}`}
      onClick={interactive ? onSelect : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? revealed : undefined}
      aria-label={interactive ? `${name}, ${role}` : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
    >
      <Image
        src={src}
        alt={`${name}, ${role}`}
        fill
        unoptimized
        loading="lazy"
        className={[
          "object-cover object-[center_18%]",
          "transition-[filter,transform] duration-700 ease-[cubic-bezier(0.24,0.43,0.15,0.97)]",
          revealed ? "grayscale-0" : "grayscale",
          "group-hover:grayscale-0",
          "group-hover:scale-[1.03]",
        ].join(" ")}
      />
    </div>
  );
}
