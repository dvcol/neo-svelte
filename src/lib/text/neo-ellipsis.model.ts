import type { Snippet } from 'svelte';

import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoEllipsisProps<Tag extends keyof HTMLElementTagNameMap = 'span'> = {
  /**
   * HTML tag to render
   *
   * @default 'span'
   */
  tag?: Tag;
  /**
   * Text to truncate
   */
  value?: string;
  /**
   * Children to truncate
   */
  children?: Snippet;
  /**
   * Maximum number of lines to display
   *
   * @default 1
   */
  lines?: number;
} & HTMLNeoBaseElement<HTMLElementTagNameMap[Tag]>;
