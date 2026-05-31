import type { ViewportName } from 'test/helpers/visual.js';

import { quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestButtonGroup.browser.test.svelte';
import VisualHarnessGuarded from './TestButtonGroup.guarded.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoButtonGroup — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it.each(VIEWPORT_NAMES)('matrix (%s)', async (viewport: ViewportName) => {
    await setViewport(viewport);
    render(VisualHarness, { props: { composite: true } as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const groups = stage.querySelectorAll<HTMLElement>('.neo-button-group');
      expect(groups.length).toBe(6);
      for (const g of groups) expect(g.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoButtonGroup', 'matrix', viewport),
    );
  });

  it('guarded pairs — flat / vertical / child disabled (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarnessGuarded, { props: {} as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const groups = stage.querySelectorAll<HTMLElement>('.neo-button-group');
      expect(groups.length).toBe(3);
    });
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoButtonGroup', 'guarded-pairs', 'desktop'),
    );
  });
});
