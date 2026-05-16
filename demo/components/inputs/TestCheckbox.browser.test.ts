import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { page } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import VisualHarness from './TestCheckbox.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoCheckbox — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('checked / indeterminate / disabled × glass / tinted / sharp × valid / invalid / required matrix (desktop)', { timeout: 30000 }, async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const checkboxes = stage.querySelectorAll<HTMLElement>('.neo-checkbox-container');
      expect(checkboxes.length).toBe(16);
      for (const c of checkboxes) expect(c.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    // SMIL <animate fill="freeze"> chains in NeoIconCheckbox draw the
    // checkmark over ~0.6s. Wait then freeze so the indicator is fully
    // rendered before snapshot capture.
    await new Promise(r => setTimeout(r, 800));
    freezeSvgAnimations(stage);
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoCheckbox', 'matrix', 'desktop'),
    );
  });
});
