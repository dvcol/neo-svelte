import type { ViewportName } from 'test/helpers/visual.js';

import { quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestDialogConfirm.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getDialog(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-dialog');
}

const VARIANTS = [
  { variant: 'confirm', component: 'NeoDialogConfirm' },
  { variant: 'stepper', component: 'NeoDialogStepper' },
] as const;

describe('neoDialogConfirm + neoDialogStepper — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it.each(VIEWPORT_NAMES.flatMap(v => VARIANTS.map(s => [v, s] as const)))(
    'matrix (%s, %s)',
    async (viewport: ViewportName, scenario: typeof VARIANTS[number]) => {
      await setViewport(viewport);
      render(VisualHarness, { props: { variant: scenario.variant } as never });
      const dialog = await vi.waitFor(() => {
        const el = getDialog();
        if (!el) throw new Error('dialog not mounted');
        return el;
      });
      if (scenario.variant === 'stepper') {
        await vi.waitFor(() => {
          if (dialog.getBoundingClientRect().width <= 0) throw new Error('dialog not sized yet');
          const stepper = document.querySelector<HTMLElement>('.neo-floating-stepper');
          if (!stepper) throw new Error('stepper not mounted');
        }, { timeout: 3000, interval: 32 });
      }
      await waitForVisualStability(dialog);
      await vi.waitFor(() => {
        const cs = getComputedStyle(dialog);
        expect(Number.parseFloat(cs.opacity)).toBeGreaterThan(0.99);
        expect(dialog.getBoundingClientRect().width).toBeGreaterThan(0);
      });
      await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
        screenshotName(scenario.component, 'matrix', viewport),
      );
    },
  );
});
