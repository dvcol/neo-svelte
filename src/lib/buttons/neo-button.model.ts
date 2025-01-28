import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLFlexProps, HTMLNeoBaseElement, HTMLRefProps, SvelteEvent } from '~/utils/html-element.utils.js';

export type NeoButtonProps<Tag extends keyof HTMLElementTagNameMap = 'button'> = {
  // Snippets

  /**
   * Snippet to display as the button content.
   */
  children?: Snippet;
  /**
   * Optional snippet or text to display as the button label.
   */
  label?: Snippet | string;
  /**
   * Optional icon snippet to display before the text.
   */
  icon?: Snippet;

  // States

  /**
   * The HTML tag to use for the button.
   * If an `href` is provided, the tag will default to `'a'`.
   * @default 'button'
   */
  tag?: Tag | keyof HTMLElementTagNameMap;
  /**
   * The url to navigate to when the anchor is clicked.
   */
  href?: string;
  /**
   * If true, the button will be disabled and a spinner will be displayed alongside the text.
   * If an icon is provided, the spinner will replace the icon.
   */
  loading?: boolean;
  /**
   * If true, the button will be disabled and a loading skeleton will be displayed instead of the text.
   */
  skeleton?: boolean;
  /**
   * If true, only the icon (if any) will be displayed.
   */
  empty?: boolean;
  /**
   * If true, the button will act as a toggle button.
   */
  toggle?: boolean;
  /**
   * Disables all button interactions.
   */
  disabled?: boolean;
  /**
   * If true, the button will ignore click events for the toggle state.
   */
  readonly?: boolean;
  /**
   * Bindable value for the toggle state.
   * @bindable
   */
  checked?: boolean;

  // Styles

  /**
   * If true, the button will start as flat on first render.
   * @see [@starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) for browser support
   */
  start?: boolean;
  /**
   * Text color to use for the button.
   */
  color?: Color;
  /**
   If true, only the button content will be displayed.
   */
  ghost?: boolean;
  /**
   * If true, the button will be displayed with no elevation or border.
   */
  text?: boolean;
  /**
   * If true, the button will be displayed with no elevation.
   */
  flat?: boolean;
  /**
   * If true, the button will be displayed with a glass effect.
   */
  glass?: boolean;
  /**
   * If true, the button will have a rounded border.
   */
  rounded?: boolean;
  /**
   * If true, the button will be inset instead of pressed when active.
   */
  inset?: boolean;
  /**
   * If true, the button will be displayed with a shallower elevation.
   */
  shallow?: boolean;
  /**
   * If true, the flex direction of the button will be reversed.
   */
  reverse?: boolean;
  /**
   * If true, the button will be surrounded by coalescing waves.
   * The waves will reverse direction on hover or active states.
   */
  coalesce?: boolean;
  /**
   * If true, the button will be surrounded by expanding waves.
   * The waves will reverse direction on hover or active states.
   */
  pulse?: boolean;

  // Events

  /**
   * Callback function to be called when the toggle state changes.
   * @param checked
   */
  onchecked?: (checked: boolean) => unknown;
  /**
   * Callback function to be called when the button is clicked.
   * @param e
   * @param checked
   */
  onclick?: (e: SvelteEvent<MouseEvent>, checked?: boolean) => unknown;
  /**
   * Callback function to be called when a key is pressed.
   * @param e
   */
  onkeydown?: (e: SvelteEvent<KeyboardEvent>) => unknown;
  /**
   * Callback function to be called when a key is released.
   * @param e
   */
  onkeyup?: (e: SvelteEvent<KeyboardEvent>) => unknown;
} & HTMLFlexProps &
  HTMLActionProps &
  HTMLRefProps &
  Partial<
    Omit<
      Tag extends 'button' ? HTMLButtonAttributes : Tag extends 'a' ? HTMLAnchorAttributes : HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>,
      'onclick' | 'onkeydown' | 'onkeyup'
    >
  >;
