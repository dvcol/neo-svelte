import type { NeoCommonRadioProps, NeoRadioButtonProps } from '~/buttons/neo-radio-button.model.js';
import type { NeoBaseInputProps, NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoLabelProps } from '~/inputs/common/neo-label.model.js';

export type NeoRadioProps = NeoBaseInputProps &
  Pick<
    NeoInputProps,
    | 'readonly'
    | 'loading'
    | 'focusin'
    | 'in'
    | 'out'
    | 'transition'
    | 'labelRef'
    | 'labelProps'
    | 'containerRef'
    | 'containerProps'
    | 'color'
    | 'tinted'
    | 'flex'
    | 'width'
    | 'height'
  > &
  Pick<NeoLabelProps, 'label'> &
  NeoCommonRadioProps & {
    /**
     * Props to be passed to the radio button.
     */
    buttonProps?: NeoRadioButtonProps;
  };
