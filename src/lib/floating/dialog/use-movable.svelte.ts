import { debounce } from '@dvcol/common-utils/common/debounce';

import { watch } from '@dvcol/svelte-utils/watch';

import type { HTMLAttributes } from 'svelte/elements';
import type { NeoHandleState } from '~/floating/common/neo-handle.model.js';
import type { NeoDialogPlacement } from '~/floating/common/neo-placement.model.js';
import type { SvelteEvent } from '~/utils/html-element.utils.js';

import { Logger } from '~/utils/logger.utils.js';

export type NeoMovableSnapTranslate = {
  /**
   * Translate duration (in ms).
   *
   * @default 600
   */
  duration?: number;
  /**
   * Easing function.
   *
   * @default 'var(--neo-transition-spring, ease-in-out)'
   */
  easing?: string;
};

export type NeoMovableSnap = {
  /**
   * Whether the movable should snap to the viewport edges & center.
   */
  enabled?: boolean;
  /**
   * Whether the dialog should only snap to the corners of the viewport.
   */
  corner?: boolean;
  /**
   * Whether snapping to a corner should change the dialog placement.
   */
  placement?: boolean;
  /**
   * Whether the dialog can be snapped outside the viewport (with handles peeking in).
   */
  outside?: boolean;
  /**
   * How much of the dialog should be visible when snapped outside the viewport.
   *
   * @default 16
   */
  offset?: number;
  /**
   * Translate css to apply when snapping to a position
   */
  translate?: NeoMovableSnapTranslate;
  grid?: number | { x: number; y: number }; // TODO
};

export type NeoMovable = NeoHandleState & {
  /**
   * The step size for dragging the dialog with arrow keys.
   *
   * @default 4
   **/
  step: number;
  /**
   * Whether the dialog should snap to the viewport edges.
   **/
  contain?: boolean;
  /**
   * Whether the dialog should snap to the viewport edges.
   * If 'corner', the dialog will snap to the closest corner.
   */
  snap?: boolean | 'corner' | NeoMovableSnap;
  /**
   * The margin around the dialog when snapping to the viewport edges.
   *
   * @default 16px
   */
  margin?: number;
};

export type NeoMoved = {
  x: number;
  y: number;
};

export type NeoMovableOutside = false | 'top' | 'bottom' | 'left' | 'right';

export type NeoMovableHandlers<Element extends HTMLElement = HTMLButtonElement> = Pick<
  HTMLAttributes<Element>,
  'onpointerdown' | 'onkeydown' | 'onkeyup' | 'onblur'
>;

