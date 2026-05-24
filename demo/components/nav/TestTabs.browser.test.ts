import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import Harness from '~/nav/NeoTabs.test.svelte';

import VisualHarness from './TestTabs.browser.test.svelte';

afterEach(() => {
  cleanup();
});

const tabs = [
  { tabId: 't1', label: 'One' },
  { tabId: 't2', label: 'Two' },
  { tabId: 't3', label: 'Three' },
];

function getTabButtons(): HTMLButtonElement[] {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('button.neo-tab-button[role="tab"]'));
}

function getActivePanel(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[role="tabpanel"]');
}

describe('neoTabs — keyboard focus order through the tablist (real focus)', { tags: ['browser'] }, () => {
  it('tab moves focus from one tab button to the next', async () => {
    const user = userEvent.setup();
    render(Harness, { props: { tabs, active: 't1' } as never });
    const buttons = await vi.waitFor(() => {
      const list = getTabButtons();
      if (list.length !== 3) throw new Error('tabs not mounted');
      return list;
    });
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);
    await user.tab();
    expect(document.activeElement).toBe(buttons[1]);
    await user.tab();
    expect(document.activeElement).toBe(buttons[2]);
  });

  it('enter on a focused tab activates it (panel and aria-selected sync)', async () => {
    const user = userEvent.setup();
    render(Harness, { props: { tabs, active: 't1' } as never });
    const buttons = await vi.waitFor(() => {
      const list = getTabButtons();
      if (list.length !== 3) throw new Error('tabs not mounted');
      return list;
    });
    buttons[2].focus();
    await user.keyboard('{Enter}');
    await vi.waitFor(() => {
      expect(getTabButtons()[2].getAttribute('aria-selected')).toBe('true');
      expect(getActivePanel()?.getAttribute('data-tab-id')).toBe('t3');
    });
  });
});

describe('neoTabs — slide indicator (real layout × animation)', { tags: ['browser'] }, () => {
  it('clicking a different tab moves the slide indicator (translate set on the tabs container)', async () => {
    const user = userEvent.setup();
    render(Harness, { props: { tabs, active: 't1', slide: true } as never });
    const buttons = await vi.waitFor(() => {
      const list = getTabButtons();
      if (list.length !== 3) throw new Error('tabs not mounted');
      return list;
    });
    await user.click(buttons[2]);
    // The slide animation drives a CSS variable on the .neo-tabs container; confirm it is set.
    await vi.waitFor(() => {
      const container = document.querySelector<HTMLElement>('.neo-tabs.neo-slide');
      expect(container).not.toBeNull();
      // After activation, .neo-translate is added when a transform was computed.
      expect(container?.classList.contains('neo-translate')).toBe(true);
    });
  });

  it('slide=false omits the .neo-slide class', async () => {
    render(Harness, { props: { tabs, active: 't1', slide: false } as never });
    await vi.waitFor(() => {
      expect(document.querySelector('.neo-tabs')).not.toBeNull();
      expect(document.querySelector('.neo-tabs.neo-slide')).toBeNull();
    });
  });
});

describe('neoTabs — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('slide / line / pill × glass / tinted × disabled / close+add / icons / vertical / skeleton matrix (desktop)', { timeout: 30000 }, async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'matrix' } as never });
    const stage = await vi.waitFor(() => {
      const el = document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const groups = stage.querySelectorAll<HTMLElement>('.neo-tabs');
      expect(groups.length).toBe(10);
    });
    await new Promise(r => setTimeout(r, 600));
    freezeSvgAnimations(stage);
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoTabs', 'matrix', 'desktop'),
    );
  });
});
