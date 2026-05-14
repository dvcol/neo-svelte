import type { NeoMovableUseResult } from '~/floating/dialog/use-movable.svelte.js';

import { cleanup } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithPortalTarget } from '../../../../test/helpers/render.js';
import Harness from './UseMovableHarness.test.svelte';

afterEach(() => {
  cleanup();
});

type Result = NeoMovableUseResult<HTMLDivElement, HTMLDivElement>;

function mountHarness(props: Record<string, unknown> = {}): {
  getResult: () => Result;
  getMovable: () => HTMLElement;
} {
  let captured: Result | undefined;
  renderWithPortalTarget(Harness as never, {
    onResult: (r: Result) => {
      captured = r;
    },
    ...props,
  } as never);
  return {
    getResult: () => {
      if (!captured) throw new Error('useMovable result not captured');
      return captured;
    },
    getMovable: () => {
      const el = document.querySelector<HTMLElement>('[data-testid="movable"]');
      if (!el) throw new Error('movable element not rendered');
      return el;
    },
  };
}

const arrowKey = (key: string): KeyboardEvent => new KeyboardEvent('keydown', { key, bubbles: true });

describe('useMovable — translate string', () => {
  it('translate combines offset.x and offset.y in px when no axis constraint', async () => {
    const { getResult } = mountHarness({ initialOffset: { x: 12, y: -8 } });
    await tick();
    expect(getResult().translate).toBe('12px -8px');
  });

  it('translate zeros the y component when axis="x"', async () => {
    const { getResult } = mountHarness({
      movable: { enabled: true, axis: 'x' },
      initialOffset: { x: 5, y: 7 },
    });
    await tick();
    expect(getResult().translate).toBe('5px 0');
  });

  it('translate zeros the x component when axis="y"', async () => {
    const { getResult } = mountHarness({
      movable: { enabled: true, axis: 'y' },
      initialOffset: { x: 5, y: 7 },
    });
    await tick();
    expect(getResult().translate).toBe('0 7px');
  });
});

describe('useMovable — keyboard arrows (enabled)', () => {
  it('arrowRight increments offset.x by step and ArrowLeft decrements it', async () => {
    const { getResult, getMovable } = mountHarness({ movable: { enabled: true, step: 4 } });
    await tick();
    await getResult().handlers.onkeydown?.(arrowKey('ArrowRight') as never);
    await tick();
    // first press: translating goes 0 -> 1, so step = 4 * 1 = 4
    expect(getMovable().dataset.offsetX).toBe('4');

    await getResult().handlers.onkeydown?.(arrowKey('ArrowLeft') as never);
    await tick();
    // second press: translating goes 1 -> 2, so step = 4 * 2 = 8 → 4 - 8 = -4
    expect(getMovable().dataset.offsetX).toBe('-4');
  });

  it('arrowUp/ArrowDown move along the y axis', async () => {
    const { getResult, getMovable } = mountHarness({ movable: { enabled: true, step: 5 } });
    await tick();
    await getResult().handlers.onkeydown?.(arrowKey('ArrowDown') as never);
    await tick();
    expect(getMovable().dataset.offsetY).toBe('5');

    await getResult().handlers.onkeydown?.(arrowKey('ArrowUp') as never);
    await tick();
    // step is 5 * 2 = 10 (translating ramped up); 5 - 10 = -5
    expect(getMovable().dataset.offsetY).toBe('-5');
  });

  it('ignores non-arrow keys', async () => {
    const { getResult, getMovable } = mountHarness({ movable: { enabled: true, step: 4 } });
    await tick();
    await getResult().handlers.onkeydown?.(arrowKey('Enter') as never);
    await tick();
    expect(getMovable().dataset.offsetX).toBe('0');
    expect(getMovable().dataset.offsetY).toBe('0');
  });

  it('does not move when movable.enabled=false (default)', async () => {
    const { getResult, getMovable } = mountHarness();
    await tick();
    await getResult().handlers.onkeydown?.(arrowKey('ArrowRight') as never);
    await tick();
    expect(getMovable().dataset.offsetX).toBe('0');
  });
});

describe('useMovable — limits & contain', () => {
  it('respects movable.limits.x.{min,max} clamping', async () => {
    const { getResult, getMovable } = mountHarness({
      movable: { enabled: true, step: 100, limits: { x: { min: -10, max: 10 } } },
    });
    await tick();
    // first ArrowRight: step=100*1=100 → clamped to 10
    await getResult().handlers.onkeydown?.(arrowKey('ArrowRight') as never);
    await tick();
    expect(getMovable().dataset.offsetX).toBe('10');

    // ArrowLeft: step=100*2=200 → 10 - 200 = -190 → clamped to -10
    await getResult().handlers.onkeydown?.(arrowKey('ArrowLeft') as never);
    await tick();
    expect(getMovable().dataset.offsetX).toBe('-10');
  });

  it('respects movable.limits.y.{min,max} clamping', async () => {
    const { getResult, getMovable } = mountHarness({
      movable: { enabled: true, step: 50, limits: { y: { min: 0, max: 25 } } },
    });
    await tick();
    await getResult().handlers.onkeydown?.(arrowKey('ArrowDown') as never);
    await tick();
    expect(getMovable().dataset.offsetY).toBe('25');

    // ArrowUp pushes negative; min=0 holds the floor
    await getResult().handlers.onkeydown?.(arrowKey('ArrowUp') as never);
    await tick();
    expect(getMovable().dataset.offsetY).toBe('0');
  });
});

describe('useMovable — reset', () => {
  it('reset() returns offset to {0, 0}', async () => {
    const { getResult, getMovable } = mountHarness({
      movable: { enabled: true, step: 4 },
      initialOffset: { x: 20, y: 30 },
    });
    await tick();
    expect(getMovable().dataset.offsetX).toBe('20');
    await getResult().reset();
    await tick();
    expect(getMovable().dataset.offsetX).toBe('0');
    expect(getMovable().dataset.offsetY).toBe('0');
  });

  it('reset({ x, y }) sets offset to the requested coordinates', async () => {
    const { getResult, getMovable } = mountHarness({ movable: { enabled: true } });
    await tick();
    await getResult().reset({ x: 7, y: 9 });
    await tick();
    expect(getMovable().dataset.offsetX).toBe('7');
    expect(getMovable().dataset.offsetY).toBe('9');
  });
});

describe('useMovable — cleanup contract', () => {
  it('does not throw when the host element is unmounted before the stopTranslating timer fires', async () => {
    vi.useFakeTimers();
    try {
      const { getResult } = mountHarness({
        movable: { enabled: true, snap: { enabled: true, translate: { duration: 600 } } },
      });
      await tick();

      // Schedule the stopTranslating timer via reset({ translate }), which calls
      // startTranslating then stopTranslating(duration) — same path as snap-on-close.
      const settled = getResult().reset({ x: 10, y: 10, translate: { duration: 600 } });
      // debounce(50) wraps stopTranslating; advance past it so the inner setTimeout schedules.
      vi.advanceTimersByTime(50);

      // Unmount the host while the inner setTimeout (delay=600) is still pending.
      // Before the fix, the timer re-read the now-undefined `element` $derived and
      // threw `Cannot set properties of undefined (setting 'transition')`. The fix
      // captures the element in the closure so the timer references a stable target.
      cleanup();

      expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
      await expect(settled).resolves.toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});
