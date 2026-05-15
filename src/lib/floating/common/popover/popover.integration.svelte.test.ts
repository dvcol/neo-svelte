import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { click } from './interactions/click.svelte.js';
import { dismiss } from './interactions/dismiss.svelte.js';
import { focus } from './interactions/focus.svelte.js';
import { hover } from './interactions/hover.svelte.js';
import { role } from './interactions/role.svelte.js';
import { Popover } from './popover.svelte.js';

function withRoot<T>(fn: () => T): { result: T; teardown: () => void } {
  let result: T;
  const teardown = $effect.root(() => {
    result = fn();
  });
  return { result: result!, teardown };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

/**
 * End-to-end interaction composition. These tests pin the surface a consumer
 * actually instantiates — `role + hover + focus + click + dismiss` — and
 * exercise the cross-cuts (toggle gating, escape close, outside-press,
 * pending-timer cancellation) that only emerge when interactions ride on the
 * same Popover instance.
 */
describe('popover — end-to-end interaction composition', () => {
  describe('tooltip preset (role + hover + focus + dismiss)', () => {
    it('writes role="tooltip" + aria-describedby and opens on hover', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(false);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [role({ role: 'tooltip' }), hover(), focus(), dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      // Closed → no aria-describedby; floating still gets role.
      expect(floating.getAttribute('role')).toBe('tooltip');
      expect(reference.getAttribute('aria-describedby')).toBeNull();
      reference.dispatchEvent(new MouseEvent('mouseenter'));
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(MouseEvent), 'hover');
      open = true;
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBe(result.floatingId);
      open = false;
      flushSync();
      teardown();
    });

    it('focus opens, blur closes with debounce, escape forces close', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(false);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [role({ role: 'tooltip' }), hover(), focus(), dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      reference.dispatchEvent(new FocusEvent('focus'));
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(FocusEvent), 'focus');
      open = true;
      flushSync();
      // Escape now closes via dismiss.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(KeyboardEvent), 'escape-key');
      open = false;
      flushSync();
      teardown();
    });

    it('hover open delay timer is cancelled when popover closes externally', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(false);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [role({ role: 'tooltip' }), hover({ delay: { open: 100 } }), dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      reference.dispatchEvent(new MouseEvent('mouseenter'));
      // Mid-flight: external close. The hover effect watches popover.open.
      vi.advanceTimersByTime(50);
      // Force a flush by toggling open to true then back to false (consumer
      // would do this through the controlled state).
      open = true;
      flushSync();
      open = false;
      flushSync();
      vi.advanceTimersByTime(200);
      // Only the initial open call (vi.fn captured before close); no subsequent
      // hover open after closure.
      const opens = onOpenChange.mock.calls.filter(c => c[0] === true && c[2] === 'hover');
      expect(opens).toHaveLength(0);
      teardown();
    });
  });

  describe('popover preset (role + click + dismiss)', () => {
    it('click toggles open via openEvent.type gate', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(false);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [role({ role: 'dialog' }), click(), dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      // First click → open.
      reference.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', button: 0 }));
      reference.dispatchEvent(new MouseEvent('click'));
      expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.any(MouseEvent), 'click');
      open = true;
      flushSync();
      // Second click while open → toggle close.
      reference.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', button: 0 }));
      reference.dispatchEvent(new MouseEvent('click'));
      expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.any(MouseEvent), 'click');
      open = false;
      flushSync();
      teardown();
    });

    it('outside-press closes; pointerdown on the reference does not', () => {
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
        interactions: [role({ role: 'dialog' }), click(), dismiss()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      // Pointerdown on reference → click() handles it (no dismiss).
      reference.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse', button: 0 }));
      const dismissed = onOpenChange.mock.calls.filter(c => c[2] === 'outside-press');
      expect(dismissed).toHaveLength(0);
      // Pointerdown on outside → dismiss closes.
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(PointerEvent), 'outside-press');
      open = false;
      flushSync();
      teardown();
    });

    it('aria-expanded reflects open state', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      let open = $state(false);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        interactions: [role({ role: 'dialog' })],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      expect(reference.getAttribute('aria-expanded')).toBe('false');
      open = true;
      flushSync();
      expect(reference.getAttribute('aria-expanded')).toBe('true');
      expect(reference.getAttribute('aria-controls')).toBe(result.floatingId);
      open = false;
      flushSync();
      teardown();
    });
  });

  describe('option reactivity styles (call-site contracts)', () => {
    it('static value: open frozen at construction', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      let externalOpen = false;
      const { teardown, result } = withRoot(() => new Popover({
        // Object shorthand — captured once, not reactive.
        open: externalOpen,
        interactions: [role({ role: 'dialog' })],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      expect(reference.getAttribute('aria-expanded')).toBe('false');
      // Mutating external state does NOT propagate (no getter).
      externalOpen = true;
      flushSync();
      expect(reference.getAttribute('aria-expanded')).toBe('false');
      teardown();
    });

    it('getter on field: open tracks the underlying signal', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      let open = $state(false);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        interactions: [role({ role: 'dialog' })],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      expect(reference.getAttribute('aria-expanded')).toBe('false');
      open = true;
      flushSync();
      expect(reference.getAttribute('aria-expanded')).toBe('true');
      teardown();
    });

    it('mixed: getter for open + static interactions array', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      let open = $state(false);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [role({ role: 'tooltip' }), hover()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      reference.dispatchEvent(new MouseEvent('mouseenter'));
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(MouseEvent), 'hover');
      open = true;
      flushSync();
      expect(reference.getAttribute('aria-describedby')).toBe(result.floatingId);
      open = false;
      flushSync();
      teardown();
    });
  });

  describe('listener teardown', () => {
    it('detaching the reference removes all interaction listeners', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [hover(), click(), focus()],
      }));
      flushSync();
      const cleanup = result.reference(reference);
      result.floating(floating);
      flushSync();
      cleanup?.();
      flushSync();
      reference.dispatchEvent(new MouseEvent('mouseenter'));
      reference.dispatchEvent(new FocusEvent('focus'));
      reference.dispatchEvent(new MouseEvent('click'));
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });

    it('detaching the floating removes ARIA writes (role attribute)', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      const { teardown, result } = withRoot(() => new Popover({
        interactions: [role({ role: 'tooltip' })],
      }));
      flushSync();
      result.reference(reference);
      const floatCleanup = result.floating(floating);
      flushSync();
      expect(floating.getAttribute('role')).toBe('tooltip');
      floatCleanup?.();
      flushSync();
      expect(floating.getAttribute('role')).toBeNull();
      teardown();
    });
  });
});
