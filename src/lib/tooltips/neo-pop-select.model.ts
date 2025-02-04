import type { NeoListSearchProps } from '~/list/neo-list-search.model.js';
import type { NeoListProps } from '~/list/neo-list.model.js';
import type { NeoTooltipProps } from '~/tooltips/neo-tooltip.model.js';

export type NeoPopSelectProps = {
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
   * Optional ref to the list.
   */
  listRef?: NeoListProps['ref'];
  /**
   * Optional props to pass to the search input.
   */
  searchProps: NeoListSearchProps;

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
   * Optional props to pass to the tooltip.
   */
  tooltipProps: Omit<NeoTooltipProps, 'ref' | 'triggerRef' | 'open' | 'children'>;
} & Omit<NeoListProps, 'ref' | 'children'>;
