import type { NeoListBaseItemProps, NeoListBaseSectionProps } from 'src/lib/index.js';
import type { Snippet } from 'svelte';

import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { NeoListBaseLoaderProps } from '~/list/neo-list-base-loader.model.js';
import type { HTMAnimationProps, HTMLTransitionProps } from '~/utils/action.utils.js';
import type { Color } from '~/utils/colors.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps } from '~/utils/html-element.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export interface NeoListDividerOption {
  top?: boolean;
  bottom?: boolean;
}
export function showDivider(divider?: boolean | NeoListDividerOption, position: keyof NeoListDividerOption = 'top') {
  if (typeof divider !== 'boolean') return divider?.[position];
  return divider;
}

export interface NeoListItemCommon<Tag extends keyof HTMLElementTagNameMap = 'li'> {
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
   * Optional label to display in the list item.
   * If not provided, the value will be used.
   *
   * @note Recommended in section for accessibility.
   */
  label?: string;
  /**
   * If true, the list item will be disabled.
   */
  disabled?: boolean;
  /**
   * If true, the item will not trigger selection, but will not be styled as disabled.
   */
  readonly?: boolean;
  /**
   * Text color to use for the item.
   */
  color?: Color | CSSStyleDeclaration['color'];
  /**
   * If true, the list section will display a divider above the title.
   */
  divider?: boolean | NeoListDividerOption;
  /**
   * If true, the item will not be displayed.
   */
  hidden?: boolean;
  /**
   * Reverse the direction of the item.
   *
   * @default false
   */
  reverse?: boolean;
  /**
   * Optional props to pass to the divider.
   */
  dividerProps?: NeoDividerProps;
  /**
   Optional props to pass to the container.
   */
  containerProps?: HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
}

export interface NeoListItemContext<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li', Context = unknown> {
  item: NeoListItem<Value, Tag>;
  index: number;
  checked?: boolean;
  context: Context;
}

export type NeoListItemRender<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li', Context = unknown> = Snippet<
  [NeoListItemContext<Value, Tag, Context>]
>;

export type NeoBaseListItem<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li', Context = any> = {
  /**
   * An arbitrary value to associate with the list item.
   */
  value: Value;
  /**
   * Optional description to display in the list item.
   */
  description?: string;
  /**
   * Optional snippet to display in place of the list item.
   */
  render?: NeoListItemRender<Value, Tag, Context>;
  /**
   * Snippet to display before the list item.
   * e.g. an icon or avatar.
   */
  before?: NeoListItemRender<Value, Tag, Context>;
  /**
   * Snippet to display after the list item.
   * e.g. a badge or action button.
   */
  after?: NeoListItemRender<Value, Tag>;
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

export type NeoListItem<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li', Context = NeoListContext> = NeoBaseListItem<
  Value,
  Tag,
  Context
>;

export interface NeoListRenderContext<Value = unknown, Item = NeoListItemOrSection<Value>> {
  items: Item[];
  /**
   * The index of the section in the list.
   */
  index?: number;
  section?: NeoListSection<Value>;
  context?: NeoListContext;
}
export type NeoListRender<Value = unknown> = Snippet<[NeoListRenderContext<Value>]>;

export type NeoListSectionRender<Value = unknown> = Snippet<[NeoListRender<Value>, NeoListRenderContext<Value>]>;
export type NeoListSection<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'ul'> = {
  /**
   * Array of child list items to display.
   */
  items: NeoListItem<Value>[];
  /**
   * Whether the section is sticky (stays on top while scrolling the content).
   */
  sticky?: boolean;
  /**
   * Optional snippet to display in place of the list section.
   * @param list - The list snippet that render items.
   * @param context - The list section context.
   */
  render?: NeoListSectionRender<Value>;
  /**
   * Optional snippet to display when the section is empty.
   */
  empty?: Snippet<[NeoListContext]>;
  /**
   * Optional props to pass to the section container.
   */
  sectionProps?: HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
} & NeoListItemCommon<Tag>;

export const isSection = <Value = unknown>(item: NeoListItem<Value> | NeoListSection<Value>): item is NeoListSection<Value> => 'items' in item;

export interface NeoListSelectedItem<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> {
  index: number;
  item: NeoListItem<Value, Tag>;
  sectionIndex?: number;
  section?: NeoListSection<Value>;
}

export interface NeoListSelectEvent<Selected = NeoListSelectedItem | NeoListSelectedItem[]> {
  type: 'select' | 'clear' | 're-select';

  previous?: Selected;
  current?: Selected;

  removed?: Selected;
  added?: Selected;
}

