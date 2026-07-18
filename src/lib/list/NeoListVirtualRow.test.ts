import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoListVirtualRowHarness from './NeoListVirtualRow.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoListVirtualRow — virtual item boundary', { tags: ['jsdom'] }, () => {
  it('owns the virtual row metadata and registers the outer element', async () => {
    const onRegister = vi.fn();
    const item = { id: 'alpha', value: 'a', label: 'Alpha' };
    const { container } = render(NeoListVirtualRowHarness, {
      props: { item, id: item.id, index: 5, virtualIndex: 2, setSize: 40, checked: true, select: true, onRegister } as never,
    });
    await tick();

    const row = container.querySelector<HTMLElement>('.neo-list-item');
    expect(onRegister).toHaveBeenCalledWith(row);
    expect(row?.dataset.id).toBe('alpha');
    expect(row?.dataset.index).toBe('5');
    expect(row?.getAttribute('aria-posinset')).toBe('3');
    expect(row?.getAttribute('aria-setsize')).toBe('40');
    expect(row?.getAttribute('aria-selected')).toBe('true');
  });

  it('uses the configured item renderer and owns both divider positions', async () => {
    const item = { id: 'bravo', value: 'b', label: 'Bravo' };
    const { container } = render(NeoListVirtualRowHarness, {
      props: {
        item,
        id: item.id,
        index: 7,
        virtualIndex: 1,
        setSize: 3,
        checked: false,
        customItem: true,
        dividerTop: true,
        dividerBottom: true,
      } as never,
    });
    await tick();

    const content = container.querySelector<HTMLOutputElement>('[data-testid="custom-item"]');
    expect(content?.textContent).toBe('Bravo');
    expect(content?.dataset.index).toBe('7');
    expect(content?.dataset.checked).toBe('false');
    expect(container.querySelectorAll('.neo-list-item-divider')).toHaveLength(2);
    expect(container.querySelector('.neo-list-item-content')).toBeNull();
  });

  it('preserves flattened section metadata in the selection payload', async () => {
    const section = { id: 'planning', label: 'Planning', items: [] };
    const item = { id: 'draft', value: 'draft', label: 'Draft', section, sectionIndex: 4 };
    const ontoggle = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoListVirtualRowHarness, {
      props: { item, id: item.id, index: 2, virtualIndex: 0, setSize: 1, select: true, ontoggle } as never,
    });
    await tick();

    await user.click(container.querySelector<HTMLButtonElement>('.neo-list-item-button')!);
    await tick();

    expect(ontoggle).toHaveBeenCalledWith({ index: 2, item, section, sectionIndex: 4 }, undefined);
  });
});
