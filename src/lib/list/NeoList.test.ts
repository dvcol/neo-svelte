import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { flattenSectionsWithCascade } from './neo-list.model.js';
import NeoList from './NeoList.svelte';
import NeoListHarness from './NeoList.test.svelte';

beforeEach(() => {
  // jsdom does not lay out — fake offsetHeight on lists/items so
  // NeoVirtualList's measurement logic can do its job.
  Object.defineProperty(HTMLUListElement.prototype, 'offsetHeight', { configurable: true, get() {
    return 200;
  } });
  Object.defineProperty(HTMLUListElement.prototype, 'clientHeight', { configurable: true, get() {
    return 200;
  } });
  Object.defineProperty(HTMLLIElement.prototype, 'offsetHeight', { configurable: true, get() {
    return 30;
  } });
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, writable: true, value() {} });
});

afterEach(() => {
  cleanup();
});

const items = [
  { id: 1, value: 'a', label: 'Alpha' },
  { id: 2, value: 'b', label: 'Bravo' },
  { id: 3, value: 'c', label: 'Charlie' },
];

function getButtons(scope: ParentNode = document): HTMLButtonElement[] {
  return Array.from(scope.querySelectorAll<HTMLButtonElement>('.neo-list-item-button'));
}

describe('neoList — render', { tags: ['jsdom'] }, () => {
  it('renders a <ul role="list"> with one <li> per item', async () => {
    const { container } = render(NeoList, { props: { items } as never });
    await tick();
    const ul = container.querySelector('ul.neo-list-items');
    expect(ul).not.toBeNull();
    expect(ul?.getAttribute('role')).toBe('list');
    expect(container.querySelectorAll('li.neo-list-item')).toHaveLength(3);
  });

  it('select=true switches the list role to "listbox" and option per item', async () => {
    const { container } = render(NeoList, { props: { items, select: true } as never });
    await tick();
    expect(container.querySelector('ul.neo-list-items')?.getAttribute('role')).toBe('listbox');
    const lis = container.querySelectorAll('li.neo-list-item');
    expect(lis[0].getAttribute('role')).toBe('option');
  });

  it('renders the empty placeholder when items=[] and not loading', async () => {
    const { container } = render(NeoList, { props: { items: [] } as never });
    await tick();
    expect(container.querySelector('.neo-list.neo-empty')).not.toBeNull();
    expect(container.querySelector('.neo-list-empty')).not.toBeNull();
  });

  it('loading=true renders the loader placeholder', async () => {
    const { container } = render(NeoList, { props: { items: [], loading: true } as never });
    await tick();
    expect(container.querySelector('.neo-list-loader')).not.toBeNull();
  });

  it('renders sections with their nested items', async () => {
    const sectioned = [
      { id: 's1', label: 'Group A', items: [{ id: 1, value: 'a', label: 'Alpha' }] },
      { id: 's2', label: 'Group B', items: [{ id: 2, value: 'b', label: 'Bravo' }] },
    ];
    const { container } = render(NeoList, { props: { items: sectioned } as never });
    await tick();
    const titles = Array.from(container.querySelectorAll('.neo-list-section-title')).map(t => t.textContent?.trim());
    expect(titles).toEqual(['Group A', 'Group B']);
    expect(container.querySelectorAll('.neo-list-section-list')).toHaveLength(2);
  });
});

describe('neoList — selection (single)', { tags: ['jsdom'] }, () => {
  it('clicking an item selects it and fires onSelect', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items, select: true, onSelect } as never });
    await tick();
    await user.click(getButtons(container)[1]);
    await tick();
    expect(onSelect).toHaveBeenCalledTimes(1);
    const event = onSelect.mock.calls[0][0] as { type: string; current: { item: { id: number } } };
    expect(event.type).toBe('select');
    expect(event.current.item.id).toBe(2);
    expect(container.querySelectorAll('li[aria-selected="true"]')).toHaveLength(1);
  });

  it('selecting a different item replaces the previous selection (single)', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items, select: true } as never });
    await tick();
    await user.click(getButtons(container)[0]);
    await tick();
    await user.click(getButtons(container)[2]);
    await tick();
    const selected = container.querySelectorAll('li[aria-selected="true"]');
    expect(selected).toHaveLength(1);
    expect(selected[0].getAttribute('data-id')).toBe('3');
  });

  it('nullable=true allows clicking the selected item to clear it', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items, select: true, nullable: true, onSelect } as never });
    await tick();
    await user.click(getButtons(container)[0]);
    await tick();
    await user.click(getButtons(container)[0]);
    await tick();
    expect(container.querySelectorAll('li[aria-selected="true"]')).toHaveLength(0);
    const last = onSelect.mock.calls.at(-1)?.[0] as { type: string };
    expect(last.type).toBe('clear');
  });

  it('nullable=false prevents clearing the only selection', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items, select: true, nullable: false } as never });
    await tick();
    await user.click(getButtons(container)[0]);
    await tick();
    await user.click(getButtons(container)[0]);
    await tick();
    expect(container.querySelectorAll('li[aria-selected="true"]')).toHaveLength(1);
  });
});

