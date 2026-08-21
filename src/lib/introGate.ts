/**
 * Preload curtain coordination.
 *
 * Pure DOM — no React dependency. Safe to import from any component.
 *
 * ⚠️ **CURRENTLY UNCONSUMED — verified 2026-08-17.** Nothing in `src/` imports
 * this module, so the `brahma:intro-release` / `brahma:intro-done` events the
 * boot script dispatches have no listeners, and `FAILSAFE_MS` below guards a
 * promise nobody awaits. It is kept rather than deleted because the boot script
 * still emits the events and the intended consumer is obvious: below-the-fold
 * hero content that should hold its entrance until the curtain starts lifting —
 *
 *     useEffect(() => { heroReady().then(() => setCanAnimate(true)); }, []);
 *
 * **Either wire that up or delete this file.** Leaving a dormant coordination
 * API around is how the project has previously ended up maintaining timings for
 * code paths that no longer run. See docs/PRELOADER-SPEC.md §10.
 */

const INTRO_SESSION_KEY = "brahma:intro-played";

/**
 * Backstop for `heroReady()` if the boot script never fires its release event
 * — a JS error before paint, or the script being stripped.
 *
 * MUST stay comfortably above the boot script's `tD` (8000ms). History: this
 * was 6000ms against a 5000ms intro — only 1s of headroom — and a slow frame
 * could have resolved the promise while the curtain was still up. Raised to
 * 7000ms then, then 9500ms, and to 10000ms when the key-drop took the intro to 8000ms.
 * **Raise this whenever tD moves.** Too low silently unlocks the hero behind a
 * curtain that is still covering it.
 */
const FAILSAFE_MS = 10000;

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
