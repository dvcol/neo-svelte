import type { ClickOptions, Interaction } from '../popover.types.js';

const MOUSE_LIKE = new Set(['mouse', 'pen', '']);

/**
 * Click-driven open/close.
 *
 * - `event: 'click'` (default) listens for the trailing click; `pointerdown`
 *   is captured solely to record the pointer type so the next click can
 *   apply `ignoreMouse`.
 * - `event: 'mousedown'` listens directly on `mousedown`; the trailing
 *   click is then short-circuited (pointerType is set) to avoid double
 *   toggling.
 * - `toggle` (default true): re-pressing the open reference closes only
 *   when the most recent open event matched the trigger event type
 *   (`popover.openEvent.type === 'click'` for click mode, `'mousedown'`
 *   for mousedown mode). This avoids treating focus-then-click as a
 *   toggle close.
 * - `keyboardHandlers` (default true): on non-`<button>` references,
 *   Enter toggles immediately and Space toggles on keyup (matching
 *   native button activation).
 */
export function click(options: ClickOptions = {}): Interaction {
  return (ctx) => {
    const enabled = $derived(options.enabled ?? true);
    const eventOpt = $derived(options.event ?? 'click');
    const toggle = $derived(options.toggle ?? true);
    const ignoreMouse = $derived(options.ignoreMouse ?? false);
    const keyboardHandlers = $derived(options.keyboardHandlers ?? true);

    let pointerType: PointerEvent['pointerType'] | undefined;
    let didKeyDown = false;

    function isMouseLike(): boolean {
      return pointerType !== undefined && MOUSE_LIKE.has(pointerType);
    }

    function isButton(target: EventTarget | null): boolean {
      return target instanceof HTMLElement && target.tagName === 'BUTTON';
    }

    function onPointerDown(event: PointerEvent): void {
      if (!enabled) return;
      pointerType = event.pointerType;
    }

    function onMouseDown(event: MouseEvent): void {
      if (!enabled) return;
      if (event.button !== 0) return;
      if (isMouseLike() && ignoreMouse) return;
      if (eventOpt === 'click') return;

      const sameTriggerType = ctx.popover.openEvent
        ? ctx.popover.openEvent.type === 'mousedown'
        : true;
      if (ctx.popover.open && toggle && sameTriggerType) {
        ctx.onOpenChange(false, event, 'click');
      } else {
        event.preventDefault();
        ctx.onOpenChange(true, event, 'click');
      }
    }

    function onClick(event: MouseEvent): void {
      if (!enabled) return;
      if (eventOpt === 'mousedown' && pointerType) {
        pointerType = undefined;
        return;
      }
      if (isMouseLike() && ignoreMouse) return;

      const sameTriggerType = ctx.popover.openEvent
        ? ctx.popover.openEvent.type === 'click'
        : true;
      if (ctx.popover.open && toggle && sameTriggerType) {
        ctx.onOpenChange(false, event, 'click');
      } else {
        ctx.onOpenChange(true, event, 'click');
      }
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (!enabled) return;
      pointerType = undefined;
      if (event.defaultPrevented || !keyboardHandlers || isButton(event.target)) return;

      if (event.key === ' ') {
        event.preventDefault();
        didKeyDown = true;
      }
      if (event.key === 'Enter') {
        if (ctx.popover.open && toggle) ctx.onOpenChange(false, event, 'click');
        else ctx.onOpenChange(true, event, 'click');
      }
    }

    function onKeyUp(event: KeyboardEvent): void {
      if (!enabled) return;
      if (event.defaultPrevented || !keyboardHandlers || isButton(event.target)) return;
      if (event.key === ' ' && didKeyDown) {
        didKeyDown = false;
        if (ctx.popover.open && toggle) ctx.onOpenChange(false, event, 'click');
        else ctx.onOpenChange(true, event, 'click');
      }
    }

    return {
      reference: {
        listeners: {
          pointerdown: onPointerDown,
          mousedown: onMouseDown,
          click: onClick,
          keydown: onKeyDown,
          keyup: onKeyUp,
        },
      },
    };
  };
}
