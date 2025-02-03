import type { Snippet } from 'svelte';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

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
   * Custom mask size
   */
  size?: CSSStyleDeclaration['width'];
  /**
   * Custom mask direction
   */
  direction?: 'top' | 'right';
  /**
   * Custom overflow value
   */
  overflow?: CSSStyleDeclaration['overflow'];
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
