import type { Snippet } from 'svelte';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoTransitionContainerProps = {
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
  tag?: keyof HTMLElementTagNameMap;

  // Styles

  /**
   * Horizontal overflow style (overflow-x).
   */
  overflow?: CSSStyleDeclaration['overflowX'];
  /**
   * Width of the container.
   */
  width?: CSSStyleDeclaration['width'];
  /**
   * Height of the container.
   */
  height?: CSSStyleDeclaration['height'];
} & HTMLNeoBaseElement;
