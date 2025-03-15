import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { IconProps } from '~/icons/icon.model.js';

export type NeoIconButtonProps = NeoButtonProps & {
  /**
   * Optional icon properties.
   */
  iconProps?: IconProps;
};
