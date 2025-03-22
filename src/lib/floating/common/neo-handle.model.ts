import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { NeoDividerProps } from '~/divider/neo-divider.model.js';

export type NeoHandlePlacement = 'top' | 'right' | 'bottom' | 'left';

export type NeoHandleState = {
  /**
   * Whether to render the handles.
   **/
  enabled: boolean;
  /**
   * Placement of the handle (or array of visible handles).
   *
   * @default 'top'
   **/
  placement: NeoHandlePlacement | NeoHandlePlacement[];
  /**
   * Whether the handle should be inside or outside the element.
   *
   * @default inside
   */
  position?: 'inside' | 'outside';
  /**
   * The allowed axis for dragging the element.
   **/
  axis?: 'x' | 'y';
  /**
   * Whether the handle content should be visible.
   **/
  handle?: boolean | Snippet<['top' | 'right' | 'bottom' | 'left']>;
};

export type NeoHandleProps = {
  /**
   * Optional children to display within each handle.
   */
  children?: Snippet<[Omit<NeoHandleState, 'placement' | 'handle'> & { placement: NeoHandlePlacement }]>;
  /**
   * Optional properties to pass to the default drag handle (divider).
   */
  dividerProps?: NeoDividerProps;
} & Partial<NeoHandleState> &
  Partial<HTMLButtonAttributes>;
