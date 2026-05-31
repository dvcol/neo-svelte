import type { ViewportName } from 'test/helpers/visual.js';

import { quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestSkeletonPrimitives.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoSkeletonText + neoSkeletonMedia — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it.each(VIEWPORT_NAMES)('text × media variants matrix (%s)', async (viewport: ViewportName) => {
    await setViewport(viewport);
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const cells = stage.querySelectorAll<HTMLElement>('.cell');
      expect(cells.length).toBe(8);
    });
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoSkeletonPrimitives', 'matrix', viewport),
    );
  });
});
