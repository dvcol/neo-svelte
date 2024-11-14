import type { TransitionFunction } from '@dvcol/svelte-utils/transition';
import type { Action } from 'svelte/action';

export type TransitionProps = Record<string, any>;
export const emptyTransition: TransitionFunction = () => () => ({});
export const emptyUse: Action<HTMLElement, any> = () => ({});

export type TransitionWithProps<T extends TransitionProps = TransitionProps> = {
  /**
   * Transition function.
   */
  use: TransitionFunction<T>;
  /**
   * Optional transition props.
   */
  props?: T;
};
export const isTransitionWithProps = <T extends TransitionProps>(
  transition: TransitionFunction<T> | TransitionWithProps<T>,
): transition is TransitionWithProps<T> => 'use' in transition && transition.use !== undefined;
export const toTransition = <T extends TransitionProps>(
  transition?: TransitionFunction<T> | TransitionWithProps<T>,
  fallback: TransitionFunction<T> = emptyTransition,
): TransitionFunction<T> => {
  if (!transition) return fallback;
  if (isTransitionWithProps(transition)) return transition.use;
  return transition;
};
export const toTransitionProps = <T extends TransitionProps>(
  transition?: TransitionFunction<T> | TransitionWithProps<T>,
  fallback?: T,
): T | undefined => {
  if (!transition) return fallback;
  if (isTransitionWithProps(transition)) return transition.props;
};

export type HTMLTransitionProps<T extends TransitionProps = TransitionProps> = {
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
};

export type ActionWithProps<T = unknown> = {
  /**
   * action function.
   */
  use: Action<HTMLElement, T>;
  /**
   * Optional action props.
   */
  props?: T;
};
export const isActionWithProps = <T>(action: Action<HTMLElement, T> | ActionWithProps<T>): action is ActionWithProps<T> =>
  'use' in action && action.use !== undefined;

export const toAction = <T = unknown>(action?: ActionWithProps<T> | Action<HTMLElement, T>): Action<HTMLElement, T> => {
  if (!action) return emptyUse;
  if (isActionWithProps<T>(action)) return action.use;
  return action;
};

export const toActionProps = <T = unknown>(action?: ActionWithProps<T> | Action<HTMLElement, T>): T | undefined => {
  if (!action) return;
  if (isActionWithProps<T>(action)) return action.props;
};

export type HTMLUseProps<T = unknown> = {
  /**
   * Optional action to use.
   */
  use?: Action<HTMLElement, T> | ActionWithProps<T>;
};

export type HTMLActionProps<B = unknown, T extends TransitionProps = TransitionProps> = HTMLUseProps<B> & HTMLTransitionProps<T>;
