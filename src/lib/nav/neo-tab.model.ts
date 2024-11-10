import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { OnChange } from '~/nav/neo-tabs.model.js';
import type { HTMLUseProps } from '~/utils/action.utils.js';

export type TabId = string | number | symbol;
export type NeoTabProps<T = unknown> = {
  // Snippets

  /**
   * Optional snippet to display as the tab content.
   */
  children?: Snippet<[{ active: boolean; tabId: TabId; value?: unknown }]>;

  // States

  /**
   * A unique identifier for the tab.
   * If none is provided, the tab will be assigned a random id.
   */
  tabId?: TabId;
  /**
   * Optional value to associate with the tab.
   */
  value?: T;

  // Styles

  /**
   * If true, the tab will display a close button that broadcasts the `onclose` event.
   * Note: The event will also be emitted to a parent `NeoTabs` if present.
   */
  close?: boolean;

  // Events

  /**
   * Event handler that fires wwhen the close button is clicked.
   */
  onclose?: OnChange<T>;

  // Other props
  /**
   * Optional props to pass to the tab container.
   */
  tabProps?: Partial<HTMLAttributes<HTMLDivElement>> & HTMLUseProps;
} & Omit<NeoButtonProps, 'value' | 'children'>;
