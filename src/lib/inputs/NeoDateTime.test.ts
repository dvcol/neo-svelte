import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoDateTime from './NeoDateTime.svelte';

afterEach(() => {
  cleanup();
});

function getInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input.neo-input-date-time');
}

describe('neoDateTime — render', () => {
  it('renders a <input type="date"> by default', async () => {
    const { container } = render(NeoDateTime, {});
    await tick();
    expect(getInput(container)?.type).toBe('date');
  });

  it('forwards the type prop ("time", "datetime-local", "month", "week")', async () => {
    const types = ['time', 'datetime-local', 'month', 'week'] as const;
    for (const type of types) {
      const { container, unmount } = render(NeoDateTime, { props: { type } as never });
      await tick();
      expect(getInput(container)?.type).toBe(type);
      unmount();
    }
  });

  it('uses the default placeholder "Select a date"', async () => {
    const { container } = render(NeoDateTime, {});
    await tick();
    expect(getInput(container)?.placeholder).toBe('Select a date');
  });
});
