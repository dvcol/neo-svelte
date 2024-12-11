import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoPinState } from '~/inputs/neo-pin.model.js';

export type NeoPasswordProps<T extends boolean = false> = {
  /**
   * Show a pin input instead of a text input.
   */
  pin?: T;
  /**
   * Button properties to pass to the show/hide password button.
   */
  buttonProps?: NeoButtonProps;
} & NeoInputProps &
  (T extends true ? NeoPinState : Record<string, never>);
