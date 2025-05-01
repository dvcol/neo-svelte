import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

export interface NeoResetSelectorProps extends NeoButtonProps {
  /**
   * The label to show in the reset selector.
   *
   * @default Reset
   */
  label?: string;
}
