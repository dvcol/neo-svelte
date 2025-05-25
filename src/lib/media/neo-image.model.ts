import type { HTMLImgAttributes } from 'svelte/elements';

import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { HTMLRefProps } from '~/utils/html-element.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export interface NeoImageProps extends Omit<HTMLImgAttributes, 'width' | 'height'>, HTMLRefProps {
  // States
  /**
   * Whether the image is loaded.
   */
  loaded?: boolean;
  /**
   * Whether the image failed to load.
   */
  error?: boolean;
  /**
   * An optional fallback image source to use if the image fails to load.
   */
  fallback?: HTMLImgAttributes['src'];

  // Size
  /**
   * Optional flex strategy for the image.
   */
  flex?: CSSStyleDeclaration['flex'];
  /**
   * Optional width constraints for the image.
   */
  width?: SizeInput<'width'>;
  /**
   * Optional height constraints for the image.
   */
  height?: SizeInput<'height'>;
  /**
   * Optional aspect ratio for the image.
   */
  ratio?: CSSStyleDeclaration['aspectRatio'];
  /**
   * Optional object fit for the image.
   */
  fit?: CSSStyleDeclaration['objectFit'];

  // Styles
  /**
   * Rounds border radius.
   */
  rounded?: BorderRadiusInput;
}
