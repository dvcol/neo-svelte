import type { NeoBaseInputProps, NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoLabelProps } from '~/inputs/common/neo-label.model.js';

export type NeoRadioElevation = -2 | -1 | 0 | 1 | 2;

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
    | 'containerRef'
    | 'containerTag'
    | 'containerProps'
  > &
  Pick<NeoLabelProps, 'label'> & {
    /**
     * Input elevation.
     * @default 2
     */
    elevation?: NeoRadioElevation;
  };
