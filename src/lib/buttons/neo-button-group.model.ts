import type { NeoButtonActiveElevation, NeoButtonBlur, NeoButtonHoverElevation } from 'src/lib/index.js';
import type { Snippet } from 'svelte';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLFlexProps, HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';
import type { ShadowElevation, ShadowElevationString } from '~/utils/shadow.utils.js';

export type NeoButtonGroupElevation = ShadowElevation | ShadowElevationString;
export type NeoButtonGroupContext = {
  // States

  /**
   * If true, the button will be disabled and a loading skeleton will be displayed instead of the text.
   */
  skeleton?: boolean;

  // Styles

  /**
   * Group elevation.
   * @default 3
   */
  elevation?: NeoButtonGroupElevation;
  /**
   * The blur level to apply.
   *
   * @default elevation, min: 1, max: 5
   * @see glass
   */
  blur?: NeoButtonBlur;
  /**
   * Button hover elevation.
   *
   * @default -1 (relative to base elevation)
   */
  buttonHover?: NeoButtonHoverElevation;
  /**
   * Button active elevation.
   *
   * @default -2 (relative to base elevation)
   */
  buttonActive?: NeoButtonActiveElevation;
  /**
   * If true, negative elevation (< 0) will be displayed as pressed instead of inset.
   */
  pressed?: boolean;
  /**
   * If true, positive elevation (> 0) will be displayed as convex instead of raised.
   */
  convex?: boolean;
  /**
   * If `true`, the group will never display a border.
   */
  borderless?: boolean;
  /**
   * If true, the button group will have a rounded border.
   */
  rounded?: boolean;
  /**
   * If true, the button group will be displayed with a shallower elevation when pressed.
   */
  shallow?: boolean;
  /**
   * Text color to use for the button.
   */
  color?: Color;
  /**
   * If true, the buttongroup  will be displayed with a glass effect.
   */
  glass?: boolean;
  /**
   * Tints the button with the current color.
   */
  tinted?: boolean;
  /**
   * If true, the button group will be surrounded by expanding waves.
   * The waves will reverse direction on hover or active states.
   */
  pulse?: boolean;
  /**
   * If true, the button group will be surrounded by coalescing waves.
   * The waves will reverse direction on hover or active states.
   */
  coalesce?: boolean;
  /**
   * If true, the button group will be stacked vertically.
   */
  vertical?: boolean;
  /**
   * If true, the button group will start as flat on first render.
   * @see [@starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) for browser support
   */
  start?: boolean;
};

export type NeoButtonGroupProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets
  /**
   * Snippet to display as the group content.
   */
  children?: Snippet<[NeoButtonGroupContext]>;

  // States
  /**
   * The HTML tag to use for the button group.
   * @default 'div'
   */
  tag?: Tag | keyof HTMLElementTagNameMap;

  // Styles
  /**
   * If true, the buttons will not wrap to the next line.
   */
  nowrap?: boolean;
} & NeoButtonGroupContext &
  HTMLFlexProps &
  HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]> &
  HTMLActionProps &
  HTMLRefProps;
