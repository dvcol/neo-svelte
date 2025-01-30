import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoListContext, NeoListItem } from '~/list/neo-list.model.js';
import type { NeoSkeletonTextProps } from '~/skeletons/neo-skeleton-text.model.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoListBaseItemProps<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> = {
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

  /**
   * Optional callback to handle the item click event.
   * @param index
   */
  onclick: NeoButtonProps['onclick'];
  /**
   * Optional props to pass to the skeleton loader.
   */
  skeletonProps?: NeoSkeletonTextProps;
} & HTMLNeoBaseElement;
