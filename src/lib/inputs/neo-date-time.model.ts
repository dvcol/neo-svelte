import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';

export type NeoDateTimeProps = {
  /**
   * Button properties to pass to the increment and decrement buttons.
   */
  buttonProps?: NeoButtonProps;
} & NeoInputProps;
