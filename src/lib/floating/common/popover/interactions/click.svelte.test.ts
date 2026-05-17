import { flushSync } from 'svelte';
import { describe, expect, it, vi } from 'vitest';

import { Popover } from '../popover.svelte.js';
import { click } from './click.svelte.js';

function withRoot<T>(fn: () => T): { result: T; teardown: () => void } {
  let result: T;
  const teardown = $effect.root(() => {
    result = fn();
  });
  return { result: result!, teardown };
}

function pointer(type: PointerEvent['pointerType'] = 'mouse'): PointerEvent {
  return new PointerEvent('pointerdown', { pointerType: type, button: 0 });
}

describe('click() interaction', () => {
  describe('event=click (default)', () => {
    it('opens on click', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [click()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(pointer());
      reference.dispatchEvent(new MouseEvent('click'));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(MouseEvent), 'click');
      teardown();
    });

    it('toggle=true closes when clicking the open reference (after click-open)', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [click()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      // Seed openEvent.type === 'click' so toggle path triggers close.
      result.openEvent = new MouseEvent('click');
      reference.dispatchEvent(pointer());
      reference.dispatchEvent(new MouseEvent('click'));
      expect(onOpenChange).toHaveBeenCalledWith(false, expect.any(MouseEvent), 'click');
      open = false;
      flushSync();
      teardown();
    });

    it('toggle=false keeps it open on subsequent click', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [click({ toggle: false })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      result.openEvent = new MouseEvent('click');
      reference.dispatchEvent(pointer());
      reference.dispatchEvent(new MouseEvent('click'));
      const closes = onOpenChange.mock.calls.filter(c => c[0] === false);
      expect(closes).toHaveLength(0);
      open = false;
      flushSync();
      teardown();
    });

    it('toggles close even when the popover was opened by a non-click event (e.g. focus)', () => {
      // Regression: previously, a `sameTriggerType` check bailed close when the
      // popover was opened by focus/hover/keyboard. That caused 2-click toggles
      // when clicking a NeoSelect chevron after tab focus opened the dropdown.
      // A click on the trigger is always a deliberate toggle.
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      let open = $state(true);
      const { teardown, result } = withRoot(() => new Popover({
        get open() {
          return open;
        },
        onOpenChange,
        interactions: [click()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      result.openEvent = new FocusEvent('focus');
      reference.dispatchEvent(pointer());
      reference.dispatchEvent(new MouseEvent('click'));
      const closes = onOpenChange.mock.calls.filter(c => c[0] === false);
      expect(closes).toHaveLength(1);
      expect(closes[0]).toEqual([false, expect.any(MouseEvent), 'click']);
      open = false;
      flushSync();
      teardown();
    });
  });

  describe('event=mousedown', () => {
    it('opens on mousedown and skips the trailing click', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [click({ event: 'mousedown' })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(pointer());
      reference.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
      reference.dispatchEvent(new MouseEvent('click'));
      // Mousedown opens once; click handler short-circuits because pointerType
      // is set after pointerdown.
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(MouseEvent), 'click');
      teardown();
    });

    it('mousedown ignores non-primary buttons', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [click({ event: 'mousedown' })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new MouseEvent('mousedown', { button: 2 }));
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });
  });

  describe('ignoreMouse', () => {
    it('skips when pointerType is mouse and ignoreMouse=true', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [click({ ignoreMouse: true })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(pointer('mouse'));
      reference.dispatchEvent(new MouseEvent('click'));
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });

    it('still opens for touch/pen even with ignoreMouse=true', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [click({ ignoreMouse: true })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(pointer('touch'));
      reference.dispatchEvent(new MouseEvent('click'));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      teardown();
    });
  });

  describe('keyboard handlers (non-button reference)', () => {
    it('enter opens', () => {
      const reference = document.createElement('div');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [click()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(KeyboardEvent), 'click');
      teardown();
    });

    it('space opens on keyup (after preventDefault on keydown)', () => {
      const reference = document.createElement('div');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [click()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      const down = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
      reference.dispatchEvent(down);
      expect(down.defaultPrevented).toBe(true);
      // Keydown alone does not toggle.
      expect(onOpenChange).not.toHaveBeenCalled();
      reference.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(KeyboardEvent), 'click');
      teardown();
    });

    it('does nothing for Enter/Space when target is a BUTTON (native handles it)', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [click()],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      reference.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      reference.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
      // Click handler still produces the native button activation; we should
      // not synthesize a duplicate from key events.
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });

    it('keyboardHandlers=false disables Enter/Space', () => {
      const reference = document.createElement('div');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [click({ keyboardHandlers: false })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      reference.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      reference.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });
  });

  describe('enabled', () => {
    it('does not respond to click when enabled=false', () => {
      const reference = document.createElement('button');
      const onOpenChange = vi.fn();
      const { teardown, result } = withRoot(() => new Popover({
        open: false,
        onOpenChange,
        interactions: [click({ enabled: false })],
      }));
      flushSync();
      result.reference(reference);
      flushSync();
      reference.dispatchEvent(pointer());
      reference.dispatchEvent(new MouseEvent('click'));
      reference.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(onOpenChange).not.toHaveBeenCalled();
      teardown();
    });
  });
});
