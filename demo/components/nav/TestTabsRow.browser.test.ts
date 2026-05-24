import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import NeoTabsRowHarness from '~/nav/NeoTabsRow.test.svelte';

import VisualHarness from './TestTabsRow.browser.test.svelte';

afterEach(() => {
  cleanup();
});

const sampleTabs = [
  { tabId: 't1', label: 'One', value: 'One' },
  { tabId: 't2', label: 'Two', value: 'Two' },
  { tabId: 't3', label: 'Three', value: 'Three' },
];

const overflowingTabs = Array.from({ length: 10 }, (_, i) => ({
  tabId: `t${i + 1}`,
  label: `Tab number ${i + 1} with extra long label`,
  value: `Tab number ${i + 1} with extra long label`,
}));

function getTabButtons(scope: ParentNode = document): HTMLButtonElement[] {
  return Array.from(scope.querySelectorAll<HTMLButtonElement>('.neo-tab > button.neo-tab-button[role="tab"]'));
}

describe('neoTabsRow — autoSize threshold (real layout)', { tags: ['browser'] }, () => {
  it('collapses trailing tabs into a menu trigger when the row overflows its container', async () => {
    const { container } = render(NeoTabsRowHarness, {
      props: { tabs: overflowingTabs, wrapperStyle: 'width: 360px;' } as never,
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

describe('neoTabsRow — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('horizontal — fully visible row (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, {
      props: { tabs: sampleTabs, active: 't2', wrapperStyle: 'width: 600px;' } as never,
    });
    const row = await vi.waitFor(() => {
      const el = document.querySelector<HTMLElement>('.neo-tabs');
      if (!el) throw new Error('row not mounted');
      return el;
    });
    // Expected behaviour: each tab button renders its `label` text content.
    const firstButton = row.querySelector<HTMLElement>('button.neo-tab-button');
    expect(firstButton?.textContent?.trim()).toBe('One');
    await waitForVisualStability(row);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoTabsRow', 'matrix-horizontal', 'desktop'),
    );
  });

  it('horizontal — overflow with collapse menu (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, {
      props: { tabs: overflowingTabs, active: 't1', wrapperStyle: 'width: 600px;' } as never,
    });
    await vi.waitFor(() => {
      const collapse = document.querySelector('.neo-tabs-row-collapse');
      if (!collapse) throw new Error('collapse not visible');
    }, { timeout: 3000, interval: 50 });
    const row = document.querySelector<HTMLElement>('.neo-tabs')!;
    await waitForVisualStability(row);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoTabsRow', 'matrix-overflow', 'desktop'),
    );
  });

  it('vertical — fully visible column (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, {
      props: { tabs: sampleTabs, active: 't2', vertical: true, wrapperStyle: 'height: 240px;' } as never,
    });
    const row = await vi.waitFor(() => {
      const el = document.querySelector<HTMLElement>('.neo-tabs');
      if (!el) throw new Error('row not mounted');
      return el;
    });
    await waitForVisualStability(row);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoTabsRow', 'matrix-vertical', 'desktop'),
    );
  });
});
