import type { ViewportName } from 'test/helpers/visual.js';

import { quietForVisual, screenshotName, setViewport, VIEWPORT_NAMES, waitForVisualStability } from 'test/helpers/visual.js';

import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { page } from 'vitest/browser';

import VisualHarness from './TestStepper.browser.test.svelte';

afterEach(() => {
  cleanup();
});

function getStepper(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.neo-stepper');
}

const ORIENTATIONS = ['horizontal', 'vertical'] as const;

describe('neoStepper — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it.each(VIEWPORT_NAMES.flatMap(v => ORIENTATIONS.map(o => [v, o] as const)))(
    'orientation matrix (%s, %s)',
    async (viewport: ViewportName, orientation: typeof ORIENTATIONS[number]) => {
      await setViewport(viewport);
      render(VisualHarness, { props: { variant: orientation } as never });
      const stepper = await vi.waitFor(() => {
        const el = getStepper();
        if (!el) throw new Error('stepper not mounted');
        return el;
      });
      await vi.waitFor(() => {
        expect(stepper.getBoundingClientRect().width).toBeGreaterThan(0);
      });
      await waitForVisualStability(stepper);
      await expect.element(page.elementLocator(document.body)).toMatchScreenshot(
        screenshotName('NeoStepper', `matrix-${orientation}`, viewport),
      );
    },
  );
});
