import type { Snippet } from 'svelte';
import type { NeoAffixProps } from '~/inputs/common/neo-affix.model.js';
import type { HTMLTransitionProps, HTMLUseProps } from '~/utils/action.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';
import type { BlurElevation, BlurElevationString, ShadowShallowElevation, ShadowShallowElevationString } from '~/utils/shadow.utils.js';

export const NeoPillSize = {
  Small: 'small' as const,
  Medium: 'medium' as const,
  Large: 'large' as const,
} as const;

export type NeoPillSizes = (typeof NeoPillSize)[keyof typeof NeoPillSize];

export type NeoPillBlur = BlurElevation | BlurElevationString;
export type NeoPillElevation = ShadowShallowElevation | ShadowShallowElevationString;
export type NeoPillContext = {
  // State
  /**
   * Display a close button in the pill.
   */
  close?: boolean;
  /**
   * Color to use for the pill.
   */
  color?: Color;
  /**
   * Display a loading indicator in the pill.
   */
  loading?: boolean;
  /**
   * Disable interactions and display a disabled state.
   */
  disabled?: boolean;
  /**
   * Disable interactions and display a skeleton state.
   */
  skeleton?: boolean;
  /**
   * Set the size of the pill.
   *
   * @default large
   */
  size?: NeoPillSizes;
  /**
   * Pill elevation (-2 to 2).
   */
  elevation?: NeoPillElevation;
  /**
   * Pill elevation on hover (-2 to 2).
   */
  hover?: NeoPillElevation;
  /**
   * The blur level to apply when in glass mode.
   *
   * @default elevation, min: 1, max: 5
   * @see glass
   */
  blur?: NeoPillBlur;

  // Styles
  /**
   * Display the pill as borderless.
   */
  borderless?: boolean;
  /**
   * Rounds border radius.
   */
  rounded?: boolean;
  /**
   * Recess the content of the pill if elevation is inset (< 0).
   */
  pressed?: boolean;
  /**
   * Display the pill with a glass effect (translucent background and blur).
   */
  glass?: boolean;
  /**
   * Tints the pill with the current color.
   */
  tinted?: boolean;
  /**
   * Invert the text color and background to fill the pill.
   */
  filled?: boolean;
  /**
   * Display the pill as flat on first render.
   */
  start?: boolean;
};

export type NeoPillProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets
  /**
   * Snippet to display as the pill content.
   */
  children?: Snippet<[NeoPillContext]>;

  // State
  /**
   * The HTML tag to use for the pill.
   * @default div
   */
  tag?: Tag;

  // Events
  /**
   * Close event
   */
  onClose?: NonNullable<NeoAffixProps['closeProps']>['onclick'];

  // Other props
  /**
   * Props to pass to the close/loading affix.
   */
  affixProps?: NeoAffixProps;
} & NeoPillContext &
  HTMLTransitionProps &
  HTMLUseProps &
  HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
