import type { NeoCheckboxButtonProps, NeoCommonCheckboxProps } from '~/buttons/neo-checkbox-button.model.js';
import type { NeoBaseInputProps, NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoLabelProps } from '~/inputs/common/neo-label.model.js';
import type { NeoValidationProps } from '~/inputs/common/neo-validation.model.js';

/**
 * Note: Checkbox group are exclusive due to the api design.
 *
 * @see [github issue #2308](https://github.com/sveltejs/svelte/issues/2308)
 */
export type NeoCheckboxProps = NeoBaseInputProps &
  Pick<
    NeoInputProps,
    | 'id'
    | 'readonly'
    | 'loading'
    | 'validation'
    | 'register'
    | 'in'
    | 'out'
    | 'transition'
    | 'labelRef'
    | 'labelProps'
    | 'containerRef'
    | 'containerProps'
    | 'validationRef'
    | 'validationProps'
  > &
  NeoCommonCheckboxProps &
  Pick<NeoLabelProps, 'label'> &
  Pick<NeoValidationProps, 'error' | 'message' | 'messageProps'> & {
    /**
     * Props to be passed to the checkbox button.
     */
    buttonProps?: NeoCheckboxButtonProps;
  };
