import type { MouseEventHandler } from 'svelte/elements';
import type { NeoConfirmProps } from '~/floating/common/neo-confirm.model.js';
import type { NeoTooltipProps } from '~/floating/tooltips/neo-tooltip.model.js';

export type NeoPopConfirmProps = {
  // Snippet
  /**
   * Element(s) to render inside the trigger.
   */
  children?: NeoTooltipProps['children'];
  /**
   * Element(s) to render inside the tooltip once open.
   */
  tooltip?: NeoTooltipProps['children'] | string;
  /**
   * Element(s) to render inside the header once open.
   */
  header?: NeoTooltipProps['children'] | string;

  // States
  /**
   * The loading state of the confirm & cancel buttons.
   */
  loading?: {
    confirm?: boolean;
    cancel?: boolean;
  };
  /**
   * The disabled state of the confirm & cancel buttons.
   */
  disabled?:
    | boolean
    | {
        confirm?: boolean;
        cancel?: boolean;
      };

  // Tooltip props
  /**
   * Optional ref to the tooltip.
   */
  tooltipRef?: NeoTooltipProps['ref'];
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
  | 'color'
  | 'filled'
  | 'tinted'
  | 'rounded'
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
  Omit<NeoConfirmProps, 'children' | 'header'>;
