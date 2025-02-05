import type { Snippet } from 'svelte';
import type { HTMLOptionAttributes } from 'svelte/elements';
import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoListItemOrSection, NeoListSelectedItem } from '~/list/neo-list.model.js';
import type { NeoPopSelectProps } from '~/tooltips/neo-pop-select.model.js';

export type NeoNativeSelectOption<Value = unknown> = {
  value: Value;
  label?: string | Snippet;
} & HTMLOptionAttributes;

export type NeoNativeSelectProps<Value = unknown> = {
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

export type NeoSelectProps<Value = unknown> = {
  // Snippets

  /**
   * Custom icon for the picker.
   */
  icon?: NeoButtonProps['icon'];

  // States
  /**
   * The array of options to display in the select.
   */
  options?: NeoListItemOrSection<Value>[];
  /**
   * Transform the selected item(s) into a displayable string.
   * @param selection
   */
  display?: (selection?: NeoListSelectedItem | NeoListSelectedItem[]) => string | string[];

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

  // OtherProps
  /**
   * Optional props to pass to the list.
   */
  listProps?: NeoPopSelectProps<Value>;
  /**
   * Button properties to pass to the show/hide dropdown button.
   */
  buttonProps?: NeoButtonProps;
} & NeoInputProps;

export const displayValue = (selection?: NeoListSelectedItem | NeoListSelectedItem[]): string => {
  if (Array.isArray(selection)) {
    if (selection?.length > 2) return `${selection?.length} items selected`;
    return selection?.map?.(s => s?.item?.label).join(', ') ?? '';
  }
  return selection?.item?.label?.toString() ?? '';
};
