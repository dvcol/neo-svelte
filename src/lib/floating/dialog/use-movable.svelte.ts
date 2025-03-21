import { debounce } from '@dvcol/common-utils/common/debounce';

import type { Snippet } from 'svelte';
import type { SvelteEvent } from '~/utils/html-element.utils.js';

import { Logger } from '~/utils/logger.utils.js';

export type NeoMovableHandlePlacement = 'top' | 'right' | 'bottom' | 'left';

export type NeoMovable = {
  /** Whether the dialog can be dragged around. */
  enabled: boolean;
  /**
   * Placement of the dialog handle (or array of visible handles).
   *
   * @default 'top'
   **/
  placement: NeoMovableHandlePlacement | NeoMovableHandlePlacement[];
  /**
   * The step size for dragging the dialog with arrow keys.
   *
   * @default 4
   **/
  step: number;
  /** The allowed axis for dragging the dialog. */
  axis?: 'x' | 'y';
  /** Whether the dialog should snap to the viewport edges. */
  contain?: boolean;
  /** Whether the handle should be visible. */
  handle?: boolean;
  /** Optional render snippet for the handle. */
  render?: Snippet<['top' | 'right' | 'bottom' | 'left']>;
};

export type NeoMoved = {
  x: number;
  y: number;
};

export const useMovable = <Element extends HTMLElement = HTMLElement>(options: {
  movable?: Partial<NeoMovable>;
  offset?: Partial<NeoMoved>;
  element?: Element;
}): {
  offset: NeoMoved;
  movable: NeoMovable;
  element?: Element;
  translate?: CSSStyleDeclaration['translate'];
  translating: number;
  handlers: {
    onpointerdown: (e: SvelteEvent<PointerEvent>) => void;
    onkeydown: (e: SvelteEvent<KeyboardEvent>) => void;
    onkeyup: () => void;
    onblur: () => void;
  };
} => {
  const element = $derived(options.element);
  const movable = $derived<NeoMovable>({
    enabled: true,
    placement: 'top',
    step: 4,
    handle: true,
    contain: true,
    ...options.movable,
  });

  let offset = $state<NeoMoved>({ x: 0, y: 0, ...options.offset });
  let initial = $state<{ x: number; y: number }>({ x: 0, y: 0 });
  const translate = $derived.by(() => {
    if (movable.axis === 'x') return `${offset?.x ?? 0}px 0`;
    if (movable.axis === 'y') return `0 ${offset?.y ?? 0}px`;
    return `${offset?.x ?? 0}px ${offset?.y ?? 0}px`;
  });

  let available = $state({ top: 0, right: 0, bottom: 0, left: 0 });
  const updateAvailable = () => {
    if (!element) return;
    const { top, right, bottom, left } = element.getBoundingClientRect();
    available = {
      top: top - offset.y,
      bottom: window.innerHeight - (bottom - offset.y),
      left: left - offset.x,
      right: window.innerWidth - (right - offset.x),
    };
  };

  const setOffset = (x: number, y: number) => {
    offset = {
      x: !movable.contain ? x : Math.min(Math.max(x, -available.left), available.right),
      y: !movable.contain ? y : Math.min(Math.max(y, -available.top), available.bottom),
    };
    options.offset = $state.snapshot(offset);
  };

  const onPointerMove = (_e: PointerEvent) => {
    setOffset(_e.clientX - initial.x, _e.clientY - initial.y);
  };

  const onPointerStop = () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerStop);
    window.removeEventListener('pointercancel', onPointerStop);
    window.removeEventListener('pointerleave', onPointerStop);
  };

  const onHandleClick = (e: SvelteEvent<PointerEvent>) => {
    if (!movable.enabled || !element) return;
    e.preventDefault();
    initial = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    updateAvailable();
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerStop);
    window.addEventListener('pointercancel', onPointerStop);
    window.addEventListener('pointerleave', onPointerStop);
  };

  let translating = $state(0);
  const onHandleKeyUp = debounce(() => {
    translating = 0;
  }, 50);

  const onHandleKeyDown = (e: SvelteEvent<KeyboardEvent>) => {
    if (!movable.enabled || !element) return;
    if (!e.key.startsWith('Arrow')) return;
    initial = { x: 0, y: 0 };

    onHandleKeyUp.cancel().catch(Logger.error);
    translating = Math.min(translating + 1, 10);
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

  return {
    get offset() {
      return offset;
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
        onpointerdown: onHandleClick,
        onkeydown: onHandleKeyDown,
        onkeyup: onHandleKeyUp,
        onblur: onHandleKeyUp,
      };
    },
  };
};
