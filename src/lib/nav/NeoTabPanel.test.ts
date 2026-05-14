import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoTabsHarness from './NeoTabsHarness.test.svelte';

afterEach(() => {
  cleanup();
});

const sampleTabs = [
  { tabId: 't1', label: 'One' },
  { tabId: 't2', label: 'Two' },
];

describe('neoTabPanel', () => {
  it('renders only the active panel inside <NeoTabs>', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, active: 't1' } as never });
    await tick();
    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');
    expect(panels).toHaveLength(1);
    expect(panels[0].getAttribute('data-tab-id')).toBe('t1');
  });

  it('panel id and aria-labelledby reference the corresponding tab', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, active: 't2' } as never });
    await tick();
    const panel = container.querySelector<HTMLElement>('[role="tabpanel"]');
    expect(panel?.id).toBe('neo-tab-panel-t2');
    expect(panel?.getAttribute('aria-labelledby')).toBe('neo-tab-t2');
  });

  it('switching active swaps the rendered panel', async () => {
    const { container, rerender } = render(NeoTabsHarness, { props: { tabs: sampleTabs, active: 't1' } as never });
    await tick();
    expect(container.querySelector<HTMLElement>('[role="tabpanel"]')?.getAttribute('data-tab-id')).toBe('t1');
    await rerender({ tabs: sampleTabs, active: 't2' } as never);
    await tick();
    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]');
    expect(panels).toHaveLength(1);
    expect(panels[0].getAttribute('data-tab-id')).toBe('t2');
  });
});
