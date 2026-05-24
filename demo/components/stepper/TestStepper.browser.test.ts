import { quietForVisual, screenshotName, setViewport, waitForVisualStability } from 'test/helpers/visual.js';

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

describe('neoStepper — visual contract (themed)', { tags: ['browser', 'visual'] }, () => {
  beforeEach(() => {
    quietForVisual();
  });

  it('horizontal — progress + controls layout (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'horizontal' } as never });
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
      screenshotName('NeoStepper', 'matrix-horizontal', 'desktop'),
    );
  });

  it('vertical — progress + controls layout (desktop)', async () => {
    await setViewport('desktop');
    render(VisualHarness, { props: { variant: 'vertical' } as never });
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
      screenshotName('NeoStepper', 'matrix-vertical', 'desktop'),
    );
  });
});