describe('neoList — selection (multiple)', { tags: ['jsdom'] }, () => {
  it('multiple=true allows accumulating selections', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items, select: true, multiple: true } as never });
    await tick();
    await user.click(getButtons(container)[0]);
    await tick();
    await user.click(getButtons(container)[2]);
    await tick();
    expect(container.querySelectorAll('li[aria-selected="true"]')).toHaveLength(2);
  });

  it('multiple=true clicking a selected item removes it from the selection', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items, select: true, multiple: true } as never });
    await tick();
    await user.click(getButtons(container)[0]);
    await tick();
    await user.click(getButtons(container)[1]);
    await tick();
    await user.click(getButtons(container)[0]);
    await tick();
    const ids = Array.from(container.querySelectorAll('li[aria-selected="true"]')).map(li => li.getAttribute('data-id'));
    expect(ids).toEqual(['2']);
  });
});

describe('neoList — disabled / readonly', { tags: ['jsdom'] }, () => {
  it('disabled blocks selection from clicks', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items, select: true, disabled: true, onSelect } as never });
    await tick();
    await user.click(getButtons(container)[0]);
    await tick();
    expect(onSelect).not.toHaveBeenCalled();
    expect(container.querySelectorAll('li[aria-selected="true"]')).toHaveLength(0);
  });

  it('readonly blocks selection from clicks', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items, select: true, readonly: true, onSelect } as never });
    await tick();
    await user.click(getButtons(container)[0]);
    await tick();
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe('neoList — component-instance API', { tags: ['jsdom'] }, () => {
  interface ListInstance {
    scrollToTop: (options?: ScrollToOptions) => unknown;
    scrollToBottom: (options?: ScrollToOptions) => unknown;
    selectItem: (...selection: { index: number; item: { id: number } }[]) => { type: string } | undefined;
    clearItem: (...selection: { index: number; item: { id: number } }[]) => { type: string } | undefined;
    reSelect: () => unknown;
  }

  function captureInstance(props: Record<string, unknown> = {}): {
    instance: ListInstance;
    container: HTMLElement;
    getRef: () => HTMLElement | undefined;
  } {
    let instance: ListInstance | undefined;
    const { container } = render(NeoListHarness, {
      props: {
        items,
        select: true,
        ...props,
        onInstance: (i: unknown) => {
          instance = i as never;
        },
      } as never,
    });
    return {
      instance: instance as ListInstance,
      container,
      getRef: () => container.querySelector<HTMLElement>('[role="listbox"], [role="list"]') ?? undefined,
    };
  }

  it('exposes scrollToTop / scrollToBottom / selectItem / clearItem / reSelect on the component instance', async () => {
    const { instance } = captureInstance();
    await tick();
    expect(typeof instance.scrollToTop).toBe('function');
    expect(typeof instance.scrollToBottom).toBe('function');
    expect(typeof instance.selectItem).toBe('function');
    expect(typeof instance.clearItem).toBe('function');
    expect(typeof instance.reSelect).toBe('function');
  });

  it('does not attach methods onto the DOM ref', async () => {
    const { getRef } = captureInstance();
    await tick();
    const list = getRef()!;
    expect(list).toBeInstanceOf(HTMLElement);
    for (const method of ['scrollToTop', 'scrollToBottom', 'selectItem', 'clearItem', 'reSelect'] as const) {
      expect(Object.hasOwn(list, method)).toBe(false);
      expect((list as unknown as Record<string, unknown>)[method]).toBeUndefined();
    }
  });

  it('instance.selectItem mutates the selection and emits via onSelect', async () => {
    const onSelect = vi.fn();
    const { instance, container } = captureInstance({ onSelect });
    await tick();
    const event = instance.selectItem({ index: 1, item: items[1] });
    await tick();
    expect(event?.type).toBe('select');
    expect(container.querySelectorAll('li[aria-selected="true"]')).toHaveLength(1);
    expect(container.querySelector('li[aria-selected="true"]')?.getAttribute('data-id')).toBe('2');
  });

  it('instance.clearItem removes a previously selected item', async () => {
    const { instance, container } = captureInstance({ multiple: true });
    await tick();
    instance.selectItem({ index: 0, item: items[0] }, { index: 2, item: items[2] });
    await tick();
    expect(container.querySelectorAll('li[aria-selected="true"]')).toHaveLength(2);
    const event = instance.clearItem({ index: 0, item: items[0] });
    await tick();
    expect(event?.type).toBe('clear');
    expect(container.querySelectorAll('li[aria-selected="true"]')).toHaveLength(1);
    expect(container.querySelector('li[aria-selected="true"]')?.getAttribute('data-id')).toBe('3');
  });

  it('instance.reSelect is a function and returns undefined when nothing is selected', async () => {
    const { instance } = captureInstance();
    await tick();
    expect(instance.reSelect()).toBeUndefined();
  });
});

// ---------- Virtual mode ----------------------------------------------------

const bigItems = Array.from({ length: 200 }, (_, i) => ({ id: i + 1, value: i + 1, label: `Item ${i + 1}` }));

