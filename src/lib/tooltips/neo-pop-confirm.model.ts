import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoTooltipProps } from '~/tooltips/neo-tooltip.model.js';
import type { HTMLNeoBaseElement, HTMLTagProps } from '~/utils/html-element.utils.js';

export type NeoPopConfirmProps = {
  // Snippet
  /**
   * Element(s) to render inside the trigger.
   */
  children?: NeoTooltipProps['children'];
  /**
   * Element(s) to render inside the tooltip once open.
   */
  tooltip?: NeoTooltipProps['children'];
  /**
   * Element(s) to render inside the header once open.
   */
  header?: NeoTooltipProps['children'];

  // States
  /**
   * The HTML tag to render the content wrapper as.
   * @default 'div'
   */
  tag?: keyof HTMLElementTagNameMap;
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
   * If the function rejects, the tooltip will not close.
   */
  onCancel?: (e: MouseEvent) => Promise<unknown> | unknown;
  /**
   * Event Handlers that fires on confirm.
   * If a promise is returned, the loading state will be set to true until the promise resolves.
   * If the promise rejects, the tooltip will not close.
   * @param e
   */
  onConfirm?: (e: MouseEvent) => Promise<unknown> | unknown;

  // Other props
  /**
   * Optional props to pass to the tooltip.
   */
  tooltipProps?: Omit<NeoTooltipProps, 'ref' | 'triggerRef' | 'open' | 'children'>;
  /**
   * Optional props to pass to the controls.
   */
  controlsProps?: HTMLNeoBaseElement & HTMLTagProps;
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
  /**
   * Optional props to pass to the cancel button.
   */
  cancelProps?: NeoButtonProps;
  /**
   * Optional props to pass to the confirm button.
   */
  confirmProps?: NeoButtonProps;
} & HTMLNeoBaseElement;
