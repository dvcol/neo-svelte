import { debounce } from '@dvcol/common-utils/common/debounce';
import { watch } from '@dvcol/svelte-utils/watch';

import type { HTMLAttributes } from 'svelte/elements';

import type { SvelteEvent } from '~/utils/html-element.utils.js';

import { type NeoHandlePlacements, type NeoHandleProps } from '~/floating/common/neo-handle.model.js';
import { type NeoDialogPlacement } from '~/floating/common/neo-placement.model.js';

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
   * @default 'var(--neo-easing-spring, ease-in-out)'
   */
  easing?: string;
};

export type NeoMovableSnap = {
  /**
   * Whether the movable should snap to the viewport edges & center.
   */
  enabled?: boolean;
  /**
   * Whether the element should only snap to the corners of the viewport.
   */
  corner?: boolean;
  /**
   * Whether snapping to a corner should change the element placement.
   */
  placement?: boolean;
  /**
   * Whether the element can be snapped outside the viewport (with handles peeking in).
   *
   * @default true
   */
  outside?: boolean;
  /**
   * How much of the element should be visible when snapped outside the viewport.
   *
   * @default 25
   */
  offset?: number;
  /**
   * Translate css to apply when snapping to a position
   */
  translate?: NeoMovableSnapTranslate;
};

export type NeoMovableHandle = Pick<NeoHandleProps, 'visible' | 'handle' | 'position' | 'minSize'> & {
  /**
   * Whether the whole element should act as a handle.
   */
  full?: boolean;
};

export type NeoMovableLimit = {
  min?: number;
  max?: number;
};

export type NeoMovableLimits = {
  x?: NeoMovableLimit;
  y?: NeoMovableLimit;
};

export type NeoMovableThreshold = {
  x?: number;
  y?: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  outside?: boolean;
};

export type NeoMovable<Parsed extends boolean = false> = Pick<NeoHandleProps, 'enabled' | 'placement' | 'axis' | 'outside'> & {
  /**
   * The step size for dragging the element with arrow keys.
   *
   * @default 4
   **/
  step?: number;
  /**
   * The margin around the element when snapping to the viewport edges.
   *
   * @default 16px
   */
  margin?: number;
  /**
   * Whether the element should be contained within to the viewport edges.
   **/
  contain?: boolean;
  /**
   * Boundaries for the element movement.
   */
  limits?: NeoMovableLimits;
  /**
   * Whether the element's offset should be reset when it is closed.
   *
   * @default true
   */
  resetOnClose?: boolean;
  /**
   * The threshold offset over which the element should be closed.
   *
   * If falsy, the element will not be closed no matter how far it is dragged.
   *
   * All thresholds are absolute values.
   *
   * @default 0
   */
  closeThreshold?: number | NeoMovableThreshold;
  /**
   * Whether to show a handle for dragging the element.
   * If 'true', the handle will be visible whenever most appropriate.
   *
   * @default true
   */
  handle?: Parsed extends true ? NeoMovableHandle : boolean | NeoMovableHandle;
  /**
   * Whether the element should snap to the viewport edges.
   * If 'corner', the element will snap to the closest corner.
   *
   * @default false
   */
  snap?: Parsed extends true ? NeoMovableSnap : boolean | 'corner' | NeoMovableSnap;
};

export type NeoMoved = {
  x: number;
  y: number;
};

export type NeoMovableOutside = false | NeoHandlePlacements;

export type NeoMovableHandlers<Element extends HTMLElement> = Pick<HTMLAttributes<Element>, 'onpointerdown' | 'onkeydown' | 'onkeyup' | 'onblur'>;

