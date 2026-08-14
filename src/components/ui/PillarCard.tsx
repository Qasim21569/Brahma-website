import { MaskText } from "@/components/ui/MaskText";
import { Reveal } from "@/components/ui/Reveal";
import { DrawnRule } from "@/components/ui/DrawnRule";
import type { Pillar } from "@/data/services";

/**
 * PillarCard — one capability pillar.
 *
 * Originally ported from `../hetari-portfolio/src/components/ServicesCard.vue`,
 * then reworked once the numbering was rejected. That version carried **three
 * competing numbering systems on one card** — `( 01 )` beside the title, an
 * oversized ghost numeral behind it, and `01 / 02 / 03` down the sub-rows — plus
 * a perpetually rotating mark. All four are gone:
 *
 *   - Scale contrast now comes from the pillar's **own name** set large and
 *     faint behind the card, so the stack still has rhythm without counting
 *     anything. These are capabilities, not ranked steps, so numbering them was
 *     also slightly wrong.
 *   - The rotating mark is replaced by `DrawnRule` as the card's top edge, which
 *     draws once on entry and settles.
 *
 * Kept a server component. The only motion is MaskText/Reveal/DrawnRule, all of
 * which are already client, so there is nothing here to hydrate.
 *
 * `tone` exists because this renders on both the light canvas and the dark
 * band. Every dark usage must set colour explicitly — never inherit across a
 * light/dark boundary (§2.4).
 */
export function PillarCard({
  pillar,
  tone = "dark-on-light",
  delay = 0,
}: {
  pillar: Pillar;
  /** "dark-on-light" = ink text on the canvas. "light-on-dark" = cream on ink. */
  tone?: "dark-on-light" | "light-on-dark";
  delay?: number;
}) {
  const light = tone === "light-on-dark";

  const heading = light ? "text-cream" : "text-primary";
  const body = light ? "text-cream-dim" : "text-on-surface-variant";
  const rule = light ? "border-white/15" : "border-mortar-grey";
  const ruleFill = light ? "bg-white/25" : "bg-mortar-grey";
  const accent = light ? "text-muted-azure" : "text-on-surface-variant";
  const ghost = light ? "text-cream/[0.055]" : "text-primary/[0.045]";

  return (
    <article className="relative pt-8">
      {/* The card's own top edge, drawn rather than static. */}
      <div className="absolute inset-x-0 top-0">
        <DrawnRule className={ruleFill} delay={delay} />
      </div>

      {/* Ghost word. Clipped at the card's right edge rather than bleeding into
          the page — "Repositioning" is long enough to run past it, and letting
          it cut on the boundary reads as deliberate. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      >
        <span
          className={`absolute -top-2 right-0 whitespace-nowrap font-display-hero uppercase leading-none tracking-tight ${ghost} text-[14vw] md:-top-6 md:text-[6vw]`}
        >
          {pillar.title}
        </span>
      </div>

      <div className="relative">
        <h3>
          <MaskText
            className={`font-headline-md text-headline-md leading-tight ${heading}`}
            delay={delay}
            lines={[pillar.title]}
          />
        </h3>
      </div>

      <div className="relative mt-8 grid grid-cols-1 gap-x-gutter gap-y-8 md:grid-cols-2">
        <MaskText
          delay={delay + 0.1}
          className={`font-body-md text-body-md leading-relaxed ${body}`}
          lines={pillar.body}
        />

        <div>
          {pillar.capabilities.map((capability, i) => (
            <Reveal key={capability} delay={delay + 0.15 + i * 0.06} distance={12}>
              {/* Hairline-separated rows. The middle row is bounded top and
                  bottom so the group reads as one set — the numbering that used
                  to do that job has gone. */}
              <p
                className={`py-2.5 ${i === 1 ? `border-y ${rule}` : ""}`}
              >
                <span className={`font-body-md text-body-md ${heading}`}>
                  {capability}
                </span>
              </p>
            </Reveal>
          ))}

          {pillar.subunit && (
            <Reveal delay={delay + 0.4}>
              <p className={`font-label-caps text-label-caps ${accent} mt-6`}>
                Operated by {pillar.subunit}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </article>
  );
}
