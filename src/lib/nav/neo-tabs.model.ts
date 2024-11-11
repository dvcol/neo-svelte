import type { Snippet } from 'svelte';
import type { NeoButtonGroup } from '~/buttons/neo-button-group.model.js';
import type { NeoTabProps, TabId } from '~/nav/neo-tab.model.js';
import type { NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';
import type { HTMLUseProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type OnChange<T = unknown> = (tabId?: TabId, value?: T, ref?: HTMLDivElement) => unknown;

export type TabsProps<T = unknown> = {
  // Snippets

  /**
   * Optional snippet to display as the tabs content.
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
  onclose?: OnChange<T>;
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
  Omit<NeoButtonGroup, 'onchange' | 'children' | 'vertical'>;
