import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';

import VisualHarness from './TestTabs.pseudo.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement {
  const el = document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
  if (!el) throw new Error('stage not mounted');
  return el;
}

describe('neoTabs — real CSS pseudo states (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('idle baseline (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoTabs', 'pseudo-idle', 'desktop'),
    );
  });

  it('hover — non-active tab hovered fades inactive siblings (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    const tabs = await vi.waitFor(() => {
      const list = document.querySelectorAll<HTMLElement>('.neo-tab');
      if (list.length < 3) throw new Error('tabs not mounted');
      return list;
    });
    // Hover the second tab (Beta — non-active).
    await userEvent.hover(tabs[1]);
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoTabs', 'pseudo-hover', 'desktop'),
    );
  });

  it('focus-visible — non-active tab keyboard-focused (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(getStage);
    await vi.waitFor(() => document.querySelector('.neo-tab'));
    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement).toBeTruthy();
    await waitForVisualStability(stage);
    await expect.element(page.getByTestId('visual-stage')).toMatchScreenshot(
      screenshotName('NeoTabs', 'pseudo-focus-visible', 'desktop'),
    );
  });
});
