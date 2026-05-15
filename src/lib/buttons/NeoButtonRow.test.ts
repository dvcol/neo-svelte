import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoButtonRow from './NeoButtonRow.svelte';

afterEach(() => {
  cleanup();
});

function getButtons(scope: ParentNode = document): HTMLButtonElement[] {
  return Array.from(scope.querySelectorAll<HTMLButtonElement>('button.neo-button'));
}

describe('neoButtonRow — render', { tags: ['jsdom'] }, () => {
  it('renders no buttons when items array is empty', async () => {
    const { container } = render(NeoButtonRow, { props: { items: [] } as never });
    await tick();
    expect(container.querySelector('.neo-button-group')).not.toBeNull();
    expect(getButtons(container)).toHaveLength(0);
  });

  it('renders one NeoButton per item', async () => {
    const items = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
    ];
    const { container } = render(NeoButtonRow, { props: { items } as never });
    await tick();
    const buttons = getButtons(container);
    expect(buttons).toHaveLength(3);
    expect(buttons.map(b => b.textContent?.trim())).toEqual(['A', 'B', 'C']);
  });

  it('isButtonRowDivider entries render as <hr> dividers, not buttons', async () => {
    const items = [
      { id: 'a', label: 'A' },
      { divider: true },
      { id: 'b', label: 'B' },
    ];
    const { container } = render(NeoButtonRow, { props: { items } as never });
    await tick();
    const buttons = getButtons(container);
    expect(buttons.map(b => b.textContent?.trim())).toEqual(['A', 'B']);
    expect(container.querySelector('.neo-divider')).not.toBeNull();
  });
});

describe('neoButtonRow — prop passthrough', { tags: ['jsdom'] }, () => {
  it('item.disabled disables the rendered button', async () => {
    const items = [{ id: 'a', label: 'A', disabled: true }];
    const { container } = render(NeoButtonRow, { props: { items } as never });
    await tick();
    expect(getButtons(container)[0]?.disabled).toBe(true);
  });

  it('item.onclick fires when the item is clicked', async () => {
    const onclick = vi.fn();
    const user = userEvent.setup();
    const items = [{ id: 'a', label: 'A', onclick }];
    const { container } = render(NeoButtonRow, { props: { items } as never });
    await tick();
    await user.click(getButtons(container)[0]);
    expect(onclick).toHaveBeenCalledTimes(1);
  });

  it('buttonProps are merged into every button (item-level wins)', async () => {
    const items = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B', disabled: true },
    ];
    const { container } = render(NeoButtonRow, { props: { items, buttonProps: { disabled: false } } as never });
    await tick();
    const buttons = getButtons(container);
    expect(buttons[0]?.disabled).toBe(false);
    expect(buttons[1]?.disabled).toBe(true);
  });
});

describe('neoButtonRow — vertical', { tags: ['jsdom'] }, () => {
  it('vertical=true applies .neo-vertical to the underlying group', async () => {
    const { container } = render(NeoButtonRow, { props: { items: [{ id: 'a', label: 'A' }], vertical: true } as never });
    await tick();
    expect(container.querySelector('.neo-button-group.neo-vertical')).not.toBeNull();
  });
});
