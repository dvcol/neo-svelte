import type { Snippet } from 'svelte';

import type { NeoButtonRowItemDivider } from '~/buttons/neo-button-row.model.js';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { NeoMenuItem } from '~/floating/menu/neo-menu-list-item.model.js';
import type { NeoMenuProps } from '~/floating/menu/neo-menu.model.js';
import type { NeoIconBouncingDotsProps } from '~/icons/neo-icon.model.js';
import type { NeoTabProps, TabId } from '~/nav/neo-tab.model.js';
import type { NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';
import type { NeoTabsProps } from '~/nav/neo-tabs.model.js';
import type { SvelteEvent } from '~/utils/html-element.utils.js';

export interface NeoTabRowItemButton<Value = unknown> extends NeoTabProps<Value> {
  menuProps?: Partial<NeoMenuItem<Value>>;
  label?: string | undefined;
  icon?: Snippet<[unknown]>;
}

export interface NeoTabRowItemDivider extends NeoDividerProps {
  divider: true;
}

export type NeoTabRowItem<Value = unknown> = NeoTabRowItemButton<Value> | NeoTabRowItemDivider;

export const isTabRowDivider = <Value = unknown>(item: NeoTabRowItem<Value>): item is NeoButtonRowItemDivider => item && 'divider' in item && item.divider;

export interface NeoTabRowContext {
  /**
   * The collapsed items in the tab row.
   */
  items?: NeoMenuItem[];
  /**
   * The number of items that are currently collapsed.
   */
  threshold?: number;
  /**
   * Optional properties to pass to the menu
   */
  menuProps?: Partial<NeoMenuProps>;
  /**
   * Optional properties to pass to the collapse button icon.
   */
  iconProps?: NeoIconBouncingDotsProps;
  /**
   * Optional properties to pass to the collapse button.
   */
  collapseProps?: NeoButtonProps;
}

export type OnTabEvent<Event = SvelteEvent, Value = unknown> = (e: Event, tab: { tabId?: TabId; value?: Value }) => unknown;

export interface NeoTabsRowProps extends Omit<NeoTabRowContext, 'items'>, Omit<NeoTabsProps, 'children'> {
  // Snippets
  /**
   * Snippet to display inside the tab row.
   */
  children?: Snippet<[NeoTabsContext, NeoTabRowContext]>;
  /**
   * Snippet to display when tabs would overflow and are collapsed.
   */
  collapsed?: Snippet<[NeoTabsContext, NeoTabRowContext]>;

  // States
  /**
   * Reference to the inner HTML element.
   */
  ref?: NeoTabsProps['ref'];
  /**
   * The tabs to display in the row.
   */
  tabs: NeoTabRowItem[];

  // Button props
  /**
   * Whether the default collapse button is hovered.
   */
  hovered?: NeoButtonProps['hovered'];
  /**
   * Whether the default collapse button is focused.
   */
  focused?: NeoButtonProps['focused'];

  // Events
  /**
   * Event handler for when a tab is hovered over.
   */
  ontabhover?: OnTabEvent<PointerEvent>;
  /**
   * Event handler for when a tab is focused.
   */
  ontabfocus?: OnTabEvent<FocusEvent>;

  // Other props
  /**
   * Optional properties to pass to the tab components.
   */
  tabProps?: NeoTabProps;
}
