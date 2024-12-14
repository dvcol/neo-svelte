import type { NeoBaseInputProps, NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoLabelProps } from '~/inputs/common/neo-label.model.js';

export type NeoRadioProps = NeoBaseInputProps &
  Pick<
    NeoInputProps,
    | 'start'
    | 'glass'
    | 'elevation'
    | 'rounded'
    | 'readonly'
    | 'loading'
    | 'disabled'
    | 'skeleton'
    | 'in'
    | 'out'
    | 'transition'
    | 'labelRef'
    | 'labelProps'
    | 'containerTag'
    | 'containerProps'
  > &
  Pick<NeoLabelProps, 'label'>;
