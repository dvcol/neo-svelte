import type { NeoButtonProps } from '~/buttons/neo-button.model.js';
import type { NeoListContext, NeoListItem } from '~/list/neo-list.model.js';
import type { NeoSkeletonTextProps } from '~/skeletons/neo-skeleton-text.model.js';

export type NeoListBaseItemProps<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'li'> = {
  // Snippets
  /**
   * Snippet to display before the list item.
   * e.g. an icon or avatar.
   */
  before?: NeoListItem<Value, Tag>['before'];
  /**
   * Snippet to display after the list item.
   * e.g. a badge or action button.
   */
  after?: NeoListItem<Value, Tag>['after'];

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
  /**
   * Optional filter to highlight text.
   */
  highlight?: string;

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
  /**
   * CSS selector to identify the list parent element and select the next/previous focusable sibling.
   *
   * This is used to determine the next/previous focusable element when navigating with the keyboard.
   *
   * @default '.neo-list-item.neo-list-item-select'
   */
  selector?: boolean;

  // Methods
  /**
   * Optional callback to handle the item click event.
   * @param index
   */
  onclick: NeoButtonProps['onclick'];
  /**
   * Optional props to pass to the button.
   */
  buttonProps?: NeoButtonProps;
} & NeoSkeletonTextProps &
  Pick<NeoButtonProps, 'hovered' | 'focused' | 'toggle'>;
