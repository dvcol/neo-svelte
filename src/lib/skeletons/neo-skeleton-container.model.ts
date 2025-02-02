import type { Snippet } from 'svelte';
import type { NeoTransitionContainerProps } from '~/containers/neo-transition-container.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoSkeletonContainerProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets

  /**
   * Snippet to display as the skeleton.
   */
  children?: Snippet;
  /**
   * Snippet to display as the content.
   */
  content?: Snippet;

  // States

  /**
   * The HTML tag to use for the container.
   * @default 'div'
   */
  tag?: Tag | keyof HTMLElementTagNameMap;
  /**
   * Whether to show the skeleton.
   */
  loading?: boolean;

  // Styles

  /**
   * Width of the container.
   */
  width?: CSSStyleDeclaration['width'];
  /**
   * Height of the container.
   */
  height?: CSSStyleDeclaration['height'];

  // Other Props

  /**
   * Props for the transition container.
   */
  containerProps?: NeoTransitionContainerProps;
} & Pick<HTMLTransitionProps, 'in' | 'out'> &
  HTMLRefProps &
  HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
