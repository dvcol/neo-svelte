import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';

import VirtualHarness from './TestVirtualList.browser.test.svelte';

afterEach(() => {
  cleanup();
});

const ROW = 30;

function makeItems(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: i + 1 }));
}

function getList(): HTMLElement {
  return document.querySelector<HTMLElement>('.neo-virtual-list')!;
}

async function settle() {
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
}

/*
 * Track ResizeObserver constructions — NeoVirtualList uses a single shared
 * observer to measure row heights. Per-row observers scale O(N) and regress
 * scroll perf as the list grows.
 */
async function withResizeObserverTracking<T>(fn: (count: () => number) => Promise<T>): Promise<T> {
  const real = window.ResizeObserver;
  let constructed = 0;
  class TrackingRO extends real {
    constructor(cb: ResizeObserverCallback) {
      super(cb);
      constructed += 1;
    }
  }
  window.ResizeObserver = TrackingRO;
  try {
    return await fn(() => constructed);
  } finally {
    window.ResizeObserver = real;
  }
}

describe('neoVirtualList — perf contract (browser)', { tags: ['browser', 'performance'] }, () => {
  it('uses a small constant number of ResizeObservers regardless of total item count', async () => {
    await withResizeObserverTracking(async (count) => {
      render(VirtualHarness, { props: { items: makeItems(2000), itemHeight: ROW, buffer: 5 } as never });
      await settle();
      // Shared observer model — independent of items.length.
      expect(count()).toBeLessThanOrEqual(4);
    });
  });

  it('observer count does not grow with scroll distance (rows registered ≈ window size)', async () => {
    await withResizeObserverTracking(async (count) => {
      render(VirtualHarness, { props: { items: makeItems(2000), itemHeight: ROW, buffer: 5 } as never });
      await settle();
      const before = count();

      const list = getList();
      // Scroll across the full list — every row enters and leaves the window
      // multiple times. Observer count must remain stable.
      for (let y = 0; y <= 30000; y += 600) {
        list.scrollTop = y;
        await new Promise(r => requestAnimationFrame(() => r(undefined)));
      }
      await settle();

      expect(count()).toBe(before);
    });
  });

  it('fast scroll burst stays under generous frame budget (2000 rows)', { timeout: 30000 }, async () => {
    render(VirtualHarness, { props: { items: makeItems(2000), itemHeight: ROW, buffer: 5 } as never });
    await settle();

    const list = getList();
    const frames: number[] = [];

    for (let y = 0; y <= 20000; y += 500) {
      const t = performance.now();
      list.scrollTop = y;
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      frames.push(performance.now() - t);
    }

    frames.sort((a, b) => a - b);
    const median = frames[Math.floor(frames.length / 2)];

    /*
     * Tripwire — virtual scroll should be cheap (only a window of rows
     * mounts at any time). Median frame budget is generous to absorb CI
     * jitter; catches structural regressions like "all rows mount at once"
     * or "every row registers a new observer".
     */
    expect(median).toBeLessThan(120);
  });
});