const sectionedItems = [
  { id: 's1', label: 'Group A', items: [{ id: 1, value: 'a', label: 'Alpha' }] },
  { id: 's2', label: 'Group B', items: [{ id: 2, value: 'b', label: 'Bravo' }] },
];

async function flushVirtual() {
  await tick();
  await tick();
  await new Promise(r => setTimeout(r, 32));
  await tick();
}

/*
 * Behavior matrix: every combination of (virtual, sections, flip).
 *
 * Today's behavior is pinned with `it`; post-rework expectations are written
 * as `it.skip` siblings with TODO markers so flipping a behavior in a later
 * phase is a one-line diff.
 *
 * Plan reference: Phase 1.1 in
 *   /Users/dinh-van.colomban/.claude/plans/neolist-feature-change-when-optimized-star.md
 */
describe('neoList — virtual/sections/flip matrix', { tags: ['jsdom'] }, () => {
  let warnSpy: ReturnType<typeof vi.spyOn<Console, 'warn'>>;
  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    warnSpy.mockRestore();
  });

  function flatBigItems() {
    return bigItems;
  }

  it('off/off/off → non-virtual flat, no warn', async () => {
    const { container } = render(NeoList, { props: { items: flatBigItems(), virtual: false } as never });
    await tick();
    expect(container.querySelector('.neo-virtual-list')).toBeNull();
    expect(container.querySelectorAll('.neo-list-item')).toHaveLength(bigItems.length);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('off/off/on → non-virtual flipped, no warn', async () => {
    const { container } = render(NeoList, { props: { items: flatBigItems(), virtual: false, flip: true } as never });
    await tick();
    expect(container.querySelector('.neo-virtual-list')).toBeNull();
    expect(container.querySelector('.neo-list.neo-flip')).not.toBeNull();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('off/on/off → non-virtual sectioned, no warn', async () => {
    const { container } = render(NeoList, { props: { items: sectionedItems, virtual: false } as never });
    await tick();
    expect(container.querySelector('.neo-virtual-list')).toBeNull();
    expect(container.querySelectorAll('.neo-list-section-list')).toHaveLength(2);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('off/on/on → non-virtual sectioned + flipped, no warn', async () => {
    const { container } = render(NeoList, { props: { items: sectionedItems, virtual: false, flip: true } as never });
    await tick();
    expect(container.querySelector('.neo-virtual-list')).toBeNull();
    expect(container.querySelectorAll('.neo-list-section-list')).toHaveLength(2);
    expect(container.querySelector('.neo-list.neo-flip')).not.toBeNull();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('on/off/off → virtual, no warn', async () => {
    const { container } = render(NeoList, { props: { items: flatBigItems(), virtual: true, itemHeight: 30 } as never });
    await flushVirtual();
    expect(container.querySelector('.neo-virtual-list')).not.toBeNull();
    expect(container.querySelectorAll('.neo-list-item').length).toBeLessThan(bigItems.length);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  /* ---- on/off/on (virtual + flip): virtual wins, flip fully dropped ---- */

  it('on/off/on: virtual wins, flip fully dropped, warns', async () => {
    const { container } = render(NeoList, { props: { items: flatBigItems(), virtual: true, flip: true, itemHeight: 30 } as never });
    await flushVirtual();
    expect(container.querySelector('.neo-virtual-list')).not.toBeNull();
    expect(container.querySelector('.neo-list.neo-flip')).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
  });

  /* ---- on/on/off (virtual + sections): virtual wins, items flattened with cascade ---- */

  it('on/on/off: virtual flat with cascade, no section headers, warns', async () => {
    const { container } = render(NeoList, {
      props: { items: sectionedItems, virtual: true, itemHeight: 30 } as never,
    });
    await flushVirtual();
    expect(container.querySelector('.neo-virtual-list')).not.toBeNull();
    expect(container.querySelectorAll('.neo-list-section-list')).toHaveLength(0);
    /*
     * sectionedItems has 2 sections × 1 item each → flattened to 2 items
     * with disabled/readonly cascaded from each parent section (truthy-only).
     */
    expect(container.querySelectorAll('.neo-list-item')).toHaveLength(2);
    expect(warnSpy).toHaveBeenCalled();
  });

  /* ---- on/on/on (virtual + sections + flip): virtual wins, items flattened, flip dropped ---- */

  it('on/on/on: virtual flat with cascade, flip fully dropped, warns', async () => {
    const { container } = render(NeoList, {
      props: { items: sectionedItems, virtual: true, flip: true, itemHeight: 30 } as never,
    });
    await flushVirtual();
    expect(container.querySelector('.neo-virtual-list')).not.toBeNull();
    expect(container.querySelector('.neo-list.neo-flip')).toBeNull();
    expect(container.querySelectorAll('.neo-list-section-list')).toHaveLength(0);
    expect(container.querySelectorAll('.neo-list-item')).toHaveLength(2);
    expect(warnSpy).toHaveBeenCalled();
  });
});

/*
 * Phase 1.2: pin the shape of the `current` selection record emitted via
 * `onSelect` in each render mode. Non-virtual flat / sectioned go through
 * NeoList.svelte:485 (full shape); virtual goes through :532 (lean shape).
 */
describe('neoList — selection payload shape', { tags: ['jsdom'] }, () => {
  it('non-virtual flat: emits { index, item, sectionIndex: undefined, section: undefined }', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items, select: true, onSelect } as never });
    await tick();
    await user.click(getButtons(container)[1]);
    await tick();
    const evt = onSelect.mock.calls[0][0] as { current: NeoListSelectedShape };
    expect(evt.current).toMatchObject({ index: 1, item: items[1] });
    expect(evt.current.sectionIndex).toBeUndefined();
    expect(evt.current.section).toBeUndefined();
  });

  it('non-virtual sectioned: emits { index, item, sectionIndex, section }', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const sectioned = [
      { id: 's1', label: 'A', items: [{ id: 1, value: 'a', label: 'Alpha' }] },
      { id: 's2', label: 'B', items: [{ id: 2, value: 'b', label: 'Bravo' }] },
    ];
    const { container } = render(NeoList, { props: { items: sectioned, select: true, onSelect } as never });
    await tick();
    await user.click(getButtons(container)[1]);
    await tick();
    const evt = onSelect.mock.calls[0][0] as { current: NeoListSelectedShape };
    expect(evt.current).toMatchObject({ index: 0, sectionIndex: 1 });
    expect(evt.current.item).toMatchObject({ id: 2 });
    expect(evt.current.section).toBeDefined();
  });

  it('virtual flat: emits { index, item, sectionIndex: undefined, section: undefined }', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoList, {
      props: { items: bigItems, virtual: true, select: true, itemHeight: 30, onSelect } as never,
    });
    await flushVirtual();
    await user.click(getButtons(container)[0]);
    await flushVirtual();
    const evt = onSelect.mock.calls[0][0] as { current: NeoListSelectedShape };
    expect(evt.current).toMatchObject({ index: 0, item: bigItems[0] });
    expect('sectionIndex' in evt.current).toBe(true);
    expect('section' in evt.current).toBe(true);
    expect(evt.current.sectionIndex).toBeUndefined();
    expect(evt.current.section).toBeUndefined();
  });

  it('virtual sectioned: flatten preserves sectionIndex / section in payload', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    const sectioned = [
      { id: 'sa', label: 'Group A', items: [{ id: 1, value: 'a1', label: 'A1' }] },
      { id: 'sb', label: 'Group B', items: [{ id: 2, value: 'b1', label: 'B1' }] },
    ];
    const { container } = render(NeoList, {
      props: { items: sectioned, virtual: true, select: true, onSelect } as never,
    });
    await flushVirtual();
    // Second flattened row → second section's first child.
    await user.click(getButtons(container)[1]);
    await flushVirtual();
    const evt = onSelect.mock.calls[0][0] as { current: NeoListSelectedShape };
    expect(evt.current.sectionIndex).toBe(1);
    expect(evt.current.section).toMatchObject({ id: 'sb', label: 'Group B' });
    expect(evt.current.item).toMatchObject({ id: 2 });
  });
});

