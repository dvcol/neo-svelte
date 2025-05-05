import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoIconArrowProps } from '~/icons/neo-icon.model.js';

export type NeoArrowButtonProps = NeoButtonProps & {
  /**
   * Optional arrow properties.
   */
  arrowProps?: NeoIconArrowProps;
  /**
   * Arrow direction.
   */
  direction?: NeoIconArrowProps['direction'];
};
