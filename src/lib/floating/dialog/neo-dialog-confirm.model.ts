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
  ref?: NeoDialogProps['ref'];
  open?: NeoDialogProps['open'];
  modal?: NeoDialogProps['modal'];
  returnValue?: NeoDialogProps['returnValue'];

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
  dialogProps?: Omit<NeoDialogProps, 'ref' | 'open' | 'children' | 'header' | 'modal' | 'returnValue'>;
} & Omit<NeoConfirmProps, 'children' | 'header'>;
