import type { TransitionFunction } from '@dvcol/svelte-utils/transition';

export type TransitionProps = Record<string, any>;
export const emptyFn: TransitionFunction = () => () => ({});

export type HTMLTransitionProps<T extends TransitionProps = TransitionProps> = {
  /**
   * Optional enter transition function.
   */
  in?: TransitionFunction<T>;
  /**
   * Optional enter transition props.
   */
  inProps?: T;
  /**
   * Optional exit transition function.
   */
  out?: TransitionFunction<T>;
  /**
   * Optional exit transition props.
   */
  outProps?: T;
  /**
   * Optional transition function.
   */
  transition?: TransitionFunction<T>;
  /**
   * Optional transition props.
   */
  transitionProps?: T;
};
