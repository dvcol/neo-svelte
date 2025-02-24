import type { Snippet } from 'svelte';
import type { NeoCollapseContext } from '~/collapse/neo-collapse-context.svelte.js';

export type NeoCollapseGroupContext = NeoCollapseContext;

export type NeoCollapseGroupProps = {
  /**
   * The neo-collapse to be controlled by this group
   */
  children: Snippet<[NeoCollapseContext]>;

  /**
   * A unique identifier for the group
   */
  id?: string;

  /**
   * The minimum number of collapses that must be open at any time.
   *
   * @default 0
   */
  min?: number;

  /**
   * The maximum number of collapses that can be open at any time.
   *
   * Note: If 0, the group will be disabled.
   *
   * @default Infinity
   */
  max?: number;

  /**
   * Whether the whole group is disabled.
   */
  disabled?: boolean;
};
