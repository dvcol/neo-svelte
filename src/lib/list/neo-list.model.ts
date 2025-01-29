import type { Snippet } from 'svelte';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { HTMAnimationProps, HTMLTransitionProps } from '~/utils/action.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoListItem<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> = {
  /**
   * An arbitrary value to associate with the list item.
   */
  value: Value;
  /**
   * The HTML tag to use for the list item.
   *
   * @default 'li'
   */
  tag?: Tag;
  /**
   * Unique identifier for the list item.
   * Used for keying the list item.
   * If not provided, the index will be used.
   */
  id?: string | number;
  /**
   * Optional label to display in the list item.
   * If not provided, the value will be used.
   */
  label?: string;
  /**
   * Text color to use for the list item.
   */
  color?: Color;
  /**
   * If true, the list item will be disabled.
   */
  disabled?: boolean;
  /**
   * Optional snippet to display in place of the list item.
   */
  render?: Snippet<[NeoListItem, number, NeoListContext]>;
  /**
   * The url to navigate to when the anchor is clicked.
   */
  href?: NeoButtonProps['href'];
  /**
   * Callback function to be called when the button is clicked.
   */
  onclick?: NeoButtonProps['onclick'];
  /**
   * Optional props to pass to the button.
   */
  buttonProps?: NeoButtonProps;
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;

export type NeoListSelectedItem = {
  /**
   * The index of the selected item.
   */
  index: number;
  /**
   * The selected item.
   */
  item: NeoListItem;
  /**
   * The selected id.
   */
  id?: NeoListItem['id'];
  /**
   * The selected value.
   */
  value?: NeoListItem['value'];
};

export type NeoListSelectEvent<Selected = NeoListSelectedItem | NeoListSelectedItem[]> = {
  /**
   * The previous selected item(s).
   */
  previous?: Selected;
  /**
   * The current selected item(s).
   */
  current?: Selected;
};

export type NeoListMethods = {
  /**
   * Scroll the list to the top.
   */
  scrollTop: () => Promise<HTMLElement | false>;
  /**
   * Scroll the list to the bottom.
   */
  scrollBottom: () => Promise<HTMLElement | false>;
  /**
   * Select an item in the list.
   * @param index - The index of the item to select.
   */
  selectItem: (index: NeoListSelectedItem['index'], ...rest: NeoListSelectedItem['index'][]) => NeoListSelectEvent;
  /**
   * Clear the selected item(s).
   */
  clearItem: (...rest: NeoListSelectedItem['index'][]) => NeoListSelectEvent;
};

export type NeoListState<Selected = undefined | NeoListSelectedItem | NeoListSelectedItem[]> = {
  // States
  /**
   * List items to display.
   */
  items?: NeoListItem[];
  /**
   * Whether to allow selecting items in the list.
   */
  select?: boolean;
  /**
   * Whether to allow multiple items in the selection.
   */
  multiple?: boolean;
  /**
   * The currently selected item(s).
   */
  selected?: Selected;
  /**
   * Array of indexes of items that have been touched.
   */
  touched?: NeoListSelectedItem['index'][];

  /**
   * If the list is currently loading additional items.
   */
  loading?: boolean | number;
  /**
   * If the list should display a loading skeleton.
   */
  skeleton?: boolean;
};

export type NeoListContext<Selected = NeoListSelectedItem | NeoListSelectedItem[]> = NeoListState<Selected> & NeoListMethods;

export type NeoListProps<Tag extends keyof HTMLElementTagNameMap = 'ul', Selected = NeoListSelectedItem | NeoListSelectedItem[]> = {
  // Snippets
  /**
   * Optional snippet to display in place of each list item.
   */
  item?: NeoListItem['render'];
  /**
   * Optional snippet to display when the list is empty.
   */
  empty?: Snippet<[NeoListContext]>;
  /**
   * Optional snippet to display in place of the loading indicator.
   */
  loader?: Snippet<[NeoListContext]>;
  /**
   * Optional snippet to display after the list.
   */
  after?: Snippet<[NeoListContext]>;
  /**
   * Optional snippet to display before the list.
   */
  before?: Snippet<[NeoListContext]>;
  /**
   * Optional snippet to display inside the list.
   */
  children?: Snippet<[NeoListContext]>;

  // Animation
  /**
   * Transition function to apply when removing items from the list.
   */
  animate: HTMAnimationProps['animate'];
  /**
   * Transition function to apply when adding items to the list.
   */
  transition: HTMLTransitionProps['transition'];

  // Styles
  /**
   * Whether to display a shadow when scrolling content.
   *
   * @default false
   */
  shadow?: boolean;
  /**
   * Overrides the default scrollbars.
   */
  scrollbar?: boolean;
  /**
   * Whether to scroll to the bottom when loading additional items.
   *
   * @default false
   */
  scrollToLoader?: boolean;

  // States
  /**
   * The HTML tag to use for the list.
   * @default 'ul'
   */
  tag?: Tag | keyof HTMLElementTagNameMap;

  // Events
  onselect?: (event: NeoListSelectEvent<Selected>) => void;

  // Other Props
  /**
   * The HTML tag to use for the list container.
   * @default div
   */
  containerTag?: keyof HTMLElementTagNameMap;
  /**
   * The props to pass to the list container.
   */
  containerProps?: HTMLNeoBaseElement;
} & HTMLRefProps &
  HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]> &
  NeoListState<Selected>;
