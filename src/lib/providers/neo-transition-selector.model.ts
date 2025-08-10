import type { NeoButtonProps } from '~/buttons/neo-button.model.js';

export interface NeoTransitionSelectorProps extends NeoButtonProps {
  /**
   * The label to show in the Transition selector.
   *
   * @default Transition: <transition>
   */
  label?: string;
} ;
