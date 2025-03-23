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

  // Stepper props
  /**
   * Where to place the progress bar relative to the stepper content.
   */
  progressPlacement?: NeoFloatingStepperProps['placement'];

  // Dialog props
  /**
   * The dialog element reference.
   */
  dialogRef?: NeoDialogProps['ref'];

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
} & Pick<
  NeoDialogProps,
  | 'ref'
  | 'open'
  | 'modal'
  | 'moved'
  | 'returnValue'
  | 'closedby'
  | 'unmountOnClose'
  | 'placement'
  | 'movable'
  | 'outside'
  | 'elevation'
  | 'blur'
  | 'slide'
  | 'color'
  | 'filled'
  | 'tinted'
  | 'backdrop'
  | 'borderless'
  | 'flex'
  | 'align'
  | 'justify'
  | 'width'
  | 'height'
  | 'padding'
  | 'in'
  | 'out'
  | 'transition'
  | 'use'
  | 'backdropProps'
> &
  Omit<NeoFloatingStepperProps, 'placement'>;
