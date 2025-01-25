import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { ShadowShallowElevation, ShadowShallowElevationString } from '~/utils/shadow.utils.js';

export type NeoSwitchElevation = ShadowShallowElevation | ShadowShallowElevationString;

export type NeoCommonSwitchProps = Pick<
  NeoInputProps,
  'checked' | 'indeterminate' | 'disabled' | 'valid' | 'start' | 'glass' | 'rounded' | 'skeleton'
> & {
  /**
   * Input elevation.
   * @default 2
   */
  elevation?: NeoSwitchElevation;
};

export type NeoSwitchButtonProps = NeoCommonSwitchProps &
  HTMLButtonAttributes & {
    /**
     * Any content to be displayed inside the radio button.
     */
    children?: Snippet;
  };
