import type { Snippet } from 'svelte';
import type { NeoSkeletonContainerProps } from '~/skeletons/neo-skeleton-container.model.js';

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
   * Type of media skeleton to display.
   */
  type: 'image' | 'video' | 'avatar' | 'empty';
  /**
   * Size of the media skeleton icon.
   */
  size?: CSSStyleDeclaration['width'];
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
   * Aspect ratio of the media.
   */
  ratio?: CSSStyleDeclaration['aspectRatio'];
} & Omit<NeoSkeletonContainerProps, 'children' | 'content'>;
