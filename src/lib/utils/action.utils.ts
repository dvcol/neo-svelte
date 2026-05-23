import type { AnimationFunction, AnimationWithProps, TransitionFunction, TransitionProps, TransitionWithProps } from '@dvcol/svelte-utils/transition';
import type { Action } from 'svelte/action';

export const emptyUse: Action<HTMLElement, any> = () => ({});

export interface HTMAnimationProps<T extends TransitionProps = TransitionProps> {
  /**
   * Optional animation function.
   */
  animate?: AnimationFunction<T> | AnimationWithProps<T>;
}

export interface HTMLTransitionProps<T extends TransitionProps = TransitionProps> {
  /**
   * Optional enter transition function.
   */
  in?: TransitionFunction<T> | TransitionWithProps<T>;
  /**
   * Optional exit transition function.
   */
  out?: TransitionFunction<T> | TransitionWithProps<T>;
  /**
   * Optional transition function.
   */
  transition?: TransitionFunction<T> | TransitionWithProps<T>;
}

export interface ActionWithProps<T = unknown> {
  /**
   * action function.
   */
  use: Action<HTMLElement, T>;
  /**
   * Optional action props.
   */
  props?: T;
}
export function isActionWithProps<T>(action: Action<HTMLElement, T> | ActionWithProps<T>): action is ActionWithProps<T> {
  return 'use' in action && action.use !== undefined;
}

export function toAction<T = unknown>(action?: ActionWithProps<T> | Action<HTMLElement, T>): Action<HTMLElement, T> {
  if (!action) return emptyUse as Action<HTMLElement, T>;
  if (isActionWithProps<T>(action)) return action.use;
  return action;
}

export function toActionProps<T = unknown>(action?: ActionWithProps<T> | Action<HTMLElement, T>): T | undefined {
  if (!action) return;
  if (isActionWithProps<T>(action)) return action.props;
}

export interface HTMLUseProps<T = unknown> {
  /**
   * Optional action to use.
   */
  use?: Action<HTMLElement, T> | ActionWithProps<T>;
}

export type HTMLActionProps<B = unknown, T extends TransitionProps = TransitionProps> = HTMLUseProps<B> & HTMLTransitionProps<T>;
