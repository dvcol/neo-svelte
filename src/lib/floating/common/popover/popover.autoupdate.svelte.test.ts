import { flushSync, tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { autoUpdateMock, autoUpdateCleanupMock } = vi.hoisted(() => ({
  autoUpdateMock: vi.fn(),
  autoUpdateCleanupMock: vi.fn(),
}));

vi.mock('@floating-ui/dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@floating-ui/dom')>();
  return {
    ...actual,
    autoUpdate: autoUpdateMock,
  };
});

const { Popover } = await import('./popover.svelte.js');

function withRoot<T>(fn: () => T): { result: T; teardown: () => void } {
  let result: T;
  const teardown = $effect.root(() => {
    result = fn();
  });
  return { result: result!, teardown };
}

function rect(el: Element, x: number, y: number, w: number, h: number) {
  Object.defineProperty(el, 'getBoundingClientRect', {
    value: () => ({ x, y, top: y, left: x, right: x + w, bottom: y + h, width: w, height: h }),
    configurable: true,
  });
}

beforeEach(() => {
  autoUpdateMock.mockReset();
  autoUpdateCleanupMock.mockReset();
  autoUpdateMock.mockImplementation(() => autoUpdateCleanupMock);
});

describe('popover — phase 3 autoupdate + css vars', () => {
  describe('css variables written on update()', () => {
    it('writes --neo-popover-reference-width/height to the floating node', async () => {
      const reference = document.createElement('div');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      rect(reference, 0, 0, 120, 48);
      rect(floating, 0, 0, 80, 30);

      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();

      await result.update();
      await tick();

      expect(floating.style.getPropertyValue('--neo-popover-reference-width')).toBe('120px');
      expect(floating.style.getPropertyValue('--neo-popover-reference-height')).toBe('48px');

      teardown();
      reference.remove();
      floating.remove();
    });

    it('writes --neo-popover-available-width/height to the floating node', async () => {
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
      await tick();

      const availableW = floating.style.getPropertyValue('--neo-popover-available-width');
      const availableH = floating.style.getPropertyValue('--neo-popover-available-height');
      expect(availableW).toMatch(/^-?\d+px$/);
      expect(availableH).toMatch(/^-?\d+px$/);

      teardown();
      reference.remove();
      floating.remove();
    });

    it('updates reference-width when the reference is resized between updates', async () => {
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
      expect(floating.style.getPropertyValue('--neo-popover-reference-width')).toBe('100px');

      rect(reference, 0, 0, 250, 40);
      await result.update();
      expect(floating.style.getPropertyValue('--neo-popover-reference-width')).toBe('250px');

      teardown();
      reference.remove();
      floating.remove();
    });
  });

  describe('autoUpdate subscription lifecycle', () => {
    it('subscribes when open && both refs present', async () => {
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
      await tick();

      expect(autoUpdateMock).toHaveBeenCalledTimes(1);
      const call = autoUpdateMock.mock.calls[0] as [Element, Element, () => void];
      expect(call[0]).toBe(reference);
      expect(call[1]).toBe(floating);
      expect(typeof call[2]).toBe('function');

      teardown();
      reference.remove();
      floating.remove();
    });

    it('tears down the subscription when the floating ref detaches', async () => {
      const reference = document.createElement('div');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      rect(reference, 0, 0, 100, 40);
      rect(floating, 0, 0, 80, 30);

      const { result, teardown } = withRoot(() => new Popover());
      flushSync();
      result.reference(reference);
      const cleanupFloating = result.floating(floating);
      flushSync();
      await tick();
      expect(autoUpdateMock).toHaveBeenCalledTimes(1);

      cleanupFloating?.();
      flushSync();
      await tick();
      expect(autoUpdateCleanupMock).toHaveBeenCalledTimes(1);

      teardown();
      reference.remove();
      floating.remove();
    });

    it('autoUpdate=false opts out of the subscription', async () => {
      const reference = document.createElement('div');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      rect(reference, 0, 0, 100, 40);
      rect(floating, 0, 0, 80, 30);

      const { result, teardown } = withRoot(() => new Popover({ autoUpdate: false }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      await tick();

      expect(autoUpdateMock).not.toHaveBeenCalled();

      teardown();
      reference.remove();
      floating.remove();
    });

    it('forwards AutoUpdateOptionsLike to @floating-ui/dom autoUpdate', async () => {
      const reference = document.createElement('div');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      rect(reference, 0, 0, 100, 40);
      rect(floating, 0, 0, 80, 30);

      const { result, teardown } = withRoot(() => new Popover({
        autoUpdate: { ancestorScroll: false, animationFrame: true, elementResize: false },
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      await tick();

      expect(autoUpdateMock).toHaveBeenCalledTimes(1);
      const call = autoUpdateMock.mock.calls[0] as [Element, Element, () => void, Record<string, boolean>];
      expect(call[3]).toMatchObject({
        ancestorScroll: false,
        animationFrame: true,
        elementResize: false,
      });

      teardown();
      reference.remove();
      floating.remove();
    });

    it('does not subscribe when open=false', async () => {
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

      expect(autoUpdateMock).not.toHaveBeenCalled();

      teardown();
      reference.remove();
      floating.remove();
    });

    it('re-subscribes when a getter-driven open flips false → true', async () => {
      const reference = document.createElement('div');
      const floating = document.createElement('div');
      document.body.append(reference, floating);
      rect(reference, 0, 0, 100, 40);
      rect(floating, 0, 0, 80, 30);

      let open = $state(false);
      const { result, teardown } = withRoot(() => new Popover({
        get open() {
          return open;
        },
      }));
      flushSync();
      result.reference(reference);
      result.floating(floating);
      flushSync();
      await tick();
      expect(autoUpdateMock).not.toHaveBeenCalled();

      open = true;
      flushSync();
      await tick();
      expect(autoUpdateMock).toHaveBeenCalledTimes(1);

      teardown();
      reference.remove();
      floating.remove();
    });
  });
});
