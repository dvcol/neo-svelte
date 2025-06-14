import type { Snippet } from 'svelte';

import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { NeoMenuListProps } from '~/floating/menu/neo-menu-list.model.js';
import type { NeoTooltipProps } from '~/floating/tooltips/neo-tooltip.model.js';
import type { NeoListBaseItemProps } from '~/list/neo-list-base-item.model.js';
import type { NeoBaseListItem } from '~/list/neo-list.model.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { HTMLNeoBaseElement, SvelteEvent } from '~/utils/html-element.utils.js';

export interface NeoMenuItem<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> extends Omit<NeoBaseListItem<Value, Tag, NeoMenuContext<Value, Tag>>, 'containerProps'>, Pick<NeoMenuListItemProps, 'tooltipProps' | 'baseProps'> {
  /**
   * If true, children items will be rendered as list items instead of a nested dropdown menu.
   *
   * @default false
   */
  section?: boolean;
  /**
   * If true, the menu section label will be sticky on scroll.
   */
  sticky?: boolean;
  /**
   * If true, the menu will stay open when the item is selected.
   */
  keepOpenOnSelect?: boolean;

  /**
   * The nested menu items.
   */
  items?: NeoMenuItem<Value, Tag>[];
  /**
   * Optional menu props to pass to the menu list wrapper.
   */
  menuProps?: Omit<NeoMenuListProps<Value>, 'itemProps' | 'baseProps' | 'tooltipProps' | 'items' | 'item' | 'ref'>;
  /**
   * Optional props to pass to the base list item.
   */
  itemProps?: Pick<NeoBaseListItem<Value, Tag, NeoMenuContext<Value, Tag>>, 'containerProps'>;
}

export interface NeoMenuContext<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> {
  /**
   * The item itself.
   */
  item: NeoMenuItem<Value, Tag>;
  /**
   * The parent item (if any).
   */
  parent?: NeoMenuItem<Value, Tag>;
  /**
   * The array of items this item belongs to.
   */
  array?: NeoMenuItem<Value, Tag>[];
  /**
   * The index of the item in the menu.
   */
  index: number;
  /**
   * The index of the parent section in the menu (if any).
   */
  sectionIndex?: number;
  /**
   * The nested level of the menu.
   *
   * @default 1
   */
  level?: number;

  // Tooltip props
  /**
   * Whether the item nested menu is open (if any).
   */
  open?: boolean;
  /**
   * If true, the menu will stay open when the item is selected.
   */
  keepOpenOnSelect?: boolean;

  // Events
  /**
   * Event handler for when a menu item with a nested menu is clicked.
   * @param item - The menu item that was clicked.
   * @param e - The pointer event.
   */
  onMenu: (item: NeoMenuItem<Value>, e: SvelteEvent<MouseEvent>) => void;
  /**
   * Event handler for when a menu item without a nested menu is clicked.
   * @param item - The menu item that was clicked.
   * @param e - The pointer event.
   */
  onSelect: (item: NeoMenuItem<Value>, e: SvelteEvent<MouseEvent>) => void;
}

export type NeoMenuListItemProps<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> = {
  // Snippets
  /**
   * The content of the list item.
   * If none is provided, the default content will be used.
   */
  children?: Snippet<[NeoMenuContext<Value, Tag>]>;

  // Item Props
  /**
   * The reference to the list item element.
   */
  ref?: HTMLElement;
  /**
   * The tag name of the list item element.
   *
   * @default 'li'
   */
  tag?: Tag;
  /**
   * The tag name of the menu element.
   *
   * @default 'ul'
   */
  menuTag?: keyof HTMLElementTagNameMap;

  // Tooltip Props
  /**
   * The reference to the tooltip element.
   */
  tooltipRef?: NeoTooltipProps['ref'];
  /**
   * The default tooltip placement.
   *
   * @default 'right-start'
   */
  placement?: NeoTooltipProps['placement'];
  /**
   * An optional offset for the tooltip.
   */
  offset?: NeoTooltipProps['offset'];

  // Styles
  /**
   * If true, the menu & items will be rounded.
   */
  rounded?: BorderRadiusInput;
  /**
   * Reverse the direction of the item.
   *
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to display a divider above items in the list.
   * If an item divider option is set, it will take precedence over the list divider.
   *
   * @default false
   */
  divider?: boolean;
  /**
   * Reverse the next/previous focusable sibling selection direction using arrow keys.
   */
  flip?: boolean;

  // Other props
  /**
   * Optional props to pass to the divider (if any.
   */
  dividerProps?: Partial<NeoDividerProps>;
  /**
   * Optional props to pass to the tooltip (if any).
   */
  tooltipProps?: Partial<Omit<NeoTooltipProps, 'ref' | 'children' | 'tooltip'>>;
  /**
   * Optional props to pass to the base list item.
   */
  baseProps?: Partial<NeoListBaseItemProps<Value, NeoMenuContext<Value, Tag>>>;
  /**
   * Optional props to pass to the menu list.
   */
  menuProps?: Omit<NeoMenuListProps<Value>, 'items' | 'item' | 'ref' | 'onMenu' | 'onSelect'>;
  /**
   * Optional props to pass to the button.
   */
  buttonProps?: NeoButtonProps;
} & Pick<NeoMenuContext<Value, Tag>, 'item' | 'parent' | 'array' | 'index' | 'sectionIndex' | 'level' | 'parent' | 'open' | 'keepOpenOnSelect' | 'onMenu' | 'onSelect'> &
Omit<HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>, 'children'>;
