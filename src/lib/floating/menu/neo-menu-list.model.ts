import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { NeoMenuItem, NeoMenuListItemProps } from '~/floating/menu/neo-menu-list-item.model.js';
import type { BorderRadiusInput } from '~/utils/border.utils.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoMenuListProps<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'ul'> = {
  /**
   * The reference to the menu list element.
   */
  ref?: HTMLElement;
  /**
   * The tag name of the menu list element.
   *
   * @default 'ul'
   */
  tag?: Tag | keyof HTMLElementTagNameMap;

  /**
   * The parent item (if any).
   */
  item?: NeoMenuItem<Value>;
  /**
   * The array of menu items to be rendered.
   */
  items?: NeoMenuItem<Value>[];

  /**
   * The nested level of the menu.
   *
   * @default 1
   */
  level?: number;

  /**
   * If true, the menu will stay open when the item is selected.
   */
  keepOpenOnSelect?: NeoMenuListItemProps<Value>['keepOpenOnSelect'];

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
   * If true, the menu will be rounded.
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
   * Inverts the flow of the list (flex-direction: column-reverse).
   *
   * @default false
   */
  flip?: boolean;

  // Events
  /**
   * Event handler for when a menu item with a nested menu is clicked.
   * @param item - The menu item that was clicked.
   * @param e - The pointer event.
   */
  onMenu?: NeoMenuListItemProps<Value>['onMenu'];
  /**
   * Event handler for when a menu item without a nested menu is clicked.
   * @param item - The menu item that was clicked.
   * @param e - The pointer event.
   */
  onSelect?: NeoMenuListItemProps<Value>['onSelect'];

  // Other Props
  /**
   * Optional props to pass to the tooltip (if any).
   */
  tooltipProps?: NeoMenuListItemProps<Value>['tooltipProps'];
  /**
   * Optional props to pass to the base list item.
   */
  baseProps?: NeoMenuListItemProps<Value>['baseProps'];
  /**
   * Optional props to pass to the list item wrapper.
   */
  itemProps?: Omit<Partial<NeoMenuListItemProps<Value>>, 'baseProps' | 'tooltipProps'>;
  /**
   * Optional props to pass to the divider.
   */
  dividerProps?: Partial<NeoDividerProps>;
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
