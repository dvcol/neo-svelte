import type { FocusOptions, Interaction, ListenerMap } from '../popover.types.js';

/**
 * Focus-driven open/close.
 *
 * - `focusWithin` (skeleton PR #164): when `true`, listens for bubbling
 *   `focusin` / `focusout` so a focusable child of a wrapper trigger can
 *   open the floating. Default `false` keeps non-bubbling `focus` / `blur`
 *   for the trigger-is-the-focus-target case. Reactive — flippable at
 *   runtime via getter; the unused listener pair stays bound but each
 *   handler gates on the current `focusWithin` value, so flipping has no
 *   re-bind cost.
 * - The close path is debounced through `setTimeout(0)` so focus moving
 *   into the floating element doesn't trigger a flash close.
 *
 * Cross-cut: when `popover.open` flips false for any other reason, drop the
 * pending close timer. Reactive read replaces the old pubsub.
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

    function makeFocusHandler(eventType: 'focus' | 'focusin') {
      return (event: FocusEvent): void => {
        if (!enabled) return;
        if (focusWithin && eventType !== 'focusin') return;
        if (!focusWithin && eventType !== 'focus') return;
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

    $effect(() => {
      if (!ctx.popover.open) clearBlurTimer();
    });

    const listeners: ListenerMap = {
      focus: makeFocusHandler('focus'),
      focusin: makeFocusHandler('focusin'),
      blur: makeBlurHandler('blur'),
      focusout: makeBlurHandler('focusout'),
    };

    return {
      reference: { listeners },
    };
  };
}
