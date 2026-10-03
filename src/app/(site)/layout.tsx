import { MotionConfig } from "motion/react";
import Intro from "@/components/Intro";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

/**
 * The public site's shell — intro curtain, motion preferences, Lenis.
 *
 * Moved here from the root layout when the admin was added, so `/admin` gets
 * none of it. `<Intro />` is still the first thing in <body>, and it is still a
 * server component; the boot script that drives it stays in the root <head>
 * because it must run before first paint.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Intro />
      <MotionConfig reducedMotion="user">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </MotionConfig>
    </>
  );
}
