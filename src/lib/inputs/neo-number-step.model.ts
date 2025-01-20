import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';

export type NeoNumberStepProps = NeoInputProps & {
  // Snippets
  /**
   * Custom icon for the plus button.
   */
  iconPlus?: NeoButtonProps['icon'];
  /**
   * Custom icon for the minus button.
   */
  iconMinus?: NeoButtonProps['icon'];

  // States
  /**
   * Center the input value.
   */
  center?: boolean;
  // Events
  /**
   * Event handler for the step-up button.
   */
  onStepUp?: (e: MouseEvent, value: number, step?: string | number) => void;
  /**
   * Event handler for the step-down button.
   */
  onStepDown?: (e: MouseEvent, value: number, step?: string | number) => void;

  // Other props
  /**
   * Button properties to pass to the increment and decrement buttons.
   */
  buttonProps?: NeoButtonProps;
  /**
   * Input Group properties to pass to the input group container.
   */
  groupProps?: NeoInputProps['containerProps'];
};
