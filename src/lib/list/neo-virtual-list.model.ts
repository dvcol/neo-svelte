import type { VirtualItem } from '@tanstack/virtual-core';
import type { NeoListBaseProps } from 'src/lib/index.js';
import type { Snippet } from 'svelte';

import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps } from '~/utils/html-element.utils.js';

export interface NeoVirtualItem<T> extends VirtualItem {
  item: T;
}

export interface NeoVirtualContext<T> {
  items: Array<T>;
  visible: Array<NeoVirtualItem<T>>;
}

export type NeoVirtualKey<T> = (item: T, index: number) => string | number;

export const defaultVirtualKey: NeoVirtualKey<unknown> = (item, index) => {
  if (typeof item !== 'object' || item === null) return index;
  if ('id' in item) {
    if (typeof item.id === 'string' || typeof item.id === 'number') return item.id;
    return JSON.stringify(item.id);
  }
  return index;
};

export interface NeoVirtualListProps<T, Tag extends keyof HTMLElementTagNameMap = 'div'> extends Omit<HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>, 'children'>, HTMLRefProps, HTMLTransitionProps, NeoListBaseProps {
  // Snippet
  /**
   * Snippet to render each item in the list.
   */
  children: Snippet<[NeoVirtualItem<T>, NeoVirtualContext<T>]>;
  /**
   * Snippet to render before all items in the list.
   */
  before?: Snippet<[NeoVirtualContext<T>]>;
  /**
   * Snippet to render after all items in the list.
   */
  after?: Snippet<[NeoVirtualContext<T>]>;

  // State
  /**
   * The tag name of the element to render the list as.
   *
   * @default 'ul'
   */
  tag?: Tag | keyof HTMLElementTagNameMap;
  /**
   * The items to render in the list.
   */
  items: Array<T>;
  /**
   * The number of items to keep rendered before and after the visible items.
   *
   * @default 3
   */
  buffer?: number;
  /**
   * The average height of each item in the list.
   */
  itemHeight?: number;
  /**
   * A function to extract a unique key from each item in the list.
   *
   * @default (item) => item?.id
   */
  key?: NeoVirtualKey<T>;

  // Other Props
  /**
   * Optional properties to pass to the content element wrapping item rows.
   */
  contentProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * Optional properties to pass to the tag element wrapping the before snippet.
   */
  beforeProps?: HTMLNeoBaseElement & HTMLTagProps;
  /**
   * Optional properties to pass to the element wrapping the after snippet.
   */
  afterProps?: HTMLNeoBaseElement & HTMLTagProps;
}
