import { cleanup, render } from '@testing-library/svelte';
import { afterEach, bench, describe } from 'vitest';

import PerfHarness from './TestListPerf.browser.test.svelte';

interface Item { id: string; label: string; value: number }
interface PerfMethods {
  push: (item: Item) => void;
  pop: () => Item | undefined;
  size: () => number;
}

const ITEM_COUNT = 1_000;

function makeItems(n: number): Item[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `item-${i}`,
    label: `Item ${i}`,
    value: i,
  }));
}

async function nextFrame(): Promise<void> {
  return new Promise(r => requestAnimationFrame(() => r()));
}

function renderPerf(initialItems: Item[], virtual: boolean) {
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
  return { result, getMethods: () => methods };
}

afterEach(() => {
  cleanup();
});

describe('neoList — mount cost (1k items)', { tags: ['performance'] }, () => {
  bench('virtual=off mount', async () => {
    renderPerf(makeItems(ITEM_COUNT), false);
    await nextFrame();
    cleanup();
  });

  bench('virtual=on mount', async () => {
    renderPerf(makeItems(ITEM_COUNT), true);
    await nextFrame();
    cleanup();
  });
});

describe('neoList — scroll loop (virtual, 1k items)', { tags: ['performance'] }, () => {
  bench('1000 programmatic scrolls', async () => {
    renderPerf(makeItems(ITEM_COUNT), true);
    await nextFrame();
    const list = document.querySelector<HTMLElement>('.neo-virtual-list');
    if (!list) {
      cleanup();
      return;
    }
    /*
     * Drive the scroll handler synchronously (no smooth scroll) so the bench
     * measures cursor recompute + slice + paint, not the browser's smooth-
     * scroll timing curve.
     */
    const max = list.scrollHeight - list.clientHeight;
    const step = Math.max(1, Math.floor(max / ITEM_COUNT));
    for (let i = 0; i < ITEM_COUNT; i++) {
      list.scrollTop = (i * step) % (max + 1);
      list.dispatchEvent(new Event('scroll'));
    }
    await nextFrame();
    cleanup();
  });
});

describe('neoList — filter/mutation cycle (virtual, 1k items)', { tags: ['performance'] }, () => {
  bench('add + remove burst (×10 each)', async () => {
    const { getMethods } = renderPerf(makeItems(ITEM_COUNT), true);
    await nextFrame();
    const m = getMethods();
    if (!m) {
      cleanup();
      return;
    }
    for (let i = 0; i < 10; i++) {
      m.push({ id: `bench-add-${i}`, label: `bench ${i}`, value: 9000 + i });
      await nextFrame();
    }
    for (let i = 0; i < 10; i++) {
      m.pop();
      await nextFrame();
    }
    cleanup();
  });
});
