import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import NeoVirtualListHarness from './NeoVirtualList.test.svelte';

const ROW = 20;
const VIEWPORT = 200;

/*
 * jsdom-friendly fakes for offsetHeight, scrollTo, and ResizeObserver.
 * The component drives layout off these and jsdom doesn't perform layout.
 */

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  cb: ResizeObserverCallback;
  els = new Set<Element>();
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
    FakeResizeObserver.instances.push(this);
  }

  observe(el: Element): void {
    this.els.add(el);
    this.fire(el);
  }

  unobserve(el: Element): void {
    this.els.delete(el);
  }

  disconnect(): void {
    this.els.clear();
  }

  fire(el: Element): void {
    const h = (el as HTMLElement).offsetHeight;
    this.cb([{
      target: el,
      contentRect: { height: h, width: 0, top: 0, left: 0, right: 0, bottom: h, x: 0, y: 0 } as DOMRectReadOnly,
      borderBoxSize: [{ blockSize: h, inlineSize: 0 }],
      contentBoxSize: [{ blockSize: h, inlineSize: 0 }],
      devicePixelContentBoxSize: [{ blockSize: h, inlineSize: 0 }],
    }], this);
  }
}

let prevRO: typeof globalThis.ResizeObserver;

function setViewportSize(viewportHeight: number, rowHeight: number) {
  Object.defineProperty(HTMLUListElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return viewportHeight;
    },
  });
  Object.defineProperty(HTMLUListElement.prototype, 'clientHeight', {
    configurable: true,
    get() {
      return viewportHeight;
    },
  });
  Object.defineProperty(HTMLLIElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return rowHeight;
    },
  });
}

beforeEach(() => {
  prevRO = globalThis.ResizeObserver;
  globalThis.ResizeObserver = FakeResizeObserver;
  FakeResizeObserver.instances = [];

  // jsdom lacks element scrollTo; the component calls it from imperative methods.
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    writable: true,
    value() { /* noop */ },
  });

  // Default geometry — individual tests may override via setLayout/setViewportSize.
  setViewportSize(VIEWPORT, ROW);
});

afterEach(() => {
  cleanup();
  globalThis.ResizeObserver = prevRO;
  // Reset row offsetHeight override.
  Object.defineProperty(HTMLLIElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return 0;
    },
  });
});

function makeItems(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: i + 1 }));
}

async function flush() {
  await tick();
  await tick();
  await new Promise(r => setTimeout(r, 32));
  await tick();
}

function getList(container: ParentNode): HTMLElement {
  return container.querySelector<HTMLElement>('.neo-virtual-list')!;
}

function getContents(container: ParentNode): HTMLElement {
  return container.querySelector<HTMLElement>('.neo-virtual-list-contents')!;
}

function getRows(container: ParentNode): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('.neo-virtual-row'));
}

function setLayout(container: ParentNode, viewportHeight = VIEWPORT, rowHeight = ROW) {
  const list = getList(container);
  Object.defineProperty(list, 'offsetHeight', { configurable: true, value: viewportHeight });
  Object.defineProperty(list, 'clientHeight', { configurable: true, value: viewportHeight });
  Object.defineProperty(HTMLLIElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return rowHeight;
    },
  });
  /*
   * Re-fire all ResizeObserver entries — Svelte 5's bind:offsetHeight uses its
   * own observer; we cannot target only ours, so fire everything.
   */
  for (const ro of FakeResizeObserver.instances) {
    for (const el of ro.els) ro.fire(el);
  }
  return list;
}

describe('neoVirtualList — render', { tags: ['jsdom'] }, () => {
  it('renders a viewport <ul> with a contents wrapper', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(3) } as never });
    setLayout(container);
    await flush();
    expect(getList(container).tagName).toBe('UL');
    expect(getContents(container)).not.toBeNull();
  });

  it('renders only items inside cursor + buffer (fixed height)', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(200), itemHeight: ROW, buffer: 0 } as never });
    setLayout(container);
    await flush();
    const visible = getRows(container).length;
    // viewport=200, rowH=20, buffer=0 → ~10 rows
    expect(visible).toBeGreaterThanOrEqual(10);
    expect(visible).toBeLessThanOrEqual(12);
    expect(visible).toBeLessThan(200);
  });

  it('buffer extends the rendered window above and below', async () => {
    const { container: a } = render(NeoVirtualListHarness, { props: { items: makeItems(200), itemHeight: ROW, buffer: 0 } as never });
    setLayout(a);
    await flush();
    const noBuf = getRows(a).length;

    const { container: b } = render(NeoVirtualListHarness, { props: { items: makeItems(200), itemHeight: ROW, buffer: 5 } as never });
    setLayout(b);
    await flush();
    const buf = getRows(b).length;
    expect(buf).toBeGreaterThan(noBuf);
  });

  it('renders all items when total content fits the viewport', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(3), itemHeight: ROW, buffer: 0 } as never });
    setLayout(container, VIEWPORT, ROW);
    await flush();
    expect(getRows(container)).toHaveLength(3);
  });

  it('renders nothing when items=[]', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: [], itemHeight: ROW } as never });
    setLayout(container);
    await flush();
    expect(getRows(container)).toHaveLength(0);
  });

  it('uses estimatedItemHeight for unmeasured rows in dynamic mode', async () => {
    /*
     * Force rows to report 0 height so measurement is skipped and the
     * estimate dictates how many rows fit the viewport.
     */
    Object.defineProperty(HTMLLIElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return 0;
      },
    });
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(50), estimatedItemHeight: 100, buffer: 0 } as never });
    await flush();
    const visible = getRows(container).length;
    // viewport=200, est=100, buffer=0 → ~2-3 rows
    expect(visible).toBeGreaterThanOrEqual(2);
    expect(visible).toBeLessThanOrEqual(4);
  });

  it('preserves stable identity by `key` (id-based) across re-renders', async () => {
    const items = makeItems(3);
    const { container, rerender } = render(NeoVirtualListHarness, { props: { items, itemHeight: ROW } as never });
    setLayout(container);
    await flush();
    const before = getRows(container).map(r => r.dataset.id);
    await rerender({ items: [items[2], items[0], items[1]], itemHeight: ROW } as never);
    await flush();
    const after = getRows(container).map(r => r.dataset.id);
    expect(after).toEqual([before[2], before[0], before[1]]);
  });
});