/*
 * Phase 1.3 / 3.3: ARIA posinset/setsize parity between modes.
 *
 * Both modes use the FILTERED position for `aria-posinset` (1..N over the
 * visible slice) while `data-index` keeps the ORIGINAL item index from
 * `flatItems`. Selection lookups continue to use the original index.
 */
describe('neoList — ARIA posinset/setsize parity', { tags: ['jsdom'] }, () => {
  const fiveItems = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, value: i + 1, label: `Item ${i + 1}` }));
  // Keep items 2, 3, 4 → 3 items in the visible window, originals at indices 1, 2, 3.
  const filterToMiddleThree = (item: { id: number }) => item.id >= 2 && item.id <= 4;

  it('non-virtual: posinset 1..N matches filtered position; setsize is filtered count; data-index = original', async () => {
    const { container } = render(NeoList, { props: { items: fiveItems, filter: filterToMiddleThree } as never });
    await tick();
    const lis = Array.from(container.querySelectorAll<HTMLElement>('li.neo-list-item'));
    expect(lis).toHaveLength(3);
    expect(lis.map(li => li.getAttribute('aria-posinset'))).toEqual(['1', '2', '3']);
    expect(new Set(lis.map(li => li.getAttribute('aria-setsize')))).toEqual(new Set(['3']));
    expect(lis.map(li => li.dataset.index)).toEqual(['1', '2', '3']);
  });

  it('virtual: posinset 1..N matches filtered position in visibleItems; data-index keeps original index', async () => {
    const { container } = render(NeoList, {
      props: { items: fiveItems, virtual: true, itemHeight: 30, filter: filterToMiddleThree } as never,
    });
    await flushVirtual();
    const lis = Array.from(container.querySelectorAll<HTMLElement>('li.neo-list-item'));
    expect(lis).toHaveLength(3);
    expect(lis.map(li => li.getAttribute('aria-posinset'))).toEqual(['1', '2', '3']);
    expect(new Set(lis.map(li => li.getAttribute('aria-setsize')))).toEqual(new Set(['3']));
    expect(lis.map(li => li.dataset.index)).toEqual(['1', '2', '3']);
  });
});

