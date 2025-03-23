import { debounce } from '@dvcol/common-utils/common/debounce';

import { watch } from '@dvcol/svelte-utils/watch';

import type { HTMLAttributes } from 'svelte/elements';
import type { NeoHandleState } from '~/floating/common/neo-handle.model.js';
import type { NeoDialogPlacement } from '~/floating/common/neo-placement.model.js';
import type { SvelteEvent } from '~/utils/html-element.utils.js';

import { Logger } from '~/utils/logger.utils.js';

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
   */
  snap?: boolean;
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

export type NeoMovableHandlers<Element extends HTMLElement = HTMLButtonElement> = Pick<
  HTMLAttributes<Element>,
  'onpointerdown' | 'onkeydown' | 'onkeyup' | 'onblur'
>;

export const useMovable = <Element extends HTMLElement = HTMLElement>(options: {
  offset: NeoMoved;
  placement: NeoDialogPlacement;
  movable?: Partial<NeoMovable>;
  element?: Element;
  handlers?: Partial<NeoMovableHandlers>;
}): {
  offset: NeoMoved;
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
    snap: true,
    ...options.movable,
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
  const startTranslating = (value = 1, easing: string = '300ms ease-in-out') => {
    clearTimeout(timeout);
    translating = value;
    if (!element) return;
    if (!translating) transition = element.style.transition;
    const computed = getComputedStyle(element).transition;
    element.style.transition = computed.includes('translate')
      ? computed.replace(/translate[^;]+/g, `translate ${easing}`)
      : `${computed}, translate ${easing}`;
  };
  const stopTranslating = debounce(async (delay = 300) => {
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

  const setOffset = (x: number, y: number, contain = movable.contain) => {
    options.offset.x = !contain ? x : Math.min(Math.max(x, -available.left), available.right);
    options.offset.y = !contain ? y : Math.min(Math.max(y, -available.top), available.bottom);
  };

  const resetOffset = (x = 0, y = 0) => {
    setOffset(x, y, false);
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
    if (!element || !movable.snap) return;
    const { left, right, top, bottom, width, height, margin } = updateAvailable();
    if (left === undefined || right === undefined || top === undefined || bottom === undefined) return;

    startTranslating();

    const windowX = window.innerWidth / 2;
    const halfWidth = width / 2;
    const middleX = left + halfWidth;

    const _offset = { x: 0, y: 0 };
    const _placement = { x: '', y: '' };

    if (middleX > windowX && middleX - windowX > window.innerWidth - middleX) {
      _placement.x = 'right';
      _offset.x = available.right;
    } else if (middleX > windowX) {
      _offset.x = available.right + margin - (windowX - halfWidth);
    } else if (middleX < windowX - middleX) {
      _placement.x = 'left';
      _offset.x = -available.left;
    } else {
      _offset.x = windowX - halfWidth - available.left - margin;
    }

    const windowY = window.innerHeight / 2;
    const halfHeight = height / 2;
    const middleY = top + halfHeight;

    if (middleY > windowY && middleY - windowY > window.innerHeight - middleY) {
      _placement.y = 'bottom';
      _offset.y = available.bottom;
    } else if (middleY > windowY) {
      _offset.y = available.bottom + margin - (windowY - halfHeight);
    } else if (middleY < windowY - middleY) {
      _placement.y = 'top';
      _offset.y = -available.top;
    } else {
      _offset.y = windowY - halfHeight - available.top - margin;
    }

    setOffset(_offset.x, _offset.y);

    await stopTranslating();

    // TODO - custom grid position (i.e. every multiple of x, y steps)
    if (!_placement.x && !_placement.y) {
      options.placement = 'center';
    } else if (_placement.y === 'top' && _placement.x === 'left') {
      options.placement = options.placement?.startsWith('left') ? 'left-start' : 'top-start';
    } else if (_placement.y === 'top' && _placement.x === 'right') {
      options.placement = options.placement?.startsWith('right') ? 'right-start' : 'top-end';
    } else if (_placement.y === 'bottom' && _placement.x === 'left') {
      options.placement = options.placement?.startsWith('left') ? 'left-end' : 'bottom-start';
    } else if (_placement.y === 'bottom' && _placement.x === 'right') {
      options.placement = options.placement?.startsWith('right') ? 'right-end' : 'bottom-end';
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
    startTranslating(Math.min(translating + 1, 10), '100ms linear');
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
