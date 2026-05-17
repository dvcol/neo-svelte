import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Popover } from '../popover.svelte.js';
import { focus } from './focus.svelte.js';

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
});

describe('focus() interaction', () => {
  describe('default (focusWithin=false)', () => {
    it('opens on focus event with reason "focus"', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new FocusEvent('focus'));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(FocusEvent), 'focus');
      teardown();
    });

    it('does not open on focusin event (non-bubbling default mode)', () => {
      const reference = document.createElement('div');
      const child = document.createElement('input');
      reference.appendChild(child);
      document.body.appendChild(reference);
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      // Child fires focus → bubbles as focusin only. With default mode the
      // wrapper does not see it.
      child.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      expect(onOpenChange).not.toHaveBeenCalled();
      document.body.removeChild(reference);
      teardown();
    });
  });

  describe('focusWithin=true', () => {
    it('opens when a child of the reference receives focus (focusin bubbles up)', () => {
      const reference = document.createElement('div');
      const child = document.createElement('input');
      reference.appendChild(child);
      document.body.appendChild(reference);
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus({ focusWithin: true })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      child.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(FocusEvent), 'focus');
      document.body.removeChild(reference);
      teardown();
    });

    it('does not react to non-bubbling focus events when focusWithin=true', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus({ focusWithin: true })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      // Non-bubbling focus event should be ignored — focusWithin attaches focusin instead.
      reference.dispatchEvent(new FocusEvent('focus'));
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });
  });

  describe('blur closes', () => {
    it('blur closes after the debounce microtask when focus moves out', () => {
      const reference = document.createElement('button');
      document.body.appendChild(reference);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [focus()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new FocusEvent('blur', { relatedTarget: document.body }));
      // Close is debounced via setTimeout(0).
      expect(onOpenChange).not.toHaveBeenCalled();
      vi.advanceTimersByTime(0);
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(FocusEvent), 'focus');
      open = false;
      flushSync();
      document.body.removeChild(reference);
      teardown();
    });

    it('blur does NOT close when focus moves into the floating element', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      document.body.appendChild(reference);
      document.body.appendChild(floating);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [focus()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      reference.dispatchEvent(new FocusEvent('blur', { relatedTarget: floating }));
      vi.advanceTimersByTime(0);
      expect(onOpenChange).not.toHaveBeenCalled();
      open = false;
      flushSync();
      document.body.removeChild(reference);
      document.body.removeChild(floating);
      teardown();
    });

    it('blur does NOT close when focus moves into a descendant of the floating element', () => {
      const reference = document.createElement('button');
      const floating = document.createElement('div');
      const inner = document.createElement('button');
      floating.appendChild(inner);
      document.body.appendChild(reference);
      document.body.appendChild(floating);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [focus()],
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      reference.dispatchEvent(new FocusEvent('blur', { relatedTarget: inner }));
      vi.advanceTimersByTime(0);
      expect(onOpenChange).not.toHaveBeenCalled();
      open = false;
      flushSync();
      document.body.removeChild(reference);
      document.body.removeChild(floating);
      teardown();
    });

    it('focusWithin=true uses focusout for the close path', () => {
      const reference = document.createElement('div');
      const child = document.createElement('input');
      reference.appendChild(child);
      document.body.appendChild(reference);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [focus({ focusWithin: true })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      child.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
      vi.advanceTimersByTime(0);
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(FocusEvent), 'focus');
      open = false;
      flushSync();
      document.body.removeChild(reference);
      teardown();
    });
  });

  describe('enabled', () => {
    it('does not open when enabled=false', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus({ enabled: false })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new FocusEvent('focus'));
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });

    it('does not close on blur when enabled=false', () => {
      const reference = document.createElement('button');
      document.body.appendChild(reference);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [focus({ enabled: false })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new FocusEvent('blur', { relatedTarget: document.body }));
      vi.advanceTimersByTime(0);
      expect(onOpenChange).not.toHaveBeenCalled();
      open = false;
      flushSync();
      document.body.removeChild(reference);
      teardown();
    });
  });

  describe('focusWithin reactive flip', () => {
    it('flipping focusWithin false → true at runtime: wrapper-child focusin opens after the flip (and did not before)', () => {
      const reference = document.createElement('div');
      const child = document.createElement('input');
      reference.appendChild(child);
      document.body.appendChild(reference);
      const onOpenChange = vi.fn();
      let focusWithin = $state(false);
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus({
          get focusWithin() {
            return focusWithin;
          },
        })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      // Before flip: focusin from child should NOT open (default focus-only mode).
      child.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      expect(onOpenChange).not.toHaveBeenCalled();
      // Flip the option live.
      focusWithin = true;
      flushSync();
      // After flip: focusin from child should open.
      child.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(FocusEvent), 'focus');
      document.body.removeChild(reference);
      teardown();
    });

    it('flipping focusWithin true → false at runtime: wrapper-child focusin no longer opens after the flip', () => {
      const reference = document.createElement('div');
      const child = document.createElement('input');
      reference.appendChild(child);
      document.body.appendChild(reference);
      const onOpenChange = vi.fn();
      let focusWithin = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus({
          get focusWithin() {
            return focusWithin;
          },
        })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      // Before flip: focusin opens.
      child.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      onOpenChange.mockClear();
      // Flip live.
      focusWithin = false;
      flushSync();
      // After flip: focusin should be ignored.
      child.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      expect(onOpenChange).not.toHaveBeenCalled();
      document.body.removeChild(reference);
      teardown();
    });
  });

  describe('pointerdown gate', () => {
    it('suppresses focus open when a pointerdown is in flight (default mode)', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new PointerEvent('pointerdown'));
      reference.dispatchEvent(new FocusEvent('focus'));
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });

    it('suppresses focusin open when a pointerdown is in flight (focusWithin mode)', () => {
      const reference = document.createElement('div');
      const child = document.createElement('input');
      reference.appendChild(child);
      document.body.appendChild(reference);
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus({ focusWithin: true })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      child.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
      expect(onOpenChange).not.toHaveBeenCalled();
      document.body.removeChild(reference);
      teardown();
    });

    it('opens on tab-into focus (no preceding pointerdown)', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      // Genuine keyboard focus: no pointerdown precedes it.
      reference.dispatchEvent(new FocusEvent('focus'));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(FocusEvent), 'focus');
      teardown();
    });

    it('clears the gate after the trailing click so subsequent focus events open normally', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new PointerEvent('pointerdown'));
      reference.dispatchEvent(new MouseEvent('click'));
      // Gate cleared by the click. A later focus (e.g. tab back into the trigger) should open.
      reference.dispatchEvent(new FocusEvent('focus'));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(FocusEvent), 'focus');
      teardown();
    });

    it('clears the gate on the next macrotask if no click follows the pointerdown', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new PointerEvent('pointerdown'));
      // No click — pointerdown alone (e.g. drag canceled). Gate releases on macrotask.
      vi.advanceTimersByTime(0);
      reference.dispatchEvent(new FocusEvent('focus'));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(FocusEvent), 'focus');
      teardown();
    });

    it('a second pointerdown re-arms the gate after a prior click cleared it', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        onOpenChange,
        interactions: [focus()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      // First pointer cycle: pointerdown → click clears the gate.
      reference.dispatchEvent(new PointerEvent('pointerdown'));
      reference.dispatchEvent(new MouseEvent('click'));
      // Second pointerdown re-arms; the focus event during this cycle must be suppressed.
      reference.dispatchEvent(new PointerEvent('pointerdown'));
      reference.dispatchEvent(new FocusEvent('focus'));
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });
  });

  describe('cleanup', () => {
    it('clears the pending blur timer when the popover closes externally', () => {
      const reference = document.createElement('button');
      document.body.appendChild(reference);
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [focus()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new FocusEvent('blur', { relatedTarget: document.body }));
      // External close mid-flight → pending close should drop.
      open = false;
      flushSync();
      vi.advanceTimersByTime(10);
      expect(onOpenChange).not.toHaveBeenCalled();
      document.body.removeChild(reference);
      teardown();
    });
  });
});