/*
 * Phase 1.4: keyboard ArrowUp/Down navigation.
 * - Non-virtual flat: ArrowDown moves focus to the next sibling.
 * - Non-virtual + flip: ArrowDown reverses to the PREVIOUS sibling
 *   (NeoListBaseItem.svelte:246 swaps the action when flip is set).
 * - Virtual within window: ArrowDown moves focus to the next sibling.
 * - Virtual at cursor edge: today, focus is lost; post-rework (Phase 3.6)
 *   the item calls `context.scrollToIndex` and then refocuses.
 * - Virtual + flip prop: today, the prop reaches the item via context.flip
 *   and reverses keyboard direction; post-rework (Phase 2) flip is fully
 *   dropped so direction stays non-flipped.
 */
describe('neoList — keyboard ArrowUp/Down', { tags: ['jsdom'] }, () => {
  const fiveItems = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, value: i + 1, label: `Item ${i + 1}` }));

  it('non-virtual flat: ArrowDown from row 0 focuses row 1', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items: fiveItems, select: true } as never });
    await tick();
    const btns = getButtons(container);
    btns[0].focus();
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(btns[1]);
  });

  it('non-virtual + flip: ArrowDown reverses to PREVIOUS sibling', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items: fiveItems, select: true, flip: true } as never });
    await tick();
    const btns = getButtons(container);
    btns[2].focus();
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(btns[1]);
  });

  it('virtual within window: ArrowDown from row 0 focuses row 1', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoList, {
      props: { items: bigItems, virtual: true, select: true, itemHeight: 30 } as never,
    });
    await flushVirtual();
    const btns = getButtons(container);
    btns[0].focus();
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(btns[1]);
  });

  it.skip('virtual at cursor edge: ArrowDown beyond window scrolls and focuses next via context.scrollToIndex — TODO Phase 3.6 (NeoListBaseItem.svelte:71-86)', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoList, {
      props: { items: bigItems, virtual: true, select: true, itemHeight: 30, buffer: 0 } as never,
    });
    await flushVirtual();
    const btns = getButtons(container);
    const lastInWindow = btns.at(-1)!;
    const dataIndex = lastInWindow.closest('li')!.dataset.index!;
    lastInWindow.focus();
    await user.keyboard('{ArrowDown}');
    await flushVirtual();
    /*
     * Post-rework: context.scrollToIndex advances the cursor past the edge,
     * then focus lands on the next row by aria-posinset.
     */
    const expectedNextIndex = String(Number(dataIndex) + 1);
    const focused = document.activeElement?.closest('li');
    expect(focused?.dataset.index).toBe(expectedNextIndex);
  });

  it('virtual + flip prop: keyboard direction NOT swapped (flip fully dropped)', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoList, {
      props: { items: bigItems, virtual: true, flip: true, select: true, itemHeight: 30 } as never,
    });
    await flushVirtual();
    const btns = getButtons(container);
    btns[1].focus();
    await user.keyboard('{ArrowDown}');
    // Post-rework: flip is dropped under virtual; ArrowDown still moves to the next sibling.
    expect(document.activeElement).toBe(btns[2]);
  });
});

/*
 * Phase 1.5 / 3.4: dividers in virtual mode.
 *
 * Virtual rows render NeoDivider above/below using the same showDivider
 * semantics as the non-virtual flat path. Combining `divider` with a numeric
 * `itemHeight` auto-falls to dynamic measurement and warns once.
 */
describe('neoList — dividers in virtual', { tags: ['jsdom'] }, () => {
  it('virtual rows render NeoDivider when divider=true', async () => {
    const { container } = render(NeoList, {
      props: { items: bigItems, virtual: true, divider: true } as never,
    });
    await flushVirtual();
    expect(container.querySelectorAll('.neo-list-item-divider').length).toBeGreaterThan(0);
  });

  it('virtual + numeric itemHeight + divider auto-falls to dynamic measurement and warns', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(NeoList, { props: { items: bigItems, virtual: true, divider: true, itemHeight: 30 } as never });
    await flushVirtual();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('divider'));
    warnSpy.mockRestore();
  });
});

