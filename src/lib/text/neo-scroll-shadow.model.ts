import type { Snippet } from 'svelte';

import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export type NeoScrollShadowProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  /**
   * Children to overflow
   */
  children?: Snippet;
  /**
   * HTML tag to render
   *
   * @default 'div'
   */
  tag?: Tag;
  /**
   * Whether to show a shadow mask on the scroll container
   */
  shadow?: boolean;
  /**
   * Whether to show a custom scrollbar
   */
  scrollbar?: boolean;
  /**
   * Optional flex strategy for the container
   */
  flex?: CSSStyleDeclaration['flex'];
  /**
   * Optional width constraints.
   */
  width?: SizeInput<'width'>;
  /**
   * Optional height constraints.
   */
  height?: SizeInput<'height'>;
  /**
   * Custom mask size
   */
  shadowSize?: CSSStyleDeclaration['width'];
  /**
   * Custom mask direction
   */
  direction?: 'top' | 'right';
  /**
   * Custom overflow value
   */
  overflow?: CSSStyleDeclaration['overflow'];
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]> &
HTMLRefProps<HTMLElementTagNameMap[Tag]>;