describe('neoVirtualList — slots', { tags: ['jsdom'] }, () => {
  it('renders the before slot when cursor.start === 0', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(2), before: true, itemHeight: ROW } as never });
    setLayout(container);
    await flush();
    expect(container.querySelector('.neo-virtual-list-before')).not.toBeNull();
  });

  it('hides the before slot once cursor.start > 0', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(200), before: true, itemHeight: ROW, buffer: 0 } as never });
    const list = setLayout(container);
    await flush();
    expect(container.querySelector('.neo-virtual-list-before')).not.toBeNull();
    list.scrollTop = 1000;
    list.dispatchEvent(new Event('scroll'));
    await flush();
    expect(container.querySelector('.neo-virtual-list-before')).toBeNull();
  });

  it('renders the after slot when cursor.end === items.length', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(2), after: true, itemHeight: ROW } as never });
    setLayout(container);
    await flush();
    expect(container.querySelector('.neo-virtual-list-after')).not.toBeNull();
  });

  it('hides the after slot when cursor.end < items.length', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(200), after: true, itemHeight: ROW, buffer: 0 } as never });
    setLayout(container);
    await flush();
    expect(container.querySelector('.neo-virtual-list-after')).toBeNull();
  });
});

describe('neoVirtualList — scroll behavior', { tags: ['jsdom'] }, () => {
  it('advances the cursor on scroll', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(200), itemHeight: ROW, buffer: 0 } as never });
    const list = setLayout(container);
    await flush();
    const startIds = getRows(container).map(r => Number(r.dataset.id));
    list.scrollTop = 1000;
    list.dispatchEvent(new Event('scroll'));
    await flush();
    const endIds = getRows(container).map(r => Number(r.dataset.id));
    expect(endIds[0]).toBeGreaterThan(startIds[0]);
  });

  it('fires onScrollTop when scrollTop=0', async () => {
    const onScrollTop = vi.fn();
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(50), itemHeight: ROW, onScrollTop } as never });
    const list = setLayout(container);
    await flush();
    list.scrollTop = 0;
    list.dispatchEvent(new Event('scroll'));
    await flush();
    expect(onScrollTop).toHaveBeenCalled();
  });

  it('fires onScrollBottom when reaching the bottom (within scrollTolerance)', async () => {
    const onScrollBottom = vi.fn();
    const items = makeItems(50);
    const { container } = render(NeoVirtualListHarness, { props: { items, itemHeight: ROW, onScrollBottom } as never });
    const list = setLayout(container);
    Object.defineProperty(list, 'scrollHeight', { configurable: true, value: items.length * ROW });
    await flush();
    list.scrollTop = items.length * ROW - VIEWPORT;
    list.dispatchEvent(new Event('scroll'));
    await flush();
    expect(onScrollBottom).toHaveBeenCalled();
  });

  it.skip('tODO: toggles `scrolling` $bindable true on scroll and false after idle debounce — covered in browser tests; @testing-library/svelte does not expose Svelte 5 bindables on the returned component.', () => {
    // Expected: scrolling=false on mount; scrolling=true synchronously on scroll;
    // scrolling=false after 150ms (desktop) / 300ms (touch) of idle.
  });
});

