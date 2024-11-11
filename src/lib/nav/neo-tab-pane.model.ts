import type { Snippet } from 'svelte';
import type { TabId } from '~/nav/neo-tab.model.js';
import type { NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';

export type NeoTabPaneProps = {
  // Snippets

  /**
   * Optional snippet to display as the tab content.
   */
  children?: Snippet<[NeoTabsContext]>;

  // States

  /**
   * The tab id to associate with this pane.
   */
  tabId?: TabId;
  /**
   * If `true`, the pane will appear when no other tabs are active.
   */
  empty?: boolean;
};
