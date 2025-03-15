import type { MouseEventHandler } from 'svelte/elements';
import type { NeoConfirmProps } from '~/floating/common/neo-confirm.model.js';
import type { NeoDialogProps } from '~/floating/dialog/neo-dialog.model.js';

export type NeoDialogConfirmProps = {
  // Snippet
  /**
   * Element(s) to render inside the trigger.
   */
  children?: NeoDialogProps['children'] | string;
  /**
   * Element(s) to render inside the header once open.
   */
  header?: NeoDialogProps['children'] | string;

  // Dialog props
  /**
   * The dialog element reference.
   */
  ref?: NeoDialogProps['ref'];
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
  onClose?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Event Handlers that fires on cancel.
   * If a promise is returned, the loading state will be set to true until the promise resolves.
   * If the function rejects, the tooltip will not close.
   */
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Event Handlers that fires on confirm.
   * If a promise is returned, the loading state will be set to true until the promise resolves.
   * If the promise rejects, the tooltip will not close.
   * @param e
   */
  onConfirm?: MouseEventHandler<HTMLButtonElement>;

  // Other props
  /**
   * Optional props to pass to the dialog.
   */
  dialogProps?: Omit<NeoDialogProps, 'ref' | 'open' | 'children' | 'header' | 'modal' | 'returnValue'>;
} & Omit<NeoConfirmProps, 'children' | 'header'>;
