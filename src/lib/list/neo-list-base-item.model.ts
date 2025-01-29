import type { NeoListContext, NeoListItem, NeoListSelectedItem } from '~/list/neo-list.model.js';

export type NeoListBaseItemModel = {
  /**
   * The list item to display.
   */
  item: NeoListItem;
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
   * Toggles the selected state of the item within the list.
   * @param index
   */
  toggleItem: (index: NeoListSelectedItem['index']) => void;
};
