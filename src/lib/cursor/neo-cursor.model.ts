import { getClickableAncestor, isClickable } from '@dvcol/common-utils/common/element';

import type { Snippet } from 'svelte';

import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoCursorContext = {
  /**
   * Hide the cursor.
   */
  hidden?: boolean;
  /**
   * Cursor style (snap, text, auto, etc.)
   */
  cursor?: string;
  /**
   * Cursor position with x, y, width, height, and radius.
   */
  position?: NeoCursorPosition;
  /**
   * Transition state ('in', 'out', false).
   */
  transition?: boolean | 'in' | 'out';
  /**
   * Whether the cursor is snapping to an element.
   */
  snap?: boolean;
};

export type NeoCursorProps = {
  /**
   * Inner content of the cursor container (if any).
   */
  children?: Snippet<[NeoCursorContext]>;
  /**
   * Optional cursor override.
   *
   * @see NeoCursorPointer
   */
  cursor?: Snippet<[NeoCursorContext]>;

  /**
   * Optional container HTML tag.
   * @default 'div'
   */
  tag?: keyof HTMLElementTagNameMap;
  /**
   * Reference to the cursor container if no target is provided.
   * @see target
   */
  ref?: HTMLElement;
  /**
   * Target element on which the pointer listeners are attached.
   *
   * @default document.body if no children are provided, undefined otherwise
   */
  target?: HTMLElement;
  /**
   * Parsed cursor state.
   */
  value?: NeoCursorState;
  /**
   * Current position of the replacement cursor.
   */
  position?: NeoCursorPosition;
  /**
   * Pointer type (mouse, touch, pen, etc.) to listen for.
   */
  pointer?: PointerEvent['pointerType'];
  /**
   * Whether to snap the cursor to the closest clickable element.
   */
  snap?: boolean;
  /**
   * The delay in milliseconds before the cursor snaps to the closest clickable element.
   * @default 10
   * @see snap
   */
  delay?: number;
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

export type NeoCursorState = {
  /**
   * Pointer position.
   */
  cursor: { x: number; y: number };
  /**
   * Cursor style (snap, text, auto, etc.)
   */
  style?: string;
  /**
   * Closest clickable element.
   */
  clickable?: Element | null;
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
