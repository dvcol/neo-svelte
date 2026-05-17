import type { FocusOptions, Interaction, ListenerMap } from '../popover.types.js';

/**
 * Focus-driven open/close.
 *
 * - `focusWithin`: when `true`, listens for bubbling
 *   `focusin` / `focusout` so a focusable child of a wrapper trigger can
 *   open the floating. Default `false` keeps non-bubbling `focus` / `blur`
 *   for the trigger-is-the-focus-target case. Reactive — flippable at
 *   runtime via getter; the unused listener pair stays bound but each
 *   handler gates on the current `focusWithin` value, so flipping has no
 *   re-bind cost.
 * - The close path is debounced through `setTimeout(0)` so focus moving
 *   into the floating element doesn't trigger a flash close.
 * - **Pointerdown gate** — focus opens are suppressed while a pointerdown
 *   on the reference is in flight. Pointer-driven focus (clicking the
 *   reference or a focusable child) lets the `click` interaction own the
 *   open; `focus` only fires for genuine focus events (tab/keyboard).
 *   Without this gate, a click on a focusable child of a wrapper trigger
 *   races: `focusin` bubbles and sets `popover.openEvent.type='focusin'`,
 *   then the trailing `click` sees a non-`'click'` `openEvent.type` and
 *   bails its toggle path, requiring 2 clicks to close. The gate clears
 *   after the trailing `click` fires (or, if no click follows, on the
 *   next macrotask).
 *
 * Cross-cut: when `popover.open` flips false for any other reason, drop the
 * pending close timer. Runs in `onOpenChange`, dispatched synchronously by
 * `Popover` on real open transitions.
 */
export function focus(options: FocusOptions = {}): Interaction {
  return (ctx) => {
    const enabled = $derived(options.enabled ?? true);
    const focusWithin = $derived(options.focusWithin ?? false);

    let blurTimeout: ReturnType<typeof setTimeout> | -1 = -1;
    function clearBlurTimer(): void {
      if (blurTimeout !== -1) clearTimeout(blurTimeout);
      blurTimeout = -1;
    }

    let pointerActive = false;
    let pointerClearTimeout: ReturnType<typeof setTimeout> | -1 = -1;
    function clearPointerTimer(): void {
      if (pointerClearTimeout !== -1) clearTimeout(pointerClearTimeout);
      pointerClearTimeout = -1;
    }
    function onPointerDown(): void {
      pointerActive = true;
      clearPointerTimer();
      pointerClearTimeout = setTimeout(() => {
        pointerActive = false;
        pointerClearTimeout = -1;
      });
    }
    function onClickClear(): void {
      pointerActive = false;
      clearPointerTimer();
    }

    function makeFocusHandler(eventType: 'focus' | 'focusin') {
      return (event: FocusEvent): void => {
        if (!enabled) return;
        if (focusWithin && eventType !== 'focusin') return;
        if (!focusWithin && eventType !== 'focus') return;
        if (pointerActive) return;
        clearBlurTimer();
        ctx.onOpenChange(true, event, 'focus');
      };
    }

    function makeBlurHandler(eventType: 'blur' | 'focusout') {
      return (event: FocusEvent): void => {
        if (!enabled) return;
        if (focusWithin && eventType !== 'focusout') return;
        if (!focusWithin && eventType !== 'blur') return;
        const relatedTarget = event.relatedTarget;
        clearBlurTimer();
        blurTimeout = setTimeout(() => {
          const floating = ctx.popover.floatingEl;
          const reference = ctx.popover.referenceEl;
          if (relatedTarget instanceof Node) {
            if (floating && (floating === relatedTarget || floating.contains(relatedTarget))) return;
            if (reference && (reference === relatedTarget || reference.contains(relatedTarget))) return;
          }
          ctx.onOpenChange(false, event, 'focus');
        });
      };
    }

    const listeners: ListenerMap = {
      focus: makeFocusHandler('focus'),
      focusin: makeFocusHandler('focusin'),
      blur: makeBlurHandler('blur'),
      focusout: makeBlurHandler('focusout'),
      pointerdown: onPointerDown,
      click: onClickClear,
    };

    return {
      reference: { listeners },
      onOpenChange(open: boolean) {
        if (!open) clearBlurTimer();
      },
    };
  };
}
