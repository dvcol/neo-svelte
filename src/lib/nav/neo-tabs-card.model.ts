import { getContext, setContext, type Snippet } from 'svelte';

import type { NeoCardProps } from '~/cards/neo-card.model.js';
import type { NeoTransitionContainerProps } from '~/container/neo-transition-container.model.js';

import { type NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';

export type NeoTabsCardContext = {
  /**
   * If `true`, pane transition will be animated.
   * @default true
   */
  animate?: boolean;
};

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
