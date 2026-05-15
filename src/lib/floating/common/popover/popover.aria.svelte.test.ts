import { flushSync } from 'svelte';
import { describe, expect, it } from 'vitest';

import { Popover } from './popover.svelte.js';

function withRoot<T>(fn: () => T): { result: T; teardown: () => void } {
  let result: T;
  const teardown = $effect.root(() => {
    result = fn();
  });
  return { result: result!, teardown };
}

describe('popover — phase 4 aria pipeline (id reservation + respect-existing)', () => {
  describe('floating id write (reserved by popover)', () => {
    it('writes popover.floatingId onto the floating node when attached', () => {
      const floating = document.createElement('div');
      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      result.floating(floating);
      flushSync();
      expect(floating.id).toBe(result.floatingId);
      teardown();
    });

    it('removes the popover-authored id on detach', () => {
      const floating = document.createElement('div');
      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      const cleanup = result.floating(floating);
      flushSync();
      expect(floating.id).toBe(result.floatingId);
      cleanup?.();
      flushSync();
      expect(floating.id).toBe('');
      teardown();
    });

    it('lazy-respects a consumer-set id (does not overwrite, does not remove on teardown)', () => {
      const floating = document.createElement('div');
      floating.id = 'consumer-owned';
      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      const cleanup = result.floating(floating);
      flushSync();
      // Consumer wins — popover does not overwrite.
      expect(floating.id).toBe('consumer-owned');
      cleanup?.();
      flushSync();
      // Consumer's id remains after teardown.
      expect(floating.id).toBe('consumer-owned');
      teardown();
    });

    it('two popovers attached to two floating nodes get distinct ids on the nodes', () => {
      const a = document.createElement('div');
      const b = document.createElement('div');
      const popA = withRoot(() => new Popover());
      const popB = withRoot(() => new Popover());
      flushSync();
      popA.result.floating(a);
      popB.result.floating(b);
      flushSync();
      expect(a.id).toBe(popA.result.floatingId);
      expect(b.id).toBe(popB.result.floatingId);
      expect(a.id).not.toBe(b.id);
      popA.teardown();
      popB.teardown();
    });

    it('re-attaches the id after a cleanup-then-attach cycle', () => {
      const floating = document.createElement('div');
      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      const cleanup = result.floating(floating);
      flushSync();
      expect(floating.id).toBe(result.floatingId);
      cleanup?.();
      flushSync();
      expect(floating.id).toBe('');
      result.floating(floating);
      flushSync();
      expect(floating.id).toBe(result.floatingId);
      teardown();
    });
  });

  describe('reference attachment — does not write any ARIA at this phase', () => {
    it('attaching the reference does not write aria-describedby/aria-expanded/aria-controls', () => {
      const reference = document.createElement('button');
      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      result.reference(reference);
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBeNull();
      expect(reference.getAttribute('aria-expanded')).toBeNull();
      expect(reference.getAttribute('aria-controls')).toBeNull();
      teardown();
    });
  });
});
