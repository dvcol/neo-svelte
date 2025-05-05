import type { NeoInputProps } from '~/inputs/common/neo-input.model.js';
import type { NeoListContext, NeoListItem, NeoListItemOrSection } from '~/list/neo-list.model.js';
import type { HTMLNeoBaseElement, HTMLRefProps } from '~/utils/html-element.utils.js';

import { isSection } from '~/list/neo-list.model.js';

export type NeoListSearchFilter = (item: NeoListItemOrSection, search?: string) => boolean;
export type NeoListSearchSort = (a: NeoListItemOrSection, b: NeoListItemOrSection, invert?: boolean) => number;
export type NeoListSearchProps<Tag extends keyof HTMLElementTagNameMap = 'div'> = {
  /**
   * The HTML tag to use for the container.
   * @default 'li'
   */
  tag?: Tag;
  /**
   * Debounce delay in milliseconds before filtering the list.
   *
   * @default 250
   */
  delay?: number;
  /**
   * Whether to invert the sort order of the list.
   */
  invert?: boolean;
  /**
   * Custom filter function to apply to the list (overrides default list filter).
   * Defaults to filtering by label alphabetically based on the list highlight filter.
   * @see NeoListContext.highlight
   */
  filter?: NeoListSearchFilter;
  /**
   * Custom sort function to apply to the list (overrides default list sort).
   * Defaults unsorted and toggles between ascending and descending alphabetical label order.
   */
  sort?: NeoListSearchSort;
  /**
   * List context (used to extract the highlight filter).
   */
  context?: NeoListContext;

  /**
   * Optional props to pass to the input.
   */
  inputProps?: NeoInputProps;
} & HTMLRefProps<HTMLInputElement> &
Pick<
  NeoInputProps,
    'value' | 'valid' | 'dirty' | 'touched' | 'hovered' | 'focused' | 'focusin' | 'loading' | 'elevation' | 'hover' | 'placeholder' | 'rounded'
> &
HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;

function itemMatch(item: NeoListItem, search: string) {
  return item.label?.toLowerCase().includes(search) || item.description?.toLowerCase().includes(search);
}

export const itemSearchFilter: NeoListSearchFilter = (item: NeoListItemOrSection, search?: string) => {
  if (item?.hidden) return false;
  const pattern = search?.trim().toLowerCase();
  if (!pattern?.length) return true;
  if (isSection(item)) return item.items?.some(i => itemMatch(i, pattern));
  return !!itemMatch(item, pattern);
};

export function itemLabelSort(a: NeoListItemOrSection, b: NeoListItemOrSection, reverse?: boolean) {
  if (!a?.label || !b?.label) return 0;
  return reverse ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label);
}
