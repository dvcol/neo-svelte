import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoListSearchProps } from '~/list/neo-list-search.model.js';
import type { NeoListItemOrSection, NeoListProps } from '~/list/neo-list.model.js';
import type { NeoTooltipProps } from '~/tooltips/neo-tooltip.model.js';

export type NeoPopSelectProps<Value = unknown> = {
  // Snippet
  /**
   * Element(s) to render inside the trigger.
   */
  children?: NeoTooltipProps['children'];

  // States
  /**
   * Whether to show the search input.
   */
  search?: boolean;

  // Styles
  /**
   * Whether to style the borders as rounded.
   */
  rounded?: boolean;

  // List props
  /**
   * List items to select from.
   */
  items?: (string | number | NeoListItemOrSection)[];
  /**
   * We use the list's search is focused.
   *
   * @see search
   */
  focused?: NeoInputProps['focused'];
  /**
   * Optional ref to the list.
   */
  listRef?: NeoListProps<Value>['ref'];
  /**
   * Optional props to pass to the search input.
   */
  searchProps?: NeoListSearchProps;
  /**
   * Event listener that fires when an item is selected/deselected.
   * @param event
   */
  onSelect?: NeoListProps<Value>['onSelect'];

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
   * The delay in milliseconds before the tooltip opens on hover.
   *
   * @default 500
   */
  hoverDelay?: NeoTooltipProps['hoverDelay'];
  /**
   * The delay in milliseconds before the tooltip open state changes.
   *
   * @default 100
   */
  openDelay?: NeoTooltipProps['openDelay'];
  /**
   * Whether to open the tooltip on focus.
   */
  openOnFocus?: NeoTooltipProps['openOnFocus'];
  /**
   * Whether to open the tooltip on hover.
   */
  openOnHover?: NeoTooltipProps['openOnHover'];
  /**
   * The target element to attach the tooltip to.
   */
  target?: NeoTooltipProps['target'];
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
   *
   * @default 'min'
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
   *
   * @default 'min'
   */
  height?: NeoTooltipProps['height'];
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
   * Event Handlers that fires on open.
   */
  onOpen?: NeoTooltipProps['onOpen'];
  /**
   * Event Handlers that fires on close.
   */
  onClose?: NeoTooltipProps['onClose'];

  // Other props
  /**
   * Optional props to pass to the tooltip.
   */
  tooltipProps?: Omit<NeoTooltipProps, 'ref' | 'triggerRef' | 'open' | 'children'>;
} & Omit<NeoListProps<Value>, 'ref' | 'children' | 'width' | 'height'>;
