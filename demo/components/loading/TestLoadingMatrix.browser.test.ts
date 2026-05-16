import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VisualHarness from './TestLoadingMatrix.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoLoadingMatrix — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('size × color matrix (desktop)', { timeout: 60000 }, async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const items = stage.querySelectorAll<HTMLElement>('.neo-loading-matrix');
      expect(items.length).toBe(6);
      for (const it of items) expect(it.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    // Wait through the @starting-style fade-in (0.2s delay + 1s transition)
    // so the loader is fully opaque, then pause the SMIL spinner so its
    // rectangles do not shift between consecutive screenshot captures.
    await new Promise(r => setTimeout(r, 1500));
    freezeSvgAnimations(stage);
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoLoadingMatrix', 'matrix', 'desktop'),
    );
  });
});