export interface NeoListMethods<Value = unknown> {
  /**
   * Scroll the list to the top.
   */
  scrollTop: (options?: ScrollToOptions) => Promise<HTMLElement | false>;
  /**
   * Scroll the list to the bottom.
   */
  scrollBottom: (options?: ScrollToOptions) => Promise<HTMLElement | false>;
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
  /**
   * Clear all items in the list then re-select the previously selected item(s) only if they still exist in the list.
   *
   * @note Requires the `id` property to be set and unique for each item.
   * @returns The selection event if the list or item was cleared, undefined otherwise.
   */
  reSelect: () => NeoListSelectEvent | undefined;
}

export type NeoListItemOrSection<Value = unknown> = NeoListItem<Value> | NeoListSection<Value>;
export interface NeoListState<Selected = undefined | NeoListSelectedItem | NeoListSelectedItem[]> {
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
   * Whether to allow deselecting items if it will result in an empty selection.
   */
  nullable?: boolean;
  /**
   * The currently selected item(s).
   */
  selected?: Selected;
  /**
   * Optional filter to highlight text.
   */
  highlight?: string;
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
  /**
   * Reverse the direction of the item.
   *
   * @default false
   */
  reverse?: boolean;
  /**
   * Inverts the flow of the list (flex-direction: column-reverse).
   *
   * @default false
   */
  flip?: boolean;
}

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
  animate?: HTMAnimationProps['animate'];
  /**
   * Transition function to apply when adding items to the list.
   * Note: unique `id` is required for entering/leaving transitions.
   */
  in?: HTMLTransitionProps['in'];
  /**
   * Transition function to apply when removing items from the list.
   * Note: unique `id` is required for entering/leaving transitions.
   */
  out?: HTMLTransitionProps['out'];

  // Styles
  /**
   * Whether to dim the opacity of inactive tabs on hover.
   */
  dim?: boolean;
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
  /**
   * Optional flex strategy for the container
   */
  flex?: CSSStyleDeclaration['flex'];
  /**
   * Optional list width constraints.
   */
  width?: SizeInput<'width'>;
  /**
   * Optional list height constraints.
   */
  height?: SizeInput<'height'>;

  // States
  /**
   * The HTML tag to use for the list.
   * @default 'ul'
   */
  tag?: Tag | keyof HTMLElementTagNameMap;

  // Events
  /**
   * Event listener that fires when an item is selected/deselected.
   * @param event
   */
  onSelect?: (event: NeoListSelectEvent<Selected>) => void;

  // Other Props
  /**
   * The props to pass to the list container.
   */
  containerProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * The props to pass to the loader.
   */
  loaderProps?: NeoListBaseLoaderProps;
  /**
   * Optional props to pass to the button.
   */
  buttonProps?: NeoButtonProps;
  /**
   * Optional props to pass to the divider.
   */
  dividerProps?: NeoDividerProps;
  /**
   * Optional props to pass to the list item.
   */
  itemProps?: Omit<NeoListBaseItemProps<Value, NeoListContext>, 'buttonProps'>;
  /**
   * Optional props to pass to the list section.
   */
  sectionProps?: NeoListBaseSectionProps<Value, Tag>;
} & HTMLRefProps &
HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]> &
NeoListState<Selected>;

export type NeoListHTMLElement<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'ul'> = HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]> &
  NeoListMethods<Value>;

export function findByIdInList<Value = unknown>(selection: NeoListSelectedItem<Value>, array: NeoListItemOrSection<Value>[]): NeoListSelectedItem<Value> | undefined {
  const result: NeoListSelectedItem<Value> = { index: -1 } as NeoListSelectedItem<Value>;
  const search = array?.some((item, index) => {
    if (isSection(item)) {
      // if section differs, skip
      if (selection?.section?.id !== item.id) return false;
      const sectionIndex = item?.items?.findIndex(sub => Object.is(sub, selection?.item) || sub.id === selection?.item?.id);
      if (sectionIndex < 0) return false;
      result.index = sectionIndex;
      result.item = item.items[sectionIndex];
      result.section = item;
      result.sectionIndex = index;
      return true;
    }
    if (item.id !== selection?.item?.id) return false;
    if (item?.id === undefined && !Object.is(item, selection?.item)) return false;
    result.index = index;
    result.item = item;
    return true;
  });
  return search ? result : undefined;
}

export function findByValueInList<Value = unknown>(value: Value, array: NeoListItemOrSection<Value>[]): NeoListSelectedItem<Value> | undefined {
  const result: NeoListSelectedItem<Value> = { index: -1 } as NeoListSelectedItem<Value>;
  const search = array.some((item, index) => {
    if (isSection(item)) {
      const sectionIndex = item.items?.findIndex(si => si.value === value);
      if (sectionIndex < 0) return false;
      result.index = sectionIndex;
      result.item = item.items[sectionIndex];
      result.section = item;
      result.sectionIndex = index;
      return true;
    }
    if (item.value !== value) return false;
    result.index = index;
    result.item = item;
    return true;
  });
  return search ? result : undefined;
}
