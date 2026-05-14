import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoPin from './NeoPin.svelte';

afterEach(() => {
  cleanup();
});

function getCells(scope: ParentNode = document): HTMLInputElement[] {
  return Array.from(scope.querySelectorAll<HTMLInputElement>('input.neo-input-pin'));
}

function getGroups(scope: ParentNode = document): HTMLElement[] {
  return Array.from(scope.querySelectorAll<HTMLElement>('.neo-pin-group'));
}

describe('neoPin — render', () => {
  it('renders a single group with the default 4 cells', async () => {
    const { container } = render(NeoPin, {});
    await tick();
    expect(getGroups(container)).toHaveLength(1);
    expect(getCells(container)).toHaveLength(4);
  });

  it('count prop changes the number of cells per group', async () => {
    const { container } = render(NeoPin, { props: { count: 6 } as never });
    await tick();
    expect(getCells(container)).toHaveLength(6);
  });

  it('groups prop renders multiple groups separated by .neo-pin-separator', async () => {
    const { container } = render(NeoPin, { props: { groups: 2, count: 3 } as never });
    await tick();
    expect(getGroups(container)).toHaveLength(2);
    expect(getCells(container)).toHaveLength(6);
    expect(container.querySelectorAll('.neo-pin-separator')).toHaveLength(1);
  });

  it('vertical=true is auto-set when groups > 1 (.neo-vertical)', async () => {
    const { container } = render(NeoPin, { props: { groups: 2, count: 2 } as never });
    await tick();
    expect(container.querySelector('.neo-pin-group-wrapper.neo-vertical')).not.toBeNull();
  });

  it('renders a hidden combined input that mirrors the value', async () => {
    const { container } = render(NeoPin, { props: { value: '12' } as never });
    await tick();
    const hidden = container.querySelector<HTMLInputElement>('input.neo-pin-hidden');
    expect(hidden).not.toBeNull();
    expect(hidden?.hidden).toBe(true);
  });
});

describe('neoPin — interaction', () => {
  it('typing into a cell advances focus to the next cell', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoPin, { props: { count: 4, type: 'text' } as never });
    await tick();
    const cells = getCells(container);
    cells[0].focus();
    await user.keyboard('a');
    await tick();
    expect(document.activeElement).toBe(cells[1]);
  });

  it('backspace on an empty cell moves focus to the previous cell', async () => {
    const user = userEvent.setup();
    const { container } = render(NeoPin, { props: { count: 3, type: 'text' } as never });
    await tick();
    const cells = getCells(container);
    cells[1].focus();
    await user.keyboard('{Backspace}');
    await tick();
    expect(document.activeElement).toBe(cells[0]);
  });
});
