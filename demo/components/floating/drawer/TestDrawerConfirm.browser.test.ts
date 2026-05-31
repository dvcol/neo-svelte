import type { ViewportName } from 'test/helpers/visual.js';

import { freezeSvgAnimations, quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestDrawerConfirm.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getDrawer(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-drawer .neo-dialog');
}

const VARIANTS = [
  { variant: 'confirm', component: 'NeoDrawerConfirm' },
  { variant: 'stepper', component: 'NeoDrawerStepper' },
] as const;

describe('neoDrawerConfirm + neoDrawerStepper — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it.each(VIEWPORT_NAMES.flatMap(v => VARIANTS.map(s => [v, s] as const)))(
    'matrix (%s, %s)',
    async (viewport: ViewportName, scenario: typeof VARIANTS[number]) => {
      await setViewport(viewport);
      render(VisualHarness, { props: { variant: scenario.variant } as never });
      const drawer = await vi.waitFor(() => {
        const el = getDrawer();
        if (!el) throw new Error('drawer not mounted');
        return el;
      });
      if (scenario.variant === 'stepper') {
        await vi.waitFor(() => {
          if (drawer.getBoundingClientRect().width <= 0) throw new Error('drawer not sized yet');
          const stepper = document.querySelector<HTMLElement>('.neo-floating-stepper');
          if (!stepper) throw new Error('stepper not mounted');
        }, { timeout: 3000, interval: 32 });
      }
      await waitForVisualStability(drawer);
      await vi.waitFor(() => {
        const cs = getComputedStyle(drawer);
        expect(Number.parseFloat(cs.opacity)).toBeGreaterThan(0.99);
        expect(drawer.getBoundingClientRect().width).toBeGreaterThan(0);
      });
      freezeSvgAnimations(drawer);
      await waitForVisualStability(drawer);
      await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
        screenshotName(scenario.component, 'matrix', viewport),
      );
    },
  );
});
