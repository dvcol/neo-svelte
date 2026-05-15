import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import { itemLabelSort, itemSearchFilter } from './neo-list-search.model.js';
import NeoListSearch from './NeoListSearch.svelte';

afterEach(() => {
  cleanup();
});

function getInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-input');
}

describe('neoListSearch — render', { tags: ['jsdom'] }, () => {
  it('renders a type=search input with the default placeholder', async () => {
    const { container } = render(NeoListSearch, {});
    await tick();
    const input = getInput(container);
    expect(input?.type).toBe('search');
    expect(input?.placeholder).toBe('Search...');
  });

  it('renders the sort toggle button by default', async () => {
    const { container } = render(NeoListSearch, {});
    await tick();
    expect(container.querySelector('button[aria-label="Change sorting order"]')).not.toBeNull();
  });

  it('sort=false omits the sort toggle button', async () => {
    const { container } = render(NeoListSearch, { props: { sort: false } as never });
    await tick();
    expect(container.querySelector('button[aria-label="Change sorting order"]')).toBeNull();
  });

  it('placeholder prop overrides the default', async () => {
    const { container } = render(NeoListSearch, { props: { placeholder: 'Find...' } as never });
    await tick();
    expect(getInput(container)?.placeholder).toBe('Find...');
  });
});

describe('neoListSearch — filter / sort wiring', { tags: ['jsdom'] }, () => {
  it('typing updates context.highlight after the debounce delay', async () => {
    const context = {
      items: [],
      highlight: undefined as string | undefined,
      filter: () => true,
      sort: () => 0,
    } as never;
    const user = userEvent.setup();
    const { container } = render(NeoListSearch, { props: { context, delay: 0 } as never });
    await tick();
    await user.type(getInput(container)!, 'foo');
    await new Promise(resolve => setTimeout(resolve, 30));
    expect((context as { highlight?: string }).highlight).toBe('foo');
  });

  it('clicking the sort button cycles invert from undefined → true → false → undefined', async () => {
    const context = {
      items: [],
      highlight: undefined as string | undefined,
      filter: () => true,
      sort: () => 0,
    } as never;
    const user = userEvent.setup();
    let invert: boolean | undefined;
    const { container } = render(NeoListSearch, {
      props: {
        context,
        get invert() {
          return invert;
        },
        set invert(v: boolean | undefined) {
          invert = v;
        },
      } as never,
    });
    await tick();
    const btn = container.querySelector<HTMLButtonElement>('button[aria-label="Change sorting order"]')!;
    await user.click(btn);
    await tick();
    expect(invert).toBe(true);
    await user.click(btn);
    await tick();
    expect(invert).toBe(false);
    await user.click(btn);
    await tick();
    expect(invert).toBeUndefined();
  });
});

describe('itemSearchFilter', { tags: ['jsdom'] }, () => {
  it('returns true when the search string is empty', () => {
    expect(itemSearchFilter({ value: 'x', label: 'Alpha' }, '')).toBe(true);
    expect(itemSearchFilter({ value: 'x', label: 'Alpha' })).toBe(true);
  });

  it('matches case-insensitively against label and description', () => {
    expect(itemSearchFilter({ value: 'x', label: 'Alpha' }, 'alp')).toBe(true);
    expect(itemSearchFilter({ value: 'x', label: 'Alpha', description: 'A first letter' }, 'first')).toBe(true);
    expect(itemSearchFilter({ value: 'x', label: 'Alpha' }, 'zzz')).toBe(false);
  });

  it('hidden items are filtered out', () => {
    expect(itemSearchFilter({ value: 'x', label: 'Alpha', hidden: true })).toBe(false);
  });

  it('section matches when any nested item matches', () => {
    const section = { items: [{ value: 'x', label: 'Alpha' }, { value: 'y', label: 'Bravo' }] } as never;
    expect(itemSearchFilter(section, 'br')).toBe(true);
    expect(itemSearchFilter(section, 'zzz')).toBe(false);
  });
});

describe('itemLabelSort', { tags: ['jsdom'] }, () => {
  const a = { value: 'a', label: 'Alpha' } as never;
  const b = { value: 'b', label: 'Bravo' } as never;

  it('returns 0 when either label is missing', () => {
    expect(itemLabelSort({ value: 'x' }, b)).toBe(0);
    expect(itemLabelSort(a, { value: 'y' })).toBe(0);
  });

  it('default order sorts descending alphabetically', () => {
    expect(itemLabelSort(a, b)).toBeGreaterThan(0);
  });

  it('reverse=true flips to ascending order', () => {
    expect(itemLabelSort(a, b, true)).toBeLessThan(0);
  });
});
