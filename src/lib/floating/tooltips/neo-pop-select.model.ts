import type { NeoTooltipProps } from '~/floating/tooltips/neo-tooltip.model.js';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoListSearchProps } from '~/list/neo-list-search.model.js';
import type { NeoListItemOrSection, NeoListProps } from '~/list/neo-list.model.js';

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
  Omit<NeoListProps<Value>, 'ref' | 'children' | 'width' | 'height'>;
