import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoCollapseGroupHarness from './NeoCollapseGroupHarness.test.svelte';

afterEach(() => {
  cleanup();
});

function getTrigger(scope: ParentNode, id: string): HTMLButtonElement {
  return scope.querySelector<HTMLButtonElement>(`[aria-controls="${id}"]`)!;
}

function expanded(scope: ParentNode, id: string): boolean {
  return getTrigger(scope, id).getAttribute('aria-expanded') === 'true';
}

const sections = [
  { id: 's1', label: 'One' },
  { id: 's2', label: 'Two' },
  { id: 's3', label: 'Three' },
];

describe('neoCollapseGroup', () => {
  it('renders each child collapse with its own trigger', async () => {
    const { container } = render(NeoCollapseGroupHarness, { props: { sections } as never });
    await tick();
    expect(container.querySelectorAll('.neo-collapse')).toHaveLength(3);
    expect(container.querySelectorAll('.neo-collapse-trigger')).toHaveLength(3);
  });

  it('disabled propagates to all sections', async () => {
    const { container } = render(NeoCollapseGroupHarness, { props: { sections, disabled: true } as never });
    await tick();
    const triggers = container.querySelectorAll<HTMLButtonElement>('.neo-collapse-trigger');
    for (const t of triggers) expect(t.disabled).toBe(true);
  });

  it('readonly propagates as .neo-readonly to all triggers', async () => {
    const { container } = render(NeoCollapseGroupHarness, { props: { sections, readonly: true } as never });
    await tick();
    const triggers = container.querySelectorAll('.neo-collapse-trigger');
    for (const t of triggers) expect(t.classList.contains('neo-readonly')).toBe(true);
  });

  it('max=1 closes the previously open section when another is opened (oldest strategy)', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoCollapseGroupHarness, {
      props: { sections, max: 1 } as never,
    });
    await tick();
    await user.click(getTrigger(container, 's1'));
    await tick();
    expect(expanded(container, 's1')).toBe(true);
    await user.click(getTrigger(container, 's2'));
    await tick();
    expect(expanded(container, 's1')).toBe(false);
    expect(expanded(container, 's2')).toBe(true);
  });

  it('min=1 prevents closing the last open section (readonly strategy)', async () => {
    const user = userEvent.setup();
    const initial = [
      { id: 's1', label: 'One', open: true },
      { id: 's2', label: 'Two' },
    ];
    const { container } = render(NeoCollapseGroupHarness, {
      props: { sections: initial, min: 1 } as never,
    });
    await tick();
    expect(expanded(container, 's1')).toBe(true);
    await user.click(getTrigger(container, 's1'));
    await tick();
    expect(expanded(container, 's1')).toBe(true);
  });
});
