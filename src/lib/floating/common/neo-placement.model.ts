import type { UseFloatingOptions } from '@skeletonlabs/floating-ui-svelte';

export type NeoPlacement = UseFloatingOptions['placement'];

export type NeoTooltipPlacement = NeoPlacement | 'auto';
export type NeoDialogPlacement = NeoPlacement | 'center';
export type NeoNotificationPlacement = NeoPlacement;

export const NeoPlacements: Record<string, NeoPlacement> = {
  Top: 'top',
  TopStart: 'top-start',
  TopEnd: 'top-end',
  Bottom: 'bottom',
  BottomStart: 'bottom-start',
  BottomEnd: 'bottom-end',
  Left: 'left',
  LeftStart: 'left-start',
  LeftEnd: 'left-end',
  Right: 'right',
  RightStart: 'right-start',
  RightEnd: 'right-end',
} as const;

export const NeoTooltipPlacements: Record<string, NeoTooltipPlacement> = {
  ...NeoPlacements,
  Auto: 'auto' as const,
} as const;

export const NeoDialogPlacements: Record<string, NeoDialogPlacement> = {
  ...NeoPlacements,
  Center: 'center' as const,
} as const;

export function reversePlacement(placement?: NeoTooltipPlacement): NeoTooltipPlacement {
  if (placement?.startsWith('right')) return placement?.replace('right', 'left') as NeoTooltipPlacement;
  if (placement?.startsWith('left')) return placement?.replace('left', 'right') as NeoTooltipPlacement;
  return placement;
}

export function invertPlacement(placement?: NeoTooltipPlacement): NeoTooltipPlacement {
  if (placement?.startsWith('top')) return placement?.replace('top', 'bottom') as NeoTooltipPlacement;
  if (placement?.startsWith('bottom')) return placement?.replace('bottom', 'top') as NeoTooltipPlacement;
  return placement;
}
