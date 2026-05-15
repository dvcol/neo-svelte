import { flushSync } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Popover } from '../popover.svelte.js';
import { dismiss } from './dismiss.svelte.js';

function withRoot<T>(fn: () => T): { result: T; teardown: () => void } {
  let result: T;
  const teardown = $effect.root(() => {
    result = fn();
  });
  return { result: result!, teardown };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('dismiss() interaction (locked contract)', () => {
  describe('escape key', () => {
    it('closes on Escape keydown when open', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(KeyboardEvent), 'escape-key');
      open = false;
      flushSync();
      teardown();
    });

    it('does not close on other keys', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      expect(onOpenChange).not.toHaveBeenCalled();
      open = false;
      flushSync();
      teardown();
    });

    it('does not close when popover is already closed', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });
  });

  describe('outside-press', () => {
    it('closes when pointerdown lands outside reference and floating', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      const outside = document.createElement('div');
      document.body.append(reference, floating, outside);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(PointerEvent), 'outside-press');
      open = false;
      flushSync();
      teardown();
    });

    it('does NOT close when pointerdown lands on the reference', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      reference.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onOpenChange).not.toHaveBeenCalled();
      open = false;
      flushSync();
      teardown();
    });

    it('does NOT close when pointerdown lands on a descendant of the reference', () => {
      const reference = document.createElement('div');
      const inner = document.createElement('span');
      reference.appendChild(inner);
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      inner.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onOpenChange).not.toHaveBeenCalled();
      open = false;
      flushSync();
      teardown();
    });

    it('does NOT close when pointerdown lands on the floating', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      floating.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onOpenChange).not.toHaveBeenCalled();
      open = false;
      flushSync();
      teardown();
    });

    it('does NOT close when pointerdown lands on a descendant of the floating (portal-aware contains walk)', () => {
      // The floating may be portaled out of the reference subtree; portal-aware
      // contains() still resolves an inner click as "inside".
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      const inner = document.createElement('button');
      floating.appendChild(inner);
      // Portal: floating is appended directly under <body>, not nested in
      // reference; only the contains() check on `floating` resolves "inside".
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      inner.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onOpenChange).not.toHaveBeenCalled();
      open = false;
      flushSync();
      teardown();
    });
  });

  describe('ancestor scroll (does NOT close — locked contract)', () => {
    it('scroll on the document does not close the popover', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      document.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      expect(onOpenChange).not.toHaveBeenCalled();
      open = false;
      flushSync();
      teardown();
    });
  });

  describe('lifecycle', () => {
    it('does not bind listeners when enabled=false', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      const outside = document.createElement('div');
      document.body.append(reference, floating, outside);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [dismiss({ enabled: false })],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onOpenChange).not.toHaveBeenCalled();
      open = false;
      flushSync();
      teardown();
    });

    it('removes document listeners when popover.open flips false', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      const outside = document.createElement('div');
      document.body.append(reference, floating, outside);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      open = false;
      flushSync();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });

    it('rebinds when open flips back to true', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      const outside = document.createElement('div');
      document.body.append(reference, floating, outside);
      const onOpenChange = vi.fn();
      let open = $state(false);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      open = true;
      flushSync();
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(PointerEvent), 'outside-press');
      open = false;
      flushSync();
      teardown();
    });
  });
});