export const useMovable = <Element extends HTMLElement = HTMLElement>(options: {
  offset: NeoMoved;
  outside: NeoMovableOutside;
  placement: NeoDialogPlacement;
  movable?: Partial<NeoMovable>;
  element?: Element;
  handlers?: Partial<NeoMovableHandlers>;
}): {
  offset: NeoMoved;
  outside: NeoMovableOutside;
  movable: NeoMovable;
  element?: Element;
  placement: NeoDialogPlacement;
  translate: CSSStyleDeclaration['translate'];
  translating: number;
  handlers: NeoMovableHandlers;
  reset: () => Promise<unknown>;
} => {
  const offset = $derived(options.offset);
  const element = $derived(options.element);
  const placement = $derived(options.placement);
  const movable = $derived<NeoMovable>({
    enabled: true,
    placement: 'top',
    step: 4,
    handle: true,
    margin: 16,
    contain: false,
    snap: 'corner',
    ...options.movable,
  });
  const snap = $derived.by(() => {
    const _snap = typeof movable.snap === 'object' ? movable.snap : { enabled: !!movable.snap, corner: movable.snap === 'corner' };
    return {
      enabled: !!movable.snap,
      offset: 16,
      ..._snap,
      translate: { duration: 600, easing: 'var(--neo-transition-spring, ease-in-out)', ..._snap.translate },
    };
  });

  let initial = $state<{ x: number; y: number }>({ x: 0, y: 0 });
  const translate = $derived.by(() => {
    if (movable.axis === 'x') return `${offset?.x ?? 0}px 0`;
    if (movable.axis === 'y') return `0 ${offset?.y ?? 0}px`;
    return `${offset?.x ?? 0}px ${offset?.y ?? 0}px`;
  });

  let translating = $state(0);
  let transition: string = '';
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const startTranslating = (value = 1, { easing = snap.translate.easing, duration = snap.translate.duration }: NeoMovableSnapTranslate = {}) => {
    clearTimeout(timeout);
    translating = value;
    if (!element) return;
    if (!translating) transition = element.style.transition;
    const computed = getComputedStyle(element).transition;
    element.style.transition = computed.includes('translate')
      ? computed.replace(/translate[^;]+/g, `translate ${duration}ms ${easing}`)
      : `${computed}, translate ${duration}ms ${easing}`;
  };
  const stopTranslating = debounce(async (delay = snap.translate.duration) => {
    clearTimeout(timeout);
    translating = 0;
    const { resolve, promise } = Promise.withResolvers();
    timeout = setTimeout(() => {
      if (translating || !element) return resolve(false);
      element.style.transition = transition;
      transition = '';
      resolve(true);
    }, delay);
    return promise;
  }, 50);

  let available = $state({ top: 0, right: 0, bottom: 0, left: 0 });
  const updateAvailable = () => {
    if (!element) return {};
    const { top, right, bottom, left, width, height } = element.getBoundingClientRect();
    const margin = movable.margin ?? 0;
    available = {
      top: Math.max(0, top - offset.y - margin),
      bottom: Math.max(0, window.innerHeight - (bottom - offset.y) - margin),
      left: Math.max(0, left - offset.x - margin),
      right: Math.max(0, window.innerWidth - (right - offset.x) - margin),
    };
    return { top, right, bottom, left, width, height, margin, available };
  };

  const setOffset = (x: number, y: number, { contain = movable.contain, outside }: { contain?: boolean; outside?: NeoMovableOutside } = {}) => {
    options.offset.x = !contain ? x : Math.min(Math.max(x, -available.left), available.right);
    options.offset.y = !contain ? y : Math.min(Math.max(y, -available.top), available.bottom);
    if (outside !== undefined) options.outside = outside;
  };

  const resetOffset = (x = 0, y = 0) => {
    setOffset(x, y, { contain: false });
    return stopTranslating(0);
  };

  watch(
    () => {
      resetOffset().catch(Logger.error);
    },
    () => placement,
    { skip: 1 },
  );

  const onPointerMove = (_e: PointerEvent) => {
    setOffset(_e.clientX - initial.x, _e.clientY - initial.y);
  };

  const snapToClosest = async () => {
    if (!element || !snap.enabled) return;
    const { left, right, top, bottom, width, height, margin } = updateAvailable();
    if (left === undefined || right === undefined || top === undefined || bottom === undefined) return;

    startTranslating();

    const windowX = window.innerWidth / 2;
    const halfWidth = width / 2;
    const middleX = left + halfWidth;

    const _offset = { x: 0, y: 0 };
    const _placement = { x: '', y: '' };
    const _outside: Record<string, NeoMovableOutside> = { previous: options.outside, current: false };

    // If element center is over the middle of the window
    if (middleX > windowX && (snap.corner || middleX - windowX > window.innerWidth - middleX)) {
      _placement.x = 'right';
      // If the element center is outside the window
      if (!_outside.previous && middleX > window.innerWidth) {
        _offset.x = available.right + width + margin - snap.offset;
        _outside.current = 'right';
      } else _offset.x = available.right;
    }
    // If the element center is closer to the middle of the window
    else if (middleX > windowX) _offset.x = available.right + margin - (windowX - halfWidth);
    // If the element center is before the middle of the window
    else if (snap.corner || middleX < windowX - middleX) {
      _placement.x = 'left';
      // If the element center is outside the window
      if (!_outside.current && !_outside.previous && middleX < 0) {
        _offset.x = -available.left - width - margin + snap.offset;
        _outside.current = 'left';
      } else _offset.x = -available.left;
    }
    // If the element center is closer to the middle of the window
    else _offset.x = windowX - halfWidth - available.left - margin;

    const windowY = window.innerHeight / 2;
    const halfHeight = height / 2;
    const middleY = top + halfHeight;

    // If element center is below the middle of the window
    if (middleY > windowY && (snap.corner || middleY - windowY > window.innerHeight - middleY)) {
      _placement.y = 'bottom';
      // If the element center is outside the window
      if (!_outside.current && !_outside.previous && middleY > window.innerHeight) {
        _offset.y = available.bottom + height + margin - snap.offset;
        _outside.current = 'bottom';
      } else _offset.y = available.bottom;
    }
    // If the element center is closer to the middle of the window
    else if (middleY > windowY) _offset.y = available.bottom + margin - (windowY - halfHeight);
    // If the element center is above the middle of the window
    else if (snap.corner || middleY < windowY - middleY) {
      _placement.y = 'top';
      // If the element center is outside the window
      if (!_outside.current && !_outside.previous && middleY < 0) {
        _offset.y = -available.top - height - margin + snap.offset;
        _outside.current = 'top';
      } else _offset.y = -available.top;
    }
    // If the element center is closer to the middle of the window
    else _offset.y = windowY - halfHeight - available.top - margin;

    setOffset(_offset.x, _offset.y, { outside: _outside.current });

    await stopTranslating();
    if (!snap.placement) return;

    // TODO - custom grid position (i.e. every multiple of x, y steps)
    if (!_placement.x && !_placement.y) {
      options.placement = 'center';
    } else if (_placement.y === 'top' && _placement.x === 'left') {
      options.placement = snap.corner || options.placement?.startsWith('left') ? 'left-start' : 'top-start';
    } else if (_placement.y === 'top' && _placement.x === 'right') {
      options.placement = snap.corner || options.placement?.startsWith('right') ? 'right-start' : 'top-end';
    } else if (_placement.y === 'bottom' && _placement.x === 'left') {
      options.placement = snap.corner || options.placement?.startsWith('left') ? 'left-end' : 'bottom-start';
    } else if (_placement.y === 'bottom' && _placement.x === 'right') {
      options.placement = snap.corner || options.placement?.startsWith('right') ? 'right-end' : 'bottom-end';
    } else if (_placement.y === 'top' && !_placement.x) {
      options.placement = 'top';
    } else if (_placement.y === 'bottom' && !_placement.x) {
      options.placement = 'bottom';
    } else if (_placement.x === 'left' && !_placement.y) {
      options.placement = 'left';
    } else if (_placement.x === 'right' && !_placement.y) {
      options.placement = 'right';
    }
  };

  const onPointerStop = () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerStop);
    window.removeEventListener('pointercancel', onPointerStop);
    window.removeEventListener('pointerleave', onPointerStop);
    snapToClosest().catch(Logger.error);
  };

  const onPointerDown = (e: SvelteEvent<PointerEvent>) => {
    if (!movable.enabled || !element || e.button !== 0) return;
    initial = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    updateAvailable();
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerStop);
    window.addEventListener('pointercancel', onPointerStop);
    window.addEventListener('pointerleave', onPointerStop);
  };

  const onKeyDown = (e: SvelteEvent<KeyboardEvent>) => {
    if (!movable.enabled || !element) return;
    if (!e.key.startsWith('Arrow')) return;
    initial = { x: 0, y: 0 };

    stopTranslating.cancel().catch(Logger.error);
    startTranslating(Math.min(translating + 1, 10), { duration: 100, easing: 'linear' });
    const step = movable.step * translating;
    if (e.key === 'ArrowLeft') {
      setOffset(offset.x - step, offset.y);
    } else if (e.key === 'ArrowRight') {
      setOffset(offset.x + step, offset.y);
    } else if (e.key === 'ArrowUp') {
      setOffset(offset.x, offset.y - step);
    } else if (e.key === 'ArrowDown') {
      setOffset(offset.x, offset.y + step);
    }
  };

  const onKeyUp = async (e: SvelteEvent<KeyboardEvent>) => {
    if (!e.key.startsWith('Arrow')) return;
    await stopTranslating(0);
    await snapToClosest();
  };

  return {
    get offset() {
      return offset;
    },
    get outside() {
      return options.outside;
    },
    get placement() {
      return placement;
    },
    get movable() {
      return movable;
    },
    get element() {
      return element;
    },
    get translate() {
      return translate;
    },
    get translating() {
      return translating;
    },
    get handlers() {
      return {
        onpointerdown: (e: SvelteEvent<PointerEvent>) => {
          onPointerDown(e);
          return options.handlers?.onpointerdown?.(e);
        },
        onkeydown: (e: SvelteEvent<KeyboardEvent>) => {
          onKeyDown(e);
          return options.handlers?.onkeydown?.(e);
        },
        onkeyup: async (e: SvelteEvent<KeyboardEvent>) => {
          onKeyUp(e).catch(Logger.error);
          return options.handlers?.onkeyup?.(e);
        },
        onblur: (e: SvelteEvent<FocusEvent>) => {
          stopTranslating().catch(Logger.error);
          return options.handlers?.onblur?.(e);
        },
      };
    },
    reset: resetOffset,
  };
};
