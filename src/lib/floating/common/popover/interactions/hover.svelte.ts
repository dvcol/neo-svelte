import type { HoverOptions, Interaction } from '../popover.types.js';

function getDelay(value: HoverOptions['delay'], prop: 'open' | 'close'): number {
  if (typeof value === 'number') return value;
  return value?.[prop] ?? 0;
}

/**
 * Hover-driven open/close.
 *
 * - `restMs` requires the pointer to rest on the reference for that long
 *   before opening (suppresses fly-by opens).
 * - `delay` (number or `{ open, close }`) gates open/close transitions through
 *   timeouts.
 * - `move` (default true) lets `mousemove` over the reference also trigger
 *   open, so re-entering an already-rendered floating doesn't get stuck.
 *
 * Cross-cutting state — clearing pending timers when the popover closes for
 * any other reason — runs in `onOpenChange`, which `Popover` invokes
 * synchronously on real open transitions (post-consumer-veto).
 */
export function hover(options: HoverOptions = {}): Interaction {
  return (ctx) => {
    const enabled = $derived(options.enabled ?? true);
    const delayOpt = $derived(options.delay ?? 0);
    const restMs = $derived(options.restMs ?? 0);
    const move = $derived(options.move ?? true);

    let openTimeout: ReturnType<typeof setTimeout> | -1 = -1;
    let restTimeout: ReturnType<typeof setTimeout> | -1 = -1;
    let blockMouseMove = true;

    function clearOpenTimer(): void {
      if (openTimeout !== -1) clearTimeout(openTimeout);
      openTimeout = -1;
    }
    function clearRestTimer(): void {
      if (restTimeout !== -1) clearTimeout(restTimeout);
      restTimeout = -1;
    }

    function closeWithDelay(event: Event): void {
      const closeDelay = getDelay(delayOpt, 'close');
      clearOpenTimer();
      if (closeDelay) {
        openTimeout = setTimeout(() => ctx.onOpenChange(false, event, 'hover'), closeDelay);
      } else {
        ctx.onOpenChange(false, event, 'hover');
      }
    }

    function onMouseEnter(event: MouseEvent): void {
      if (!enabled) return;
      clearOpenTimer();
      blockMouseMove = false;
      if (restMs > 0 && !getDelay(delayOpt, 'open')) return;
      const openDelay = getDelay(delayOpt, 'open');
      if (openDelay) {
        openTimeout = setTimeout(() => ctx.onOpenChange(true, event, 'hover'), openDelay);
      } else {
        ctx.onOpenChange(true, event, 'hover');
      }
    }

    function onMouseMove(event: MouseEvent): void {
      if (!enabled) return;
      if (move) onMouseEnter(event);
      if (ctx.popover.open || restMs === 0) return;
      clearRestTimer();
      restTimeout = setTimeout(() => {
        if (!blockMouseMove) ctx.onOpenChange(true, event, 'hover');
      }, restMs);
    }

    function onMouseLeave(event: MouseEvent): void {
      if (!enabled) return;
      clearRestTimer();
      closeWithDelay(event);
    }

    function onFloatingMouseEnter(): void {
      if (!enabled) return;
      clearOpenTimer();
    }

    function onFloatingMouseLeave(event: MouseEvent): void {
      if (!enabled) return;
      closeWithDelay(event);
    }

    return {
      reference: {
        listeners: {
          mouseenter: onMouseEnter,
          mousemove: onMouseMove,
          mouseleave: onMouseLeave,
        },
      },
      floating: {
        listeners: {
          mouseenter: onFloatingMouseEnter,
          mouseleave: onFloatingMouseLeave,
        },
      },
      onOpenChange(open: boolean) {
        if (open) return;
        clearOpenTimer();
        clearRestTimer();
        blockMouseMove = true;
      },
    };
  };
}
