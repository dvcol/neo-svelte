import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoListRowHarness from './NeoListRow.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoListRow — composition', { tags: ['jsdom'] }, () => {
  it('renders the default item and emits its selection payload', async () => {
    const item = { id: 'alpha', value: 'a', label: 'Alpha' };
    const ontoggle = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoListRowHarness, {
      props: { item, index: 2, checked: true, select: true, ontoggle } as never,
    });
    await tick();

    await user.click(container.querySelector<HTMLButtonElement>('.neo-list-item-button')!);
    await tick();

    expect(ontoggle).toHaveBeenCalledWith({ index: 2, item, section: undefined, sectionIndex: undefined }, true);
  });

  it('composes the configured item renderer inside the row renderer', async () => {
    const item = { id: 'bravo', value: 'b', label: 'Bravo' };
    const { container } = render(NeoListRowHarness, {
      props: { item, index: 4, checked: true, sectionIndex: 1, customItem: true, wrap: true } as never,
    });
    await tick();

    const row = container.querySelector<HTMLElement>('[data-testid="custom-row"]');
    const content = row?.querySelector<HTMLOutputElement>('[data-testid="custom-item"]');
    expect(row?.dataset.id).toBe('bravo');
    expect(row?.dataset.sectionIndex).toBe('1');
    expect(content?.textContent).toBe('Bravo');
    expect(content?.dataset.index).toBe('4');
    expect(content?.dataset.checked).toBe('true');
  });

  it('passes the required list renderer to a custom section renderer', async () => {
    const item = {
      id: 'planning',
      label: 'Planning',
      items: [
        { id: 'draft', value: 'draft', label: 'Draft' },
        { id: 'review', value: 'review', label: 'Review' },
      ],
    };
    const { container } = render(NeoListRowHarness, {
      props: { item, index: 3, customSection: true } as never,
    });
    await tick();

    const section = container.querySelector<HTMLElement>('[data-testid="custom-section"]');
    expect(section?.dataset.index).toBe('3');
    expect(section?.querySelector('h2')?.textContent).toBe('Planning');
    expect(Array.from(section?.querySelectorAll('[data-nested-id]') ?? []).map(node => node.textContent)).toEqual(['Draft', 'Review']);
  });
});
