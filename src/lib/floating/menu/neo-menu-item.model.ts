import type { Snippet } from 'svelte';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoMenuListProps } from '~/floating/menu/neo-menu-list.model.js';
import type { NeoTooltipProps } from '~/floating/tooltips/neo-tooltip.model.js';
import type { NeoListBaseItemProps } from '~/list/neo-list-base-item.model.js';
import type { NeoBaseListItem } from '~/list/neo-list.model.js';
import type { HTMLNeoBaseElement, SvelteEvent } from '~/utils/html-element.utils.js';

export type NeoMenuItem<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> = Omit<
  NeoBaseListItem<Value, Tag, NeoMenuContext<Value, Tag>>,
  'containerProps'
> & {
  items?: NeoMenuItem<Value, Tag>[];
  menuProps?: Omit<NeoMenuListProps<Value>, 'itemProps' | 'baseProps' | 'tooltipProps' | 'items' | 'item' | 'ref'>;
  itemProps?: Pick<NeoBaseListItem<Value, Tag, NeoMenuContext<Value, Tag>>, 'containerProps'>;
} & Pick<NeoMenuListItemProps, 'tooltipProps' | 'baseProps'>;

export type NeoMenuContext<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> = {
  /**
   * The item itself.
   */
  item: NeoMenuItem<Value, Tag>;
  /**
   * The index of the item in the menu.
   */
  index: number;
  /**
   * The length of the parent menu list.
   */
  length: number;
  /**
   * The parent item (if any).
   */
  parent?: NeoMenuItem<Value, Tag>;

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
};

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
  rounded?: boolean;

  // Other props
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
} & Pick<NeoMenuContext<Value, Tag>, 'item' | 'index' | 'length' | 'parent' | 'open' | 'keepOpenOnSelect' | 'onMenu' | 'onSelect'> &
  Omit<HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>, 'children'>;
