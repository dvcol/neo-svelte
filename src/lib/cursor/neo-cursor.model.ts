import type { Snippet } from 'svelte';

export type NeoCursorProps = {
  ref?: HTMLElement;
  children?: Snippet;
  target?: HTMLElement;
  snap?: boolean;
};
