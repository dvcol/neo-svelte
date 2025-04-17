import type { Snippet } from 'svelte';

import type { NeoCursorContext } from '~/cursor/neo-cursor.model.js';
import type { HTMLNeoBaseElement } from '~/utils/html-element.utils.js';

export type NeoCursorPointerProps = NeoCursorContext & {
  /**
   * Inner content of the cursor.
   */
  children?: Snippet<[NeoCursorContext]>;
} & Omit<HTMLNeoBaseElement<HTMLSpanElement>, 'children'>;
