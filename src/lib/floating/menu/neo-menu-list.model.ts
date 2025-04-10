import type { NeoMenuItem, NeoMenuListItemProps } from '~/floating/menu/neo-menu-item.model.js';
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
  tag?: Tag;

  /**
   * The parent item (if any).
   */
  item?: NeoMenuItem<Value>;
  /**
   * The array of menu items to be rendered.
   */
  items?: NeoMenuItem<Value>[];

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

  // Events
  /**
   * Event handler for when a menu item with a nested menu is clicked.
   * @param item - The menu item that was clicked.
   * @param e - The pointer event.
   */
  onMenu: NeoMenuListItemProps<Value>['onMenu'];
  /**
   * Event handler for when a menu item without a nested menu is clicked.
   * @param item - The menu item that was clicked.
   * @param e - The pointer event.
   */
  onSelect: NeoMenuListItemProps<Value>['onSelect'];

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
   * Optional props to pass to the divider.
   */
  dividerProps?: NeoMenuListItemProps<Value>['dividerProps'];
  /**
   * Optional props to pass to the list item wrapper.
   */
  itemProps?: Partial<NeoMenuListItemProps<Value>>;
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
