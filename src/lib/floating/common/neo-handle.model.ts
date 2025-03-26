import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { NeoDividerProps } from '~/divider/neo-divider.model.js';
import type { NeoMovableOutside } from '~/floating/dialog/use-movable.svelte.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export const NeoHandlePlacement = {
  Top: 'top' as const,
  Right: 'right' as const,
  Bottom: 'bottom' as const,
  Left: 'left' as const,
} as const;

export type NeoHandlePlacements = (typeof NeoHandlePlacement)[keyof typeof NeoHandlePlacement];

export type NeoHandleContext = {
  enabled: boolean;
  placements: NeoHandlePlacements[];
  axis?: 'x' | 'y';
  outside?: NeoMovableOutside;
};

export type NeoHandleProps = {
  /**
   * children around which to render the handles.
   */
  children?: Snippet<[NeoHandleContext]>;
  /**
   * Custom snippet for the handle content.
   **/
  handle?: Snippet<[NeoHandlePlacements]>;

  /**
   * Optional references to the handle buttons.
   */
  refs?: Partial<Record<NeoHandlePlacements, HTMLButtonElement>>;
  /**
   * Whether to render the handles.
   **/
  enabled?: boolean;
  /**
   * Whether the handle content should be visible
   **/
  visible?: boolean;
  /**
   * The allowed axis for dragging the element.
   **/
  axis?: 'x' | 'y';
  /**
   * Whether the element is currently outside the viewport.
   *
   * @default false
   */
  outside?: NeoMovableOutside;
  /**
   * Placement of the handle (or array of visible handles).
   *
   * @default 'top'
   **/
  placement?: NeoHandlePlacements | Partial<Record<NeoHandlePlacements, boolean>>;
  /**
   * Whether the handle should be inside or outside the element.
   *
   * @default inside
   */
  position?: 'inside' | 'outside';
  /**
   * Element elevation (used when calculating the handle offset when outside).
   *
   * @default 0
   * @see outside
   */
  elevation?: number;
  /**
   * Minimum handle size (in px).
   *
   * @default 16
   */
  minSize?: number;

  /**
   * Optional properties to pass to the default drag handle (divider).
   */
  dividerProps?: NeoDividerProps;
  /**
   * Optional properties to pass to the handle group wrapper.
   */
  groupProps?: HTMLNeoBaseElement;
} & Partial<HTMLButtonAttributes>;
