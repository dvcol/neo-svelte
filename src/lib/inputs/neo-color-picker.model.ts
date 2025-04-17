import type { HTMLInputAttributes } from 'svelte/elements';

import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { HTMLRefProps } from '~/utils/html-element.utils.js';

export type NeoColorPickerSelectorProps = HTMLRefProps<HTMLInputElement> &
  HTMLInputAttributes & {
    /**
     * If true, the input will have a rounded border.
     */
    rounded?: NeoInputProps['rounded'];
  };

export type NeoColorPickerProps = {
  /**
   * Custom icon for the picker.
   */
  icon?: NeoButtonProps['icon'];
  /**
   * Reference to the color picker input element.
   */
  pickerRef?: NeoColorPickerSelectorProps['ref'];
  /**
   * Input properties to pass to the color picker input.
   */
  pickerProps?: Omit<NeoColorPickerSelectorProps, 'ref'>;
  /**
   * Button properties to pass to the picker button.
   */
  buttonProps?: NeoButtonProps;
} & NeoInputProps;
