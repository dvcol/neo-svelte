import type { Snippet } from 'svelte';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
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

export type NeoListMethods = {
  /**
   * Scroll the list to the top.
   */
  scrollTop: () => Promise<HTMLElement | false>;
  /**
   * Scroll the list to the bottom.
   */
  scrollBottom: () => Promise<HTMLElement | false>;
};

export type NeoListState = {
  // States
  /**
   * List items to display.
   */
  items?: NeoListItem[];

  /**
   * If the list is currently loading additional items.
   */
  loading?: boolean | number;
  /**
   * If the list should display a loading skeleton.
   */
  skeleton?: boolean;
};

export type NeoListContext = NeoListState & NeoListMethods;

export type NeoListProps<Tag extends keyof HTMLElementTagNameMap = 'ul'> = {
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
   * Optional snippet to display inside the list.
   */
  children?: Snippet<[NeoListContext]>;

  // Styles
  /**
   * Whether to display a shadow when scrolling content.
   *
   * @default true
   */
  shadow?: boolean;
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
  NeoListState;
