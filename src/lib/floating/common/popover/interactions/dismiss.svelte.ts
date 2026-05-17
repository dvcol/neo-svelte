import type { DismissOptions, Interaction } from '../popover.types.js';

/**
 * Locked dismiss contract:
 *  - Esc closes (document keydown, capture phase).
 *  - Pointerdown outside reference + floating closes (document pointerdown,
 *    capture phase).
 *  - Pointerdown on the reference (or a descendant) does NOT close — that
 *    keeps click-to-toggle authoritative.
 *  - Pointerdown on the floating (or a descendant) does NOT close — portal
 *    safety: containment is checked via `Node.contains`, which walks the
 *    DOM ancestry and resolves correctly even when the floating is portaled
 *    out of the reference subtree.
 *  - Ancestor scroll does NOT close. Position pipeline already follows the
 *    reference; closing on every scroll surprises users.
 *
 * Listeners are bound only on the open transition (via `onOpenChange`,
 * dispatched synchronously by `Popover`). The cleanup returned by
 * `onOpenChange(true, …)` is invoked on the matching close transition. The
 * `enabled` flag is gated inside the handlers so flipping it at runtime
 * short-circuits without re-binding.
 */
export function dismiss(options: DismissOptions = {}): Interaction {
  return (ctx) => {
    const enabled = $derived(options.enabled ?? true);

    function isInside(target: EventTarget | null): boolean {
      if (!(target instanceof Node)) return false;
      const reference = ctx.popover.referenceEl;
      const floating = ctx.popover.floatingEl;
      if (reference && (reference === target || reference.contains(target))) return true;
      if (floating && (floating === target || floating.contains(target))) return true;
      return false;
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (!enabled || event.key !== 'Escape') return;
      ctx.onOpenChange(false, event, 'escape-key');
    }

    function onPointerDown(event: PointerEvent): void {
      if (!enabled || isInside(event.target)) return;
      ctx.onOpenChange(false, event, 'outside-press');
    }

    return {
      onOpenChange(open: boolean) {
        if (!open) return;
        const doc = ctx.popover.floatingEl?.ownerDocument ?? document;
        doc.addEventListener('keydown', onKeyDown, true);
        doc.addEventListener('pointerdown', onPointerDown, true);
        return () => {
          doc.removeEventListener('keydown', onKeyDown, true);
          doc.removeEventListener('pointerdown', onPointerDown, true);
        };
      },
    };
  };
}
