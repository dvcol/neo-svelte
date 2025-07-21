import type { UseFloatingOptions } from '@skeletonlabs/floating-ui-svelte';

import type { NeoListItem } from '~/list/neo-list.model.js';

export const positionOptions: NeoListItem<UseFloatingOptions['placement']>[] = [
  { value: 'top-start', label: 'Top Start' },
  { value: 'top', label: 'Top' },
  { value: 'top-end', label: 'Top End' },
  { value: 'right-start', label: 'Right Start' },
  { value: 'right', label: 'Right' },
  { value: 'right-end', label: 'Right End' },
  { value: 'bottom-end', label: 'Bottom End' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'bottom-start', label: 'Bottom Start' },
  { value: 'left-end', label: 'Left End' },
  { value: 'left', label: 'Left' },
  { value: 'left-start', label: 'Left Start' },
];
