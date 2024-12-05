import type { HTMLInputAttributes } from 'svelte/elements';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoInputProps } from '~/inputs/neo-input.model.js';

export type NeoColorPickerProps = {
  /**
   * Reference to the color picker input element.
   */
  pickerRef?: HTMLInputElement;
  /**
   * Input properties to pass to the color picker input.
   */
  pickerProps?: HTMLInputAttributes;
  /**
   * Button properties to pass to the picker button.
   */
  buttonProps?: NeoButtonProps;
} & NeoInputProps;
