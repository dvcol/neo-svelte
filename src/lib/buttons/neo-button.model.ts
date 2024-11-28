import type { Snippet } from 'svelte';
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import type { HTMLActionProps } from '~/utils/action.utils.js';
import type { HTMLFlexProps, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoButtonProps = {
  // Snippets

  /**
   * Snippet to display as the button content.
   */
  children?: Snippet;
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
  tag?: keyof HTMLElementTagNameMap;
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
   * If true, only the button content will be displayed.
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
  onclick?: (e: MouseEvent, checked?: boolean) => unknown;
  /**
   * Callback function to be called when a key is pressed.
   * @param e
   */
  onkeydown?: (e: KeyboardEvent) => unknown;
  /**
   * Callback function to be called when a key is released.
   * @param e
   */
  onkeyup?: (e: KeyboardEvent) => unknown;
} & Partial<Omit<HTMLButtonAttributes, 'onclick' | 'onkeydown' | 'onkeyup'>> &
  Partial<Omit<HTMLAnchorAttributes, 'onclick' | 'onkeydown' | 'onkeyup'>> &
  HTMLFlexProps &
  HTMLActionProps &
  HTMLRefProps;
