import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestSkeleton.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoSkeletonContainer — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('all states (text-loading | media-loading | content-loaded) — desktop', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { composite: true } as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    // Each cell has visible content (skeleton bars or loaded label) before
    // we screenshot — guards against the previous "blank stage" failure.
    await vi.waitFor(() => {
      const cells = stage.querySelectorAll<HTMLElement>('[data-cell]');
      expect(cells.length).toBe(3);
      for (const cell of cells) {
        expect(cell.getBoundingClientRect().height).toBeGreaterThan(0);
      }
    });
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoSkeletonContainer', 'all-states', 'desktop'),
    );
  });
});
