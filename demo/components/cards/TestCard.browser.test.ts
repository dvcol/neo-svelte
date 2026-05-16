import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VisualHarness from './TestCard.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoCard — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('elevation × glass × tinted × rounded matrix (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { composite: true } as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const cards = stage.querySelectorAll<HTMLElement>('.neo-card');
      expect(cards.length).toBe(6);
      for (const c of cards) expect(c.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoCard', 'matrix', 'desktop'),
    );
  });
});