describe('neoVirtualList — sizing modes', { tags: ['jsdom'] }, () => {
  it('fixed itemHeight (number) places the cursor by O(1) division', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(1000), itemHeight: 25, buffer: 0 } as never });
    const list = setLayout(container, VIEWPORT, 25);
    await flush();
    expect(getRows(container).length).toBeGreaterThanOrEqual(8);
    list.scrollTop = 25 * 100;
    list.dispatchEvent(new Event('scroll'));
    await flush();
    const ids = getRows(container).map(r => Number(r.dataset.id));
    expect(ids[0]).toBeGreaterThanOrEqual(95);
    expect(ids[0]).toBeLessThanOrEqual(105);
  });

  it('per-item height function consults the callback', async () => {
    const heights = vi.fn((_item: { id: number }, i: number) => (i % 2 === 0 ? 30 : 50));
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(20), itemHeight: heights, buffer: 0 } as never });
    setLayout(container);
    await flush();
    expect(heights).toHaveBeenCalled();
  });

  it('dynamic measurement sets data-virtual-key on each rendered row', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: makeItems(5) } as never });
    setLayout(container);
    await flush();
    const keys = getRows(container).map(r => r.dataset.virtualKey);
    expect(keys).toEqual(['1', '2', '3', '4', '5']);
    const types = getRows(container).map(r => r.dataset.virtualKeyType);
    expect(new Set(types)).toEqual(new Set(['n']));
  });
});

interface Methods {
  refresh: () => void;
  scrollToTop: (options?: ScrollToOptions) => HTMLElement | false;
  scrollToBottom: (options?: ScrollToOptions) => HTMLElement | false;
  scrollToIndex: (i: number, options?: { align?: 'start' | 'center' | 'end' }) => HTMLElement | false;
}

describe('neoVirtualList — imperative methods', { tags: ['jsdom'] }, () => {
  function withMethods(items: { id: number | string }[], extra: Record<string, unknown> = {}) {
    let methods: Methods | undefined;
    const result = render(NeoVirtualListHarness, {
      props: {
        items,
        itemHeight: ROW,
        ...extra,
        get methods() {
          return methods;
        },
        set methods(v: Methods | undefined) {
          methods = v;
        },
      } as never,
    });
    return { ...result, get methods() {
      return methods!;
    } };
  }

  it('exposes refresh / scrollToTop / scrollToBottom / scrollToIndex', async () => {
    const { container, methods } = withMethods(makeItems(50));
    setLayout(container);
    await flush();
    expect(typeof methods.refresh).toBe('function');
    expect(typeof methods.scrollToTop).toBe('function');
    expect(typeof methods.scrollToBottom).toBe('function');
    expect(typeof methods.scrollToIndex).toBe('function');
  });

  it('scrollToIndex computes target offset with `align` option', async () => {
    const { container, methods } = withMethods(makeItems(50));
    const list = setLayout(container);
    Object.defineProperty(list, 'scrollHeight', { configurable: true, value: 50 * ROW });
    const spy = vi.spyOn(list, 'scrollTo');
    await flush();
    methods.scrollToIndex(20, { align: 'start' });
    expect(spy).toHaveBeenCalled();
    const lastCall = spy.mock.calls.at(-1)![0] as ScrollToOptions;
    expect(lastCall.top).toBe(20 * ROW);
  });

  it('scrollToIndex returns false for out-of-bounds index', async () => {
    const { container, methods } = withMethods(makeItems(10));
    setLayout(container);
    await flush();
    expect(methods.scrollToIndex(-1)).toBe(false);
    expect(methods.scrollToIndex(99)).toBe(false);
  });

  it('scrollToTop scrolls the viewport to 0', async () => {
    const { container, methods } = withMethods(makeItems(50));
    const list = setLayout(container);
    const spy = vi.spyOn(list, 'scrollTo');
    await flush();
    methods.scrollToTop();
    const lastCall = spy.mock.calls.at(-1)![0] as ScrollToOptions;
    expect(lastCall.top).toBe(0);
  });

  it('scrollToBottom scrolls to the actual scrollable max (scrollHeight - clientHeight)', async () => {
    const { container, methods } = withMethods(makeItems(50));
    const list = setLayout(container);
    /*
     * Bottom target reads scrollHeight - clientHeight off the live element so
     * it accounts for before/after slot heights, not just the offset prefix sum.
     */
    Object.defineProperty(list, 'scrollHeight', { configurable: true, value: 50 * ROW });
    const spy = vi.spyOn(list, 'scrollTo');
    await flush();
    methods.scrollToBottom();
    const lastCall = spy.mock.calls.at(-1)![0] as ScrollToOptions;
    expect(lastCall.top).toBe(50 * ROW - VIEWPORT);
  });
});

describe('neoVirtualList — measurement lifecycle', { tags: ['jsdom'] }, () => {
  it('register attachment writes data-virtual-key with type marker (string vs number)', async () => {
    const items = [{ id: 'a' }, { id: 'b' }];
    const { container } = render(NeoVirtualListHarness, { props: { items } as never });
    setLayout(container);
    await flush();
    const rows = getRows(container);
    expect(rows[0].dataset.virtualKey).toBe('a');
    expect(rows[0].dataset.virtualKeyType).toBe('s');
  });

  it.skip('tODO: register attachment unobserves on row unmount (no leaked observers). Covered in browser test where ResizeObserver is real.', () => {
    // Expected: when items shrink, ResizeObserver entries for unmounted rows are removed
    // (verified by counting observed elements before/after items mutation).
  });
});
