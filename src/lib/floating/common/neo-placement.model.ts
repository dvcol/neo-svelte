import type { UseFloatingOptions } from '@skeletonlabs/floating-ui-svelte';

export type NeoPlacement = NonNullable<UseFloatingOptions['placement']>;

export type NeoTooltipPlacement = NeoPlacement | 'auto';
export type NeoDialogPlacement = NeoPlacement | 'center';

export const NeoPlacements = {
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
} as const satisfies Record<string, NeoPlacement>;

export const NeoTooltipPlacements = {
  ...NeoPlacements,
  Auto: 'auto',
} as const satisfies Record<string, NeoTooltipPlacement>;

export const NeoDialogPlacements = {
  ...NeoPlacements,
  Center: 'center',
} as const satisfies Record<string, NeoDialogPlacement>;

export const NeoNotificationPlacements = {
  Top: 'top',
  TopStart: 'top-start',
  TopEnd: 'top-end',
  Bottom: 'bottom',
  BottomStart: 'bottom-start',
  BottomEnd: 'bottom-end',
} as const satisfies Partial<Record<string, NeoDialogPlacement>>;

export type NeoNotificationPlacement = (typeof NeoNotificationPlacements)[keyof typeof NeoNotificationPlacements];

export function reversePlacement(placement?: NeoTooltipPlacement): NeoTooltipPlacement | undefined {
  if (placement?.startsWith('right')) return placement?.replace('right', 'left') as NeoTooltipPlacement;
  if (placement?.startsWith('left')) return placement?.replace('left', 'right') as NeoTooltipPlacement;
  return placement;
}

export function invertPlacement(placement?: NeoTooltipPlacement): NeoTooltipPlacement | undefined {
  if (placement?.startsWith('top')) return placement?.replace('top', 'bottom') as NeoTooltipPlacement;
  if (placement?.startsWith('bottom')) return placement?.replace('bottom', 'top') as NeoTooltipPlacement;
  return placement;
}
