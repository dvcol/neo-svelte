import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestProgress.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoProgressBar — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('value × style × buffer / marks / before / after / track / borderless × status × thresholds matrix (desktop)', { timeout: 30000 }, async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const bars = stage.querySelectorAll<HTMLElement>('.neo-progress');
      expect(bars.length).toBe(24);
      for (const b of bars) expect(b.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    // Indeterminate progress bars use SMIL <animate> stripes; freeze so the
    // stripe phase doesn't drift between snapshots.
    await new Promise(r => setTimeout(r, 400));
    freezeSvgAnimations(stage);
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoProgressBar', 'matrix', 'desktop'),
    );
  });

  it('vertical orientation matrix (desktop)', { timeout: 30000 }, async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'vertical' } as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const bars = stage.querySelectorAll<HTMLElement>('.neo-progress');
      expect(bars.length).toBe(24);
      for (const b of bars) {
        const rect = b.getBoundingClientRect();
        expect(rect.height).toBeGreaterThan(0);
        expect(rect.width).toBeGreaterThan(0);
      }
    });
    await new Promise(r => setTimeout(r, 400));
    freezeSvgAnimations(stage);
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoProgressBar', 'matrix-vertical', 'desktop'),
    );
  });
});
