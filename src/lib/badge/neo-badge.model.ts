import type { Snippet } from 'svelte';
import type { NeoPillProps } from '~/pill/neo-pill.model.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export const NeoBadgePlacement = {
  Top: 'top' as const,
  TopRight: 'top-right' as const,
  TopLeft: 'top-left' as const,
  Bottom: 'bottom' as const,
  BottomRight: 'bottom-right' as const,
  BottomLeft: 'bottom-left' as const,
  Right: 'right' as const,
  Left: 'left' as const,
} as const;

export type NeoBadgePlacements = (typeof NeoBadgePlacement)[keyof typeof NeoBadgePlacement];

export type NeoBadgeContext = {
  placement: NeoBadgePlacements;
  offset?: { x?: string; y?: string };
};

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
   * The tag to use for the relative container.
   */
  containerTag?: keyof HTMLElementTagNameMap;
  /**
   * Props to pass to the relative container.
   */
  containerProps?: HTMLNeoBaseElement;
} & NeoPillProps;
