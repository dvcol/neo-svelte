import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoBaseListItem } from '~/list/neo-list.model.js';
import type { NeoMediaProps } from '~/media/neo-media.model.js';
import type { NeoMarkProps } from '~/text/neo-mark.model.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { HTMLNeoBaseElement, HTMLTagProps } from '~/utils/html-element.utils.js';

export interface NeoListBaseItemProps<
  Value = unknown,
  Context = any,
  Tag extends keyof HTMLElementTagNameMap = 'li',
  Item extends NeoBaseListItem<Value, Tag, Context> = NeoBaseListItem<Value, Tag, Context>,
> extends HTMLNeoBaseElement, HTMLTagProps, Pick<NeoButtonProps, 'hovered' | 'focused' | 'toggle' | 'glass' | 'tinted' | 'filled'> {
  // Snippets
  /**
   * Snippet to display before the list item.
   * e.g. an icon or avatar.
   */
  before?: Item['before'];
  /**
   * Snippet to display after the list item.
   * e.g. a badge or action button.
   */
  after?: Item['after'];

  // Context
  /**
   * The list item to display.
   */
  item: Item;
  /*
   * The current index of the item within the list.
   */
  index: number;
  /**
   * The current list context.
   */
  context: Context;
  /**
   * Optional filter to highlight text.
   */
  highlight?: string;

  // States
  /**
   * Reference to the button element (if any) within the list item.
   */
  buttonRef?: NeoButtonProps['ref'];
  /**
   * If true, the item will display as a selectable button.
   *
   * This will take precedence over `arrow`.
   * @see arrow
   */
  select?: boolean;
  /**
   * If true, the item will display with a chevron arrow.
   *
   * This cannot be used with `select`.
   * @see select
   */
  arrow?: boolean;
  /**
   * If true, the item will display with a checked state.
   * Only applicable if `select` is true.
   * @see select
   */
  checked?: boolean;
  /**
   * If true, the item's checkmark will animate while rendering.
   * @see checked
   * @see select
   */
  touched?: boolean;
  /**
   * If true, the item will display as disabled.
   */
  disabled?: boolean;
  /**
   * If true, the item will not trigger selection, but will not be styled as disabled.
   */
  readonly?: boolean;
  /**
   * CSS selector to identify the list parent element and select the next/previous focusable sibling.
   *
   * This is used to determine the next/previous focusable element when navigating with the keyboard.
   *
   * @default '.neo-list-item.neo-list-item-select'
   */
  selector?: string;
  /**
   * Reverse the next/previous focusable sibling selection direction using arrow keys.
   */
  flip?: boolean;
  /**
   * If true, the item will be rounded.
   */
  rounded?: BorderRadiusInput;
  /**
   * Reverse the direction of the item.
   *
   * @default false
   */
  reverse?: boolean;
  /**
   * The maximum number of lines to display before truncating the text.
   * @default label: 1, description: 2
   */
  ellipsis?: number | { label?: number; description?: number };

  // Methods
  /**
   * Optional callback to handle the item click event.
   * @param index
   */
  onclick?: NeoButtonProps['onclick'];

  // Other props
  /**
   * Optional props to pass to the button.
   */
  buttonProps?: NeoButtonProps;
  /**
   * Optional props to pass to the media.
   */
  mediaProps?: NeoMediaProps;
  /**
   * Optional props to pass to the marks.
   */
  markProps?: NeoMarkProps;
} ;
