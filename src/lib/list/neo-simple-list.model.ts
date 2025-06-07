import type { Snippet } from 'svelte';

import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { NeoListBaseItemProps } from '~/list/neo-list-base-item.model.js';
import type { NeoListBaseLoaderProps } from '~/list/neo-list-base-loader.model.js';
import type { NeoListBaseSectionProps } from '~/list/neo-list-base-section.model.js';
import type { NeoListBaseProps, NeoListItem, NeoListItemRender, NeoListMethods, NeoListSectionRender, NeoListState } from '~/list/neo-list.model.js';
import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps, SvelteEvent } from '~/utils/html-element.utils.js';
import type { SizeInput } from '~/utils/style.utils.js';

export type NeoSimpleListContext = NeoListState<NeoListItem> & NeoListMethods;

export type NeoSimpleListProps<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'ul', Context = NeoSimpleListContext> = {
  // Snippets
  /**
   * Optional snippet to display in place of each list item.
   */
  item?: NeoListItemRender<Value, 'li', Context>;
  /**
   * Optional snippet to display in place of each list section.
   */
  section?: NeoListSectionRender<Value>;
  /**
   * Optional snippet to display when the list is empty.
   */
  empty?: Snippet<[Context]>;
  /**
   * Optional snippet to display in place of the loading indicator.
   */
  loader?: Snippet<[Context]>;
  /**
   * Optional snippet to display after the list.
   */
  after?: Snippet<[Context]>;
  /**
   * Optional snippet to display before the list.
   */
  before?: Snippet<[Context]>;
  /**
   * Optional snippet to display inside the list.
   */
  children?: Snippet<[Context]>;

  // Virtual Props

  /**
   * The number of items to keep rendered before and after the visible items.
   *
   * @default 3
   */
  buffer?: number;
  /**
   * The average height of each item in the list.
   */
  itemHeight?: number;

  // Transitions
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
   * Whether to scroll to the bottom when loading additional items.
   *
   * @default false
   */
  scrollToLoader?: boolean;
  /**
   * Scroll tolerance when determining if the list is scrolled to the top or bottom (in pixels).
   *
   * @default 1
   */
  scrollTolerance?: number;
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
   * Event listener that fires when the list is scrolled to the top.
   * @param event
   */
  onScrollTop?: (event?: SvelteEvent) => void;
  /**
   * Event listener that fires when the list is scrolled to the bottom.
   * @param event
   */
  onScrollBottom?: (event?: SvelteEvent) => void;

  // Other Props
  /**
   * The props to pass to the list container.
   */
  containerProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * The props to pass to the loader.
   */
  loaderProps?: Partial<NeoListBaseLoaderProps>;
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
  itemProps?: Partial<Omit<NeoListBaseItemProps<Value, Context>, 'buttonProps'>>;
  /**
   * Optional props to pass to the list section.
   */
  sectionProps?: NeoListBaseSectionProps<Value, Tag>;
} & NeoListBaseProps & HTMLRefProps &
HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]> &
NeoListState<NeoListItem>;
