import type { Snippet } from 'svelte';
import type { NeoFloatingStepperProps } from '~/floating/common/neo-floating-stepper.model.js';
import type { NeoTooltipContext, NeoTooltipProps, NeoTooltipToggle } from '~/floating/tooltips/neo-tooltip.model.js';
import type { NeoStepperContext } from '~/stepper/neo-stepper.model.js';

export type NeoPopStepperProps = {
  // Snippet
  /**
   * Element(s) to render inside the trigger.
   */
  children?: NeoTooltipProps['children'];
  /**
   * Element(s) to render inside the tooltip once open.
   */
  tooltip?: Snippet<[NeoTooltipContext, NeoTooltipToggle, NeoStepperContext]>;
  /**
   * Element(s) to render inside the header once open.
   */
  header?: Snippet<[NeoTooltipContext, NeoTooltipToggle, NeoStepperContext]>;

  // Tooltip props
  /**
   * Optional ref to the tooltip.
   */
  tooltipRef?: NeoTooltipProps['ref'];
  /**
   * Optional ref to the trigger element.
   */
  triggerRef?: NeoTooltipProps['triggerRef'];
  /**
   * Whether the tooltip can be dismissed and a close button shown.
   *
   * @default true
   */
  closable?: NeoTooltipProps['closeOnDismiss'];

  // Events
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
   * Optional props to pass to the tooltip.
   */
  tooltipProps?: Omit<NeoTooltipProps, 'ref' | 'triggerRef' | 'open' | 'children'>;
} & Pick<
  NeoTooltipProps,
  | 'triggerRef'
  | 'open'
  | 'target'
  | 'openDelay'
  | 'hoverDelay'
  | 'openOnFocus'
  | 'openOnHover'
  | 'openOnClick'
  | 'color'
  | 'filled'
  | 'tinted'
  | 'elevation'
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
  | 'onOpen'
  | 'onClose'
> &
  NeoFloatingStepperProps;
