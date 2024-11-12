import type { Snippet } from 'svelte';
import type { NeoButtonGroupProps } from '~/buttons/neo-button-group.model.js';
import type { NeoTabProps, TabId } from '~/nav/neo-tab.model.js';
import type { NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';
import type { HTMLUseProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoTabContextValue<T = unknown> = { index: number; value?: T; ref: HTMLElement };
export type OnChange<T = unknown> = (tabId?: TabId, newValue?: NeoTabContextValue<T>, oldValue?: NeoTabContextValue) => unknown;
export type OnClose<T = unknown> = (tabId?: TabId, value?: NeoTabContextValue<T>) => unknown;

export type NeoTabsProps<T = unknown> = {
  // Snippets

  /**
   * Snippet to display as the tabs content.
   */
  children?: Snippet<[NeoTabsContext]>;
  /**
   * Optional snippet to expose context to other components.
   */
  panes?: Snippet<[NeoTabsContext]>;

  // States

  /**
   * The HTML tag to use for the tabs.
   * @default 'div'
   */
  tag?: keyof HTMLElementTagNameMap;

  // Styles

  /**
   * Display the active tab with a line.
   * Only applies when `slide` is `true`.
   */
  line?: boolean;
  /**
   * If `true`, the panes will be displayed before the tabs.
   * @default false
   */
  before?: boolean;

  // Events

  /**
   * Event handler that fires when the active tab changes.
   */
  onchange?: OnChange<T>;
  /**
   * Event handler that fires when any close button is clicked.
   */
  onclose?: OnClose<T>;
  /**
   * Event handler that fires when the add button is clicked.
   */
  onadd?: NeoTabProps['onclick'];

  // Other props

  /**
   * Optional props to pass to the tabs container.
   */
  tabsProps?: HTMLNeoBaseElement & HTMLUseProps;
} & NeoTabsContext &
  Omit<NeoButtonGroupProps, 'onchange' | 'children' | 'vertical' | 'ref'> &
  HTMLRefProps;
