import type { Snippet } from 'svelte';

import type { NeoImageProps } from '~/media/neo-image.model.js';
import type { NeoSkeletonMediaProps } from '~/skeletons/neo-skeleton-media.model.js';
import type { NeoSkeletonTextProps } from '~/skeletons/neo-skeleton-text.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps } from '~/utils/html-element.utils.js';
import type { BlurElevation, BlurElevationString, ShadowElevation, ShadowElevationString } from '~/utils/shadow.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export type NeoMediaElevation = ShadowElevation | ShadowElevationString;
export type NeoMediaBlur = BlurElevation | BlurElevationString;

export const NeoMediaType = {
  Image: 'image',
  Video: 'video',
  Audio: 'audio',
} as const;

export type NeoMediaTypes = (typeof NeoMediaType)[keyof typeof NeoMediaType];

export interface NeoMediaContext<Type extends NeoMediaTypes = NeoMediaTypes> {
  // States
  /**
   * Whether to show the media as a skeleton.
   */
  loading?: boolean;
  /**
   * The type of media to display.
   */
  type?: Type;

  // Styles
  /**
   * Whether to show a border around the media (when applicable).
   */
  borderless?: boolean;
  /**
   * Recess the content of the media if elevation is inset (< 0).
   */
  pressed?: boolean;
  /**
   * Whether to show the media with a border radius.
   */
  rounded?: BorderRadiusInput;
  /**
   * Whether to show the media with a glass effect.
   */
  glass?: boolean;
  /**
   * Color to tint the media with.
   */
  color?: Color | CSSStyleDeclaration['color'];
  /**
   * Whether to tint the media background with the color.
   */
  tinted?: boolean;
  /**
   * Whether to fill the media with the color.
   */
  filled?: boolean;
  /**
   * Whether to display the media as flat on first render.
   */
  start?: boolean;

  // Shadow
  /**
   * Media elevation.
   * @default 3
   */
  elevation?: NeoMediaElevation;
  /**
   * The blur level to apply when in glass mode.
   *
   * @default elevation, min: 1, max: 5
   * @see glass
   */
  blur?: NeoMediaBlur;
}

export interface NeoMediaProps<Type extends NeoMediaTypes = NeoMediaTypes, Tag extends keyof HTMLElementTagNameMap = 'figure'> extends NeoMediaContext<Type>, Omit<HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>, 'children' | 'color'>, HTMLRefProps, HTMLTransitionProps {
  // Snippets
  /**
   * Element(s) to render inside the media.
   */
  children?: Snippet<[NeoMediaContext<Type>]>;
  /**
   * A snippet or a string to display as the media caption.
   */
  caption?: string | Snippet<[NeoMediaContext<Type>]>;

  // States
  /**
   * The HTML tag to use for the media component.
   *
   * @default 'figure'
   */
  tag?: Tag;

  // Media
  /**
   * The props to pass to the image element.
   */
  image?: NeoImageProps;

  // Sizes
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
   * Optional aspect ratio for the media.
   */
  ratio?: CSSStyleDeclaration['aspectRatio'];

  // OtherProps
  /**
   * The props to pass to the caption element.
   */
  captionProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * The props to pass to the caption skeleton loader.
   */
  skeletonTextProps?: NeoSkeletonTextProps;
  /**
   * The props to pass to the media skeleton loader.
   */
  skeletonMediaProps?: NeoSkeletonMediaProps;
}
