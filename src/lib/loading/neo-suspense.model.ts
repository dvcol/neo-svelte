import type { Snippet } from 'svelte';

export interface NeoSuspenseProps<R = any, E = any> {
  promise: Promise<R>;
  delay?: number;
  loading?: Snippet<[Promise<R>]>;
  result?: Snippet<[R]>;
  error?: Snippet<[E]>;
  children?: Snippet;
}
