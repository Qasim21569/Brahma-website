"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.24, 0.43, 0.15, 0.97] as const;

/**
 * Accordion — exclusive rows. Plus and the indicator dot stay on their own
 * row; they never share a Motion layoutId, which used to fly the icon and
 * bullet across questions when another opened.
 */
export default function Accordion({
  items,
  className = "",
}: {
  items: { title: string; body: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={`flex flex-col ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i;

        return (
          <div key={item.title} className="border-b border-ink-deep/10 last:border-b-0">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <div className="flex min-w-0 items-center gap-4">
                <span
                  aria-hidden="true"
                  className={[
                    "h-3 w-3 shrink-0 rounded-full border transition-[background-color,border-color] duration-300",
                    "ease-[cubic-bezier(0.24,0.43,0.15,0.97)]",
                    isOpen
                      ? "border-accent bg-accent"
                      : "border-ink-deep/30 bg-transparent",
                  ].join(" ")}
                />
                <span className="font-body-lg text-body-lg text-ink-deep">
                  {item.title}
                </span>
              </div>

              <span
                aria-hidden="true"
                className="relative h-5 w-5 shrink-0 text-ink-deep/60"
              >
                <span className="absolute top-1/2 left-[3px] h-px w-[14px] -translate-y-1/2 bg-current" />
                <span
                  className={[
                    "absolute top-[3px] left-1/2 h-[14px] w-px -translate-x-1/2 bg-current origin-center",
                    "transition-transform duration-300 ease-[cubic-bezier(0.24,0.43,0.15,0.97)]",
                    "motion-reduce:transition-none",
                    isOpen ? "scale-y-0" : "scale-y-100",
                  ].join(" ")}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pl-7 font-body-md text-body-md text-on-surface-variant">
                    {item.body}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
