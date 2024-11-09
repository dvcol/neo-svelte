import type { TransitionFunction } from '@dvcol/svelte-utils/transition';
import type { Action } from 'svelte/action';

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

export type HTMLBaseProps<T = unknown> = {
  /**
   * Optional action to use.
   */
  use?: Action<HTMLElement, T>;
  /**
   * Optional action props.
   */
  useProps?: T;
};

export type HTMLActionProps<B = unknown, T extends TransitionProps = TransitionProps> = HTMLBaseProps<B> & HTMLTransitionProps<T>;
