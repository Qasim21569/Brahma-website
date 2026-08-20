/**
 * Preload curtain coordination.
 *
 * Pure DOM — no React dependency. Safe to import from any component.
 */

const INTRO_SESSION_KEY = "brahma:intro-played";

/**
 * Backstop for `heroReady()` if the boot script never fires its release event
 * — a JS error before paint, or the script being stripped.
 *
 * MUST stay comfortably above the boot script's `tD` (7500ms). History: this
 * was 6000ms against a 5000ms intro — only 1s of headroom — and a slow frame
 * could have resolved the promise while the curtain was still up. Raised to
 * 7000ms then, and to 9500ms when the intro went to 7500ms on 2026-08-17.
 * **Raise this whenever tD moves.** Too low silently unlocks the hero behind a
 * curtain that is still covering it.
 */
const FAILSAFE_MS = 9500;

export function introMode(): "play" | "exit" | "skip" | "done" {
  const el = document.documentElement;
  const state = el.getAttribute("data-intro");
  if (state === "done") return "done";
  if (state === "play") return "play";
  if (state === "exit") return "exit";
  return "skip";
}

export function introAlreadySettled(): boolean {
  const el = document.documentElement;
  return (
    el.getAttribute("data-intro") === "done" ||
    el.hasAttribute("data-intro-released")
  );
}

export function heroReady(): Promise<void> {
  if (introAlreadySettled() || introMode() === "skip") {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const onRelease = () => {
      document.removeEventListener("brahma:intro-release", onRelease);
      resolve();
    };
    document.addEventListener("brahma:intro-release", onRelease);
    setTimeout(() => {
      document.removeEventListener("brahma:intro-release", onRelease);
      resolve();
    }, FAILSAFE_MS);
  });
}
