import { type Snippet } from 'svelte';

import type { NeoCardProps } from '~/cards/neo-card.model.js';
import type { NeoTransitionContainerProps } from '~/container/NeoTransitionContainer.model.js';

import { type NeoTabsContext } from '~/nav/neo-tabs-context.svelte.js';

export type NeoTabsCardProps<T = unknown> = {
  /**
   * Snippet to display as the card content.
   */
  children?: Snippet<[NeoTabsContext<T> | undefined]>;

  // Styles
  /**
   * If `true`, pane transition will be animated.
   * @default true
   */
  animate?: boolean;

  // Other props
  /**
   * Optional props to pass to the tab container if `animate` is `true`.
   * @see animate
   */
  containerProps?: NeoTransitionContainerProps;
} & Omit<NeoCardProps, 'children'>;

export const NeoTabsCardContextSymbol = Symbol('NeoTabsCardContext');
