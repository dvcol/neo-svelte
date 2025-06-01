import type { NeoListContext, NeoListRender, NeoListSection } from '~/list/neo-list.model.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoListBaseSectionProps<Value = unknown, Tag extends keyof HTMLElementTagNameMap = 'ul'> = {
  /**
   * The list section to display.
   */
  list: NeoListRender<Value>;

  /**
   * The list section to display.
   */
  section: NeoListSection<Value, Tag>;
  /**
   * If true, the section will display as a selectable list of items.
   */
  select?: boolean;
  /*
   * The current index of the section within the list.
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
  /**
   * Reverse the direction of the item.
   *
   * @default false
   */
  reverse?: boolean;
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
