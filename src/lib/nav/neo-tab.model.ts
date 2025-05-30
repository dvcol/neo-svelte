import type { Snippet } from 'svelte';

import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { OnChange } from '~/nav/neo-tabs.model.js';
import type { HTMLUseProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type TabId = string | number | symbol;
export type NeoTabProps<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  // Snippets

  /**
   * Snippet to display as the tab content.
   */
  children?: Snippet<[{ active: boolean; tabId: TabId; value?: unknown }]>;

  // States

  /**
   * The HTML tag to use for the tab.
   * @default 'div'
   */
  tag?: Tag | keyof HTMLElementTagNameMap;
  /**
   * A unique identifier for the tab.
   * If none is provided, the tab will be assigned a random id.
   */
  tabId?: TabId;
  /**
   * Optional value to associate with the tab.
   */
  value?: Value;
  /**
   * Whether the tab should be registered with the parent `NeoTabs` context.
   * If false, the tab will not be included in the `NeoTabs` context.
   * If true, the tab will be registered only if another tab with the same id is not already registered.
   * If `force`, the tab will be registered even if another tab with the same id is already registered.
   *
   * @default true
   * @see {@link NeoTabContext}
   */
  register?: boolean | 'force';

  // Styles

  /**
   * If true, the tab will display a close button that broadcasts the `onclose` event.
   * Note: The event will also be emitted to a parent `NeoTabs` if present.
   */
  close?: boolean;

  // Events

  /**
   * Event handler that fires when the close button is clicked.
   */
  onclose?: OnChange<Value>;

  // Other props

  /**
   * Optional props to pass to the tab container.
   */
  tabProps?: HTMLNeoBaseElement & HTMLUseProps;
} & Omit<NeoButtonProps, 'value' | 'children' | 'ref' | 'tag'> &
HTMLRefProps;
