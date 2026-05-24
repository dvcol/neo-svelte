import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestList.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoList — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('sectioned / multi-select / tinted / glass / disabled / empty matrix (desktop)', { timeout: 30000 }, async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const lists = stage.querySelectorAll<HTMLElement>('.neo-list');
      expect(lists.length).toBe(6);
      for (const l of lists) expect(l.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    await new Promise(r => setTimeout(r, 800));
    freezeSvgAnimations(stage);
    const loaders = Array.from(stage.querySelectorAll<HTMLElement>('.neo-list-base-loader'));
    if (loaders.length) await Promise.all(loaders.map(async l => waitForVisualStability(l)));
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoList', 'matrix', 'desktop'),
    );
  });
});
