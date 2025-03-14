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
   * Optional ref to the trigger element.
   */
  triggerRef?: NeoTooltipProps['triggerRef'];
  /**
   * The tooltip open state.
   */
  open?: NeoTooltipProps['open'];
  /**
   * The target element to attach the tooltip to.
   */
  target?: NeoTooltipProps['target'];
  /**
   * The delay in milliseconds before the tooltip open state changes.
   *
   * @default 100
   */
  openDelay?: NeoTooltipProps['openDelay'];
  /**
   * The delay in milliseconds before the tooltip opens on hover.
   *
   * @default 500
   */
  hoverDelay?: NeoTooltipProps['hoverDelay'];
  /**
   * Whether to open the tooltip on focus.
   */
  openOnFocus?: NeoTooltipProps['openOnFocus'];
  /**
   * Whether to open the tooltip on hover.
   */
  openOnHover?: NeoTooltipProps['openOnHover'];
  /**
   * Whether the tooltip can be dismissed and a close button shown.
   *
   * @default true
   */
  closable?: NeoTooltipProps['closeOnDismiss'];

  // Styles
  /**
   * Whether to style the borders as rounded.
   */
  rounded?: boolean;
  /**
   * Text color to use for the tooltip.
   */
  color?: NeoTooltipProps['color'];
  /**
   * Fills the tooltip background.
   */
  filled?: NeoTooltipProps['filled'];
  /**
   * Tints the tooltip with the current color.
   */
  tinted?: NeoTooltipProps['tinted'];
  /**
   * The shadow elevation of the tooltip.
   *
   * @default 2
   */
  elevation?: NeoTooltipProps['elevation'];
  /**
   * Optional flex strategy for the container
   */
  flex?: NeoTooltipProps['flex'];
  /**
   * Width strategy for the tooltip.
   * - `match`: the tooltip will match the width of the trigger.
   * - `min`: the tooltip will be at least as wide as the trigger.
   * - `max`: the tooltip will be at most as wide as the trigger.
   * - `available`: the tooltip will be at most as wide as the available space.
   * - `string`: a css width value will be applied to the tooltip.
   * - `{ min: string, max: string, absolute: string }`: a css value will be applied to the tooltip.
   */
  width?: NeoTooltipProps['width'];
  /**
   * Height strategy for the tooltip.
   * - `match`: the tooltip will match the height of the trigger.
   * - `min`: the tooltip will be at least as tall as the trigger.
   * - `max`: the tooltip will be at most as tall as the trigger.
   * - `available`: the tooltip will be at most as tall as the available space.
   * - `string`: a css height value will be applied to the tooltip.
   * - `{ min: string, max: string, absolute: string }`: a css value will be applied to the tooltip.
   */
  height?: NeoTooltipProps['height'];

  // Events
  /**
   * Event Handlers that fires on open.
   */
  onOpen?: NeoTooltipProps['onOpen'];
  /**
   * Event Handlers that fires on close.
   */
  onClose?: NeoTooltipProps['onClose'];
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
} & Omit<NeoConfirmProps, 'children' | 'header'>;
