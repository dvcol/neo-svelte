import type { NeoListContext, NeoListRender, NeoListSection } from '~/list/neo-list.model.js';
import type { NeoSkeletonTextProps } from '~/skeletons/neo-skeleton-text.model.js';
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
  /*
   * The current index of the section within the list.
   */
  index: number;
  /**
   * The current list context.
   */
  context: NeoListContext;

  /**
   * If true, the section will display as a skeleton.
   */
  skeleton?: boolean;
  /**
   * Optional props to pass to the skeleton loader.
   */
  skeletonProps?: NeoSkeletonTextProps;
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
