import type { Snippet } from 'svelte';

import type { HTMLTransitionProps } from '~/utils/action.utils.js';
import type { HTMLNeoBaseElement, HTMLRefProps, HTMLTagProps } from '~/utils/html-element.utils.js';

export interface NeoVirtualItem<T> {
  /** Stable id derived from `key(item)`, falling back to the item index. */
  id: string | number;
  /** Index of the item inside `items`. */
  index: number;
  /** The item itself. */
  item: T;
}

export interface NeoVirtualContext<T> {
  /** All items passed to the list. */
  items: Array<T>;
  /** Currently rendered slice. */
  visible: Array<NeoVirtualItem<T>>;
  /** Inclusive start cursor of the rendered window. */
  start: number;
  /** Exclusive end cursor of the rendered window. */
  end: number;
  /** Total content height (px) including unmeasured estimates. */
  total: number;
  /** Current viewport height (px). */
  viewport: number;
  /** Whether the user is actively scrolling (true between `scroll` and the debounced `scrollend`). */
  scrolling: boolean;
}

export type NeoVirtualKey<T> = (item: T, index: number) => string | number | undefined;

export const defaultVirtualKey: NeoVirtualKey<unknown> = (item, index) => {
  if (typeof item !== 'object' || item === null) return index;
  if ('id' in item) return (item as { id?: string | number }).id ?? index;
  return index;
};

export type NeoVirtualItemHeight<T> = number | ((item: T, index: number) => number);

export interface NeoVirtualListMethods {
  /** Force a re-measure of all currently rendered rows and recompute the offset map. */
  refresh: () => void;
  /** Smooth-scroll the viewport to the top (or bottom in flip mode). */
  scrollToTop: (options?: ScrollToOptions) => HTMLElement | false;
  /** Smooth-scroll the viewport to the bottom (or top in flip mode). */
  scrollToBottom: (options?: ScrollToOptions) => HTMLElement | false;
  /** Smooth-scroll the viewport so item `index` is visible. */
  scrollToIndex: (index: number, options?: ScrollToOptions & { align?: 'start' | 'center' | 'end' }) => HTMLElement | false;
}

/**
 * A Svelte 5 attachment that the consumer must spread onto each rendered row
 * element via `{@attach register}`. The attachment registers the element with
 * NeoVirtualList's measurement and observation pipeline.
 *
 * Required for dynamic-height mode; cheap and harmless in fixed-height mode
 * (only the `data-virtual-key` attribute is set so `refresh()` can find rows).
 */
export type NeoVirtualRegister = (element: Element) => void | (() => void);

export interface NeoVirtualListProps<T, Tag extends keyof HTMLElementTagNameMap = 'ul'>
  extends Omit<HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>, 'children'>,
  HTMLRefProps,
  HTMLTransitionProps {
  // Snippets

  /**
   * Snippet rendered for each visible item.
   *
   * Consumers MUST attach the third argument to their row element:
   * `<li {@attach register}>...</li>`. NeoVirtualList does not wrap the row
   * for you — the consumer owns the row markup.
   */
  children: Snippet<[NeoVirtualItem<T>, NeoVirtualContext<T>, NeoVirtualRegister]>;
  /** Snippet rendered before the first item, only when `cursor.start === 0`. */
  before?: Snippet<[NeoVirtualContext<T>]>;
  /** Snippet rendered after the last item, only when `cursor.end === items.length`. */
  after?: Snippet<[NeoVirtualContext<T>]>;

  // State

  /**
   * The HTML tag to use for the scroll viewport.
   * @default 'ul'
   */
  tag?: Tag | keyof HTMLElementTagNameMap;
  /** Items to virtualize. */
  items: Array<T>;
  /**
   * Stable key function. Heights are cached by this key so reorders preserve measurements.
   * @default (item, i) => item.id ?? i
   */
  key?: NeoVirtualKey<T>;
  /**
   * Item height in pixels. Provide a number for fixed-size rows (fastest path),
   * a function for caller-known per-item heights, or omit to measure dynamically.
   */
  itemHeight?: NeoVirtualItemHeight<T>;
  /**
   * Initial estimate (px) used for unmeasured rows in dynamic mode.
   * Refines automatically as rows are measured.
   * @default 40
   */
  estimatedItemHeight?: number;
  /**
   * Number of rows to render outside the visible window (above and below).
   * @default 3
   */
  buffer?: number;
  /**
   * Whether the user is actively scrolling. Bindable so consumers can suppress
   * transitions during scroll.
   */
  scrolling?: boolean;
  /**
   * Inverts the rendering order so item 0 sits at the bottom (chat-style lists).
   * @default false
   */
  flip?: boolean;

  // Events

  /** Fired when scrollTop reaches the top of the viewport (within `scrollTolerance`). */
  onScrollTop?: (event?: Event) => void;
  /** Fired when scrollTop reaches the bottom of the viewport (within `scrollTolerance`). */
  onScrollBottom?: (event?: Event) => void;
  /** Tolerance in pixels when computing top/bottom hits. @default 1 */
  scrollTolerance?: number;

  // Other

  /** Props for the inner content element (the row wrapper). */
  contentProps?: HTMLNeoBaseElement & HTMLTagProps;
  /** Props for the optional `before` slot wrapper. */
  beforeProps?: HTMLNeoBaseElement & HTMLTagProps;
  /** Props for the optional `after` slot wrapper. */
  afterProps?: HTMLNeoBaseElement & HTMLTagProps;
}
