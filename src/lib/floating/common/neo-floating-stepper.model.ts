import type { Snippet } from 'svelte';
import type { MouseEventHandler } from 'svelte/elements';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoStepperContext, NeoStepperProps } from '~/stepper/neo-stepper.model.js';
import type { HTMLNeoBaseElement, HTMLTagProps } from '~/utils/html-element.utils.js';

export type NeoFloatingStepperProps = {
  // Snippet
  /**
   * Element(s) to render inside the header once open.
   */
  header?: Snippet<[NeoStepperContext]>;

  // State
  /**
   * Whether the stepper show a close button shown.
   *
   * @default true
   */
  closable?: boolean;

  // Styles
  /**
   * Whether to style the borders as rounded.
   */
  rounded?: boolean;

  // Events
  /**
   * Event Handlers that fires on close.
   */
  onClose?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Event Handlers that fires on cancel.
   */
  onCancel?: NeoStepperProps['onBeforeStep'];
  /**
   * Event Handlers that fires on confirm.
   */
  onConfirm?: NeoStepperProps['onBeforeStep'];

  // Other props
  /**
   * Optional props to pass to the header.
   */
  headerProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * Optional props to pass to the content wrapper.
   */
  contentProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * Optional props to pass to the close button.
   */
  closeProps?: NeoButtonProps;
} & NeoStepperProps;