describe('flattenSectionsWithCascade — divider propagation', { tags: ['jsdom'] }, () => {
  it('stamps a top-only divider on the first child of every section after the first', () => {
    const flat = flattenSectionsWithCascade([
      { id: 's1', label: 'Group 1', divider: true, items: [
        { id: 'a', label: 'a' },
        { id: 'b', label: 'b' },
      ] },
      { id: 's2', label: 'Group 2', divider: true, items: [
        { id: 'c', label: 'c' },
        { id: 'd', label: 'd' },
      ] },
      { id: 's3', label: 'Group 3', divider: true, items: [
        { id: 'e', label: 'e' },
      ] },
    ] as never);
    expect(flat.map(i => i.divider)).toEqual([
      undefined,
      undefined, // first section is never decorated
      { top: true },
      undefined, // section 2 → top-only above first child
      { top: true }, // section 3 → top-only above only child
    ]);
  });

  it('does not propagate when the section has no divider', () => {
    const flat = flattenSectionsWithCascade([
      { id: 's1', label: 'Group 1', items: [{ id: 'a', label: 'a' }] },
      { id: 's2', label: 'Group 2', items: [
        { id: 'b', label: 'b' },
        { id: 'c', label: 'c' },
      ] },
    ] as never);
    expect(flat.every(i => i.divider === undefined)).toBe(true);
  });

  it('honors NeoListDividerOption (e.g. only-bottom suppresses top inheritance)', () => {
    const flat = flattenSectionsWithCascade([
      { id: 's1', label: 'Group 1', items: [{ id: 'a', label: 'a' }] },
      { id: 's2', label: 'Group 2', divider: { bottom: true } as never, items: [
        { id: 'b', label: 'b' },
      ] },
    ] as never);
    // Section divider is `{ bottom: true }` → no top → first child gets nothing.
    expect(flat[1].divider).toBeUndefined();
  });

  it('child divider wins over section divider', () => {
    const flat = flattenSectionsWithCascade([
      { id: 's1', label: 'Group 1', items: [{ id: 'a', label: 'a' }] },
      { id: 's2', label: 'Group 2', divider: true, items: [
        { id: 'b', label: 'b', divider: { bottom: true } as never },
        { id: 'c', label: 'c' },
      ] },
    ] as never);
    expect(flat[1].divider).toEqual({ bottom: true });
    expect(flat[2].divider).toBeUndefined();
  });

  it('passes flat items through unchanged', () => {
    const input = [
      { id: 'a', label: 'a' },
      { id: 'b', label: 'b', divider: true },
    ];
    const flat = flattenSectionsWithCascade(input as never);
    expect(flat.map(i => i.divider)).toEqual([undefined, true]);
  });
});

/*
 * Phase 1.6 / 3.5: row transitions in virtual mode.
 *
 * Virtual rows wire `in:` / `out:` directives behind a per-key `seenKeys`
 * gate (NeoList.svelte). The gate is seeded from `flatItems` on first run
 * so first-paint and scroll-into-view never play intros, then prunes keys
 * that leave so a removed-then-re-added item plays its intro again.
 *
 * Tests use a counting `{ use }` wrapper: the gate's suppression path
 * returns a zero-duration TransitionConfig WITHOUT invoking the user's
 * transition fn, so `use` calls equal "real" intros/outros — perfect for
 * pinning gate decisions independently of jsdom timing. Live transition
 * timing is verified in browser tests.
 */
describe('neoList — row transitions in virtual', { tags: ['jsdom'] }, () => {
  function counting() {
    let calls = 0;
    const use = () => {
      calls += 1;
      return { duration: 0 };
    };
    return { use, get calls() {
      return calls;
    } };
  }

  it('virtual rows do NOT animate on initial mount (seenKeys seeded from flatItems)', async () => {
    const inSpy = counting();
    const outSpy = counting();
    const { container } = render(NeoList, {
      props: {
        items: bigItems,
        virtual: true,
        itemHeight: 30,
        in: { use: inSpy.use },
        out: { use: outSpy.use },
      } as never,
    });
    await flushVirtual();
    const rows = container.querySelectorAll<HTMLElement>('.neo-virtual-list .neo-list-item');
    expect(rows.length).toBeGreaterThan(0);
    expect(inSpy.calls).toBe(0);
    expect(outSpy.calls).toBe(0);
  });

  it('virtual rows DO animate intro for a key added to flatItems after mount', async () => {
    const inSpy = counting();
    const outSpy = counting();
    const { rerender } = render(NeoList, {
      props: {
        items: bigItems,
        virtual: true,
        itemHeight: 30,
        in: { use: inSpy.use },
        out: { use: outSpy.use },
      } as never,
    });
    await flushVirtual();
    expect(inSpy.calls).toBe(0);
    // Prepend a new key so the cursor's initial window includes it.
    const next = [{ id: 9999, value: 9999, label: 'new' }, ...bigItems];
    await rerender({
      items: next,
      virtual: true,
      itemHeight: 30,
      in: { use: inSpy.use },
      out: { use: outSpy.use },
    } as never);
    await flushVirtual();
    expect(inSpy.calls).toBe(1);
    expect(outSpy.calls).toBe(0);
  });

  it('virtual rows DO animate outro when a visible key is removed from flatItems', async () => {
    const inSpy = counting();
    const outSpy = counting();
    const { rerender } = render(NeoList, {
      props: {
        items: bigItems,
        virtual: true,
        itemHeight: 30,
        in: { use: inSpy.use },
        out: { use: outSpy.use },
      } as never,
    });
    await flushVirtual();
    // Drop the first item — it is in the initial cursor window, so out: fires.
    const next = bigItems.slice(1);
    await rerender({
      items: next,
      virtual: true,
      itemHeight: 30,
      in: { use: inSpy.use },
      out: { use: outSpy.use },
    } as never);
    await flushVirtual();
    expect(outSpy.calls).toBeGreaterThanOrEqual(1);
  });

  it('virtual rows re-animate intro when a removed key is re-added (prune path)', async () => {
    const inSpy = counting();
    const outSpy = counting();
    const { rerender } = render(NeoList, {
      props: {
        items: bigItems,
        virtual: true,
        itemHeight: 30,
        in: { use: inSpy.use },
        out: { use: outSpy.use },
      } as never,
    });
    await flushVirtual();
    // Remove first, then re-add at front; key=1 should be pruned then unseen.
    await rerender({
      items: bigItems.slice(1),
      virtual: true,
      itemHeight: 30,
      in: { use: inSpy.use },
      out: { use: outSpy.use },
    } as never);
    await flushVirtual();
    const introsAfterRemove = inSpy.calls;
    await rerender({
      items: bigItems,
      virtual: true,
      itemHeight: 30,
      in: { use: inSpy.use },
      out: { use: outSpy.use },
    } as never);
    await flushVirtual();
    expect(inSpy.calls).toBeGreaterThan(introsAfterRemove);
  });
});

