import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoSimpleList from './NeoSimpleList.svelte';

afterEach(() => {
  cleanup();
});

const sampleItems = [
  { id: 1, value: 'a', label: 'Alpha' },
  { id: 2, value: 'b', label: 'Bravo' },
  { id: 3, value: 'c', label: 'Charlie' },
];

describe('neoSimpleList — render', () => {
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
