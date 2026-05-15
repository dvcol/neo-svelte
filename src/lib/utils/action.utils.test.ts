import type { AnimationFunction, TransitionFunction } from '@dvcol/svelte-utils/transition';
import type { Action } from 'svelte/action';

import { emptyAnimation, emptyTransition } from '@dvcol/svelte-utils/transition';
import { describe, expect, it } from 'vitest';

import {
  emptyUse,
  isActionWithProps,
  isTransitionWithProps,
  toAction,
  toActionProps,
  toAnimation,
  toTransition,
  toTransitionProps,
} from './action.utils.js';

describe('emptyUse', { tags: ['jsdom'] }, () => {
  it('returns an empty action object regardless of arguments', () => {
    const result = emptyUse(document.createElement('div'), { foo: 'bar' });
    expect(result).toEqual({});
  });
});

describe('isTransitionWithProps', { tags: ['jsdom'] }, () => {
  it('returns true when the value is a { use } wrapper', () => {
    expect(isTransitionWithProps({ use: emptyTransition })).toBe(true);
  });

  it('returns false for a bare transition function', () => {
    expect(isTransitionWithProps(emptyTransition)).toBe(false);
  });

  it('returns false when use is explicitly undefined', () => {
    expect(isTransitionWithProps({ use: undefined as unknown as TransitionFunction })).toBe(false);
  });
});

describe('toTransition', { tags: ['jsdom'] }, () => {
  it('unwraps a { use, props } object to its function', () => {
    const fn: TransitionFunction = () => ({});
    expect(toTransition({ use: fn })).toBe(fn);
  });

  it('returns a bare transition function unchanged', () => {
    const fn: TransitionFunction = () => ({});
    expect(toTransition(fn)).toBe(fn);
  });

  it('returns the default emptyTransition when called with nothing', () => {
    expect(toTransition()).toBe(emptyTransition);
  });

  it('honors a custom fallback', () => {
    const fallback: TransitionFunction = () => ({});
    expect(toTransition(undefined, fallback)).toBe(fallback);
  });
});

describe('toAnimation', { tags: ['jsdom'] }, () => {
  it('unwraps and falls back to emptyAnimation by default', () => {
    expect(toAnimation()).toBe(emptyAnimation);
    const fn: AnimationFunction = () => ({});
    expect(toAnimation({ use: fn })).toBe(fn);
    expect(toAnimation(fn)).toBe(fn);
  });

  it('honors a custom fallback', () => {
    const fallback: AnimationFunction = () => ({});
    expect(toAnimation(undefined, fallback)).toBe(fallback);
  });
});

describe('toTransitionProps', { tags: ['jsdom'] }, () => {
  it('returns the .props of a wrapper', () => {
    expect(toTransitionProps({ use: emptyTransition, props: { duration: 200 } })).toEqual({ duration: 200 });
  });

  it('returns the fallback when given a bare function', () => {
    expect(toTransitionProps(emptyTransition, { duration: 100 })).toEqual({ duration: 100 });
  });

  it('returns the fallback when given undefined', () => {
    expect(toTransitionProps(undefined, { duration: 100 })).toEqual({ duration: 100 });
    expect(toTransitionProps()).toBeUndefined();
  });
});

describe('isActionWithProps', { tags: ['jsdom'] }, () => {
  it('returns true when the value has a defined use', () => {
    expect(isActionWithProps({ use: emptyUse })).toBe(true);
  });

  it('returns false for a bare action function', () => {
    expect(isActionWithProps(emptyUse)).toBe(false);
  });

  it('returns false when use is explicitly undefined', () => {
    expect(isActionWithProps({ use: undefined as unknown as Action })).toBe(false);
  });
});

describe('toAction', { tags: ['jsdom'] }, () => {
  it('returns emptyUse when called with nothing', () => {
    expect(toAction()).toBe(emptyUse);
  });

  it('unwraps a wrapper to its action function', () => {
    const fn: Action<HTMLElement, { x: number }> = () => ({});
    expect(toAction({ use: fn })).toBe(fn);
  });

  it('returns a bare action function unchanged', () => {
    const fn: Action<HTMLElement, void> = () => ({});
    expect(toAction(fn)).toBe(fn);
  });
});

describe('toActionProps', { tags: ['jsdom'] }, () => {
  it('returns undefined when no action is provided', () => {
    expect(toActionProps()).toBeUndefined();
  });

  it('returns undefined when given a bare action', () => {
    expect(toActionProps(emptyUse)).toBeUndefined();
  });

  it('returns the .props of a wrapper', () => {
    expect(toActionProps({ use: emptyUse, props: { count: 3 } })).toEqual({ count: 3 });
  });
});
