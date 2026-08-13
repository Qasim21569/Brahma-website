"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Accordion — collapsed/expanded row group.
 *
 * Each item shows a title + optional icon; only one item is open at a time
 * (exclusive mode via layoutId). The indicator dot (filled / empty) and the
 * plus→minus icon animate through `layoutId` so Motion smoothly morphs them.
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
          <div
            key={i}
            className="border-b border-ink-deep/10 last:border-b-0"
          >
            <button
              className="flex w-full items-center justify-between py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <div className="flex items-center gap-4">
                <div className="relative h-3 w-3 flex-shrink-0">
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="dot-filled"
                        layoutId="dot"
                        className="absolute inset-0 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    ) : (
                      <motion.div
                        key="dot-empty"
                        layoutId="dot"
                        className="absolute inset-0 rounded-full border border-ink-deep/30"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                  </AnimatePresence>
                </div>

                <span className="font-body-lg text-body-lg text-ink-deep">
                  {item.title}
                </span>
              </div>

              <div className="relative h-5 w-5 flex-shrink-0">
                <AnimatePresence initial={false} mode="popLayout">
                  {isOpen ? (
                    <motion.div
                      key="minus"
                      layoutId="icon"
                      className="absolute inset-0 flex items-center justify-center text-ink-deep/60"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 8h12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="plus"
                      layoutId="icon"
                      className="absolute inset-0 flex items-center justify-center text-ink-deep/60"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M8 2v12M2 8h12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.24, 0.43, 0.15, 0.97] }}
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
