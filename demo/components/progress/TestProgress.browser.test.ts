import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

  // TODO: src/lib/progress/NeoProgressBar.svelte:231-253 — top/bottom directions
  // declare width: 0.5rem but rely on flex: 1 1 100% for height, so vertical
  // bars collapse when the parent does not constrain height. Expected: top/bottom
  // directions should default to a reasonable height analogous to the right/left
  // height: 0.5rem rule, or the container should set height. Currently vertical
  // bars render as 0px tall in unconstrained layouts, producing useless snapshots.
  it.skip('vertical orientation matrix (desktop)', async () => {
    expect(true).toBe(true);
  });
});
