import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { ShadowShallowElevation, ShadowShallowElevationString } from '~/utils/shadow.utils.js';

export type NeoCheckboxElevation = ShadowShallowElevation | ShadowShallowElevationString;

export type NeoCommonCheckboxProps = Pick<
  NeoInputProps,
  'checked' | 'indeterminate' | 'touched' | 'disabled' | 'start' | 'glass' | 'rounded' | 'skeleton' | 'color' | 'tinted'
> & {
  /**
   * Input elevation.
   * @default 2
   */
  elevation?: NeoCheckboxElevation;
};

export type NeoCheckboxButtonProps = NeoCommonCheckboxProps &
  HTMLButtonAttributes & {
    /**
     * Any content to be displayed inside the checkbox button.
     */
    children?: Snippet;
  };
