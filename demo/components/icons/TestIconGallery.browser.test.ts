import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestIconGallery.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoIcon — gallery visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('full icon set grid (desktop)', { timeout: 45000 }, async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const cells = stage.querySelectorAll<HTMLElement>('.cell');
      expect(cells.length).toBeGreaterThanOrEqual(50);
      for (const c of cells) expect(c.querySelector('svg')).not.toBeNull();
    });
    // Wait for icon entry SMIL animations to complete (longest chain is
    // ~1s for icons with two stroked paths drawn in sequence), then freeze
    // any indefinite loops (BouncingDots, CircleLoading) by removing the
    // SMIL nodes so consecutive screenshots are pixel-stable.
    await new Promise(r => setTimeout(r, 1200));
    freezeSvgAnimations(stage);
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoIconGallery', 'matrix', 'desktop'),
    );
  });
});
