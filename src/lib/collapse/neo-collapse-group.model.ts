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
  min?: NeoCollapseContext['min'];

  /**
   * The maximum number of collapses that can be open at any time.
   *
   * Note: If 0, the group will be readonly.
   *
   * @default Infinity
   */
  max?: NeoCollapseContext['max'];

  /**
   * Whether the whole group is disabled.
   */
  disabled?: NeoCollapseContext['disabled'];

  /**
   * Whether the whole group is readonly.
   */
  readonly?: NeoCollapseContext['readonly'];

  /**
   * The strategy to use when the group has reached the maximum/minimum number of open collapses.
   * - `readonly`: The group will be readonly and won't allow any more collapses to be opened/closed.
   * - `oldest`: The oldest opened/closed collapses will be toggled.
   *
   * @default { min: 'readonly', max: 'oldest' }
   */
  strategy?: NeoCollapseContext['strategy'];
};
