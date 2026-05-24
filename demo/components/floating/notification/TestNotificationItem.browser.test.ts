import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestNotificationItem.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoSimpleNotification — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('severity × close × action matrix (desktop)', { timeout: 30000 }, async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const items = stage.querySelectorAll<HTMLElement>('.neo-notification');
      expect(items.length).toBe(12);
      for (const it of items) expect(it.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    // CircleLoading SMIL spinner + Svelte fly-in transitions don't pause via
    // CSS-only quietForVisual. Wait for fly-ins, then freeze SMIL.
    await new Promise(r => setTimeout(r, 800));
    freezeSvgAnimations(stage);
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoSimpleNotification', 'matrix', 'desktop'),
    );
  });
});
