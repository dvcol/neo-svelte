import type { Snippet } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';

export type NeoRadioElevation = -2 | -1 | 0 | 1 | 2;

export type NeoCommonRadioProps = Pick<NeoInputProps, 'checked' | 'touched' | 'disabled' | 'start' | 'glass' | 'rounded' | 'skeleton'> & {
  /**
   * Input elevation.
   * @default 2
   */
  elevation?: NeoRadioElevation;
};

export type NeoRadioButtonProps = NeoCommonRadioProps &
  HTMLButtonAttributes & {
    /**
     * Any content to be displayed inside the radio button.
     */
    children?: Snippet;
  };
