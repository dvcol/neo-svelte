import type { ViewportName } from 'test/helpers/visual.js';

import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

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

  it.each(VIEWPORT_NAMES)('severity × close × action matrix (%s)', { timeout: 30000 }, async (viewport: ViewportName) => {
    await setViewport(viewport);
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
      screenshotName('NeoSimpleNotification', 'matrix', viewport),
    );
  });
});
