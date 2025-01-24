import type { Snippet } from 'svelte';
import type { NeoSkeletonContainerProps } from '~/skeletons/neo-skeleton-container.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoSkeletonMediaProps = {
  // Snippets

  /**
   * Snippet to display as the skeleton content.
   */
  children?: Snippet;
  /**
   * Optional media snippet to display.
   */
  media?: Snippet;

  // State
  /**
   * Whether to show the skeleton.
   */
  loading?: boolean;
  /**
   * Type of media skeleton to display.
   */
  type: 'image' | 'video' | 'avatar' | 'empty';
  /**
   * Size of the media skeleton icon.
   */
  size?: CSSStyleDeclaration['width'];
  /**
   * Alignment strategy for the skeleton.
   */
  align?: CSSStyleDeclaration['alignSelf'];
  /**
   * Width of the skeleton.
   */
  width?: CSSStyleDeclaration['width'];
  /**
   * Height of the skeleton.
   */
  height?: CSSStyleDeclaration['height'];

  // Styles
  /**
   * Whether to round the corners of the skeleton.
   */
  rounded?: boolean;
  /**
   * Whether to round the skeleton as a circle.
   */
  circle?: boolean;
  /**
   * Whether to add glass like transparency to the skeleton.
   */
  glass?: boolean;
  /**
   * Aspect ratio of the media.
   */
  ratio?: CSSStyleDeclaration['aspectRatio'] /**
   * Props to pass to the skeleton container.
   */;
  containerProps?: Omit<NeoSkeletonContainerProps, 'children' | 'content' | 'containerProps'>;
  /**
   * Props to pass to the transition container.
   */
  transitionProps?: NeoSkeletonContainerProps['containerProps'];
} & Pick<HTMLTransitionProps, 'in' | 'out'> &
  HTMLRefProps &
  HTMLNeoBaseElement;
