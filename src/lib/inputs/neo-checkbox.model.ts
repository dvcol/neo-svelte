import type { NeoBaseInputProps, NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoLabelProps } from '~/inputs/common/neo-label.model.js';
import type { NeoValidationProps } from '~/inputs/common/neo-validation.model.js';

export type NeoCheckboxProps = NeoBaseInputProps &
  Pick<
    NeoInputProps,
    | 'start'
    | 'glass'
    | 'rounded'
    | 'readonly'
    | 'loading'
    | 'disabled'
    | 'skeleton'
    | 'validation'
    | 'in'
    | 'out'
    | 'transition'
    | 'labelRef'
    | 'labelProps'
    | 'containerTag'
    | 'containerProps'
    | 'wrapperTag'
    | 'wrapperProps'
  > &
  Pick<NeoLabelProps, 'label'> &
  Pick<NeoValidationProps, 'error' | 'message' | 'messageTag' | 'messageProps'> & {
    /**
     * Whether the checkbox is raised or flat.
     */
    flat?: boolean;
  };
