import type { Snippet } from 'svelte';

import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoTransitionContainerProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets

  /**
   * Snippet to display as the container content.
   */
  children?: Snippet;

  // States

  /**
   * The HTML tag to use for the container.
   * @default 'div'
   */
  tag?: Tag | keyof HTMLElementTagNameMap;
  /**
   * Optional key(s) to key the transitions.
   */
  key?: unknown | unknown[];

  // Styles

  /**
   * Overflow style (overflow-x).
   */
  overflow?: CSSStyleDeclaration['overflow'];
  /**
   * Horizontal overflow style (overflow-x).
   */
  overflowX?: CSSStyleDeclaration['overflowX'];
  /**
   * Vertical overflow style (overflow-x).
   */
  overflowY?: CSSStyleDeclaration['overflowY'];
  /**
   * Width of the container.
   */
  width?: CSSStyleDeclaration['width'];
  /**
   * Height of the container.
   */
  height?: CSSStyleDeclaration['height'];
  /**
   * Reverse the direction of the container.
   * Flow from right to left by default.
   */
  reverse?: boolean;
} & HTMLTransitionProps &
HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
