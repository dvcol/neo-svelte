import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoIconProps } from '~/icons/neo-icon.model.js';

export type NeoIconButtonProps = NeoButtonProps & {
  /**
   * Optional icon properties.
   */
  iconProps?: NeoIconProps;
};