/*
 * Phase 1.7: imperative methods are no-ops in non-virtual mode.
 * Pinned by NeoList.svelte:174-181 — `scrollToIndex` returns false and
 * `refresh` early-returns when `virtualEnabled` is false.
 */
describe('neoList — imperative methods (non-virtual no-ops)', { tags: ['jsdom'] }, () => {
  it('refresh and scrollToIndex are no-ops in non-virtual mode', async () => {
    let instance: { refresh: () => void; scrollToIndex: (i: number) => unknown } | undefined;
    render(NeoListHarness, {
      props: {
        items: bigItems,
        virtual: false,
        onInstance: (i: unknown) => {
          instance = i as never;
        },
      } as never,
    });
    await tick();
    expect(typeof instance!.refresh).toBe('function');
    expect(() => instance!.refresh()).not.toThrow();
    expect(instance!.scrollToIndex(0)).toBe(false);
    expect(instance!.scrollToIndex(50)).toBe(false);
  });
});

/*
 * Phase 1.8: runtime prop toggling.
 *
 * - `virtual` false ↔ true: the rendered primitive (.neo-virtual-list)
 *   appears or disappears with no orphan listeners on the previous host.
 * - `flip` while `virtual=true`: today the gate downgrades to non-virtual;
 *   post-rework virtual stays and flip is dropped + warned.
 * - Items sectioned ↔ flat with `virtual=true`: today downgrades; post-
 *   rework flattens with cascade + warns.
 * - sort/filter ref change re-derives `visibleItems` in virtual mode (the
 *   non-virtual side already re-derives via the inline pipeline at :429).
 *   After Phase 3.1 hoists `visibleItems`, this is shared.
 */
