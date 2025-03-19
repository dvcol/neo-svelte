import type { UseFloatingOptions } from '@skeletonlabs/floating-ui-svelte';

export type NeoPlacement = UseFloatingOptions['placement'];

export type NeoTooltipPlacement = NeoPlacement | 'auto';
export type NeoDialogPlacement = NeoPlacement | 'center';
