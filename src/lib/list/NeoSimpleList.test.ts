import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoSimpleList from './NeoSimpleList.svelte';
import NeoSimpleListHarness from './NeoSimpleList.test.svelte';

afterEach(() => {
  cleanup();
});

const sampleItems = [
  { id: 1, value: 'a', label: 'Alpha' },
  { id: 2, value: 'b', label: 'Bravo' },
  { id: 3, value: 'c', label: 'Charlie' },
];

describe('neoSimpleList — render', { tags: ['jsdom'] }, () => {
  it('renders the empty placeholder when items=[] and not loading', async () => {
    const { container } = render(NeoSimpleList, { props: { items: [] } as never });
    await tick();
    expect(container.querySelector('.neo-list.neo-empty')).not.toBeNull();
    expect(container.querySelector('.neo-list-empty')).not.toBeNull();
    expect(container.textContent).toContain('No items');
  });

  it('loading=true renders the loader region even with empty items', async () => {
    const { container } = render(NeoSimpleList, { props: { items: [], loading: true } as never });
    await tick();
    expect(container.querySelector('.neo-list-loader')).not.toBeNull();
  });

  it('flip=true adds .neo-flip on the outer container', async () => {
    const { container } = render(NeoSimpleList, { props: { items: sampleItems, flip: true } as never });
    await tick();
    expect(container.querySelector('.neo-list.neo-flip')).not.toBeNull();
  });

  it('filter that excludes every item collapses to the empty placeholder', async () => {
    const filter = () => false;
    const { container } = render(NeoSimpleList, { props: { items: sampleItems, filter } as never });
    await tick();
    expect(container.querySelector('.neo-list.neo-empty')).not.toBeNull();
    expect(container.querySelector('.neo-list-empty')).not.toBeNull();
  });

  it('all items hidden falls back to the empty placeholder via the default filter', async () => {
    const items = sampleItems.map(item => ({ ...item, hidden: true }));
    const { container } = render(NeoSimpleList, { props: { items } as never });
    await tick();
    expect(container.querySelector('.neo-list.neo-empty')).not.toBeNull();
  });
});

describe('neoSimpleList — component-instance API', { tags: ['jsdom'] }, () => {
  interface SimpleListInstance {
    scrollToTop: (options?: ScrollToOptions) => unknown;
    scrollToBottom: (options?: ScrollToOptions) => unknown;
  }

  function captureInstance(props: Record<string, unknown> = {}): {
    instance: SimpleListInstance;
    container: HTMLElement;
    getRef: () => HTMLElement | undefined;
  } {
    let instance: SimpleListInstance | undefined;
    let ref: HTMLElement | undefined;
    const { container } = render(NeoSimpleListHarness, {
      props: {
        items: sampleItems,
        ...props,
        onInstance: (i: unknown) => {
          instance = i as never;
        },
        ref,
      } as never,
    });
    // Find the outermost ref-bound element (NeoSimpleList binds ref onto the
    // inner list element which carries `[role="list"]`).
    return {
      instance: instance as SimpleListInstance,
      container,
      getRef: () => ref ?? container.querySelector<HTMLElement>('[role="list"]') ?? undefined,
    };
  }

  it('exposes scrollToTop / scrollToBottom on the component instance', async () => {
    const { instance } = captureInstance();
    await tick();
    expect(typeof instance.scrollToTop).toBe('function');
    expect(typeof instance.scrollToBottom).toBe('function');
  });

  it('does not attach scrollToTop / scrollToBottom onto the DOM ref', async () => {
    const { getRef } = captureInstance();
    await tick();
    const list = getRef()!;
    expect(list).toBeInstanceOf(HTMLElement);
    for (const method of ['scrollToTop', 'scrollToBottom'] as const) {
      expect(Object.hasOwn(list, method)).toBe(false);
      expect((list as unknown as Record<string, unknown>)[method]).toBeUndefined();
    }
  });
});
