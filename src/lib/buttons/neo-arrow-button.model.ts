import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { IconArrowProps } from '~/icons/icon.model.js';

export type NeoArrowButtonProps = NeoButtonProps & {
  /**
   * Optional arrow properties.
   */
  arrowProps?: IconArrowProps;
  /**
   * Arrow direction.
   */
  direction?: IconArrowProps['direction'];
};
