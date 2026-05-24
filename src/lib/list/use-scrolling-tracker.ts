import { onDestroy } from 'svelte';

/**
 * Track an externally-owned `scrolling` flag with an idle window: flip true
 * synchronously when `mark()` is called, then reset to false after no calls
 * have happened for `idleMs`.
 *
 * Used by `NeoList` (non-virtual) and `NeoVirtualList` so both modes
 * surface the same `scrolling` semantics. Both call sites expose
 * `scrolling` as a `$bindable` prop, so the tracker takes a setter rather
 * than owning the state itself.
 *
 * Must be called during component initialization — `onDestroy` is wired
 * internally so callers don't need to remember to clean up.
 */
/**
 * Setter called with `true` on the first `mark()`, then with `false` once
 * the idle window elapses without further marks.
 */
export type NeoScrollingTrackerSetter = (value: boolean) => void;

export interface NeoScrollingTrackerOptions {
  /**
   * Idle window (ms) before resetting to `false`. Defaults: 300 on touch
   * devices, 150 otherwise — mirroring native scrollend cadence.
   */
  idleMs?: number;
  /**
   * Override the touch idle default (ms).
   *
   * @default 300
   */
  touchIdleMs?: number;
  /**
   * Override the non-touch idle default (ms).
   *
   * @default 150
   */
  pointerIdleMs?: number;
}

export interface NeoScrollingTracker {
  /** Mark a scroll event; (re)starts the idle timer. */
  mark: () => void;
  /**
   * Clear any pending timer. Already wired to `onDestroy` — call manually
   * only if the consumer needs to cancel before component teardown.
   */
  cancel: () => void;
}

const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;

export function useScrollingTracker(
  setter: NeoScrollingTrackerSetter,
  { idleMs, touchIdleMs = 300, pointerIdleMs = 150 }: NeoScrollingTrackerOptions = {},
): NeoScrollingTracker {
  const resolved = idleMs ?? (isTouch ? touchIdleMs : pointerIdleMs);
  let timer: ReturnType<typeof setTimeout> | 0 = 0;
  const cancel = () => {
    if (timer) clearTimeout(timer);
    timer = 0;
  };
  onDestroy(cancel);
  return {
    mark() {
      setter(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setter(false);
        timer = 0;
      }, resolved);
    },
    cancel,
  };
}
