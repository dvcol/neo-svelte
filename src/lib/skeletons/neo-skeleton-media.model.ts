import type { Snippet } from 'svelte';

import type { NeoSkeletonContainerProps } from '~/skeletons/neo-skeleton-container.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

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
  type?: 'image' | 'video' | 'avatar' | 'empty';
  /**
   * Size of the media skeleton icon.
   */
  size?: CSSStyleDeclaration['width'];
  /**
   * Alignment strategy for the skeleton.
   */
  align?: CSSStyleDeclaration['alignSelf'];
  /**
   * Optional aspect ratio for the image.
   */
  ratio?: CSSStyleDeclaration['aspectRatio'];
  /**
   * Overrides the default flex value.
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
   * Whether to enable the skeleton container.
   */
  disabled?: boolean;

  // Styles
  /**
   * Whether to round the corners of the skeleton.
   */
  rounded?: BorderRadiusInput;
  /**
   * Whether to round the skeleton as a circle.
   */
  circle?: boolean;
  /**
   * Whether to add glass like transparency to the skeleton.
   */
  glass?: boolean;
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
