import type { Snippet } from 'svelte';
import type { HTMLOptionAttributes } from 'svelte/elements';

import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoPopSelectProps } from '~/floating/tooltips/neo-pop-select.model.js';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoListItemOrSection, NeoListSelectedItem } from '~/list/neo-list.model.js';

export type NeoNativeSelectOption<Value = any> =
  | string
  | number
  | ({
    value: Value;
    label?: string | Snippet;
    id?: string | number;
  } & HTMLOptionAttributes);

export type NeoNativeSelectProps<Value = any> = {
  /**
   * Custom icon for the picker.
   */
  icon?: NeoButtonProps['icon'];
  /**
   * Button properties to pass to the show/hide dropdown button.
   */
  buttonProps?: NeoButtonProps;
  /**
   * The array of options to display in the select.
   */
  options?: NeoNativeSelectOption<Value>[];
} & NeoInputProps;

export type NeoSelectOption<Value = any> = NeoListItemOrSection<Value>;

export type NeoSelectProps<Value = any> = {
  // Snippets

  /**
   * Custom icon for the picker.
   */
  icon?: NeoButtonProps['icon'];
  /**
   * Custom content to display in the input.
   */
  content?: NeoInputProps['display'];

  // States
  /**
   * The array of options to display in the select.
   */
  options?: NeoSelectOption<Value>[];
  /**
   * Transform the selected item(s) into a displayable string.
   * @param selection
   */
  display?: (selection?: NeoListSelectedItem<Value> | NeoListSelectedItem<Value>[]) => NeoInputProps['display'];
  /**
   * Extract the selected item(s) value.
   * @param selection
   */
  transform?: (selection?: NeoListSelectedItem<Value> | NeoListSelectedItem<Value>[]) => undefined | Value | Value[];

  // ListProps
  /**
   * Optional ref to the list.
   */
  listRef?: NeoPopSelectProps<Value>['listRef'];
  /**
   * Optional filter to highlight text.
   */
  highlight?: NeoPopSelectProps<Value>['highlight'];
  /**
   * A filter function to apply to each item in the list.
   * @param item
   */
  filter?: NeoPopSelectProps<Value>['filter'];
  /**
   * A sort function to apply to the list items.
   * @param a
   * @param b
   */
  sort?: NeoPopSelectProps<Value>['sort'];
  /**
   * The currently selected item(s).
   */
  selected?: NeoPopSelectProps<Value>['selected'];
  /**
   * Whether to show the search input.
   */
  search?: NeoPopSelectProps<Value>['search'];

  // Tooltip Props
  /**
   * Optional ref to the tooltip.
   */
  tooltipRef?: NeoPopSelectProps<Value>['tooltipRef'];
  /**
   * Optional ref to the trigger element.
   */
  triggerRef?: NeoPopSelectProps<Value>['triggerRef'];
  /**
   * The tooltip open state.
   */
  open?: NeoPopSelectProps<Value>['open'];
  /**
   * The delay in milliseconds before the tooltip opens on hover.
   *
   * @default 500
   */
  hoverDelay?: NeoPopSelectProps<Value>['hoverDelay'];
  /**
   * The delay in milliseconds before the tooltip open state changes.
   *
   * @default 100
   */
  openDelay?: NeoPopSelectProps<Value>['openDelay'];
  /**
   * Whether to open the tooltip on focus.
   */
  openOnFocus?: NeoPopSelectProps<Value>['openOnFocus'];
  /**
   * Whether to open the tooltip on hover.
   */
  openOnHover?: NeoPopSelectProps<Value>['openOnHover'];
  /**
   * Event listener that fires when an item is selected/deselected.
   * @param event
   */
  onSelect?: NeoPopSelectProps<Value>['onSelect'];
  /**
   * Event listener that fires when an item is selected/deselected.
   * @param value
   */
  onChange?: NeoPopSelectProps<Value>['onChange'];
  /**
   * Event Handlers that fires on open.
   */
  onOpen?: NeoPopSelectProps<Value>['onOpen'];
  /**
   * Event Handlers that fires on close.
   */
  onClose?: NeoPopSelectProps<Value>['onClose'];

  // OtherProps
  /**
   * Optional props to pass to the list.
   */
  listProps?: NeoPopSelectProps<Value>;
  /**
   * Button properties to pass to the show/hide dropdown button.
   */
  buttonProps?: NeoButtonProps;
} & Omit<NeoInputProps, 'display'>;

export const displayValue: NeoSelectProps['display'] = <Value = unknown>(
  selection?: NeoListSelectedItem<Value> | NeoListSelectedItem<Value>[],
): NeoInputProps['display'] => {
  if (Array.isArray(selection)) {
    if (selection?.length > 2) return `${selection?.length} items selected`;
    return selection?.map(s => s.item?.label ?? s.item?.value?.toString()).join(', ');
  }
  return selection?.item?.label ?? selection?.item?.value?.toString();
};

export const transformValue: NeoSelectProps['transform'] = <Value = unknown>(
  selection?: NeoListSelectedItem<Value> | NeoListSelectedItem<Value>[],
): undefined | Value | Value[] => {
  if (Array.isArray(selection)) return selection?.map?.(s => s?.item?.value) ?? [];
  return selection?.item?.value;
};
