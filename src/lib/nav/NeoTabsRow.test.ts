import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoTabsRowHarness from './NeoTabsRow.test.svelte';

afterEach(() => {
  cleanup();
});

const sampleTabs = [
  { tabId: 't1', label: 'One', value: 'v1' },
  { tabId: 't2', label: 'Two', value: 'v2' },
  { tabId: 't3', label: 'Three', value: 'v3' },
];

function getTabButtons(scope: ParentNode = document): HTMLButtonElement[] {
  return Array.from(scope.querySelectorAll<HTMLButtonElement>('.neo-tab > button.neo-tab-button[role="tab"]'));
}

describe('neoTabsRow — render', { tags: ['jsdom'] }, () => {
  it('renders one tab per item with role=tab', async () => {
    const { container } = render(NeoTabsRowHarness, { props: { tabs: sampleTabs } as never });
    await tick();
    expect(container.querySelector('[role="tablist"]')).not.toBeNull();
    expect(getTabButtons(container).length).toBeGreaterThanOrEqual(3);
  });

  // jsdom layout: `scrollWidth`/`clientWidth` are always 0, so `autoSize` resets threshold to 0
  // on mount and the collapse trigger never renders. The contract for threshold-driven collapse
  // is exercised in the browser project (NeoTabsRow.browser.test.ts).
  it('threshold=0 (no overflow) renders all tabs and no collapse trigger', async () => {
    const { container } = render(NeoTabsRowHarness, { props: { tabs: sampleTabs, threshold: 0 } as never });
    await tick();
    expect(container.querySelector('.neo-tabs-row-collapse')).toBeNull();
    expect(getTabButtons(container)).toHaveLength(3);
  });

  it('renders divider items as dividers, not as tab buttons', async () => {
    const tabs = [
      { tabId: 't1', label: 'One' },
      { divider: true } as const,
      { tabId: 't2', label: 'Two' },
    ];
    const { container } = render(NeoTabsRowHarness, { props: { tabs } as never });
    await tick();
    const buttons = getTabButtons(container);
    expect(buttons).toHaveLength(2);
    expect(container.querySelectorAll('.neo-tab-divider').length).toBeGreaterThanOrEqual(1);
  });

  it('vertical=true adds .neo-vertical to the tabs container', async () => {
    const { container } = render(NeoTabsRowHarness, { props: { tabs: sampleTabs, vertical: true } as never });
    await tick();
    expect(container.querySelector('.neo-tabs.neo-vertical')).not.toBeNull();
  });

  it('disabled propagates to all tab buttons', async () => {
    const { container } = render(NeoTabsRowHarness, { props: { tabs: sampleTabs, disabled: true } as never });
    await tick();
    for (const btn of getTabButtons(container)) expect(btn.disabled).toBe(true);
  });
});
