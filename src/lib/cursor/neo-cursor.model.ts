import { getClickableAncestor, isClickable } from '@dvcol/common-utils/common/element';

import type { Snippet } from 'svelte';

import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export const NeoCursorPointerType = {
  Mouse: 'mouse' as const,
  Touch: 'touch' as const,
  Pen: 'pen' as const,
} as const;

export type NeoCursorPointerTypes = (typeof NeoCursorPointerType)[keyof typeof NeoCursorPointerType];

export const NeoCursorType = {
  Snap: 'snap' as const,
  Text: 'text' as const,
  Auto: 'auto' as const,
  None: 'none' as const,
} as const;

export type NeoCursorTypes = (typeof NeoCursorType)[keyof typeof NeoCursorType];

export type NeoCursorContext = {
  /**
   * Show/hide the cursor.
   */
  show?: boolean;
  /**
   * Cursor type (snap, text, auto, etc.)
   */
  cursor?: string | NeoCursorTypes;
  /**
   * Pointer type (mouse, touch, pen, etc.)
   */
  pointer?: NeoCursorPointerTypes | PointerEvent['pointerType'];
  /**
   * Pointer state after making contact with the surface.
   */
  contact?: NeoCursorContact;
  /**
   * Cursor position with x, y, width, height, and radius.
   */
  position?: NeoCursorPosition;
  /**
   * Target element on which the cursor is snapping / can snap to.
   */
  target?: Element | null;
  /**
   * Transition state ('in', 'out', false).
   */
  transition?: boolean | 'in' | 'out';
  /**
   * Whether the cursor is snapping to an element.
   */
  snapping?: boolean;
  /**
   * Whether the cursor is touching the surface.
   */
  touching?: boolean;
  /**
   * Whether the cursor shows pressure information.
   */
  pressure?: boolean;
  /**
   * Whether the cursor shows tilt information.
   */
  tilt?: boolean;
};

export type NeoCursorProps = {
  // Snippets

  /**
   * Inner content of the cursor container (if any).
   */
  children?: Snippet<[NeoCursorContext]>;
  /**
   * Optional custom cursor override.
   *
   * @see NeoCursorPointer
   */
  custom?: Snippet<[NeoCursorContext]>;

  // Bindable Props

  /**
   * Reference to the cursor container if no target is provided.
   * @see target
   */
  ref?: HTMLElement;
  /**
   * Cursor type (snap, text, auto, etc.)
   */
  cursor?: NeoCursorContext['cursor'];
  /**
   * Pointer type (mouse, touch, pen, etc.)
   */
  pointer?: NeoCursorContext['pointer'];
  /**
   * Pointer state after making contact with the surface.
   */
  contact?: NeoCursorContext['contact'];
  /**
   * Current position of the replacement cursor.
   */
  position?: NeoCursorContext['position'];
  /**
   * Target element on which the cursor is snapping / can snap to.
   */
  snapTarget?: NeoCursorContext['target'];
  /**
   * Whether the cursor is snapping to an element.
   */
  snapping?: NeoCursorContext['snapping'];
  /**
   * Whether the cursor is touching the surface.
   */
  touching?: NeoCursorContext['touching'];

  // Other Props

  /**
   * Optional container HTML tag.
   * @default 'div'
   */
  tag?: keyof HTMLElementTagNameMap;
  /**
   * Target element on which the pointer listeners are attached.
   *
   * @default document.body if no children are provided, undefined otherwise
   */
  target?: HTMLElement;
  /**
   * Pointer type (mouse, touch, pen, etc.) to listen for.
   */
  watch?: PointerEvent['pointerType'];
  /**
   * Whether the cursor can snap to snap-able elements.
   */
  snap?: boolean;
  /**
   * The delay in milliseconds before the cursor snaps to the closest clickable element.
   * @default 10
   * @see snap
   */
  delay?: number;
  /**
   * Disable cursor tracking.
   */
  disabled?: boolean;
  /**
   * Whether the cursor shows pressure information.
   */
  pressure?: NeoCursorContext['pressure'];
  /**
   * Whether the cursor shows tilt information.
   */
  tilt?: NeoCursorContext['tilt'];
  /**
   * Whether to listen for pointer move, or raw update (when supported).
   *
   * Note: PointerEvent.update is not supported in all browsers and may introduce performance issues.
   * @default false
   * @see [PointerEvent.update](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerrawupdate_event)
   */
  raw?: boolean;
} & Omit<HTMLNeoBaseElement, 'children'>;

export type NeoCursorPosition = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: string;
};

export type NeoCursorContact = {
  size: { width: PointerEvent['width']; height: PointerEvent['height'] };
  tilt: { x: PointerEvent['tiltX']; y: PointerEvent['tiltY'] };
  twist: PointerEvent['twist'];
  angle: { azimuth: PointerEvent['azimuthAngle']; altitude: PointerEvent['altitudeAngle'] };
  pressure: { point: PointerEvent['pressure']; tangential: PointerEvent['tangentialPressure'] };
};

export type NeoCursorState = {
  /**
   * Pointer position.
   */
  coordinates: { x: number; y: number };
  /**
   * Pointer type (mouse, touch, pen, etc.)
   */
  pointer: NeoCursorPointerTypes | PointerEvent['pointerType'];
  /**
   * Cursor style (snap, text, auto, etc.)
   */
  cursor?: string | NeoCursorTypes;
  /**
   * Closest clickable element.
   */
  target?: Element | null;
  /**
   * Pointer state after making contact with the surface.
   */
  contact?: NeoCursorContact;
  /**
   * Original PointerEvent.
   */
  event?: PointerEvent;
};

export const getClosestClickable = (element: Element, boundary?: Element | (() => Element)) =>
  getClickableAncestor(element, boundary, (el: Element) => {
    if (el.getAttribute('data-neo-cursor') === 'false' || el.getAttribute('data-neo-cursor') === 'none') return false;
    if (el.getAttribute('data-neo-cursor') === 'snap') return true;
    return isClickable(el);
  });

export const getFirstDataNeoCursor = (element?: Element | null, boundary?: Element | (() => Element)): string | undefined | null => {
  if (!element) return;
  if (typeof boundary === 'function' && boundary() === element) return;
  if (boundary === element) return;
  if (element.hasAttribute('data-neo-cursor')) return element.getAttribute('data-neo-cursor');
  if (!element.parentElement) return;
  return getFirstDataNeoCursor(element.parentElement, boundary);
};
