import type { Snippet } from 'svelte';
import type { NeoFloatingStepperProps } from '~/floating/common/neo-floating-stepper.model.js';
import type { NeoDialogContext, NeoDialogProps } from '~/floating/dialog/neo-dialog.model.js';
import type { NeoTooltipProps } from '~/floating/tooltips/neo-tooltip.model.js';
import type { NeoStepperContext } from '~/stepper/neo-stepper.model.js';

export type NeoDialogStepperProps = {
  // Snippet
  /**
   * Element(s) to render inside the stepper.
   */
  children?: Snippet<[NeoDialogContext, NeoStepperContext]> | string;
  /**
   * Element(s) to render inside the header once open.
   */
  header?: Snippet<[NeoDialogContext, NeoStepperContext]> | string;

  // Dialog props
  /**
   * The dialog element reference.
   */
  dialogRef?: NeoDialogProps['ref'];
  /**
   * Whether the dialog is open or not.
   * A change in this prop will trigger the dialog to open or close.
   */
  open?: NeoDialogProps['open'];
  /**
   * Whether the dialog should be modal or not when triggered by a change in the `open` prop.
   *
   * @default true
   */
  modal?: NeoDialogProps['modal'];
  /**
   * The return value when the dialog is closed.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLDialogElement/returnValue)
   */
  returnValue?: NeoDialogProps['returnValue'];
  /**
   * Manages the dialog's closing behavior on supported platforms.
   * If set, disables custom closeOnClickOutside logic.
   *
   * @see [support](https://caniuse.com/mdn-html_elements_dialog_closedby)
   * @see closeOnClickOutside
   */
  closedby?: NeoDialogProps['closedby'];

  // Events
  /**
   * Event Handlers that fires on close.
   */
  onClose?: NeoTooltipProps['onClose'];
  /**
   * Event Handlers that fires on cancel.
   * If a promise is returned, the loading state will be set to true until the promise resolves.
   * If the function rejects, the tooltip will not close.
   */
  onCancel?: NeoFloatingStepperProps['onBeforeStep'];
  /**
   * Event Handlers that fires on confirm.
   * If a promise is returned, the loading state will be set to true until the promise resolves.
   * If the promise rejects, the tooltip will not close.
   * @param e
   */
  onConfirm?: NeoFloatingStepperProps['onBeforeStep'];

  // Other props
  /**
   * Optional props to pass to the dialog.
   */
  dialogProps?: Omit<NeoDialogProps, 'ref' | 'open' | 'children' | 'header' | 'modal' | 'returnValue'>;
} & NeoFloatingStepperProps;
