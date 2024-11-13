import type { Snippet } from 'svelte';
import type { TabId } from '~/nav/neo-tab.model.js';
import type { NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoTabPaneProps<T = unknown> = {
  // Snippets

  /**
   * Snippet to display as the tab content.
   */
  children?: Snippet<[NeoTabsContext<T> | undefined]>;

  // States

  /**
   * The tab id to associate with this pane.
   */
  tabId?: TabId;
  /**
   * If `true`, the pane will appear when no other tabs are active.
   */
  empty?: boolean;
  /**
   * The HTML tag to use for the container id `animate` is true.
   * @default 'div'
   * @see animate
   */
  tag?: keyof HTMLElementTagNameMap;

  // Styles
  /**
   * If `true`, pane transition will be animated.
   * If `false`, the pane will check if any neo-tabs-card parent is animating.
   * @default false
   */
  animate?: boolean;
} & HTMLNeoBaseElement &
  HTMLRefProps;