export type NeoMovableUseOptions<Element extends HTMLElement, Handle extends HTMLElement> = {
  /**
   * The element's offset from its original position if any (applied transform).
   */
  offset: NeoMoved;
  /**
   * Whether the element is outside the viewport, and in which direction.
   */
  outside: NeoMovableOutside;
  /**
   * The element original placement.
   */
  placement: NeoDialogPlacement;
  /**
   * Movable options.
   */
  movable?: Partial<NeoMovable>;
  /**
   * Reference to the element to move.
   */
  element?: Element;
  /**
   * Callback to close the element.
   */
  close?: () => unknown | Promise<unknown>;
  /**
   * Event handlers to attach to the handle.
   */
  handlers?: Partial<NeoMovableHandlers<Handle>>;
};

export type NeoMovableOffsetOptions = { contain?: boolean; outside?: NeoMovableOutside; limits?: NeoMovableLimits };
export type NeoMovableResetOptions = NeoMovableOffsetOptions & { x?: number; y?: number; translate?: boolean | NeoMovableSnapTranslate };

export type NeoMovableUseResult<Element extends HTMLElement, Handle extends HTMLElement> = {
  /**
   * The element's offset from its original position if any (applied transform).
   */
  offset: NeoMoved;
  /**
   * Whether the element is outside the viewport, and in which direction.
   */
  outside: NeoMovableOutside;
  /**
   * The element original placement.
   */
  placement: NeoDialogPlacement;
  /**
   * Original movable options.
   */
  movable: NeoMovable;
  /**
   * Reference to the element to move.
   */
  element?: Element;
  /**
   * The css translate value to apply to the element.
   */
  translate: CSSStyleDeclaration['translate'];
  /**
   * If the element is currently being translated programmatically (snap or arrow keys).
   */
  translating: number;
  /**
   * If the element is currently being moved by the user (drag).
   */
  moving: boolean;
  /**
   * Event handlers to attach to the handle.
   */
  handlers: NeoMovableHandlers<Handle>;
  /**
   * Reset the element's offset to its original position.
   */
  reset: (options?: NeoMovableResetOptions) => Promise<boolean>;
};

export const defaultSnap: Required<NeoMovableSnap> = {
  enabled: false,
  corner: false,
  outside: true,
  placement: false,
  offset: 25,
  translate: { duration: 600, easing: 'var(--neo-easing-spring, ease-in-out)' },
};

export const defaultHandle: NeoMovableHandle = {
  full: false,
  visible: true,
  position: 'inside',
  minSize: 16,
};

export const defaultMovable: NeoMovable = {
  enabled: false,
  step: 4,
  margin: 16,
  contain: false,
  resetOnClose: true,
  snap: defaultSnap,
  handle: defaultHandle,
};

