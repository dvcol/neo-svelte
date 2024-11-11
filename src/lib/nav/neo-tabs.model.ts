import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { NeoButtonGroup } from '~/buttons/neo-button-group.model.js';
import type { NeoTabProps, TabId } from '~/nav/neo-tab.model.js';
import type { NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';
import type { HTMLUseProps } from '~/utils/action.utils.js';

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

  // Styles
  /**
   * Display the active tab with a line.
   * Only applies when `slide` is `true`.
   */
  line?: boolean;
  /**
   * Sets the position of the pane snippet relative to the tabs.
   */
  position?: 'before' | 'after';

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
  tabsProps?: Partial<HTMLAttributes<HTMLDivElement>> & HTMLUseProps;
} & NeoTabsContext &
  Omit<NeoButtonGroup, 'onchange' | 'children' | 'vertical'>;