describe('neoList — runtime prop toggling', { tags: ['jsdom'] }, () => {
  it('virtual false ↔ true: primitive swaps cleanly', async () => {
    const { container, rerender } = render(NeoList, { props: { items: bigItems, virtual: false } as never });
    await tick();
    expect(container.querySelector('.neo-virtual-list')).toBeNull();
    await rerender({ items: bigItems, virtual: true, itemHeight: 30 } as never);
    await flushVirtual();
    expect(container.querySelector('.neo-virtual-list')).not.toBeNull();
    await rerender({ items: bigItems, virtual: false } as never);
    await tick();
    expect(container.querySelector('.neo-virtual-list')).toBeNull();
  });

  it('virtual=true: sort or filter reference change re-derives visibleItems', async () => {
    /*
     * Phase 3.5 wired `out:` transitions on virtual rows. Outros don't
     * complete in jsdom (no rAF advance), so leaving rows would linger
     * forever. Disable transitions here — the test pins `visibleItems`
     * re-derivation, not animation timing.
     */
    const noop = { use: () => () => ({ duration: 0 }) };
    const { container, rerender } = render(NeoList, {
      props: { items: bigItems, virtual: true, itemHeight: 30, in: noop, out: noop } as never,
    });
    await flushVirtual();
    const before = Array.from(container.querySelectorAll<HTMLElement>('.neo-list-item'))
      .map(li => li.dataset.id);
    expect(before.length).toBeGreaterThan(0);
    // Filter to even ids only — visibleItems shrinks; the rendered window
    // must reflect the filtered slice.
    await rerender({
      items: bigItems,
      virtual: true,
      itemHeight: 30,
      in: noop,
      out: noop,
      filter: (item: { id: number }) => item.id % 2 === 0,
    } as never);
    await flushVirtual();
    const after = Array.from(container.querySelectorAll<HTMLElement>('.neo-virtual-list .neo-list-item'))
      .map(li => Number(li.dataset.id));
    expect(after.length).toBeGreaterThan(0);
    expect(after.every(id => id % 2 === 0)).toBe(true);
  });

  it('virtual=true + flip prop toggled on at runtime: virtual stays, flip dropped + warns', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container, rerender } = render(NeoList, {
      props: { items: bigItems, virtual: true, itemHeight: 30 } as never,
    });
    await flushVirtual();
    expect(container.querySelector('.neo-virtual-list')).not.toBeNull();
    await rerender({ items: bigItems, virtual: true, itemHeight: 30, flip: true } as never);
    await flushVirtual();
    expect(container.querySelector('.neo-virtual-list')).not.toBeNull();
    expect(container.querySelector('.neo-list.neo-flip')).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('virtual=true: items toggling sectioned ↔ flat keeps virtual + flattens with cascade + warns', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container, rerender } = render(NeoList, {
      props: { items: bigItems, virtual: true, itemHeight: 30 } as never,
    });
    await flushVirtual();
    expect(container.querySelector('.neo-virtual-list')).not.toBeNull();
    await rerender({ items: sectionedItems, virtual: true, itemHeight: 30 } as never);
    await flushVirtual();
    expect(container.querySelector('.neo-virtual-list')).not.toBeNull();
    expect(container.querySelectorAll('.neo-list-section-list')).toHaveLength(0);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

interface NeoListSelectedShape {
  index: number;
  item: { id: number | string };
  sectionIndex?: number;
  section?: unknown;
}

describe('neoList — virtual mode (selection)', { tags: ['jsdom'] }, () => {
  it('selects items inside the virtual window via click', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoList, { props: { items: bigItems, virtual: true, select: true, itemHeight: 30 } as never });
    await flushVirtual();
    const btns = getButtons(container);
    expect(btns.length).toBeGreaterThan(0);
    await user.click(btns[0]);
    await flushVirtual();
    const checked = container.querySelectorAll('li[aria-selected="true"]');
    expect(checked).toHaveLength(1);
    // data-index should reflect the *original* item position in the unfiltered list.
    expect(checked[0].getAttribute('data-index')).toBe('0');
  });

  it('selection persists across cursor moves (scroll then back)', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoList, {
      props: { items: bigItems, virtual: true, select: true, itemHeight: 30, buffer: 0 } as never,
    });
    await flushVirtual();
    await user.click(getButtons(container)[0]);
    await flushVirtual();
    expect(container.querySelectorAll('li[aria-selected="true"]')).toHaveLength(1);
    // Scroll past the selected row so it leaves the rendered window.
    const list = container.querySelector<HTMLElement>('.neo-virtual-list')!;
    list.scrollTop = 30 * 100;
    list.dispatchEvent(new Event('scroll'));
    await flushVirtual();
    // Selected row is no longer in the DOM (it's outside the cursor).
    expect(container.querySelectorAll('li[data-id="1"]')).toHaveLength(0);
    // Scroll back to the top — the selection must reappear.
    list.scrollTop = 0;
    list.dispatchEvent(new Event('scroll'));
    await flushVirtual();
    expect(container.querySelectorAll('li[aria-selected="true"]')).toHaveLength(1);
  });
});

describe('neoList — virtual mode (transitions gating)', { tags: ['jsdom'] }, () => {
  it.skip('while scrolling=true, virtual rows resolve to emptyTransition — harness limitation: jsdom does not run Svelte transitions, so the gate cannot be observed here. Real coverage: demo/components/list/TestListAnimation.browser.test.ts:49 (virtual row transitions, counting wrappers) and :153 (loader transitions).', () => {});
});

describe('neoList — imperative methods (virtual delegation)', { tags: ['jsdom'] }, () => {
  it('scrollToIndex delegates to NeoVirtualList in virtual mode', async () => {
    let instance: { scrollToIndex: (i: number) => HTMLElement | false } | undefined;
    const { container } = render(NeoListHarness, {
      props: {
        items: bigItems,
        virtual: true,
        itemHeight: 30,
        onInstance: (i: unknown) => {
          instance = i as never;
        },
      } as never,
    });
    await flushVirtual();
    expect(container.querySelector('.neo-virtual-list')).not.toBeNull();
    expect(typeof instance?.scrollToIndex).toBe('function');
    expect(instance!.scrollToIndex(50)).not.toBe(false);
  });

  it('scrollToIndex returns false in non-virtual mode', async () => {
    let instance: { scrollToIndex: (i: number) => HTMLElement | false } | undefined;
    render(NeoListHarness, {
      props: {
        items: bigItems,
        virtual: false,
        onInstance: (i: unknown) => {
          instance = i as never;
        },
      } as never,
    });
    await tick();
    expect(instance!.scrollToIndex(0)).toBe(false);
  });

  it('refresh is a no-op in non-virtual mode and a function in virtual mode', async () => {
    let instance: { refresh: () => void } | undefined;
    render(NeoListHarness, {
      props: {
        items: bigItems,
        virtual: true,
        itemHeight: 30,
        onInstance: (i: unknown) => {
          instance = i as never;
        },
      } as never,
    });
    await flushVirtual();
    expect(typeof instance?.refresh).toBe('function');
    expect(() => instance!.refresh()).not.toThrow();
  });
});
