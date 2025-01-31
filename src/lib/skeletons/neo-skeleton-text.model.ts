import type { Snippet } from 'svelte';
import type { NeoSkeletonContainerProps } from '~/skeletons/neo-skeleton-container.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoSkeletonTextProps = {
  // Snippets

  /**
   * Snippet to display as the skeleton content.
   */
  children?: Snippet;

  // States

  /**
   * Whether to show the skeleton.
   */
  loading?: boolean;
  /**
   * Number of paragraphs to show.
   */
  paragraphs?: string | number;
  /**
   * Number of lines to show in each paragraph.
   */
  lines?: string | number | number[];

  // Styles
  /**
   * Whether to show the alternative style (with various text segments of different sizes).
   */
  alt?: boolean;
  /**
   * Whether to show the title.
   */
  title?: boolean;
  /**
   * Justify the text to fill the width of the container.
   */
  justify?: boolean;
  /**
   * Overrides the default flex value.
   */
  flex?: CSSStyleDeclaration['flex'];
  /**
   * Alignment strategy for the skeleton.
   */
  align?: CSSStyleDeclaration['alignSelf'];
  /**
   * Width of the element.
   */
  width?: CSSStyleDeclaration['width'];
  /**
   * Height of the element.
   */
  height?: CSSStyleDeclaration['height'];
  /**
   * Whether to add glass like transparency to the skeleton.
   */
  glass?: boolean;

  // Other props
  /**
   * Props for the title div.
   */
  titleProps?: HTMLNeoBaseElement;
  /**
   * Props for the paragraph div.
   */
  paragraphProps?: HTMLNeoBaseElement;
  /**
   * Props to pass to the skeleton container.
   */
  containerProps?: Omit<NeoSkeletonContainerProps, 'children' | 'content' | 'containerProps'>;
  /**
   * Props to pass to the transition container.
   */
  transitionProps?: NeoSkeletonContainerProps['containerProps'];
} & Pick<HTMLTransitionProps, 'in' | 'out'> &
  HTMLRefProps &
  HTMLNeoBaseElement;
