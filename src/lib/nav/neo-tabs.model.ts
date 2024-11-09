import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { NeoButtonGroup } from '~/buttons/neo-button-group.model.js';
import type { NeoTabProps, TabId } from '~/nav/neo-tab.model.js';

export type OnChange<T = unknown> = (tabId?: TabId, value?: T, ref?: HTMLDivElement) => unknown;
export type NeoTabsContext = {
  // States
  active?: TabId;
  disabled?: boolean;

  // Styles
  slide?: boolean;
  line?: boolean;
  add?: boolean;
  close?: boolean;
  vertical?: boolean;
};

export type TabsProps<T = unknown> = {
  // Snippets

  /**
   * Optional snippet to display as the tabs content.
   */
  children?: Snippet<[NeoTabsContext]>;

  // Events
  /**
   * Event handler that fires when the active tab changes.
   */
  onchange?: OnChange<T>;
  /**
   * Event handler that fires when any close button is clicked.
   */
  onclose?: OnChange<T>;
  /**
   * Event handler that fires when the add button is clicked.
   */
  onadd?: NeoTabProps['onclick'];

  // Other props

  /**
   * Optional props to pass to the tabs container.
   */
  tabsProps?: Partial<HTMLAttributes<HTMLDivElement>>;
} & NeoTabsContext &
  Omit<NeoButtonGroup, 'onchange' | 'children' | 'vertical'>;
