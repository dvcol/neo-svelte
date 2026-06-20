import type { Snippet } from 'svelte';

export interface NeoErrorContainerProps {
  children?: Snippet;
  pending?: Snippet;
  failed?: Snippet<[{ error: unknown; reset: () => void }]>;

  handler?: (error: unknown, reset: () => void) => void;
}
