import Link from "next/link";
import { MaskText } from "@/components/ui/MaskText";
import { FlickerText } from "@/components/ui/FlickerText";
import { Reveal } from "@/components/ui/Reveal";
import { DrawnRule } from "@/components/ui/DrawnRule";
import { GhostWordmark } from "@/components/ui/GhostWordmark";

/**
 * CtaSection — the closing band, shared by every page that has one.
 *
 * This existed five times as inline JSX (home, about, services, careers,
 * contact) and had already drifted: four bands used `bg-primary` and one
 * `bg-ink-deep`, three sizes of pill were in play, only four carried the ghost
 * wordmark, and one pair of buttons sat below the 44px touch floor. The copy
 * differs per page and is passed in; the FRAME is what is shared.
 *
 * Deliberately a server component — every moving part (MaskText, FlickerText,
 * Reveal, DrawnRule, GhostWordmark) is already a client island of its own.
 */

export type CtaAction = {
  label: string;
  href: string;
  /** `solid` is the primary action; `outline` the secondary. */
  variant?: "solid" | "outline";
  /** Renders the inline arrow. Omit for addresses and terminal actions. */
  icon?: boolean;
};

export type CtaSectionProps = {
  /**
   * Hand-broken headline lines (§2.2). With `reveal="flicker"` only the first
   * line is used — FlickerText is a single-word-per-letter effect and a second
   * line would silently vanish.
   */
  titleLines: string[];
  /** `mask` reveals line by line; `flicker` is the per-letter hover treatment. */
  reveal?: "mask" | "flicker";
  /** Hand-broken body lines. Omitted on pages where the headline stands alone. */
  bodyLines?: string[];
  /** Omitted entirely on careers, which closes on a statement, not an ask. */
  actions?: CtaAction[];
  /** `ink-deep` preserves About's darker band, which sets its own rhythm. */
  tone?: "primary" | "ink-deep";
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** One pill geometry for every action, at or above the 44px touch floor. */
function CtaButton({ action }: { action: CtaAction }) {
  const base =
    "inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-8 py-4 font-label-caps text-label-caps transition-colors duration-300";
  const variant =
    action.variant === "outline"
      ? "border border-cream/40 text-cream hover:bg-cream hover:text-ink-deep"
      : "bg-cream text-ink-deep hover:bg-cream-dim";
  const className = `${base} ${variant}`;

  const content = (
    <>
      {action.label}
      {action.icon && <ArrowIcon />}
    </>
  );

  // mailto/tel are not routes — Link would prefetch a non-page.
  return action.href.startsWith("mailto:") || action.href.startsWith("tel:") ? (
    <a href={action.href} className={className}>
      {content}
    </a>
  ) : (
    <Link href={action.href} className={className}>
      {content}
    </Link>
  );
}

export function CtaSection({
  titleLines,
  reveal = "mask",
  bodyLines,
  actions,
  tone = "primary",
}: CtaSectionProps) {
  const bg = tone === "ink-deep" ? "bg-ink-deep" : "bg-primary";

  return (
    <section className={`relative overflow-hidden ${bg} py-section-gap text-cream md:py-24`}>
      <GhostWordmark>BRAHMAS</GhostWordmark>

      <div className="relative z-10 px-margin-edge">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Setting-out line above the headline — the DrawnRule gesture that
              opens each PillarCard, reused so the band reads as authored
              rather than as a stray centred block. */}
          <DrawnRule className="max-w-[88px] bg-muted-azure/60" />

          <h2 className="mt-8">
            {reveal === "flicker" ? (
              <span className="font-headline-lg text-headline-lg text-cream">
                <FlickerText>{titleLines[0]}</FlickerText>
              </span>
            ) : (
              <MaskText
                className="font-headline-lg text-headline-lg text-cream"
                lines={titleLines}
              />
            )}
          </h2>

          {bodyLines && (
            <MaskText
              delay={0.15}
              className="font-body-lg text-body-lg mt-8 max-w-xl text-cream/70"
              lines={bodyLines}
            />
          )}

          {actions && actions.length > 0 && (
            <Reveal delay={0.4}>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {actions.map((action) => (
                  <CtaButton key={action.href + action.label} action={action} />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
