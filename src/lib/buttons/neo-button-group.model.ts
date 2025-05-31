import type { Snippet } from 'svelte';

import type { NeoButtonActiveElevation, NeoButtonBlur, NeoButtonHoverElevation } from '~/buttons/neo-button.model.js';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLFlexProps, HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';
import type { ShadowElevation, ShadowElevationString } from '~/utils/shadow.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export type NeoButtonGroupElevation = ShadowElevation | ShadowElevationString;
export interface NeoButtonGroupContext {
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
   * Group hover elevation.
   *
   * @default 0 (relative to base elevation)
   */
  hover?: NeoButtonHoverElevation;
  /**
   * The blur level to apply.
   *
   * @default elevation, min: 1, max: 5
   * @see glass
   */
  blur?: NeoButtonBlur;
  /**
   * Shadow elevation for the buttons (hover, active, pressed).
   */
  button?: {
    /**
     * Button hover elevation.
     *
     * @default -1 (relative to base elevation)
     */
    hover?: NeoButtonHoverElevation;
    /**
     * Button active elevation.
     *
     * @default -2 (absolute value)
     */
    active?: NeoButtonActiveElevation;
    /**
     * Whether the pressed state should be displayed as recessed or pressed.
     *
     * @default true if `elevation` + `hover` > 0 && `active` < 0
     */
    pressed?: boolean;
  };
  /**
   * Shorthand for a flat borderless inset button group.
   *
   * @defaults`{ elevation: 0, hover: 0, active: -2, pressed: false, borderless: true }`
   */
  text?: boolean;
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
  rounded?: BorderRadiusInput;
  /**
   * Text color to use for the button.
   */
  color?: Color | CSSStyleDeclaration['color'];
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
}

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
  /**
   * The offset height of the button group.
   */
  offsetHeight?: HTMLElementTagNameMap[Tag]['offsetHeight'];
  /**
   * The offset width of the button group.
   */
  offsetWidth?: HTMLElementTagNameMap[Tag]['offsetWidth'];

  // Styles
  /**
   * If true, the buttons will not wrap to the next line.
   */
  nowrap?: boolean;

  // Size
  /**
   * Optional width constraints.
   */
  width?: SizeInput<'width'>;
  /**
   * Optional height constraints.
   */
  height?: SizeInput<'height'>;
} & NeoButtonGroupContext &
HTMLFlexProps &
HTMLActionProps &
HTMLRefProps &
Omit<HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>, 'children'>;
