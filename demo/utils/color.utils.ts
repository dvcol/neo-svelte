import type { NeoSelectOption } from '~/inputs/neo-select.model.js';
import type { Color } from '~/utils/colors.utils.js';

import { Colors } from '~/utils/colors.utils.js';

export const colorOptions: NeoSelectOption<Color>[] = [
  {
    label: 'Primary',
    value: Colors.Primary,
    color: Colors.Primary,
  },
  {
    label: 'Secondary',
    value: Colors.Secondary,
    color: Colors.Secondary,
  },
  {
    label: 'Success',
    value: Colors.Success,
    color: Colors.Success,
  },
  {
    label: 'Warning',
    value: Colors.Warning,
    color: Colors.Warning,
  },
  {
    label: 'Error',
    value: Colors.Error,
    color: Colors.Error,
  },
];
