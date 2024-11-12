import type { Snippet } from 'svelte';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { HTMLFlexProps, HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoButtonGroupContext = {
  // States

  /**
   * The HTML tag to use for the button group.
   * @default 'div'
   */
  tag?: keyof HTMLElementTagNameMap;
  /**
   * If true, the button will be disabled and a loading skeleton will be displayed instead of the text.
   */
  skeleton?: boolean;

  // Styles

  /**
   * If true, the button group will start as flat on first render.
   */
  start?: boolean;
  /**
   * If true, only the button group content will be displayed.
   */
  text?: boolean;
  /**
   * If true, the button group will be displayed with no elevation.
   */
  flat?: boolean;
  /**
   * If true, the buttongroup  will be displayed with a glass effect.
   */
  glass?: boolean;
  /**
   * If true, the button group will have a rounded border.
   */
  rounded?: boolean;
  /**
   * If true, the button will not depress past the initial plane.
   */
  shallow?: boolean;
  /**
   * If true, the button group will be inset and the buttons flat.
   */
  inset?: boolean;
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
};

export type NeoButtonGroupProps = {
  /**
   * Snippet to display as the button content.
   */
  children?: Snippet<[NeoButtonGroupContext]>;

  // Styles
  /**
   * If true, the buttons will not wrap to the next line.
   */
  nowrap?: boolean;
} & NeoButtonGroupContext &
  HTMLFlexProps &
  HTMLNeoBaseElement &
  HTMLActionProps &
  HTMLRefProps;
