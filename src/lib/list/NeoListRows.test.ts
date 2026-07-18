import type { NeoListRowsProps, NeoListVisibleItem } from './neo-list-rows.model.js';
import type { NeoListItemOrSection } from './neo-list.model.js';

import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoListRows from './NeoListRows.svelte';

afterEach(() => {
  cleanup();
});

const instant = () => ({ duration: 0 });

function renderRows(
  items: NeoListItemOrSection[],
  visible: NeoListVisibleItem[],
  overrides: Partial<NeoListRowsProps> = {},
) {
  return render(NeoListRows, {
    props: {
      items,
      visible,
      context: {},
      animateFn: instant,
      inFn: instant,
      outFn: instant,
      skipOffscreen: () => false,
      observe: () => {},
      isChecked: () => false,
      filter: () => true,
      sort: () => 0,
      ...overrides,
    } as never,
  });
}

describe('neoListRows — non-virtual collection', { tags: ['jsdom'] }, () => {
  it('renders the supplied visible order with original indices and positional ARIA', async () => {
    const items = [
      { id: 'alpha', value: 'a', label: 'Alpha' },
      { id: 'bravo', value: 'b', label: 'Bravo' },
      { id: 'charlie', value: 'c', label: 'Charlie' },
    ];
    const visible = [{ item: items[2], index: 2 }, { item: items[0], index: 0 }];
    const isChecked = vi.fn(({ index }) => index === 2);
    const { container } = renderRows(items, visible, { select: true, isChecked });
    await tick();

    const rows = Array.from(container.querySelectorAll<HTMLElement>(':scope > .neo-list-item'));
    expect(rows.map(row => row.dataset.id)).toEqual(['charlie', 'alpha']);
    expect(rows.map(row => row.dataset.index)).toEqual(['2', '0']);
    expect(rows.map(row => row.getAttribute('aria-posinset'))).toEqual(['1', '2']);
    expect(rows.map(row => row.getAttribute('aria-setsize'))).toEqual(['2', '2']);
    expect(rows.map(row => row.getAttribute('aria-selected'))).toEqual(['true', 'false']);
  });

  it('filters and sorts items independently inside sections', async () => {
    const section = {
      id: 'section',
      label: 'Section',
      items: [
        { id: 'alpha', value: 'a', label: 'Alpha', hidden: true },
        { id: 'bravo', value: 'b', label: 'Bravo' },
        { id: 'charlie', value: 'c', label: 'Charlie' },
      ],
    };
    const filter = (item: NeoListItemOrSection) => !item.hidden;
    const sort = (a: NeoListItemOrSection, b: NeoListItemOrSection) => (b.label ?? '').localeCompare(a.label ?? '');
    const { container } = renderRows([section], [{ item: section, index: 0 }], { sections: true, filter, sort });
    await tick();

    const nestedRows = Array.from(container.querySelectorAll<HTMLElement>('.neo-list-section-list > .neo-list-item'));
    expect(nestedRows.map(row => row.dataset.id)).toEqual(['charlie', 'bravo']);
    expect(nestedRows.map(row => row.dataset.index)).toEqual(['2', '1']);
  });

  it('places a global divider before every row after the first', async () => {
    const items = [
      { id: 'alpha', value: 'a', label: 'Alpha' },
      { id: 'bravo', value: 'b', label: 'Bravo' },
      { id: 'charlie', value: 'c', label: 'Charlie' },
    ];
    const visible = items.map((item, index) => ({ item, index }));
    const { container } = renderRows(items, visible, { divider: true });
    await tick();

    const rows = Array.from(container.querySelectorAll<HTMLElement>(':scope > .neo-list-item'));
    expect(rows.map(row => row.querySelectorAll(':scope > .neo-list-item-divider').length)).toEqual([0, 1, 1]);
  });

  it('renders its empty state when no visible rows remain', async () => {
    const { container } = renderRows([], []);
    await tick();
    expect(container.querySelector('.neo-list-empty-content')?.textContent).toContain('No items');
  });
});
