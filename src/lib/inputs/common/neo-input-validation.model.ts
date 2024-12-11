import type { NeoValidationFieldContext, NeoValidationProps, NeoValidationValue } from '~/inputs/common/neo-validation.model.js';

export type NeoInputValidationProps<
  T extends HTMLElement = HTMLElement,
  V extends NeoValidationValue = NeoValidationValue,
  C extends NeoValidationFieldContext<T, V> = NeoValidationFieldContext<T, V>,
> = NeoValidationProps<T, V, C> & {
  /**
   * `true` if the input passes validation.
   */
  valid?: boolean;
  /**
   * `true` if the any message is displayed
   */
  visible?: boolean;
  /**
   * `true` to display the validation message.
   */
  validation?: boolean;
  /**
   * Optional validation message.
   * Note: This will be overridden by the error message if it is set.
   */
  validationMessage?: string;
};
