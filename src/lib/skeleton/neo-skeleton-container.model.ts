import type { Snippet } from 'svelte';
import type { NeoTransitionContainerProps } from '~/container/neo-transition-container.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';

export type NeoSkeletonContainerProps = {
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
} & Pick<HTMLTransitionProps, 'in' | 'out'>;
