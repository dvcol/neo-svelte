import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';
import type { ShadowElevation, ShadowElevationString } from '~/utils/shadow.utils.js';

export type NeoDividerElevation = ShadowElevation | ShadowElevationString;

export type NeoDividerProps = {
  // States
  /**
   * If true, the divider will be displayed vertically.
   */
  vertical?: boolean;
  /**
   * If true, a loading skeleton will be displayed instead of the divider.
   */
  skeleton?: boolean;

  // Styles
  /**
   * Divider elevation.
   *
   * @default -2
   */
  elevation?: NeoDividerElevation;
  /**
   * Divider height.
   */
  height?: CSSStyleDeclaration['height'];
  /**
   * Divider width.
   */
  width?: CSSStyleDeclaration['width'];
  /**
   * If true, the divider will be displayed with a glass effect.
   */
  glass?: boolean;
  /**
   * If true, the divider will have a rounded borders.
   */
  rounded?: boolean;
} & HTMLNeoBaseElement;
