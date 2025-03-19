import type { UseFloatingOptions } from '@skeletonlabs/floating-ui-svelte';
import type { NeoSelectOption } from '~/inputs/neo-select.model.js';

export const positionOptions: NeoSelectOption<UseFloatingOptions['placement']>[] = [
  { value: 'top', label: 'Top' },
  { value: 'top-start', label: 'Top Start' },
  { value: 'top-end', label: 'Top End' },
  { value: 'right', label: 'Right' },
  { value: 'right-start', label: 'Right Start' },
  { value: 'right-end', label: 'Right End' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'bottom-start', label: 'Bottom Start' },
  { value: 'bottom-end', label: 'Bottom End' },
  { value: 'left', label: 'Left' },
  { value: 'left-start', label: 'Left Start' },
  { value: 'left-end', label: 'Left End' },
];
