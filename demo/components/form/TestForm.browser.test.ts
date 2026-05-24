import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestForm.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStage(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-testid="visual-stage"]');
}

describe('neoForm + neoFieldset — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('form (with legend) + bordered/borderless fieldsets matrix (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: {} as never });
    const stage = await vi.waitFor(() => {
      const el = getStage();
      if (!el) throw new Error('stage not mounted');
      return el;
    });
    await vi.waitFor(() => {
      const fieldsets = stage.querySelectorAll<HTMLElement>('.neo-fieldset');
      expect(fieldsets.length).toBe(3);
      const form = stage.querySelector<HTMLElement>('.neo-form');
      expect(form).not.toBeNull();
      for (const f of fieldsets) expect(f.getBoundingClientRect().width).toBeGreaterThan(0);
    });
    await waitForVisualStability(stage);
    await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
      screenshotName('NeoForm', 'matrix', 'desktop'),
    );
  });
});
