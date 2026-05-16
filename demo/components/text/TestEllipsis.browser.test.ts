import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VisualHarness from './TestEllipsis.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoEllipsis — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('lines × content matrix (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const items = stage.querySelectorAll<HTMLElement>('.neo-ellipsis');
      expect(items.length).toBe(4);
    });
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoEllipsis', 'matrix', 'desktop'),
    );
  });
});
