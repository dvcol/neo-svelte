import type { UseFloatingOptions } from '@skeletonlabs/floating-ui-svelte';

export type NeoPlacement = UseFloatingOptions['placement'];

export type NeoTooltipPlacement = NeoPlacement | 'auto';
export type NeoDialogPlacement = NeoPlacement | 'center';

export const NeoPlacements: Record<string, NeoPlacement> = {
  Top: 'top' as const,
  TopStart: 'top-start' as const,
  TopEnd: 'top-end' as const,
  Bottom: 'bottom' as const,
  BottomStart: 'bottom-start' as const,
  BottomEnd: 'bottom-end' as const,
  Left: 'left' as const,
  LeftStart: 'left-start' as const,
  LeftEnd: 'left-end' as const,
  Right: 'right' as const,
  RightStart: 'right-start' as const,
  RightEnd: 'right-end' as const,
} as const;

export const NeoTooltipPlacements: Record<string, NeoTooltipPlacement> = {
  ...NeoPlacements,
  Auto: 'auto' as const,
} as const;

export const NeoDialogPlacements: Record<string, NeoDialogPlacement> = {
  ...NeoPlacements,
  Center: 'center' as const,
} as const;
