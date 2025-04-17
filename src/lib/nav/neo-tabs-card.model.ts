import type { Snippet } from 'svelte';

import type { NeoCardProps } from '~/cards/neo-card.model.js';
import type { NeoTransitionContainerProps } from '~/containers/neo-transition-container.model.js';
import type { NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';

import { getContext, setContext } from 'svelte';

export interface NeoTabsCardContext {
  /**
   * If `true`, pane transition will be animated.
   * @default true
   */
  animate?: boolean;
}

export type NeoTabsCardProps<T = unknown> = {
  /**
   * Snippet to display as the card content.
   */
  children?: Snippet<[NeoTabsContext<T> | undefined]>;

  // Other props
  /**
   * Optional props to pass to the tab container if `animate` is `true`.
   * @see animate
   */
  containerProps?: NeoTransitionContainerProps;
} & NeoTabsCardContext &
Omit<NeoCardProps, 'children'>;

export const NeoTabsCardContextSymbol = Symbol('NeoTabsCardContext');

export const setTabsCardContext = (context: NeoTabsCardContext): NeoTabsCardContext => setContext(NeoTabsCardContextSymbol, context);
export const getTabsCardContext = (): NeoTabsCardContext | undefined => getContext<NeoTabsCardContext>(NeoTabsCardContextSymbol);
