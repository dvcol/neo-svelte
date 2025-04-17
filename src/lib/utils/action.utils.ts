import type { AnimationFunction, TransitionFunction, TransitionProps } from '@dvcol/svelte-utils/transition';
import type { Action } from 'svelte/action';

import { emptyAnimation, emptyTransition } from '@dvcol/svelte-utils/transition';

export const emptyUse: Action<HTMLElement, any> = () => ({});

export interface TransitionWithProps<
  T extends TransitionProps = TransitionProps,
  F extends TransitionFunction<T> | AnimationFunction<T> = TransitionFunction<T>,
> {
  /**
   * Transition function.
   */
  use: F;
  /**
   * Optional transition props.
   */
  props?: T;
}

export interface AnimationWithProps<T extends TransitionProps = TransitionProps> {
  /**
   * Transition function.
   */
  use: AnimationFunction<T>;
  /**
   * Optional transition props.
   */
  props?: T;
}

export function isTransitionWithProps<T extends TransitionProps, F extends TransitionFunction<T> | AnimationFunction<T> = TransitionFunction<T>>(transition: F | TransitionWithProps<T, F>): transition is TransitionWithProps<T, F> {
  return 'use' in transition && transition.use !== undefined;
}

function toFunction<T extends TransitionProps, F extends TransitionFunction<T> | AnimationFunction<T> = TransitionFunction<T>>(transition?: F | TransitionWithProps<T, F>): F | undefined {
  if (!transition) return;
  if (isTransitionWithProps(transition)) return transition.use;
  return transition;
}

export function toAnimation<T extends TransitionProps>(transition?: AnimationFunction<T> | AnimationWithProps<T>, fallback: AnimationFunction<T> = emptyAnimation): AnimationFunction<T> {
  return toFunction(transition) ?? fallback;
}

export function toTransition<T extends TransitionProps>(transition?: TransitionFunction<T> | TransitionWithProps<T>, fallback: TransitionFunction<T> = emptyTransition): TransitionFunction<T> {
  return toFunction(transition) ?? fallback;
}

export function toTransitionProps<T extends TransitionProps, F extends TransitionFunction<T> | AnimationFunction<T> = TransitionFunction<T>>(transition?: F | TransitionWithProps<T, F>, fallback?: T): T | undefined {
  if (!transition) return fallback;
  if (isTransitionWithProps(transition)) return transition.props;
  return fallback;
}

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
