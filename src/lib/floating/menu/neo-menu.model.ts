import type { NeoMenuItem } from '~/floating/menu/neo-menu-list-item.model.js';
import type { NeoMenuListProps } from '~/floating/menu/neo-menu-list.model.js';
import type { NeoTooltipProps } from '~/floating/tooltips/neo-tooltip.model.js';

export type NeoMenuProps<Value = unknown> = Omit<NeoTooltipProps, 'tooltip'> & {
  items: NeoMenuItem<Value>[];

  // Events
  /**
   * Event handler for when a menu item with a nested menu is clicked.
   * @param item - The menu item that was clicked.
   * @param e - The pointer event.
   */
  onMenu?: NeoMenuListProps<Value>['onMenu'];
  /**
   * Event handler for when a menu item without a nested menu is clicked.
   * @param item - The menu item that was clicked.
   * @param e - The pointer event.
   */
  onSelect?: NeoMenuListProps<Value>['onSelect'];

  /**
   * If true, the menu will stay open when the item is selected.
   */
  keepOpenOnSelect?: NeoMenuListProps<Value>['keepOpenOnSelect'];

  // Other Props
  /**
   * Optional props to pass to the tooltip (if any).
   */
  tooltipProps?: NeoMenuListProps<Value>['tooltipProps'];
  /**
   * Optional props to pass to the base list item.
   */
  baseProps?: NeoMenuListProps<Value>['baseProps'];
  /**
   * Optional props to pass to the list item wrapper.
   */
  itemProps?: NeoMenuListProps<Value>['itemProps'];
  /**
   * Optional props to pass to the menu list wrapper.
   */
  menuProps?: Partial<NeoMenuListProps<Value>>;
  /**
   * Optional props to pass to the divider.
   */
  dividerProps?: NeoMenuListProps<Value>['dividerProps'];
} & Pick<NeoMenuListProps<Value>, 'shadow' | 'scrollbar' | 'rounded' | 'reverse' | 'flip'>;
