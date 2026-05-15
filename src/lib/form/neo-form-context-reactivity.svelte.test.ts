import { flushSync } from 'svelte';
import { describe, expect, it } from 'vitest';

import { NeoFormContext } from './neo-form-context.svelte.js';

describe('neoFormContext — reactivity through $derived', { tags: ['jsdom'] }, () => {
  it('touched flips when a registered field.state.touched is mutated', () => {
    const cleanup = $effect.root(() => {
      const ctx = new NeoFormContext();
      const state = $state({ touched: false, dirty: false, valid: true, value: 1, initial: 1 });
      ctx.register({ id: 'a', state });
      flushSync();
      expect(ctx.touched).toBe(false);
      state.touched = true;
      flushSync();
      expect(ctx.touched).toBe(true);
    });
    cleanup();
  });

  it('valid flips when a registered field.state.valid is mutated', () => {
    const cleanup = $effect.root(() => {
      const ctx = new NeoFormContext();
      const state = $state({ touched: false, dirty: false, valid: true, value: 1, initial: 1 });
      ctx.register({ id: 'a', state });
      flushSync();
      expect(ctx.valid).toBe(true);
      state.valid = false;
      flushSync();
      expect(ctx.valid).toBe(false);
    });
    cleanup();
  });

  it('values reflect added and removed fields', () => {
    const cleanup = $effect.root(() => {
      const ctx = new NeoFormContext();
      ctx.register({ id: 'a', state: { touched: false, dirty: false, valid: true, value: 1, initial: 0 } });
      flushSync();
      expect(ctx.values).toEqual({ a: 1 });
      ctx.register({ id: 'b', state: { touched: false, dirty: false, valid: true, value: 2, initial: 0 } });
      flushSync();
      expect(ctx.values).toEqual({ a: 1, b: 2 });
      ctx.remove('a');
      flushSync();
      expect(ctx.values).toEqual({ b: 2 });
    });
    cleanup();
  });
});
