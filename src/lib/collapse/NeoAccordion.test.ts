import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoAccordionHarness from './NeoAccordionHarness.test.svelte';

afterEach(() => {
  cleanup();
});

const sections = [
  { id: 'a1', label: 'One' },
  { id: 'a2', label: 'Two' },
];

describe('neoAccordion — render', () => {
  it('renders each child collapse', async () => {
    const { container } = render(NeoAccordionHarness, { props: { sections } as never });
    await tick();
    expect(container.querySelectorAll('.neo-collapse')).toHaveLength(2);
  });

  it('horizontal=true adds .neo-horizontal', async () => {
    const { container } = render(NeoAccordionHarness, { props: { sections, horizontal: true } as never });
    await tick();
    expect(container.querySelector('.neo-accordion.neo-horizontal')).not.toBeNull();
  });

  it('segmented defaults to true (.neo-segmented)', async () => {
    const { container, rerender } = render(NeoAccordionHarness, { props: { sections } as never });
    await tick();
    expect(container.querySelector('.neo-accordion.neo-segmented')).not.toBeNull();
    await rerender({ sections, segmented: false } as never);
    await tick();
    expect(container.querySelector('.neo-accordion.neo-segmented')).toBeNull();
  });

  it('borderless=true adds .neo-borderless', async () => {
    const { container } = render(NeoAccordionHarness, { props: { sections, borderless: true } as never });
    await tick();
    expect(container.querySelector('.neo-accordion.neo-borderless')).not.toBeNull();
  });

  it('rounded=true adds .neo-rounded', async () => {
    const { container } = render(NeoAccordionHarness, { props: { sections, rounded: true } as never });
    await tick();
    expect(container.querySelector('.neo-accordion.neo-rounded')).not.toBeNull();
  });

  it('glass=true adds .neo-glass', async () => {
    const { container } = render(NeoAccordionHarness, { props: { sections, glass: true } as never });
    await tick();
    expect(container.querySelector('.neo-accordion.neo-glass')).not.toBeNull();
  });

  it('without group, sections are independent (no max enforcement)', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoAccordionHarness, { props: { sections } as never });
    await tick();
    const t1 = container.querySelector<HTMLButtonElement>('[aria-controls="a1"]')!;
    const t2 = container.querySelector<HTMLButtonElement>('[aria-controls="a2"]')!;
    await user.click(t1);
    await tick();
    await user.click(t2);
    await tick();
    expect(t1.getAttribute('aria-expanded')).toBe('true');
    expect(t2.getAttribute('aria-expanded')).toBe('true');
  });

  it('group={max:1} enforces only one section open at a time', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoAccordionHarness, {
      props: { sections, group: { max: 1 } } as never,
    });
    await tick();
    const t1 = container.querySelector<HTMLButtonElement>('[aria-controls="a1"]')!;
    const t2 = container.querySelector<HTMLButtonElement>('[aria-controls="a2"]')!;
    await user.click(t1);
    await tick();
    await user.click(t2);
    await tick();
    expect(t1.getAttribute('aria-expanded')).toBe('false');
    expect(t2.getAttribute('aria-expanded')).toBe('true');
  });

  it('disabled=true propagates to children when grouped', async () => {
    const { container } = render(NeoAccordionHarness, {
      props: { sections, disabled: true, group: {} } as never,
    });
    await tick();
    const triggers = container.querySelectorAll<HTMLButtonElement>('.neo-collapse-trigger');
    for (const t of triggers) expect(t.disabled).toBe(true);
  });
});
