import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoVirtualListHarness from './NeoVirtualList.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoVirtualList — render', { tags: ['jsdom'] }, () => {
  it('renders the before slot when cursor.start === 0', async () => {
    const items = [{ id: 1 }];
    const { container } = render(NeoVirtualListHarness, { props: { items, before: true } as never });
    await tick();
    expect(container.querySelector('.neo-virtual-list-before')).not.toBeNull();
  });

  it('renders the after slot when cursor.end === items.length', async () => {
    const items = [{ id: 1 }];
    const { container } = render(NeoVirtualListHarness, { props: { items, after: true } as never });
    await tick();
    await tick();
    await tick();
    await new Promise(r => setTimeout(r, 50));
    expect(container.querySelector('.neo-virtual-list-after')).not.toBeNull();
  });

  it('scrollbar=true adds .neo-scroll, false omits it', async () => {
    const { container, rerender } = render(NeoVirtualListHarness, { props: { items: [{ id: 1 }], scrollbar: true } as never });
    await tick();
    expect(container.querySelector('.neo-virtual-list.neo-scroll')).not.toBeNull();
    await rerender({ items: [{ id: 1 }], scrollbar: false } as never);
    await tick();
    expect(container.querySelector('.neo-virtual-list.neo-scroll')).toBeNull();
  });

  it('shadow=true adds .neo-shadow, false omits it', async () => {
    const { container, rerender } = render(NeoVirtualListHarness, { props: { items: [{ id: 1 }], shadow: true } as never });
    await tick();
    expect(container.querySelector('.neo-virtual-list.neo-shadow')).not.toBeNull();
    await rerender({ items: [{ id: 1 }], shadow: false } as never);
    await tick();
    expect(container.querySelector('.neo-virtual-list.neo-shadow')).toBeNull();
  });

  it('dim=true adds .neo-dim on the contents wrapper', async () => {
    const { container } = render(NeoVirtualListHarness, { props: { items: [{ id: 1 }], dim: true } as never });
    await tick();
    expect(container.querySelector('.neo-virtual-list-contents.neo-dim')).not.toBeNull();
  });
});
