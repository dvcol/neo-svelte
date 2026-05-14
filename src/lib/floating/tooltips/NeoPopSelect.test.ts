import { cleanup } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithPortalTarget } from '../../../../test/helpers/render.js';
import Harness from './NeoPopSelectHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getTooltip(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-tooltip');
}

function getOptions(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[role="option"].neo-list-item:not(.neo-list-loader)'),
  );
}

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('neoPopSelect — render', () => {
  it('renders the trigger element from children', () => {
    const { getByTestId } = renderWithPortalTarget(Harness, { items });
    expect(getByTestId('trigger-button').textContent).toBe('open select');
  });

  it('keeps the tooltip mounted (unmountOnClose=false) but hidden when closed', async () => {
    renderWithPortalTarget(Harness, { items, open: false });
    await tick();
    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip?.hasAttribute('hidden')).toBe(true);
  });

  it('reveals the list when opened', async () => {
    renderWithPortalTarget(Harness, { items, open: true });
    await tick();
    const options = getOptions();
    expect(options.length).toBe(items.length);
    expect(options.map(o => o.textContent?.trim())).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('renders nothing list-like when items array is empty (empty state)', async () => {
    renderWithPortalTarget(Harness, { items: [], open: true });
    await tick();
    expect(getOptions()).toHaveLength(0);
    // empty state placeholder is rendered inside the list
    const empty = document.querySelector('.neo-list-empty-content');
    expect(empty).not.toBeNull();
  });
});

describe('neoPopSelect — search', () => {
  it('does not render the search input when search=false (default)', async () => {
    renderWithPortalTarget(Harness, { items, open: true, search: false });
    await tick();
    expect(document.querySelector('.neo-list-search')).toBeNull();
  });

  it('renders the search input when search=true', async () => {
    renderWithPortalTarget(Harness, { items, open: true, search: true });
    await tick();
    expect(document.querySelector('.neo-list-search')).not.toBeNull();
  });
});

describe('neoPopSelect — multiple', () => {
  it('selecting two options replaces the previous one when multiple is omitted (default single-select)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { items, open: true, onChange });
    await tick();
    const options = getOptions();
    const click = async (i: number): Promise<void> => {
      const btn = options[i].querySelector<HTMLElement>('button, [role="button"]') ?? options[i];
      await user.click(btn);
    };
    await click(0);
    await click(1);
    const last = onChange.mock.calls.at(-1) as [unknown, unknown];
    expect(last[0]).toBe('banana');
  });

  it('selecting two options accumulates them when multiple=true', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { items, open: true, multiple: true, onChange });
    await tick();
    const options = getOptions();
    const click = async (i: number): Promise<void> => {
      const btn = options[i].querySelector<HTMLElement>('button, [role="button"]') ?? options[i];
      await user.click(btn);
    };
    await click(0);
    await click(1);
    const last = onChange.mock.calls.at(-1) as [unknown];
    expect(last[0]).toEqual(['apple', 'banana']);
  });

  it('search and multiple compose: search input visible AND multi-select accumulates', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, {
      items,
      open: true,
      search: true,
      multiple: true,
      onChange,
    });
    await tick();
    expect(document.querySelector('.neo-list-search')).not.toBeNull();
    const options = getOptions();
    const click = async (i: number): Promise<void> => {
      const btn = options[i].querySelector<HTMLElement>('button, [role="button"]') ?? options[i];
      await user.click(btn);
    };
    await click(0);
    await click(2);
    const last = onChange.mock.calls.at(-1) as [unknown];
    expect(last[0]).toEqual(['apple', 'cherry']);
  });
});

describe('neoPopSelect — selection', () => {
  it('fires onSelect and onChange with the selected value when an option is clicked', async () => {
    const onSelect = vi.fn();
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(Harness, { items, open: true, onSelect, onChange });
    await tick();
    const [first] = getOptions();
    expect(first).toBeDefined();
    const button = first.querySelector<HTMLElement>('button, [role="button"]') ?? first;
    await user.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    const [current] = onChange.mock.calls[0] as [unknown];
    expect(current).toBe('apple');
  });
});

describe('neoPopSelect — items reactivity', () => {
  it('renders the new option set when items prop changes', async () => {
    const { rerender } = renderWithPortalTarget(Harness, { items, open: true });
    await tick();
    expect(getOptions()).toHaveLength(3);
    await rerender({ items: [...items, { value: 'date', label: 'Date' }], open: true });
    await tick();
    expect(getOptions()).toHaveLength(4);
    expect(getOptions()[3].textContent?.trim()).toBe('Date');
  });
});
