import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';

export type NeoCheckboxElevation = -2 | -1 | 0 | 1 | 2;

export type NeoCommonCheckboxProps = Pick<
  NeoInputProps,
  'checked' | 'indeterminate' | 'touched' | 'disabled' | 'start' | 'glass' | 'rounded' | 'skeleton'
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
