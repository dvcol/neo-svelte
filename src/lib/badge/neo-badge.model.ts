import type { Snippet } from 'svelte';

import type { NeoPillProps } from '~/pill/neo-pill.model.js';
import type { HTMLNeoBaseElement, HTMLTagProps } from '~/utils/html-element.utils.js';

export const NeoBadgePlacement = {
  Top: 'top',
  TopRight: 'top-right',
  TopLeft: 'top-left',
  Bottom: 'bottom',
  BottomRight: 'bottom-right',
  BottomLeft: 'bottom-left',
  Right: 'right',
  Left: 'left',
} as const;

export type NeoBadgePlacements = (typeof NeoBadgePlacement)[keyof typeof NeoBadgePlacement];

export interface NeoBadgeContext {
  placement: NeoBadgePlacements;
  offset?: { x?: string; y?: string };
}

export type NeoBadgeProps = {
  /**
   * The content to place the badge on.
   */
  children?: Snippet<[NeoBadgeContext]>;
  /**
   * The value to display in the badge.
   */
  value?: Snippet<[NeoBadgeContext]>;

  /**
   * Optional vertical and horizontal offset for the badge.
   */
  offset?: number | string | { x?: number | string; y?: number | string };
  /**
   * Badge placement relative to the content.
   *
   * @default top-right
   */
  placement?: NeoBadgePlacements;
  /**
   * Props to pass to the relative container.
   */
  containerProps?: HTMLNeoBaseElement & HTMLTagProps;
} & NeoPillProps;
