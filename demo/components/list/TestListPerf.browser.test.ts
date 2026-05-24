import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';

import PerfHarness from './TestListPerf.browser.test.svelte';

afterEach(() => {
  cleanup();
});

interface Item { id: string; label: string; value: number }
interface PerfMethods {
  push: (item: Item) => void;
  pop: () => Item | undefined;
  size: () => number;
}

function makeItems(n: number): Item[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `item-${i}`,
    label: `Item ${i}`,
    value: i,
  }));
}

async function settle() {
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
}

function renderPerf(initialItems: Item[], virtual = false): { methods: PerfMethods; result: ReturnType<typeof render> } {
  let methods: PerfMethods | undefined;
  const result = render(PerfHarness, {
    props: {
      initialItems,
      virtual,
      get methods() {
        return methods;
      },
      set methods(v: PerfMethods | undefined) {
        methods = v;
      },
    } as never,
  });
  if (!methods) throw new Error('PerfHarness did not expose methods');
  return { methods, result };
}

/*
 * Track every IntersectionObserver constructed so we can assert the FLIP
 * `skip` infrastructure stays as a single shared observer — a per-row
 * observer would scale O(N) on mount/unmount and reintroduce regressions.
 */
async function withObserverTracking<T>(fn: (count: () => number) => Promise<T>): Promise<T> {
  const real = window.IntersectionObserver;
  let constructed = 0;
  class TrackingIO extends real {
    constructor(cb: IntersectionObserverCallback, init?: IntersectionObserverInit) {
      super(cb, init);
      constructed += 1;
    }
  }
  window.IntersectionObserver = TrackingIO;
  try {
    return await fn(() => constructed);
  } finally {
    window.IntersectionObserver = real;
  }
}

describe('neoList — perf contract (browser)', { tags: ['browser'] }, () => {
  it('uses a small constant number of IntersectionObservers regardless of row count', async () => {
    await withObserverTracking(async (count) => {
      renderPerf(makeItems(500));
      await settle();
      // One observer for the FLIP `skip` infra, plus minor slack for any
      // shared infra. Per-row observers would balloon this past the cap.
      expect(count()).toBeLessThanOrEqual(4);
    });
  });

  it('does not allocate new observers on item add/remove', async () => {
    await withObserverTracking(async (count) => {
      const { methods } = renderPerf(makeItems(200));
      await settle();
      const before = count();

      for (let i = 0; i < 10; i++) {
        methods.push({ id: `add-${i}`, label: `Added ${i}`, value: 1000 + i });
        await settle();
      }
      for (let i = 0; i < 10; i++) {
        methods.pop();
        await settle();
      }

      // Add/Remove must not allocate per-row observers. The shared observer
      // re-creates only on options change (root / rootMargin), neither of
      // which mutate during this test.
      expect(count()).toBe(before);
    });
  });

  it('add+remove burst on 1000 rows stays under generous frame budget', { timeout: 30000 }, async () => {
    const { methods } = renderPerf(makeItems(1000));
    await settle();

    const wait2RAF = async () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const frames: number[] = [];

    for (let i = 0; i < 10; i++) {
      const t = performance.now();
      methods.push({ id: `burst-${i}`, label: `Burst ${i}`, value: 2000 + i });
      await wait2RAF();
      frames.push(performance.now() - t);
    }
    for (let i = 0; i < 10; i++) {
      const t = performance.now();
      methods.pop();
      await wait2RAF();
      frames.push(performance.now() - t);
    }

    frames.sort((a, b) => a - b);
    const median = frames[Math.floor(frames.length / 2)];

    /*
     * Tripwire — not a fine-grained regression metric. Local hot-path
     * baseline is ~170-190ms median for this workload; CI runners can be
     * 3-5x slower. 800ms catches order-of-magnitude regressions (per-row
     * observers, broken FLIP `skip`, sync layout thrash) without flapping
     * on environment variance.
     */
    expect(median).toBeLessThan(800);
  });
});
