import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoInputProps } from '~/inputs/neo-input.model.js';
import type { NeoPinState } from '~/inputs/neo-pin.model.js';

export type NeoPasswordProps<T extends boolean = false> = {
  /**
   * Show a pin input instead of a text input.
   */
  pin?: T;
  /**
   * Button properties to pass to the increment and decrement buttons.
   */
  buttonProps?: NeoButtonProps;
} & NeoInputProps &
  (T extends true ? NeoPinState : Record<string, never>);
