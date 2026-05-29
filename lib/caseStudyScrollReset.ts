/**
 * Scroll helpers for the case study overlay and horizontal gallery.
 */

export function resetElementScrollAxes(el: HTMLElement | null | undefined, resetX: boolean, resetY: boolean) {
  if (!el) return;
  if (resetY) el.scrollTop = 0;
  if (resetX) el.scrollLeft = 0;
}

/** Reset a modal panel scroller. Avoids `scrollIntoView` (can move the viewport on some browsers). */
export function flushScrollContainer(el: HTMLElement | null | undefined) {
  if (typeof document === "undefined" || !el) return;

  el.scrollTop = 0;
  el.scrollLeft = 0;
  try {
    el.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } catch {
    /* ignore */
  }
}

/** Re-apply after layout (skipped during SSR). */
export function scheduleScrollContainerFlushes(getEl: () => HTMLElement | null | undefined) {
  if (typeof window === "undefined") return;

  const run = () => {
    try {
      flushScrollContainer(getEl());
    } catch {
      /* ignore — never break the app from scroll bookkeeping */
    }
  };

  run();
  try {
    queueMicrotask(run);
  } catch {
    window.setTimeout(run, 0);
  }
  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(run);
  }
  window.setTimeout(run, 0);
  window.setTimeout(run, 72);
}
