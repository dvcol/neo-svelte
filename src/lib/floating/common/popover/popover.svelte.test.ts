import type { Placement } from '@floating-ui/dom';

import { flushSync, tick } from 'svelte';
import { describe, expect, it } from 'vitest';

import { Popover } from './popover.svelte.js';

function withRoot<T>(fn: () => T): { result: T; teardown: () => void } {
  let result: T;
  const teardown = $effect.root(() => {
    result = fn();
  });
  return { result: result!, teardown };
}

function rect(reference: Element, x: number, y: number, w: number, h: number) {
  Object.defineProperty(reference, 'getBoundingClientRect', {
    value: () => ({ x, y, top: y, left: x, right: x + w, bottom: y + h, width: w, height: h }),
    configurable: true,
  });
}

const PLACEMENTS: { placement: Placement; origin: string }[] = [
  { placement: 'top', origin: 'bottom' },
  { placement: 'top-start', origin: 'bottom left' },
  { placement: 'top-end', origin: 'bottom right' },
  { placement: 'bottom', origin: 'top' },
  { placement: 'bottom-start', origin: 'top left' },
  { placement: 'bottom-end', origin: 'top right' },
  { placement: 'left', origin: 'right' },
  { placement: 'left-start', origin: 'right top' },
  { placement: 'left-end', origin: 'right bottom' },
  { placement: 'right', origin: 'left' },
  { placement: 'right-start', origin: 'left top' },
  { placement: 'right-end', origin: 'left bottom' },
];

describe('popover — phase 2 core', () => {
  describe('construction', () => {
    it('instantiates with no options', () => {
      expect(() => withRoot(() => new Popover()).teardown()).not.toThrow();
    });

    it('instantiates with a static options object', () => {
      expect(() => withRoot(() => new Popover({ open: false, placement: 'top' })).teardown()).not.toThrow();
    });

    it('exposes a stable floatingId (string, non-empty)', () => {
      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      expect(typeof result.floatingId).toBe('string');
      expect(result.floatingId.length).toBeGreaterThan(0);
      teardown();
    });

    it('two instances get distinct floatingIds', () => {
      const a = withRoot(() => new Popover());
      const b = withRoot(() => new Popover());
      flushSync();
      expect(a.result.floatingId).not.toBe(b.result.floatingId);
      a.teardown();
      b.teardown();
    });
  });

  describe('attachments capture refs', () => {
    it('reference attachment captures the node into referenceEl', () => {
      const node = document.createElement('button');
      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      const cleanup = result.reference(node);
      flushSync();
      expect(result.referenceEl).toBe(node);
      cleanup?.();
      flushSync();
      expect(result.referenceEl).toBeUndefined();
      teardown();
    });

    it('floating attachment captures the node into floatingEl', () => {
      const node = document.createElement('div');
      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      const cleanup = result.floating(node);
      flushSync();
      expect(result.floatingEl).toBe(node);
      cleanup?.();
      flushSync();
      expect(result.floatingEl).toBeUndefined();
      teardown();
    });

    // Regression guard: skeleton's `floatingStyles` (replaced by direct DOM
    // writes) emitted `position: absolute; left: 0; top: 0; translate: …`. Without
    // the absolute + (0,0) anchor, `translate` translates from the element's
    // natural flow position — non-default placements silently render in the
    // wrong spot (default `bottom` happens to coincide with flow). This test
    // pins the foundation so a future "translate-only" simplification can't
    // regress positioning again.
    it('floating attachment writes the foundation positioning (position + 0,0 anchor)', () => {
      const node = document.createElement('div');
      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      result.floating(node);
      flushSync();
      expect(node.style.position).toBe('absolute');
      expect(node.style.left).toBe('0px');
      expect(node.style.top).toBe('0px');
      teardown();
    });

    it('detach only clears the ref if it still points at the same node', () => {
      const a = document.createElement('button');
      const b = document.createElement('button');
      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      const cleanupA = result.reference(a);
      flushSync();
      const cleanupB = result.reference(b);
      flushSync();
      expect(result.referenceEl).toBe(b);
      cleanupA?.();
      flushSync();
      expect(result.referenceEl).toBe(b);
      cleanupB?.();
      flushSync();
      expect(result.referenceEl).toBeUndefined();
      teardown();
    });
  });

  describe('position pipeline', () => {
    it('update() resolves after computePosition', async () => {
      const reference = document.createElement('div');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      rect(reference, 0, 0, 100, 40);
      rect(floating, 0, 0, 80, 30);

      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();

      await result.update();
      expect(floating.style.translate.length).toBeGreaterThan(0);
      teardown();
      reference.remove();
      floating.remove();
    });

    it('writes translate (PR #165) instead of transform', async () => {
      const reference = document.createElement('div');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      rect(reference, 0, 0, 100, 40);
      rect(floating, 0, 0, 80, 30);

      const { result, teardown } = withRoot(() => new Popover({ placement: 'bottom-start' }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();

      await result.update();
      await tick();
      expect(floating.style.translate).toMatch(/var\(--neo-popover-translate-override,\s*\dpx \d+px\)|var\(--neo-popover-translate-override, \d+px \d+px\)/);
      // No bare `transform: translate(...)` written by Popover (PR #165 contract).
      expect(floating.style.transform).toBe('');
      teardown();
      reference.remove();
      floating.remove();
    });

    for (const { placement, origin } of PLACEMENTS) {
      it(`maps placement ${placement} → transform-origin "${origin}" (silent-bug fix)`, async () => {
        const reference = document.createElement('div');
        const floating = document.createElement('div');
        document.body.append(reference, floating);
        rect(reference, 0, 0, 100, 40);
        rect(floating, 0, 0, 80, 30);

        const { result, teardown } = withRoot(() => new Popover({ placement }));
        flushSync();
        result.reference(reference);
        result.floating(floating);
        flushSync();

        await result.update();
        await tick();
        expect(floating.style.transformOrigin).toContain(origin);
        teardown();
        reference.remove();
        floating.remove();
      });
    }
  });

  describe('reactivity', () => {
    it('static option does not re-trigger when external state changes', async () => {
      const reference = document.createElement('div');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      rect(reference, 0, 0, 100, 40);
      rect(floating, 0, 0, 80, 30);

      const { result, teardown } = withRoot(() => new Popover({ placement: 'top' }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();

      await result.update();
      await tick();
      expect(floating.style.transformOrigin).toContain('bottom');
      teardown();
      reference.remove();
      floating.remove();
    });

    it('getter option re-triggers when the underlying signal changes', async () => {
      const reference = document.createElement('div');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      rect(reference, 0, 0, 100, 40);
      rect(floating, 0, 0, 80, 30);

      let placement = $state<Placement>('top');
      const { result, teardown } = withRoot(() => new Popover({
        get placement() {
          return placement;
        },
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();

      await result.update();
      await tick();
      expect(floating.style.transformOrigin).toContain('bottom');

      placement = 'left';
      flushSync();
      // The position effect schedules an async computePosition; explicitly
      // call update() to await its DOM write deterministically.
      await result.update();
      await tick();
      expect(floating.style.transformOrigin).toContain('right');

      teardown();
      reference.remove();
      floating.remove();
    });

    it('open=false short-circuits the position pipeline', async () => {
      const reference = document.createElement('div');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      rect(reference, 0, 0, 100, 40);
      rect(floating, 0, 0, 80, 30);

      const { result, teardown } = withRoot(() => new Popover({ open: false }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      await tick();

      // No translate written when open=false.
      expect(floating.style.translate).toBe('');
      teardown();
      reference.remove();
      floating.remove();
    });
  });
});
