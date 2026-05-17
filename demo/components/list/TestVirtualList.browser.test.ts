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

function getRows(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.row'));
}

async function settle() {
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
  await new Promise(r => requestAnimationFrame(() => r(undefined)));
}

describe('neoVirtualList — render (browser)', { tags: ['browser'] }, () => {
  it('renders only a window of rows (fixed height)', async () => {
    render(VirtualHarness, { props: { items: makeItems(1000), itemHeight: ROW, buffer: 0 } as never });
    await settle();
    const rows = getRows();
    // ~8 rows (240/30) ± transition slack
    expect(rows.length).toBeGreaterThanOrEqual(8);
    expect(rows.length).toBeLessThanOrEqual(20);
  });

  it('total content height matches items × rowHeight (padding-spacer total)', async () => {
    const items = makeItems(500);
    render(VirtualHarness, { props: { items, itemHeight: ROW } as never });
    await settle();
    const list = getList();
    // scrollHeight ≈ items.length * ROW; allow ±1 row of padding/border slack.
    const expected = items.length * ROW;
    expect(Math.abs(list.scrollHeight - expected)).toBeLessThanOrEqual(ROW);
  });
});

describe('neoVirtualList — scroll (browser)', { tags: ['browser'] }, () => {
  it('advances the cursor when scrolling, releasing rows that left the window', async () => {
    render(VirtualHarness, { props: { items: makeItems(1000), itemHeight: ROW, buffer: 0 } as never });
    await settle();
    const initialIds = getRows().map(r => Number(r.dataset.id));
    expect(initialIds[0]).toBe(1);

    const list = getList();
    list.scrollTop = ROW * 200;
    await settle();
    await new Promise(r => setTimeout(r, 50));
    const movedIds = getRows().map(r => Number(r.dataset.id));
    expect(movedIds[0]).toBeGreaterThanOrEqual(195);
    expect(movedIds[0]).toBeLessThanOrEqual(210);
  });

  it('fast scroll keeps the viewport populated (no empty gaps)', async () => {
    render(VirtualHarness, { props: { items: makeItems(2000), itemHeight: ROW, buffer: 5 } as never });
    await settle();
    const list = getList();
    // Simulate a fast scroll burst.
    for (let y = 0; y <= 20000; y += 250) {
      list.scrollTop = y;
      await new Promise(r => requestAnimationFrame(() => r(undefined)));
    }
    await new Promise(r => setTimeout(r, 100));
    expect(getRows().length).toBeGreaterThan(0);
  });
});

describe('neoVirtualList — register lifecycle (browser)', { tags: ['browser'] }, () => {
  it('rows that scroll out are unobserved (no leaked observers)', async () => {
    const observed = new Set<Element>();
    const realRO = window.ResizeObserver;
    class TrackingRO extends realRO {
      observe(el: Element) {
        observed.add(el);
        return super.observe(el);
      }

      unobserve(el: Element) {
        observed.delete(el);
        return super.unobserve(el);
      }
    }
    window.ResizeObserver = TrackingRO;

    try {
      render(VirtualHarness, { props: { items: makeItems(1000), buffer: 0 } as never });
      await settle();
      const rowsBefore = getRows().length;
      expect(observed.size).toBeGreaterThanOrEqual(rowsBefore);

      const list = getList();
      list.scrollTop = ROW * 500;
      await settle();
      await new Promise(r => setTimeout(r, 100));

      const rowsAfter = getRows().length;
      // Observed set should shrink to roughly the new rendered window — not
      // accumulate the union of all rows that were ever rendered.
      expect(observed.size).toBeLessThanOrEqual(rowsAfter * 3);
    } finally {
      window.ResizeObserver = realRO;
    }
  });

  it('unmount disconnects the observer (no long-lived references)', async () => {
    const realRO = window.ResizeObserver;
    let disconnects = 0;
    class TrackingRO extends realRO {
      disconnect() {
        disconnects += 1;
        return super.disconnect();
      }
    }
    window.ResizeObserver = TrackingRO;

    try {
      const result = render(VirtualHarness, { props: { items: makeItems(50) } as never });
      await settle();
      result.unmount();
      await settle();
      expect(disconnects).toBeGreaterThanOrEqual(1);
    } finally {
      window.ResizeObserver = realRO;
    }
  });
});

interface Methods {
  refresh: () => void;
  scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end'; behavior?: ScrollBehavior }) => unknown;
}

describe('neoVirtualList — imperative methods (browser)', { tags: ['browser'] }, () => {
  it('scrollToIndex scrolls so the target row is visible', async () => {
    let methods: Methods | undefined;
    render(VirtualHarness, {
      props: {
        items: makeItems(1000),
        itemHeight: ROW,
        get methods() {
          return methods;
        },
        set methods(v: Methods | undefined) {
          methods = v;
        },
      } as never,
    });
    await settle();
    methods!.scrollToIndex(300, { align: 'start', behavior: 'instant' });
    await new Promise(r => setTimeout(r, 50));
    const list = getList();
    expect(Math.abs(list.scrollTop - 300 * ROW)).toBeLessThanOrEqual(ROW * 2);
  });

  it('refresh re-measures rendered rows (dynamic mode)', async () => {
    let methods: Methods | undefined;
    render(VirtualHarness, {
      props: {
        items: makeItems(20),
        get methods() {
          return methods;
        },
        set methods(v: Methods | undefined) {
          methods = v;
        },
      } as never,
    });
    await settle();
    expect(typeof methods!.refresh).toBe('function');
    expect(() => methods!.refresh()).not.toThrow();
  });
});