export const useMovable = <Element extends HTMLElement, Handle extends HTMLElement>(
  options: NeoMovableUseOptions<Element, Handle>,
): NeoMovableUseResult<Element, Handle> => {
  const offset = $derived(options.offset);
  const element = $derived(options.element);
  const placement = $derived(options.placement);
  const movable = $derived<NeoMovable>({
    ...defaultMovable,
    ...options.movable,
  });
  const snap = $derived.by(() => {
    const _snap = typeof movable.snap === 'object' ? movable.snap : { enabled: !!movable.snap, corner: movable.snap === 'corner' };
    return {
      ...defaultSnap,
      enabled: !!movable.snap,
      ..._snap,
      translate: { ...defaultSnap.translate, ..._snap.translate },
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
    if (computed.includes('translate')) element.style.transition = computed.replace(/translate[^;]+/g, `translate ${duration}ms ${easing}`);
    else element.style.transition = `${computed}, translate ${duration}ms ${easing}`;

    return { easing, duration };
  };
  const stopTranslating = debounce(async (delay = snap.translate.duration) => {
    clearTimeout(timeout);
    const { resolve, promise } = Promise.withResolvers<boolean>();
    timeout = setTimeout(() => {
      if (!element) return resolve(false);
      element.style.transition = transition;
      transition = '';
      translating = 0;
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

  const threshold = $derived.by(() => {
    if (!movable.closeThreshold) return;
    const _threshold = typeof movable.closeThreshold === 'number' ? { x: movable.closeThreshold, y: movable.closeThreshold } : movable.closeThreshold;
    const _fallback = _threshold.outside ? available : { top: 0, right: 0, bottom: 0, left: 0 };
    const _margin = movable.margin ?? 0;
    const { width, height } = element?.getBoundingClientRect() ?? { width: 0, height: 0 };
    return {
      top: _threshold.top ?? _threshold.y ?? _fallback.top + _margin + height,
      bottom: _threshold.bottom ?? _threshold.y ?? _fallback.bottom + _margin + height,
      left: _threshold.left ?? _threshold.x ?? _fallback.left + _margin + width,
      right: _threshold.right ?? _threshold.x ?? _fallback.right + _margin + width,
    };
  });

  const setOffset = (x: number, y: number, { contain = movable.contain, outside, limits = movable.limits }: NeoMovableOffsetOptions = {}) => {
    if (contain) {
      x = Math.min(Math.max(x, -available.left), available.right);
      y = Math.min(Math.max(y, -available.top), available.bottom);
    }
    if (limits?.x) {
      if (limits.x.min !== undefined) x = Math.max(x, limits.x.min);
      if (limits.x.max !== undefined) x = Math.min(x, limits.x.max);
    }
    if (limits?.y) {
      if (limits.y.min !== undefined) y = Math.max(y, limits.y.min);
      if (limits.y.max !== undefined) y = Math.min(y, limits.y.max);
    }
    options.offset.x = x;
    options.offset.y = y;
    if (outside !== undefined) options.outside = outside;
  };

  const resetOffset = ({ x, y, translate: _translate, ...opts }: NeoMovableResetOptions = {}) => {
    let duration = 0;
    if (_translate) duration = startTranslating(1, typeof _translate === 'object' ? _translate : undefined)?.duration ?? 0;
    setOffset(x ?? 0, y ?? 0, { contain: false, ...opts });
    return stopTranslating(duration);
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
      if (snap.outside && !_outside.previous && middleX > window.innerWidth) {
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
      if (snap.outside && !_outside.current && !_outside.previous && middleX < 0) {
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
      if (snap.outside && !_outside.current && !_outside.previous && middleY > window.innerHeight) {
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
      if (snap.outside && !_outside.current && !_outside.previous && middleY < 0) {
        _offset.y = -available.top - height - margin + snap.offset;
        _outside.current = 'top';
      } else _offset.y = -available.top;
    }
    // If the element center is closer to the middle of the window
    else _offset.y = windowY - halfHeight - available.top - margin;

    setOffset(_offset.x, _offset.y, { outside: _outside.current });

    await stopTranslating();
    if (!snap.placement) return;

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

  const closeOnThreshold = async () => {
    if (!element || !threshold) return false;
    if (
      // If the offset x is positive we are moving right
      offset.x <= threshold.right &&
      -offset.x <= threshold.left &&
      // If the offset y is positive we are moving down
      offset.y <= threshold.bottom &&
      -offset.y <= threshold.top
    ) {
      return false;
    }
    await options.close?.();
    return true;
  };

  let moving = $state(false);
  const onPointerStop = async () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerStop);
    window.removeEventListener('pointercancel', onPointerStop);
    window.removeEventListener('pointerleave', onPointerStop);
    moving = false;
    try {
      if (await closeOnThreshold()) return;
      await snapToClosest();
    } catch (e) {
      Logger.error(e);
    }
  };

  const onPointerDown = async (e: SvelteEvent<PointerEvent>) => {
    if (!movable.enabled || !element || e.button !== 0) return;
    if (translating) await stopTranslating(0);
    e.preventDefault();
    moving = true;
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

    stopTranslating.cancel();
    startTranslating(Math.min(translating + 1, 10), { duration: 100, easing: 'linear' });
    const step = (movable.step ?? 4) * translating;
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
    get moving() {
      return moving;
    },
    get handlers() {
      return {
        onpointerdown: (e: SvelteEvent<PointerEvent>) => {
          onPointerDown(e).catch(Logger.error);
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
