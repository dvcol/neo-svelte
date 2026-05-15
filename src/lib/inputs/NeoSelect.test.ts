import { renderWithPortalTarget } from 'test/helpers/render.js';

import { cleanup } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoSelect from './NeoSelect.svelte';

afterEach(() => {
  cleanup();
});

function getToggle(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-select-toggle');
}

function getOptions(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[role="option"].neo-list-item:not(.neo-list-loader)'),
  );
}

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('neoSelect — render', { tags: ['jsdom'] }, () => {
  it('renders the toggle button with aria-label', () => {
    renderWithPortalTarget(NeoSelect as never, { options });
    const toggle = getToggle();
    expect(toggle).not.toBeNull();
    expect(toggle?.getAttribute('aria-label')).toBe('Toggle select dropdown');
  });

  it('keeps the popover mounted but hidden when closed (unmountOnClose default)', async () => {
    renderWithPortalTarget(NeoSelect as never, { options, open: false });
    await tick();
    const tooltip = document.querySelector<HTMLElement>('.neo-tooltip');
    expect(tooltip).not.toBeNull();
    expect(tooltip?.hasAttribute('hidden')).toBe(true);
  });

  it('reveals the option list when opened', async () => {
    renderWithPortalTarget(NeoSelect as never, { options, open: true });
    await tick();
    const items = getOptions();
    expect(items).toHaveLength(options.length);
    expect(items.map(o => o.textContent?.trim())).toEqual(['Apple', 'Banana', 'Cherry']);
  });
});

describe('neoSelect — toggle (disabled / readonly matrix)', { tags: ['jsdom'] }, () => {
  it('clicking the toggle button opens the popover when neither disabled nor readonly', async () => {
    const user = userEvent.setup();
    renderWithPortalTarget(NeoSelect as never, { options });
    await tick();
    const tooltip = document.querySelector<HTMLElement>('.neo-tooltip');
    expect(tooltip?.hasAttribute('hidden')).toBe(true);
    await user.click(getToggle()!);
    await tick();
    expect(tooltip?.hasAttribute('hidden')).toBe(false);
  });

  it('does not toggle when disabled=true', async () => {
    const user = userEvent.setup();
    renderWithPortalTarget(NeoSelect as never, { options, disabled: true });
    await tick();
    const tooltip = document.querySelector<HTMLElement>('.neo-tooltip');
    await user.click(getToggle()!);
    await tick();
    expect(tooltip?.hasAttribute('hidden')).toBe(true);
  });

  it('does not toggle when readonly=true', async () => {
    const user = userEvent.setup();
    renderWithPortalTarget(NeoSelect as never, { options, readonly: true });
    await tick();
    const tooltip = document.querySelector<HTMLElement>('.neo-tooltip');
    await user.click(getToggle()!);
    await tick();
    expect(tooltip?.hasAttribute('hidden')).toBe(true);
  });
});

describe('neoSelect — selection', { tags: ['jsdom'] }, () => {
  it('clicking an option fires onSelect and onChange with the option value', async () => {
    const onSelect = vi.fn();
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(NeoSelect as never, { options, open: true, onSelect, onChange });
    await tick();
    const [first] = getOptions();
    const button = first.querySelector<HTMLElement>('button, [role="button"]') ?? first;
    await user.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    const [current] = onChange.mock.calls[0] as [unknown];
    expect(current).toBe('apple');
  });
});

describe('neoSelect — search', { tags: ['jsdom'] }, () => {
  it('does not render the search input when search=false (default)', async () => {
    renderWithPortalTarget(NeoSelect as never, { options, open: true, search: false });
    await tick();
    expect(document.querySelector('.neo-list-search')).toBeNull();
  });

  it('renders the search input when search=true', async () => {
    renderWithPortalTarget(NeoSelect as never, { options, open: true, search: true });
    await tick();
    expect(document.querySelector('.neo-list-search')).not.toBeNull();
  });
});

describe('neoSelect — multiple', { tags: ['jsdom'] }, () => {
  it('selecting two options replaces the previous one when multiple is omitted (default single-select)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(NeoSelect as never, { options, open: true, onChange });
    await tick();
    const items = getOptions();
    const click = async (i: number): Promise<void> => {
      const btn = items[i].querySelector<HTMLElement>('button, [role="button"]') ?? items[i];
      await user.click(btn);
    };
    await click(0);
    await click(1);
    const last = onChange.mock.calls.at(-1) as [unknown];
    expect(last[0]).toBe('banana');
  });

  it('selecting two options accumulates them when multiple=true', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithPortalTarget(NeoSelect as never, { options, open: true, multiple: true, onChange });
    await tick();
    const items = getOptions();
    const click = async (i: number): Promise<void> => {
      const btn = items[i].querySelector<HTMLElement>('button, [role="button"]') ?? items[i];
      await user.click(btn);
    };
    await click(0);
    await click(1);
    const last = onChange.mock.calls.at(-1) as [unknown];
    expect(last[0]).toEqual(['apple', 'banana']);
  });
});

describe('neoSelect — clearable', { tags: ['jsdom'] }, () => {
  it('does not render a clear affix when clearable=false (default) even after selecting', async () => {
    const user = userEvent.setup();
    renderWithPortalTarget(NeoSelect as never, { options, clearable: false, open: true, multiple: true });
    await tick();
    const [first] = getOptions();
    const button = first.querySelector<HTMLElement>('button, [role="button"]') ?? first;
    await user.click(button);
    await tick();
    expect(document.querySelector('.neo-affix-clear')).toBeNull();
  });

  it('renders a clear affix when clearable=true with a selection while the popover is open', async () => {
    const user = userEvent.setup();
    renderWithPortalTarget(NeoSelect as never, { options, clearable: true, open: true, multiple: true });
    await tick();
    const [first] = getOptions();
    const button = first.querySelector<HTMLElement>('button, [role="button"]') ?? first;
    await user.click(button);
    await tick();
    // Affix render is debounced (100ms) — wait for it.
    await new Promise(r => setTimeout(r, 150));
    expect(document.querySelector('.neo-affix-clear')).not.toBeNull();
  });
});

describe('neoSelect — items reactivity', { tags: ['jsdom'] }, () => {
  it('renders the new option set when options prop changes', async () => {
    const { rerender } = renderWithPortalTarget(NeoSelect as never, { options, open: true });
    await tick();
    expect(getOptions()).toHaveLength(3);
    await rerender({ options: [...options, { value: 'date', label: 'Date' }], open: true });
    await tick();
    expect(getOptions()).toHaveLength(4);
    expect(getOptions()[3].textContent?.trim()).toBe('Date');
  });
});
