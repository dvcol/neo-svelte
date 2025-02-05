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
   * `false` to hide the validation message.
   * `'error'` to only display the error message.
   * `'success'` to only display the success message.
   */
  validation?: boolean | 'error' | 'success';
  /**
   * Optional validation message.
   * Note: This will be overridden by the error message if it is set.
   */
  validationMessage?: string;
};
