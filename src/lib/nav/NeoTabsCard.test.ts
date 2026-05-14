import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';

import NeoTabsCardHarness from './NeoTabsCardHarness.test.svelte';

afterEach(() => {
  cleanup();
});

const sampleTabs = [
  { tabId: 't1', label: 'One' },
  { tabId: 't2', label: 'Two' },
];

describe('neoTabsCard', () => {
  it('renders a NeoCard wrapping the children snippet', async () => {
    const { container } = render(NeoTabsCardHarness, { props: { tabs: sampleTabs, active: 't1' } as never });
    await tick();
    expect(container.querySelector('.neo-card')).not.toBeNull();
    expect(container.querySelector('.harness-card-content')?.textContent).toBe('card-t1');
  });

  it('animate=true wraps content in a NeoTransitionContainer', async () => {
    const { container } = render(NeoTabsCardHarness, {
      props: { tabs: sampleTabs, active: 't1', animate: true } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card')).not.toBeNull();
    expect(container.querySelector('.neo-transition-container')).not.toBeNull();
  });

  it('animate=false skips the NeoTransitionContainer wrapper', async () => {
    const { container } = render(NeoTabsCardHarness, {
      props: { tabs: sampleTabs, active: 't1', animate: false } as never,
    });
    await tick();
    expect(container.querySelector('.neo-card')).not.toBeNull();
    expect(container.querySelector('.neo-transition-container')).toBeNull();
    expect(container.querySelector('.harness-card-content')).not.toBeNull();
  });

  it('animate defaults to true', async () => {
    const { container } = render(NeoTabsCardHarness, { props: { tabs: sampleTabs, active: 't1' } as never });
    await tick();
    expect(container.querySelector('.neo-transition-container')).not.toBeNull();
  });
});
