import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoListBaseSectionHarness from './NeoListBaseSection.test.svelte';

afterEach(() => {
  cleanup();
});

describe('neoListBaseSection — render', { tags: ['jsdom'] }, () => {
  it('renders a label and a <ul role="list"> by default', async () => {
    const section = { id: 's', items: [{ id: 1, value: 'a', label: 'Alpha' }], label: 'Section A' };
    const { container } = render(NeoListBaseSectionHarness, { props: { section, index: 0 } as never });
    await tick();
    const title = container.querySelector('.neo-list-section-title');
    expect(title?.textContent).toContain('Section A');
    const list = container.querySelector('ul.neo-list-section-list');
    expect(list).not.toBeNull();
    expect(list?.getAttribute('role')).toBe('list');
  });

  it('select=true switches the list role to "listbox"', async () => {
    const section = { id: 's', items: [{ id: 1, value: 'a' }], label: 'Section A' };
    const { container } = render(NeoListBaseSectionHarness, { props: { section, index: 0, select: true } as never });
    await tick();
    expect(container.querySelector('ul.neo-list-section-list')?.getAttribute('role')).toBe('listbox');
  });

  it('section.sticky=true marks the title with .neo-sticky', async () => {
    const section = { id: 's', items: [], label: 'Sticky', sticky: true };
    const { container } = render(NeoListBaseSectionHarness, { props: { section, index: 0 } as never });
    await tick();
    expect(container.querySelector('.neo-list-section-title.neo-sticky')).not.toBeNull();
  });

  it('reverse=true marks the title with .neo-reverse', async () => {
    const section = { id: 's', items: [], label: 'Section' };
    const { container } = render(NeoListBaseSectionHarness, { props: { section, index: 0, reverse: true } as never });
    await tick();
    expect(container.querySelector('.neo-list-section-title.neo-reverse')).not.toBeNull();
  });

  it('flip=true adds .neo-flip on the section list', async () => {
    const section = { id: 's', items: [], label: 'Section' };
    const { container } = render(NeoListBaseSectionHarness, { props: { section, index: 0, flip: true } as never });
    await tick();
    expect(container.querySelector('ul.neo-list-section-list.neo-flip')).not.toBeNull();
  });

  it('section without a label does not render the section title', async () => {
    const section = { id: 's', items: [] };
    const { container } = render(NeoListBaseSectionHarness, { props: { section, index: 0 } as never });
    await tick();
    expect(container.querySelector('.neo-list-section-title')).toBeNull();
  });

  it('aria-labelledby points to the title id when label is present', async () => {
    const section = { id: 's', items: [], label: 'Section A' };
    const { container } = render(NeoListBaseSectionHarness, { props: { section, index: 0 } as never });
    await tick();
    const title = container.querySelector<HTMLElement>('.neo-list-section-title');
    const ul = container.querySelector<HTMLElement>('ul.neo-list-section-list');
    expect(title?.id).toBeTruthy();
    expect(ul?.getAttribute('aria-labelledby')).toBe(title?.id);
  });
});
