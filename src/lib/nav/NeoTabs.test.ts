import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';

import NeoTabsHarness from './NeoTabs.test.svelte';

afterEach(() => {
  cleanup();
});

const sampleTabs = [
  { tabId: 't1', label: 'One' },
  { tabId: 't2', label: 'Two' },
  { tabId: 't3', label: 'Three' },
];

function getTabButtons(scope: ParentNode = document): HTMLButtonElement[] {
  return Array.from(scope.querySelectorAll<HTMLButtonElement>('button.neo-tab-button[role="tab"]'));
}

function getActivePanels(scope: ParentNode = document): HTMLElement[] {
  return Array.from(scope.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
}

describe('neoTabs — render', { tags: ['jsdom'] }, () => {
  it('renders one tab button and tablist for each tab', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs } as never });
    await tick();
    expect(container.querySelector('[role="tablist"]')).not.toBeNull();
    expect(getTabButtons(container)).toHaveLength(3);
  });

  it('renders one tabpanel for the active tab only', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, active: 't2' } as never });
    await tick();
    const panels = getActivePanels(container);
    expect(panels).toHaveLength(1);
    expect(panels[0].getAttribute('data-tab-id')).toBe('t2');
  });

  it('aria-selected reflects the active tab', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, active: 't1' } as never });
    await tick();
    const buttons = getTabButtons(container);
    expect(buttons[0].getAttribute('aria-selected')).toBe('true');
    expect(buttons[1].getAttribute('aria-selected')).toBe('false');
  });

  it('add=true renders the "Add new tab" button', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, add: true } as never });
    await tick();
    expect(container.querySelector('button[aria-label="Add new tab"]')).not.toBeNull();
  });

  it('close=true renders a close button per tab', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, close: true } as never });
    await tick();
    expect(container.querySelectorAll('button.neo-tab-close')).toHaveLength(3);
  });

  it('close=false hides per-tab close buttons', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, close: false } as never });
    await tick();
    expect(container.querySelector('button.neo-tab-close')).toBeNull();
  });

  it('disabled=true disables every tab button', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, disabled: true } as never });
    await tick();
    for (const btn of getTabButtons(container)) expect(btn.disabled).toBe(true);
  });

  it('per-tab disabled is reflected on the tab button', async () => {
    const tabs = [
      { tabId: 't1', label: 'One' },
      { tabId: 't2', label: 'Two', disabled: true },
    ];
    const { container } = render(NeoTabsHarness, { props: { tabs } as never });
    await tick();
    const buttons = getTabButtons(container);
    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].disabled).toBe(true);
  });
});

describe('neoTabs — interaction', { tags: ['jsdom'] }, () => {
  it('clicking a tab activates it and fires onchange', async () => {
    const onchange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, active: 't1', onchange } as never });
    await tick();
    onchange.mockClear();
    await user.click(getTabButtons(container)[2]);
    await tick();
    expect(onchange).toHaveBeenCalled();
    expect(onchange.mock.calls.at(-1)?.[0]).toBe('t3');
    expect(getTabButtons(container)[2].getAttribute('aria-selected')).toBe('true');
    const panels = getActivePanels(container);
    expect(panels[0].getAttribute('data-tab-id')).toBe('t3');
  });

  it('clicking a close button fires onclose with the tab id', async () => {
    const onclose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoTabsHarness, {
      props: { tabs: sampleTabs, active: 't1', close: true, onclose } as never,
    });
    await tick();
    const closeBtns = container.querySelectorAll<HTMLButtonElement>('button.neo-tab-close');
    await user.click(closeBtns[1]);
    await tick();
    expect(onclose).toHaveBeenCalledTimes(1);
    expect(onclose.mock.calls[0][0]).toBe('t2');
  });

  it('clicking the add button fires onadd', async () => {
    const onadd = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, add: true, onadd } as never });
    await tick();
    await user.click(container.querySelector<HTMLButtonElement>('button[aria-label="Add new tab"]')!);
    await tick();
    expect(onadd).toHaveBeenCalledTimes(1);
  });

  it('disabled tabs do not change the active tab on click', async () => {
    const tabs = [
      { tabId: 't1', label: 'One' },
      { tabId: 't2', label: 'Two', disabled: true },
    ];
    const onchange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(NeoTabsHarness, { props: { tabs, active: 't1', onchange } as never });
    await tick();
    onchange.mockClear();
    await user.click(getTabButtons(container)[1]);
    await tick();
    expect(onchange).not.toHaveBeenCalled();
    expect(getTabButtons(container)[0].getAttribute('aria-selected')).toBe('true');
  });
});

describe('neoTabs — style modifiers', { tags: ['jsdom'] }, () => {
  it('line=true adds .neo-line', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, line: true } as never });
    await tick();
    expect(container.querySelector('.neo-tabs.neo-line')).not.toBeNull();
  });

  it('pill=true adds .neo-pill', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, pill: true } as never });
    await tick();
    expect(container.querySelector('.neo-tabs.neo-pill')).not.toBeNull();
  });

  it('slide defaults to true (.neo-slide); slide=false omits it', async () => {
    const { container, rerender } = render(NeoTabsHarness, { props: { tabs: sampleTabs } as never });
    await tick();
    expect(container.querySelector('.neo-tabs.neo-slide')).not.toBeNull();
    await rerender({ tabs: sampleTabs, slide: false } as never);
    await tick();
    expect(container.querySelector('.neo-tabs.neo-slide')).toBeNull();
  });

  it('vertical=true adds .neo-vertical', async () => {
    const { container } = render(NeoTabsHarness, { props: { tabs: sampleTabs, vertical: true } as never });
    await tick();
    expect(container.querySelector('.neo-tabs.neo-vertical')).not.toBeNull();
  });
});
