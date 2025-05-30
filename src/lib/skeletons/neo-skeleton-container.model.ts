import type { Snippet } from 'svelte';

import type { NeoTransitionContainerProps } from '~/containers/neo-transition-container.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export interface NeoSkeletonContainerContext {
  /**
   * Computed content width.
   */
  width?: string;
  /**
   * Computed content height.
   */
  height?: string;
}

export type NeoSkeletonContainerProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets

  /**
   * Snippet to display as the skeleton.
   */
  children?: Snippet<[NeoSkeletonContainerContext]>;
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
  /**
   * Whether to enable the skeleton container.
   */
  disabled?: boolean;
  /**
   * The context to pass to the skeleton.
   */
  context?: NeoSkeletonContainerContext;

  // Styles

  /**
   * Optional flex strategy for the container
   */
  flex?: CSSStyleDeclaration['flex'];
  /**
   * Optional aspect ratio for the container.
   */
  ratio?: CSSStyleDeclaration['aspectRatio'];
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

  // Other Props

  /**
   * Props for the transition container.
   */
  containerProps?: NeoTransitionContainerProps;
} & Pick<HTMLTransitionProps, 'in' | 'out'> &
HTMLRefProps &
Omit<HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>, 'children'>;
