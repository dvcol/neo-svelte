import type { NeoBaseInputProps, NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoLabelProps } from '~/inputs/common/neo-label.model.js';
import type { NeoValidationProps } from '~/inputs/common/neo-validation.model.js';

export type NeoSwitchElevation = -2 | -1 | 0 | 1 | 2;

/**
 * Note: Checkbox group are exclusive due to the api design.
 *
 * @see [github issue #2308](https://github.com/sveltejs/svelte/issues/2308)
 */
export type NeoSwitchProps = NeoBaseInputProps &
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
    | 'focusin'
    | 'in'
    | 'out'
    | 'transition'
    | 'labelRef'
    | 'labelProps'
    | 'containerRef'
    | 'containerTag'
    | 'containerProps'
    | 'wrapperRef'
    | 'wrapperTag'
    | 'wrapperProps'
  > &
  Pick<NeoLabelProps, 'label'> &
  Pick<NeoValidationProps, 'error' | 'message' | 'messageTag' | 'messageProps'> & {
    /**
     * Input elevation.
     * @default 2
     */
    elevation?: NeoSwitchElevation;
  };
