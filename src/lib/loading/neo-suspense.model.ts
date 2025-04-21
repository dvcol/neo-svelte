import type { NeoLoadingMatrixProps } from 'src/lib/index.js';
import type { Snippet } from 'svelte';

export interface NeoSuspenseProps<R = any, E = any> {
  /**
   * The promise to await.
   */
  promise: Promise<R>;
  /**
   * Optional delay before showing the loading state.
   */
  delay?: number;
  /**
   * Optional loading snippet to show while the promise is pending.
   */
  loading?: Snippet<[Promise<R>]> | false;
  /**
   * Optional component to show when the promise is rejected.
   */
  error?: Snippet<[E]>;
  /**
   * Optional component to show when the promise is resolved.
   * If none is provided, the `children` prop will be used.
   *
   * @see {@link children}
   */
  result?: Snippet<[R]>;
  /**
   * Optional component to show when the promise is resolved.
   * If `result` is not provided, this will be used instead.
   * @see {@link result}
   */
  children?: Snippet;

  /**
   * Optional props to pass to the default loading component if no `loading` prop is provided.
   * @see {@link loading}
   */
  matrixProps?: NeoLoadingMatrixProps;
}
