import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoTabsRowHarness from './NeoTabsRowHarness.test.svelte';

afterEach(() => {
  cleanup();
});

const sampleTabs = [
  { tabId: 't1', label: 'One' },
  { tabId: 't2', label: 'Two' },
  { tabId: 't3', label: 'Three' },
];

const overflowingTabs = Array.from({ length: 10 }, (_, i) => ({
  tabId: `t${i + 1}`,
  label: `Tab number ${i + 1} with extra long label`,
}));

function getTabButtons(scope: ParentNode = document): HTMLButtonElement[] {
  return Array.from(scope.querySelectorAll<HTMLButtonElement>('.neo-tab > button.neo-tab-button[role="tab"]'));
}

describe('neoTabsRow — autoSize threshold (real layout)', () => {
  it('collapses trailing tabs into a menu trigger when the row overflows its container', async () => {
    const { container } = render(NeoTabsRowHarness, {
      props: { tabs: overflowingTabs, wrapperStyle: 'width: 200px;' } as never,
    });
    await tick();
    await vi.waitFor(() => {
      expect(container.querySelector('.neo-tabs-row-collapse')).not.toBeNull();
    }, { timeout: 1000 });
    const visible = getTabButtons(container);
    expect(visible.length).toBeLessThan(overflowingTabs.length);
    expect(visible.length).toBeGreaterThan(0);
  });

  it('does not render a collapse trigger when all tabs fit in the container', async () => {
    const { container } = render(NeoTabsRowHarness, {
      props: { tabs: sampleTabs, wrapperStyle: 'width: 1200px;' } as never,
    });
    await tick();
    // Allow autoSize to run a tick or two and stabilize
    await new Promise(r => setTimeout(r, 50));
    expect(container.querySelector('.neo-tabs-row-collapse')).toBeNull();
    expect(getTabButtons(container)).toHaveLength(sampleTabs.length);
  });
});
