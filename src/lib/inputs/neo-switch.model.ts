import type { NeoCommonSwitchProps, NeoSwitchButtonProps } from '~/buttons/neo-switch-button.model.js';
import type { NeoBaseInputProps, NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoLabelProps } from '~/inputs/common/neo-label.model.js';
import type { NeoValidationProps } from '~/inputs/common/neo-validation.model.js';

/**
 * Note: Checkbox group are exclusive due to the api design.
 *
 * @see [github issue #2308](https://github.com/sveltejs/svelte/issues/2308)
 */
export type NeoSwitchProps = NeoBaseInputProps &
  Pick<
    NeoInputProps,
    | 'readonly'
    | 'loading'
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
    | 'color'
    | 'tinted'
  > &
  NeoCommonSwitchProps &
  Pick<NeoLabelProps, 'label'> &
  Pick<NeoValidationProps, 'error' | 'message' | 'messageTag' | 'messageProps'> & {
    /**
     * Props to be passed to the switch button.
     */
    buttonProps?: NeoSwitchButtonProps;
  };
