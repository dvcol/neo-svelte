import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoInputProps } from '~/inputs/neo-input.model.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoNumberStepProps = NeoInputProps & {
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
   * The HTML tag to use for the stepped number container.
   * @default div
   */
  numberTag?: keyof HTMLElementTagNameMap;
  /**
   * The props to pass to the stepped number container.
   */
  numberProps?: HTMLNeoBaseElement;
};