import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoTabDivider from './NeoTabDivider.svelte';

afterEach(() => {
  cleanup();
});

describe('neoTabDivider', () => {
  it('renders a divider with the neo-tab-divider class', async () => {
    const { container } = render(NeoTabDivider, { props: {} as never });
    await tick();
    const divider = container.querySelector('.neo-tab-divider');
    expect(divider).not.toBeNull();
  });

  it('forwards user-provided classes', async () => {
    const { container } = render(NeoTabDivider, { props: { class: 'custom-divider' } as never });
    await tick();
    const divider = container.querySelector('.neo-tab-divider.custom-divider');
    expect(divider).not.toBeNull();
  });

  it('inverts orientation relative to the (absent) tab context — defaults to vertical', async () => {
    // Without a tab context, context.state.vertical is undefined, so !vertical === true
    const { container } = render(NeoTabDivider, { props: {} as never });
    await tick();
    const divider = container.querySelector('.neo-tab-divider');
    expect(divider?.classList.contains('neo-vertical')).toBe(true);
  });
});
