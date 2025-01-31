import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoListContext, NeoListItem } from '~/list/neo-list.model.js';
import type { NeoSkeletonTextProps } from '~/skeletons/neo-skeleton-text.model.js';

export type NeoListBaseItemProps<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> = {
  // Context
  /**
   * The list item to display.
   */
  item: NeoListItem<Value, Tag>;
  /*
   * The current index of the item within the list.
   */
  index: number;
  /**
   * The current list context.
   */
  context: NeoListContext;

  // States
  /**
   * If true, the item will display as a skeleton.
   */
  skeleton?: boolean;
  /**
   * If true, the item will display as a selectable button.
   */
  select?: boolean;
  /**
   * If true, the item will display with a checked state.
   * Only applicable if `select` is true.
   * @see select
   */
  checked?: boolean;
  /**
   * If true, the item's checkmark will animate while rendering.
   * @see checked
   * @see select
   */
  touched?: boolean;
  /**
   * If true, the item will display as disabled.
   */
  disabled?: boolean;
  /**
   * If true, the item will not trigger selection, but will not be styled as disabled.
   */
  readonly?: boolean;

  // Methods
  /**
   * Optional callback to handle the item click event.
   * @param index
   */
  onclick: NeoButtonProps['onclick'];
} & NeoSkeletonTextProps;
