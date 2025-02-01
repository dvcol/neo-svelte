import type { Snippet } from 'svelte';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { NeoListBaseLoaderProps } from '~/list/neo-list-base-loader.model.js';
import type { HTMAnimationProps, HTMLTransitionProps } from '~/utils/action.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoListItemCommon<Tag extends keyof HTMLElementTagNameMap = 'li'> = {
  /**
   * Unique identifier for the list item.
   * Used for keying the list item.
   * If not provided, the index will be used.
   * Note: Required for entering/leaving transitions.
   */
  id?: string | number;
  /**
   * The HTML tag to use for the item.
   * @default 'li'
   */
  tag?: Tag;
  /**
   * Text color to use for the item.
   */
  color?: Color;
  /**
   * If true, the list section will display a divider above the title.
   */
  divider?: boolean;
  /**
   * If true, the item will not be displayed.
   */
  hidden?: boolean;
  /**
   * Optional props to pass to the divider.
   */
  dividerProps?: NeoDividerProps;
  /**
   Optional props to pass to the container.
   */
  containerProps?: HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
};

export type NeoListItemRenderContext<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> = {
  item: NeoListItem<Value, Tag>;
  index: number;
  context: NeoListContext;
};
export type NeoListItemRender<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> = Snippet<[NeoListItemRenderContext<Value, Tag>]>;
export type NeoListItem<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> = {
  /**
   * An arbitrary value to associate with the list item.
   */
  value: Value;
  /**
   * Optional label to display in the list item.
   * If not provided, the value will be used.
   */
  label?: string;
  /**
   * Optional description to display in the list item.
   */
  description?: string;
  /**
   * If true, the list item will be disabled.
   */
  disabled?: boolean;
  /**
   * If true, the item will not trigger selection, but will not be styled as disabled.
   */
  readonly?: boolean;
  /**
   * Optional snippet to display in place of the list item.
   */
  render?: NeoListItemRender<Value, Tag>;
  /**
   * Snippet to display before the list item.
   * e.g. an icon or avatar.
   */
  before?: Snippet<[NeoListItemRenderContext<Value, Tag>]>;
  /**
   * Snippet to display after the list item.
   * e.g. a badge or action button.
   */
  after?: Snippet<[NeoListItemRenderContext<Value, Tag>]>;
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
} & NeoListItemCommon<Tag>;

export type NeoListRenderContext<Value = unknown, Item = NeoListItem | NeoListSection> = {
  items: Item[];
  /**
   * The index of the section in the list.
   */
  index?: number;
  section?: NeoListSection<Value>;
  context?: NeoListContext;
};
export type NeoListRender<Value = unknown> = Snippet<[NeoListRenderContext<Value>]>;

export type NeoListSectionRender<Value = unknown> = Snippet<[NeoListRender<Value>, NeoListRenderContext<Value>]>;
export type NeoListSection<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'ul'> = {
  title?: string;
  items: NeoListItem<Value>[];
  /**
   * Optional snippet to display in place of the list section.
   * @param list - The list snippet that render items.
   * @param context - The list section context.
   */
  render?: NeoListSectionRender<Value>;
} & NeoListItemCommon<Tag>;

export const isSection = (item: NeoListItem | NeoListSection): item is NeoListSection => 'items' in item;

export type NeoListSelectedItem<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> = {
  index: number;
  item: NeoListItem<Value, Tag>;
  sectionIndex?: number;
  section?: NeoListSection<Value>;
};

export type NeoListSelectEvent<Selected = NeoListSelectedItem | NeoListSelectedItem[]> = {
  previous?: Selected;
  current?: Selected;
};

export type NeoListMethods<Value = unknown> = {
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
   *
   * @returns The selection event if the item was selected, undefined otherwise.
   */
  selectItem: (...selection: NeoListSelectedItem<Value>[]) => NeoListSelectEvent | undefined;
  /**
   * Clear the selected item(s).
   * If no index is provided, all items will be cleared.
   *
   * @returns The selection event if the list or item was cleared, undefined otherwise.
   */
  clearItem: (...selection: NeoListSelectedItem<Value>[]) => NeoListSelectEvent | undefined;
};

export type NeoListItemOrSection = NeoListItem | NeoListSection;
export type NeoListState<Selected = undefined | NeoListSelectedItem | NeoListSelectedItem[]> = {
  // States
  /**
   * List items to display.
   */
  items?: NeoListItemOrSection[];
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
   * A filter function to apply to each item in the list.
   * @param item
   */
  filter?: (item: NeoListItemOrSection) => boolean;
  /**
   * A sort function to apply to the list items.
   * @param a
   * @param b
   */
  sort?: (a: NeoListItemOrSection, b: NeoListItemOrSection) => number;

  /**
   * If the list is currently loading additional items.
   */
  loading?: boolean;
  /**
   * If the list should display a loading skeleton.
   */
  skeleton?: boolean;
  /**
   * Disable all items in the list.
   */
  disabled?: boolean;
  /**
   * Disable selection for all items in the list.
   */
  readonly?: boolean;
};

export type NeoListContext<Selected = NeoListSelectedItem | NeoListSelectedItem[]> = NeoListState<Selected> & NeoListMethods;

export type NeoListProps<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'ul', Selected = NeoListSelectedItem | NeoListSelectedItem[]> = {
  // Snippets
  /**
   * Optional snippet to display in place of each list item.
   */
  item?: NeoListItemRender<Value>;
  /**
   * Optional snippet to display in place of each list section.
   */
  section?: NeoListSectionRender<Value>;
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
   * Note: unique `id` is required for entering/leaving transitions.
   */
  animate: HTMAnimationProps['animate'];
  /**
   * Transition function to apply when adding items to the list.
   * Note: unique `id` is required for entering/leaving transitions.
   */
  transition: HTMLTransitionProps['transition'];

  // Styles
  /**
   * Whether to display a shadow when scrolling content.
   *
   * @default true
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
  /**
   * The props to pass to the loader.
   */
  loaderProps?: NeoListBaseLoaderProps;
  /**
   * Optional props to pass to the button.
   */
  buttonProps?: NeoButtonProps;
} & HTMLRefProps &
  HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]> &
  NeoListState<Selected>;
