import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoList from './NeoList.svelte';
import NeoListHarness from './NeoList.test.svelte';

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
